const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const jwtToken = require('./token/token')
const expressJwt = require('express-jwt')
const tools = require("./tools/index")
const user = require('./dao/user')
const comment = require('./dao/comment')
const article = require('./dao/article')
const image = require('./dao/image')

//解决跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

//解析token获取用户信息
app.use(function (req, res, next) {
  var token = req.headers['authorization'];
  if (token == undefined) {
    return next();
  } else {
    jwtToken.getToken(token).then((data) => {
      req.data = data;
      return next();
    }).catch((error) => {
      return next();
    })
  }
});

//开放文件夹
app.use(express.static(path.join(__dirname, 'uploads')));

// 配置解析表单 POST 请求体插件（注意：一定要在 app.use(router) 之前 ）
app.use(bodyParser.urlencoded({ extended: true }));

//修改传输内容或者上传文件时的大小限制，改为10mb
app.use(bodyParser.json({ limit: "10MB" }))

//验证token是否过期并规定那些路由不需要验证
app.use(
  "/api",
  expressJwt({
    secret: 'wyl_forum_token',
    algorithms: ['HS256']
  }).unless({
    //不需要验证的接口名称
    path: [
      "/api/article/getArticleData",
      '/api/login',
      '/api/register',
      "/api/article/getOneArticleInfo",
      "/api/comment/allData",
      "/api/article/RaticleReadLike",
      "/api/article/addReadNum",
      "/api/article/allArticles"
    ]
  }),
  user,
  comment,
  article,
  image
)

//token失效返回信息
app.use(function (err, req, res, next) {
  if (err.status == 401) {
    return res.status(200).json(tools.response(962464, null, "token 已失效"))
  }
})

app.listen(3000, () => {
  console.log('服务器已启动......');
})