let mongoose = require('mongoose');
// const AutoIncrementFactory = require('mongoose-sequence');

let OriUrlSchema = new mongoose.Schema({
    original_url: {
        type: String,
        required: true,
    },
    short_url: {
        type: Number,
        default: 0
    }
});
// const AutoIncrement = AutoIncrementFactory(connection);

module.exports = mongoose.model('OriUrl', OriUrlSchema);
