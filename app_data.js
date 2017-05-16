var express = require('express');
var path = require('path');
var mongoose = require('mongoose')
var port = process.env.PORT || 3000;
var app = express();

//mongoose.connect('mongodb://localhost/mooc')
// view engine setup
app.set('views', './views/pages');
app.set('view engine', 'jade');
//app.use(express.bodyParser());//报错
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'views/styles'))); //配置静态文路径
app.listen(port);

console.log('mooc strarted on port ' + port);

//index page
app.get('/', function(req, res) {
    // Movie.fetch(function(err, movies) {
    //     if (err) {
    //         console.log(err)
    //     }
    //     res.render('index', {
    //         title: 'imooc 首页',
    //         movies: [{
    //             title: '机械战警',
    //             _id: 1,
    //             poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png'
    //         }, {
    //             title: '机械战警',
    //             _id: 2,
    //             poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png'
    //         }, {
    //             title: '机械战警',
    //             _id: 3,
    //             poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png'
    //         }, {
    //             title: '机械战警',
    //             _id: 4,
    //             poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png'
    //         }, {
    //             title: '机械战警',
    //             _id: 5,
    //             poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png'
    //         }, {
    //             title: '机械战警',
    //             _id: 6,
    //             poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png'
    //         }, {
    //             title: '机械战警',
    //             _id: 7,
    //             poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png'
    //         }]
    //     })
    // })
    res.render('index', {
        title: 'imooc 首页',
        movies: [{
            title: '机械战警',
            _id: 1,
            poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png'
        }, {
            title: '机械战警',
            _id: 2,
            poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png'
        }, {
            title: '机械战警',
            _id: 3,
            poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png'
        }, {
            title: '机械战警',
            _id: 4,
            poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png'
        }, {
            title: '机械战警',
            _id: 5,
            poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png'
        }, {
            title: '机械战警',
            _id: 6,
            poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png'
        }, {
            title: '机械战警',
            _id: 7,
            poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png'
        }]
    })

});
//detail page
app.get('/movie/:id', function(req, res) {
    res.render('detail', {
        title: 'imooc 详情',
        movie: {
            doctor: '阿里说得对',
            country: '美国',
            title: '机械战警',
            year: 2014,
            poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png',
            language: '英语',
            flash: 'http://player.youku.com/player.php/Type/Folder/Fid//Ob//sid/XMjU1ODczNjA4MA==/v.swf',
            summary: '一个六人同堂的大家庭，搬进新家的当晚便遭遇了火灾。虽死里逃生却殃及池鱼，背负起天价的赔偿。然而，一波未平一个六人同堂的大家庭，搬进新家的当晚便遭遇了火灾。虽死里逃生却殃及池鱼，背负起天价的赔偿。然而，一波未平一个六人同堂的大家庭，搬进新家的当晚便遭遇了火灾。虽死里逃生却殃及池鱼，背负起天价的赔偿。然而，一波未平',
        }
    })
});
//admin page
app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: 'imooc 后台录入',
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
});
//admin post movie
app.post('/admin/movie/new', function(req, res) {
    console.log(req.body);
    console.log(res);
    var id = req.body.movie._id;
    var movieObj = req.body.movie; //用了bodyParser就可以采用这种req.body.movie获取前端页面传过来的值，以json格式包装
    var _movie
    // if (id !== 'undefined') {
    //     Movie.findById(id, function(err, movie) {
    //         if (err) {
    //             console.log(err)
    //         }
    //         _movie = _.extend(movie, movieObj); //underscore模板的一个用法，复制movieObj的内容到movie，有重复会覆盖
    //         _movie.save(function(err, movie) {
    //             if (err) {
    //                 console.log(err)
    //             }
    //             res.redirect('/movie/' + movie._id)
    //         })
    //     })
    // } else {
    //     _movie = new Movie({
    //         doctor: movieObj.doctor,
    //         title: movieObj.title,
    //         country: movieObj.country,
    //         language: movieObj.language,
    //         year: movieObj.year,
    //         poster: movieObj.poster,
    //         summary: movieObj.summary,
    //         flash: movieObj.flash,
    //     })
    //     _movie.save(function(err, movie) {
    //         if (err) {
    //             console.log(err)
    //         }
    //         res.redirect('/movie/' + movie._id)
    //     })
    // }
});
//list page
app.get('/admin/list', function(req, res) {
    res.render('list', {
        title: 'imooc 列表',
        movies: [{
            title: '机械战警',
            _id: 1,
            doctor: '阿里说得对',
            country: '美国',
            year: 2014,
            poster: 'http://www.yaya12.com/wp-content/themes/yaya/images/yayady.png',
            language: '英语',
            flash: 'http://player.youku.com/player.php/sid/XMTg3MjM3NDQxMg==/v.swf',
            summary: '一个六人同堂的大家庭，搬进新家的当晚便遭遇了火灾。虽死里逃生却殃及池鱼，背负起天价的赔偿。然而，一波未平一个六人同堂的大家庭，搬进新家的当晚便遭遇了火灾。虽死里逃生却殃及池鱼，背负起天价的赔偿。然而，一波未平一个六人同堂的大家庭，搬进新家的当晚便遭遇了火灾。虽死里逃生却殃及池鱼，背负起天价的赔偿。然而，一波未平',
        }]
    })
});
