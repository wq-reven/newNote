const { db: mongoose, Schema } = require('../dbconfig/mongoose');
// Schema结构
const managerSchema = new Schema(
    {
        uid: { type: Number },
        nickname: { type: String },
        creator: { type: String },
        registerTime: { type: Number },
        permission: { type: Number },
        roles: { type: Number },
    },
    {
        collection: 'manager_user',
        versionKey: false,
    }
);

module.exports = managerSchema;