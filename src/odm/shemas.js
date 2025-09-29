const { mongoose } = require('../init.js');


// Review and Property Schema + models
const reviewSchema = new mongoose.Schema({
    user: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Changed from Number
        nickname: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            lowercase: true,
            match: [/.+@.+\..+/, 'Please enter a valid email']
        }
    },
    name_of_service: { type: String, required: true, trim: true },
    street_address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    comment: { type: String },
    photos: {
        type: [String],
        default: [],
        validate: {
            validator: function (photos) {
                // Optional: Validate photo URLs
                return photos.every(photo =>
                    typeof photo === 'string' && photo.length > 0
                );
            },
            message: 'All photos must be valid URL strings'
        }
    },
    created_at: { type: Date, default: Date.now }
});

const propertySchema = new mongoose.Schema({
    name: String,
    address: String,
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
});

const Property = mongoose.model('Property', propertySchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = { Property, Review }

