var express = require('express'); //express是基于 Node.js 平台，快速、开放、极简的 web 开发框架。
var port = process.env.PORT || 3000; //获取一个端口号，或者是用户自己指定，默认3000
var path = require('path'); //NodeJS中的Path对象，用于处理目录的对象，提高开发效率。
var app = express(); //使用express框架
var bodyParser = require('body-parser'); //表单传输与request对应解析成json数据比较常用
var moment = require('moment'); //处理时间格式
//cookie
var session = require('express-session'); //引入cookie
var mongoSrore = require('connect-mongo')(session);
//数据库
var mongoose = require('mongoose'); //引入mongodb数据库的框架
var bluebird = require('bluebird');
//打印log
var morgan = require('morgan');
//文件上传--暂时没有使用
var multer = require('multer'); //npm install multer--暂未使用//上传文件框架，可以是一个文件也可以是多个文件
var upload = multer({ dest: './uploads' }); //上传文件的时候用的--暂未使用

// 表单数据格式化
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.locals.moment = moment;

// view engine setup
app.set('views', './app/views/pages'); //设置模板的相对路径
app.set('view engine', 'jade'); //设置模板引擎
app.use(express.static(path.join(__dirname, 'public'))); //可以让其他js文件找到bower_components目录;.bowerrc文件更改bower install 安装路径
//app.use(express.static(path.join(__dirname, 'views/styles'))); //配置静态文路径

//数据库配置
//mongoose.Promise = global.Promise;
mongoose.Promise = bluebird; //保证数据库全局通用--解决报错-改成localhost:27017解决
var dbUrl = "mongodb://127.0.0.1:27017/mooc";
mongoose.connect(dbUrl);
//测试数据库是否联通
// var db = mongoose.connect(dbUrl);
// db.connection.on("error", function(error) {
//     console.log("数据库连接失败：" + error);
// });
// db.connection.on("open", function() {
//     console.log("------数据库连接成功！------");
// });

//配置cookie--session持久化
app.use(session({
    secret: 'mooc',
    store: new mongoSrore({
        url: dbUrl,
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true,
}));

//配置环境--打印信息
if ('development' === app.get('env')) {
    app.set('showStackError', true);
    app.use(morgan(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

require('./config/routes_old')(app); //引入路由文件

app.listen(port); //监听端口
console.log('mooc strarted on port ' + port);
