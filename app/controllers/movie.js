var Movie = require('../modals/movie');
var _ = require('underscore');
//Underscore一个JavaScript实用库，提供了一整套函数式编程的实用功能，但是没有扩展任何JavaScript内置对象。
//它是这个问题的答案：“如果我在一个空白的HTML页面前坐下， 并希望立即开始工作， 
//我需要什么？“...它弥补了部分jQuery没有实现的功能,同时又是Backbone.js必不可少的部分。 
//http://www.css88.com/doc/underscore
exports.detail = function() {
    return function(req, res) {
        var id = req.params.id; //获取的是参数中的id
        Movie.findById(id, function(err, movie) {
            res.render('detail', {
                title: 'mooc' + movie.title,
                movie: movie
            })
        })
    }
}
exports.new = function() {
    return function(req, res) {
        // console.log("###################");
        // console.log(res);
        // console.log("###################");
        res.render('admin', {
            title: 'mooc 后台录入',
            movie: {
                doctor: '',
                country: '',
                title: '',
                year: '',
                poster: '',
                language: '',
                flash: '',
                summary: '',
            }
        })
    }
}
exports.save = function() {
    return function(req, res) {
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
    }
}
exports.update = function() {
    return function(req, res) {
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
    }
}
exports.list = function() {
    return function(req, res) {
        Movie.fetch(function(err, movies) {
            if (err) {
                console.log(err)
            }
            res.render('list', {
                title: 'mooc 列表',
                movies: movies
            })
        })
    }
}
exports.del = function() {
    return function(req, res) {
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
    }
}
