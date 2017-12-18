const { db: mongoose, Schema } = require('../dbconfig/mongoose');
// Schema结构
const reportSchema = new Schema(
    {
        informId: { type: Number },
        informedId: { type: Number },
        type: { type: Number },
        content: { type: String },
        status: { type: Number },
        created: { type: Number },
        processResult: { type: String },
        processor: { type: Number},
        updated: { type: Number },
    },
    { collection: 'inform' }
);
module.exports = reportSchema;