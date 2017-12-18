const usercontroller = require('./server/controllers/userControllers');
const videocontroller = require('./server/controllers/videoControllers');
const challangecontroller = require('./server/controllers/challengeControllers');

// ----------------------用户管理------------------------------------------//
// 查询用户详情信息接口
module.exports.queryUserDetail = usercontroller.queryUserDetail;

// 通过用户id或者用户昵称搜索用户接口
module.exports.searchUser = usercontroller.searchUser;

// 更改用户作品数
module.exports.updateProductVideoNum = usercontroller.updateProductVideoNum;

// ----------------------视频管理------------------------------------------//
// 查询所属ownername用户的视频接口
module.exports.queryVideosByNickname = videocontroller.queryVideosByNickname;

// 根据搜索框查询符合条件视频的接口
module.exports.searchVideo = videocontroller.searchVideo;

// 点击播放键返回视频地址接口
module.exports.playVideo = videocontroller.playVideo;

// 修改视频所属挑战接口
module.exports.changeVideoChallengementByVid = videocontroller.changeVideoChallengementByVid;

// 新增用户与挑战关系接口
module.exports.addChallengeUserRelation = videocontroller.addChallengeUserRelation;

// 删除用户与挑战关系接口
module.exports.delChallengeUserRelation = videocontroller.delChallengeUserRelation;

// 更新视频与挑战关系接口
module.exports.updateChallengeVideoRelation = videocontroller.updateChallengeVideoRelation;

// 对视频状态操作接口
module.exports.changeVideoStatus = videocontroller.changeVideoStatus;

// 删除video与挑战关系接口
module.exports.delChallengeVideoRelation = videocontroller.delChallengeVideoRelation;

// 根据uid和challengeId查询用户在挑战下的视频数量
module.exports.videoNumWithUidAndChallengeId = videocontroller.videoNumWithUidAndChallengeId;
// 查询视频来源
module.exports.queryVideoCreator = videocontroller.queryVideoCreator;

// ----------------------挑战管理------------------------------------------//
// 查询所有挑战管理
module.exports.queryAllChallenges = challangecontroller.queryAllChallenges;

// 添加挑战
module.exports.addChallenge = challangecontroller.addChallenge;

// 返回所有挑战名称，不分页
module.exports.returnAllChallengeMent = challangecontroller.returnAllChallengeMent;

// 删除挑战
module.exports.deleteChallenge = challangecontroller.deleteChallenge;

// 更改挑战videoNum接口
module.exports.addchallengeVideoNum = challangecontroller.addchallengeVideoNum;

// 更改挑战userNum接口
module.exports.addchallengeUserNum = challangecontroller.addchallengeUserNum;
// 模糊搜索挑战
module.exports.vagueSearchChallenge = challangecontroller.vagueSearchChallenge;

// ------------------------权限管理----------------------------------------//
// 查询管理员
module.exports.searchUserManager = usercontroller.searchUserManager;

// 增加管理员
module.exports.addUserManager = usercontroller.addUserManager;

// 查询管理员是否存在接口
module.exports.checkUserManager = usercontroller.checkUserManager;

// 修改管理员权限
module.exports.changeManagerPermission = usercontroller.changeManagerPermission;

// ------------------------------资料审核----------------------------------//
// 根据搜索框条件搜索修改资料的用户
module.exports.searchEditUser = usercontroller.searchEditUser;

// 返回所有未审核修改资料用户
module.exports.queryallEditUser = usercontroller.queryallEditUser;

// ------------------------------举报管理----------------------------------//
// 查询举报信息
module.exports.searchReportInfo = usercontroller.searchReportInfo;
// 修改举报信息
module.exports.changeReportInfo = usercontroller.changeReportInfo;