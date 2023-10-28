let mongoose = require('mongoose');

let logSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    exercise: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise'
    }]
});

module.exports = mongoose.model('Log', logSchema);
