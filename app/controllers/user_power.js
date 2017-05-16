//会员权限
exports.singinRequired = function(req, res, next) {
    var user = req.session.user;
    if (!user) { //未登录
        return res.redirect('/signin');
    }
    next();
}
exports.adminRequired = function(req, res, next) {
    var user = req.session.user;
    if (user.role <= 10) { //admin
        return res.redirect('/signin');
    }
    next();
}
