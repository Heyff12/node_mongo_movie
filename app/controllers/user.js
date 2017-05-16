var User = require('../modals/user');
exports.signup = function() {
    return function(req, res) {
        var _user = req.body.user;
        //req.param('user')
        //req.params('user')   '/user/signup/:user'    /user/signup/34646456
        //req.query('user')   /user/signup?user=34646456 
        //console.log(_user);

        User.find({ name: _user.name }, function(err, user) { //检测用户名是否重复
            if (err) {
                console.log(err);
            }
            // console.log('11111111------user');
            // console.log(user);
            // console.log('22222222------user');
            if (user.length >= 1) { //用户名已存在
                return res.redirect('/');
            } else {
                var user = new User(_user);
                user.save(function(err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log('3333333333------user');
                        // console.log(user);
                        // console.log('444444444------user');
                        res.redirect('/admin/userlist');
                    }
                });
            }
        });
    }
}
exports.signin = function() {
    return function(req, res) {
        var _user = req.body.user;
        var name = _user.name;
        var password = _user.password;
        User.findOne({ name: name }, function(err, user) {
            if (err) {
                console.log(err);
            }
            // console.log("!!!!!!!111111");
            // console.log(user);
            // console.log("!!!!!!!222222");
            if (!user) { //用户名不存在
                console.log('用户名不存在');
                return res.redirect('/');
            }

            user.comparePassword(password, function(err, isMatch) {
                if (err) {
                    console.log(err);
                }
                // console.log("!!!!!!!333333");
                // console.log(err);
                // console.log("!!!!!!!444444");
                // console.log(isMatch);
                // console.log("!!!!!!!5555555");
                if (isMatch) {
                    req.session.user = user;
                    console.log('password Is  matched');
                    return res.redirect('/');
                } else {
                    console.log('password Is not matched');
                }
            });
        });
    }
}
exports.logout = function() {
    return function(req, res) {
        delete req.session.user;
        delete app.locals.user;
        res.redirect('/');
    }
}
exports.list = function() {
    return function(req, res) {
        User.fetch(function(err, users) {
            if (err) {
                console.log(err)
            }
            res.render('userlist', {
                title: 'mooc 用户列表',
                users: users
            })
        })
    }
}
