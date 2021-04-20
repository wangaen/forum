let express = require('express')
let bodyParser = require('body-parser')
let router = require('./router')
let path = require('path')

let app = express()

// 路由请求超时的中间件
app.use((req, res, next) => {
  req.setTimeout(20000, () => {
      return res.status(408).json({
        type: 'error',
        message: "请求超时,请重新再试"
      })
  });
  res.setTimeout(20000, () => {
    return res.status(408).json({
      type: 'error',
      message: "挤爆了,你稍后再试"
    })
  });
  next();
})

//解决跨域
app.all('*',function (req, res, next) {
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

//开放文件夹
app.use(express.static(path.join(__dirname, 'uploads')));

// 配置解析表单 POST 请求体插件（注意：一定要在 app.use(router) 之前 ）
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())

app.use(router)

app.listen(3000,() => {
  console.log('服务器已启动......');
})