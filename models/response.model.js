const mongoose = require('mongoose');

const RequestCountSchema = new mongoose.Schema({
    get: {
        type: Number,
        default: 0,
    },
    post: {
        type: Number,
        default: 0,
    },
    put: {
        type: Number,
        default: 0,
    },
    delete: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const RequestCount = mongoose.model('RequestCount', RequestCountSchema);

module.exports = RequestCount;
