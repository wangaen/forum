let mongoose = require('mongoose')

// 连接数据库
  mongoose.connect('mongodb://root:000000@127.0.0.1:27017/forum?authSource=admin',
  { 
    useNewUrlParser: true ,
    useUnifiedTopology:true,
    useFindAndModify:false
  })
  .then(() => console.log( '数据库连接成功comment' ))
  .catch(err => console.log( '数据库连接失败' + err ));

var Schema = mongoose.Schema

var commentSchema = new Schema({
  //文章id
  articleId:{
    type: String,
    required: true
  },
  //内容
  content: {
    type: String,
    required: true
  },
  //评论级别
  commentGrade: {
    type: String,
    enum: ['1', '2', '3'],
    default: '1'
  },
  //父级id
  parentId: {
    type: String,
    default: ''
  },
  //评论人id
  fromUserId:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  //被评论人id
  toUserId:{
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
})

module.exports = mongoose.model('Comment', commentSchema)
