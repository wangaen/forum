let mongoose = require('mongoose')

// 连接数据库
  mongoose.connect('mongodb://root:000000@127.0.0.1:27017/forum?authSource=admin',
  { 
    useNewUrlParser: true ,
    useUnifiedTopology:true,
    useFindAndModify:false
  })
  .then(() => console.log( '数据库连接成功article' ))
  .catch(err => console.log( '数据库连接失败' + err ));

var Schema = mongoose.Schema

var articleSchema = new Schema({
  //标题
  title: {
    type: String,
    required: true
  },
  //内容
  content: {
    type: String,
    required: true
  },
  //用户id
  user_id:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  //创建时间
  created_time: {
    type: Date,
    default: Date.now
  },
  //最后更新时间
  last_up_time: {
    type: Date,
    default: Date.now
  },
  //封面图片
  article_img: {
    type: String,
    default: ''
  },
  //点赞
  like_num:{
    type: Number,
    default: 0
  },
  //阅读数
  read_num:{
    type: Number,
    default: 1
  },
  comment_num:{
    type: Number,
    default: 0,
  }
})

module.exports = mongoose.model('Article', articleSchema)
