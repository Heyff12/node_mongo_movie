var fs = require('fs'); //读写文件
var path = require('path'); //路径
//会员权限--是否登陆
exports.singinRequired = function(req, res, next) {
    var user = req.session.user;
    if (!user) { //未登录
        return res.redirect('/signin');
    }
    next();
}
//会员权限--是否是管理员
exports.adminRequired = function(req, res, next) {
    var user = req.session.user;
    if (user.role <= 10) { //admin
        return res.redirect('/signin');
    }
    next();
}
//电影权限--是否上传海报
exports.savePoster = function(req, res, next) {
    var posterData = req.files.uploadPoster;
    var filePath = posterData.path;
    var originalFilename = posterData.originalFilename;
    if (originalFilename) {
        fs.readFile(filePath, function(err, data) {
            var timestamp = Date.now();
            var type = posterData.type.split('/')[1];
            var poster = timestamp + '.' + type;
            var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);
            fs.writeFile(newPath, data, function(err) {
                req.poster = poster;
                next();
            });
        });
    } else {
        next();
    }
}