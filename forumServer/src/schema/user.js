let mongoose = require('mongoose')
let Api = require('../api/api')
// 连接数据库
  mongoose.connect('mongodb://root:000000@127.0.0.1:27017/forum?authSource=admin',
  { 
    useNewUrlParser: true ,
    useUnifiedTopology:true,
    useFindAndModify:false
  })
  .then(() => console.log( '数据库连接成功user' ))
  .catch(err => console.log( '数据库连接失败' + err ));

var Schema = mongoose.Schema

var userSchema = new Schema({
  //邮箱
  email: {
    type: String,
    // 删除左右两边的空格
    trim: true,
    default: ''
  },
  //用户名
  nickname: {
    type: String,
    trim: true,
    required: true
  },
  //真实姓名
  realname:{
    type: String,
    trim: true,
    default: ''
  },
  //密码
  password: {
    type: String,
    required: true
  },
  //地址
  location:{
    type: String,
    trim: true,
    default: ''
  },
  //个人简介
  experience:{
    type: String,
    trim: true,
    default: ''
  },
  //头像
  avatar: {
    type: String,
    default: `${Api.api}1617899625339-default-moren.png`
  },
  //性别
  gender: {
    type: String,
    enum: ['-1', '0', '1'],
    default: '-1'
  },
  //出生日期
  birthday: {
    type: String,
    default: null
  },
  //权限状态码
  status: {
    type: String,
    // 0 没有权限限制
    // 1 不可以评论
    // 2 不可以登录
    enum: ['0', '1', '2'],
    default: '0'
  },
  //创建时间
  createdTime: {
    type: Date,
    default: Date.now
  },
  //最后更新时间
  lastModifiedTime: {
    type: Date,
    default: Date.now
  },
})

module.exports = mongoose.model('User', userSchema)
