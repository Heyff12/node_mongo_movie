var Movie = require('../app/modals/movie'); //电影
var User = require('../app/modals/user'); //用户
var Comment = require('../app/modals/comment'); //评论
var Catetory = require('../app/modals/catetory'); //分类
var _ = require('underscore');
//Underscore一个JavaScript实用库，提供了一整套函数式编程的实用功能，但是没有扩展任何JavaScript内置对象。
//它是这个问题的答案：“如果我在一个空白的HTML页面前坐下， 并希望立即开始工作， 
//我需要什么？“...它弥补了部分jQuery没有实现的功能,同时又是Backbone.js必不可少的部分。 
//http://www.css88.com/doc/underscore
var user_power = require('../app/controllers/user_power');
//var comment_power = require('../app/controllers/comment_power');


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
    //index page--链接
    app.get('/', function(req, res) { //这里的'/'是指的监听的访问路径，后面为回调函数 
        Catetory
            .find({})
            .populate({ path: 'movies', options: { limit: 5 } })
            .exec(function(err, catetories) {
                if (err) {
                    console.log(err)
                }
                res.render('index', {
                        title: 'mooc 首页',
                        catetories: catetories
                    }) //render是jade框架里面用来指定那个jade的方法
            })
            // Movie.fetch(function(err, movies) {
            //     if (err) {
            //         console.log(err)
            //     }
            //     res.render('index', {
            //             title: 'mooc 首页',
            //             movies: movies
            //         }) //render是jade框架里面用来指定那个jade的方法
            // })
    });
    //detail page--链接
    app.get('/movie/:id', function(req, res) {
        var id = req.params.id; //获取的是参数中的id
        // Movie.findById(id, function(err, movie) {
        //     Comment.find({movie:id},function(err,comments){
        //         res.render('detail', {
        //             title: 'mooc' + movie.title,
        //             movie: movie,
        //             comments:comments
        //         })
        //     })            
        // })
        Movie.findById(id, function(err, movie) {
            Comment
                .find({ movie: id })
                .populate('from', 'name')
                .populate('reply.from reply.to', 'name')
                .exec(function(err, comments) {
                    res.render('detail', {
                        title: 'mooc' + movie.title,
                        movie: movie,
                        comments: comments
                    })
                })
        })
    });
    //admin page--链接
    app.get('/admin/movie/new', user_power.singinRequired, user_power.adminRequired, function(req, res) {
        // console.log("###################");
        // console.log(res);
        // console.log("###################");
        Catetory.find({},function(err,catetories){
            res.render('admin', {
                title: 'mooc 后台录入',
                catetories:catetories,
                movie: {}
            })
        });        
    });
    //admin update movie--链接
    app.get('/admin/movie/update/:id', user_power.singinRequired, user_power.adminRequired, function(req, res) {
        var id = req.params.id;
        //这里的逻辑是如果获取到了id就查找这个id对应的数据传到admin录入，这里要求admin录入页value要有对应
        if (id) {
            Movie.findById(id, function(err, movie) {
                if (err) {
                    console.log(err)
                }
                res.render('admin', {
                    title: 'mooc后台更新页',
                    movie: movie
                })
            })
        }
    });
    //admin post movie--接口
    app.post('/admin/movie', user_power.singinRequired, user_power.adminRequired, function(req, res) {
        // console.log("!!!!!!!11111!!!!!!!!");
        // console.log(req.body);
        // console.log("!!!!!!!2222!!!!!!!!!");
        // console.log(res);
        // console.log("!!!!!!!3333!!!!!!!!!");
        var id = req.body.movie._id;
        var movieObj = req.body.movie; //用了bodyParser就可以采用这种req.body.movie获取前端页面传过来的值，以json格式包装
        var _movie;
        if (id !== 'undefined') {
            Movie.findById(id, function(err, movie) {
                if (err) {
                    console.log(err);
                }
                _movie = _.extend(movie, movieObj); //underscore模板的一个用法，复制movieObj的内容到movie，有重复会覆盖
                _movie.save(function(err, movie) {
                    if (err) {
                        console.log(err);
                    }
                    res.redirect('/movie/' + movie._id);
                })
            })
        } else {
            _movie = new Movie({
                doctor: movieObj.doctor,
                title: movieObj.title,
                country: movieObj.country,
                language: movieObj.language,
                year: movieObj.year,
                poster: movieObj.poster,
                summary: movieObj.summary,
                flash: movieObj.flash,
            })
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            })
        }
    });
    //list page--链接
    app.get('/admin/movie/list', user_power.singinRequired, user_power.adminRequired, function(req, res) {
        Movie.fetch(function(err, movies) {
            if (err) {
                console.log(err)
            }
            res.render('list', {
                title: 'mooc 列表',
                movies: movies
            })
        })
    });
    //删除--接口
    app.delete('/admin/movie/list', user_power.singinRequired, user_power.adminRequired, function(req, res) {
        //console.log(req);
        var id = req.query.id;
        // console.log("11111@@@@@");
        // console.log(id);
        // console.log("222222@@@@@");
        if (id) {
            Movie.remove({ _id: id }, function(err, movie) {
                if (err) {
                    res.json({ success: 0 });
                } else {
                    // console.log("3333@@@@@");
                    // console.log(res);
                    // console.log("4444@@@@@");
                    res.json({ success: 1 });
                }
            })
        } else {
            // console.log("5555@@@@@");
            res.json({ success: 0 });
        }
    });


    //signup--提交接口
    app.post('/user/signup', function(req, res) {
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
                return res.redirect('/signin');
            } else {
                var user = new User(_user);
                user.save(function(err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log('3333333333------user');
                        // console.log(user);
                        // console.log('444444444------user');
                        res.redirect('/');
                    }
                });
            }
        });
    });
    //signin--提交接口
    app.post('/user/signin', function(req, res) {
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
                return res.redirect('/signup');
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
                    return res.redirect('/signin');
                }
            });
        });
    });
    //logout--接口
    app.get('/logout', function(req, res) {
        delete req.session.user;
        delete app.locals.user;
        res.redirect('/');
    });
    //userlist page--链接
    app.get('/admin/userlist', user_power.singinRequired, user_power.adminRequired, function(req, res) {
        // var user = req.session.user;
        // if (!user) { //未登录
        //     return res.redirect('/signin');
        // }
        // if (user.role <= 10) { //admin
        //     User.fetch(function(err, users) {
        //         if (err) {
        //             console.log(err)
        //         }
        //         res.render('userlist', {
        //             title: 'mooc 用户列表',
        //             users: users
        //         })
        //     })
        // }
        User.fetch(function(err, users) {
            if (err) {
                console.log(err)
            }
            res.render('userlist', {
                title: 'mooc 用户列表',
                users: users
            })
        })
    });
    //新的独立登陆 和注册页面--链接
    app.get('/signin', function(req, res) {
        res.render('signin', {
            title: '登陆页面',
        })
    });
    app.get('/signup', function(req, res) {
        res.render('signup', {
            title: '注册页面',
        })
    });

    //comment--接口
    app.post('/user/comment', user_power.singinRequired, function(req, res) {
        var _comment = req.body.comment;
        var movieId = _comment.movie;
        if (_comment.cid) {
            Comment.findById(_comment.cid, function(err, comment) {
                var reply = {
                    from: _comment.from,
                    to: _comment.tid,
                    content: _comment.content
                }
                comment.reply.push(reply);
                comment.save(function(err, comment) {
                    if (err) {
                        console.log(err);
                    }
                    res.redirect('/movie/' + movieId);
                })
            })
        } else {
            var comment = new Comment(_comment);
            comment.save(function(err, comment) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movieId);
            })
        }
    })


    //admin post catetorya--链接
    app.get('/admin/catetory/new', user_power.singinRequired, user_power.adminRequired, function(req, res) {
        res.render('catetory_admin', {
            title: 'mooc 后台分类录入业',
            catetory:{}
        })
    });
    //admin post catetory--接口
    app.post('/admin/catetory', user_power.singinRequired, user_power.adminRequired, function(req, res) {
        var _catetory = req.body.catetory;
        var catetory = new Catetory(_catetory); 
        catetory.save(function(err, catetory) {
            if (err) {
                console.log(err);
            }
            res.redirect('/admin/catetory/list');
        })
    });
    //admin post catetoryalist--链接
    app.get('/admin/catetory/list', user_power.singinRequired, user_power.adminRequired, function(req, res) {
        Catetory.fetch(function(err, catetories) {
            if (err) {
                console.log(err)
            }
            res.render('catetorylist', {
                title: 'mooc 分类列表',
                catetories: catetories
            })
        })
    });
    //admin update movie--链接
    app.get('/admin/catetory/update/:id', user_power.singinRequired, user_power.adminRequired, function(req, res) {
        var id = req.params.id;
        //这里的逻辑是如果获取到了id就查找这个id对应的数据传到admin录入，这里要求admin录入页value要有对应
        if (id) {
            Catetory.findById(id, function(err, catetory) {
                if (err) {
                    console.log(err)
                }
                res.render('admin', {
                    title: 'mooc  catetory后台更新页',
                    catetory: catetory
                })
            })
        }
    });
    //删除--接口
    app.delete('/admin/catetory/list', user_power.singinRequired, user_power.adminRequired, function(req, res) {
        //console.log(req);
        var id = req.query.id;
        // console.log("11111@@@@@");
        // console.log(id);
        // console.log("222222@@@@@");
        if (id) {
            Catetory.remove({ _id: id }, function(err, catetory) {
                if (err) {
                    res.json({ success: 0 });
                } else {
                    // console.log("3333@@@@@");
                    // console.log(res);
                    // console.log("4444@@@@@");
                    res.json({ success: 1 });
                }
            })
        } else {
            // console.log("5555@@@@@");
            res.json({ success: 0 });
        }
    });
}
