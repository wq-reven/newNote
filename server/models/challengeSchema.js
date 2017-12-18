const { db: mongoose, Schema } = require('../dbconfig/mongoose');
// Schema结构
const challengeSchema = new Schema(
    {
        challengeStatus: { type: Number },
        challengeDesc: { type: String },
        challengeId: { type: String },
        challengeName: { type: String },
        createSource: { type: Number },
        mangerCreator: {
            creator: { type: String },
            creatorid: { type: Number },
        },
        creatorInfo: {
            avatarLarger: { type: String },
            avatarMedium: { type: String },
            avatarThumb: { type: String },
            nickname: { type: String },
            sex: { type: Number },
            signature: { type: String },
            uid: { type: Number },
        },
        userNum: { type: Number },
        videoNum: { type: Number },
        challengeStatus: { type: Number },
        cTime: { type: Date },
    },
    {
        collection: 'challenge',
        versionKey: false,
    }
);

module.exports = challengeSchema;
