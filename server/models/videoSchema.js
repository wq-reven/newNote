const { db: mongoose, Schema } = require('../dbconfig/mongoose');
//Schema结构
const videoSchema = new Schema(
    {
        vid: { type: String },
        uniqueVideoId: { type: String },
        videoPlayUrl: { type: String },
        status: { type: String },
        author:{
            nickname:{ type: String },
            uid: { type: Number },
            sex: { type: Number }
        },
        challengeName: { type: String },
        challengeId: { type: String }
    },
    { collection: 'video' }
);

module.exports = videoSchema;