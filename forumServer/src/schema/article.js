let mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://root:000000@127.0.0.1:27017/forum?authSource=admin',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('数据库连接成功article'))
  .catch(err => console.log('数据库连接失败' + err));

var Schema = mongoose.Schema

var articleSchema = new Schema({
  //标题
  title: {
    type: String,
    required: true
  },
  //展示部分内容
  contentText: {
    type: String,
    default: ''
  },
  //详情全部内容
  contentHtml: {
    type: String,
    required: true
  },
  //用户id
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  //创建时间
  createdTime: {
    type: Date,
    default: Date.now
  },
  //最后更新时间
  lastUpTime: {
    type: Date,
    default: Date.now
  },
  //图片
  articleImgs: {
    type: Array,
    default: []
  },
  //点赞
  likeNum: {
    type: Number,
    default: 0
  },
  //阅读数
  readNum: {
    type: Number,
    default: 1
  },
  //评论数
  commentNum: {
    type: Number,
    default: 0,
  }
})

module.exports = mongoose.model('Article', articleSchema)
