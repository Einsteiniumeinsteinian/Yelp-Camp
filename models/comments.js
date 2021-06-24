const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema({
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    content: String
})
//* {mongooseModel: mongoose.model('Comment', commentSchema), commentSchema: commentSchema}  : Using embedding of Data
module.exports = mongoose.model('Comment', commentSchema)