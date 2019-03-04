const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    editDate: {
        type: Date,
    },
    content: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Comment', commentSchema);

