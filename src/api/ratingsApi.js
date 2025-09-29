
const rateLimit = require('express-rate-limit');
const { Review, Property } = require('../odm/shemas.js')
const { App, mongoose, express, cors } = require('../init.js')


// Middleware
App.use(express.json());
App.use(cors());

// 1. General API rate limiter - applies to all /api routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// 2. Strict limiter for POST requests (creating reviews)
const createReviewLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 review creations per hour
    message: {
        success: false,
        message: 'Too many reviews created. Please try again after an hour.'
    },
    skipSuccessfulRequests: false, // Count all requests
});

// 3. Apply general limiter to all API routes
App.use('/api/', apiLimiter);


// GET /api/reviews -  General limiter applies (50 req/15min) Get all reviews with optional filtering and pagination
App.get('/api/reviews', async (req, res) => {
    try {
        const {
            city,
            country,
            rating,
            user_id,
            limit = 10,
            page = 1,
            sortBy = 'created_at',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = {};
        if (city) filter.city = new RegExp(city, 'i');
        if (country) filter.country = new RegExp(country, 'i');
        if (rating) filter.rating = parseInt(rating);
        if (user_id) filter['user.id'] = parseInt(user_id);

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const reviews = await Review.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalCount = await Review.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: reviews.length,
            totalCount,
            totalPages: Math.ceil(totalCount / parseInt(limit)),
            currentPage: parseInt(page),
            data: reviews
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
});

// GET /api/reviews/:id -  General limiter applies. Get single review by ID
App.get('/api/reviews/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid review ID format'
            });
        }

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review
        });

    } catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching review',
            error: error.message
        });
    }
});

// GET /api/reviews/user/:userId -  General limiter applies. Get reviews by user ID
App.get('/api/reviews/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userId_int = parseInt(userId);

        if (isNaN(userId_int)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }

        const reviews = await Review.find({ 'user.id': userId_int })
            .sort({ created_at: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user reviews',
            error: error.message
        });
    }
});

// POST /api/reviews - Both general limiter AND strict create limiter apply. Create new review (bonus endpoint)
App.post('/api/reviews', createReviewLimiter, async (req, res) => {
    try {
        const { user, name_of_service, street_address, city, country, rating, comment, photos } = req.body;

        // Check if user already exists
        const existingUser = await Review.findOne({ 'user.email': user.email }, { user: 1 });

        let userId;
        if (existingUser) {
            userId = existingUser.user.id;
        } else {
            userId = new mongoose.Types.ObjectId(); // Generate new ObjectId
        }

        const reviewData = {
            user: {
                id: userId,
                nickname: user.nickname,
                email: user.email
            },
            name_of_service,
            street_address,
            city,
            country,
            rating,
            comment,
            photos: photos || []
        };

        const review = new Review(reviewData);
        await review.save();

        res.status(200).json({
            success: true,
            data: review
        });

    } catch (error) {

        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: validationErrors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating review',
            error: error.message
        });
    }
});