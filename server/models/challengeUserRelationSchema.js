const { db: mongoose, Schema } = require('../dbconfig/mongoose');
// Schema结构
const challengeUserRelationSchema = new Schema(
    {
        uid: { type: Number },
        challengeId: { type: String },
    },
    {
        collection: 'challengeUserRelation',
        versionKey: false,
    }
);

module.exports = challengeUserRelationSchema;