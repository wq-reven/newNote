const mongoose = require('mongoose');
mongoose
    // .connect('mongodb://ifeng:1qazXSW%403edc@10.50.16.20:27017/admin', { useMongoClient: true })
    .connect('mongodb://superman:superman@10.90.35.66:27021/admin', { useMongoClient: true })
    .then(() => {
        console.log('connected to DB');
    })
    .catch(err => console.log(err));
// mongoose.connect('mongodb://localhost/axshare');
mongoose.Promise = global.Promise;
const db = mongoose.connection;
const Schema = mongoose.Schema;
db.on('error', function(error) {
    console.log('数据库连接失败：' + error);
});
db.once('open', function() {
    console.log('数据库连接成功!');
});

module.exports = { db, Schema };
