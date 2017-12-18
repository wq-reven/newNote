const { db: mongoose, Schema } = require('../dbconfig/mongoose');
// Schema结构
const userSchema = new Schema(
    {
        uid: { type: Number },
        nickname: { type: String },
        userType: { type: Number },
        avatarLarger: { type: String },
        avatarMedium: { type: String },
        avatarThumb: { type: String },
        creator: { type: String },
        fansNum: { type: Number },
        followNum: {type: Number },
        lastLoginTime: { type: Number},
        likeNum: { type: Number},
        owerName: { type: String},
        platform: { type: String },
        producedVideoNum: { type: Number},
        registerTime: { type: Number },
        sex: { type: Number},
        signature: { type: String },
        cStatus: {type: Number }
    },
    { collection: 'user' }
);

module.exports = userSchema;
