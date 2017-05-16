var Movie = require('../modals/movie');
//index page
// exports.index = function(req, res) { //这里的'/'是指的监听的访问路径，后面为回调函数    
//     Movie.fetch(function(err, movies) {
//         if (err) {
//             console.log(err)
//         }
//         res.render('index', {
//                 title: 'mooc 首页',
//                 movies: movies
//             }) //render是jade框架里面用来指定那个jade的方法
//     })
// }
exports.index = function() { //这里的'/'是指的监听的访问路径，后面为回调函数    
    return function(req, res) { //这里的'/'是指的监听的访问路径，后面为回调函数    
        Movie.fetch(function(err, movies) {
            if (err) {
                console.log(err)
            }
            res.render('index', {
                    title: 'mooc 首页',
                    movies: movies
                }) //render是jade框架里面用来指定那个jade的方法
        })
    }
}
