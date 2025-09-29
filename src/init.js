const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const App = express();

module.exports = { App, express, mongoose, cors };



