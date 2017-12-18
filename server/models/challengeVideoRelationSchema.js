const { db: mongoose, Schema } = require('../dbconfig/mongoose');
// Schema结构
const challengeVideoRelationSchema = new Schema(
    {
        uniqueVideoId: { type: String },
        challengeId: { type: String },
    },
    {
        collection: 'challengeVideoRelation',
        versionKey: false,
    }
);

module.exports = challengeVideoRelationSchema;