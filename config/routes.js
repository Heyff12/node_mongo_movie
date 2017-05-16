var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
module.exports = function(app) {
    //设置跨域访问
    // app.all('*', function(req, res, next) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //     res.header("X-Powered-By",' 3.2.1')
    //     res.header("Content-Type", "application/json;charset=utf-8");
    //     next();
    // });
    //pre handle user
    app.use(function(req, res, next) {
        console.log('user in session===');
        console.log(req.session.user);
        var _user = req.session.user;
        if (_user) {
            app.locals.user = _user;

        }
        return next();
    });

    //index page
    app.get('/', Index.index);


    //detail page
    app.get('/movie/:id', Movie.detail);
    //admin page
    app.get('/admin/movie', Movie.new);
    //admin update movie
    app.get('/admin/update/:id', Movie.update);
    //admin post movie
    app.post('/admin/movie/new', Movie.save);
    //list page
    app.get('/admin/list', Movie.list);
    //删除
    app.delete('/admin/list', Movie.del);


    //signup
    app.post('/user/signup', User.signup);
    //signin
    app.post('/user/signin', User.signin);
    //logout
    app.get('/logout', User.logout);
    //userlist page
    app.get('/admin/userlist', User.list);

}
