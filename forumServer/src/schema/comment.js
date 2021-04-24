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
  article_id:{
    type: String,
    required: true
  },
  //内容
  content: {
    type: String,
    required: true
  },
  //评论级别
  comment_grade: {
    type: String,
    enum: ['1', '2', '3'],
    default: '1'
  },
  //父级id
  parent_id: {
    type: String,
    default: ''
  },
  //评论人id
  from_user_id:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  //被评论人id
  to_user_id:{
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
})

module.exports = mongoose.model('Comment', commentSchema)
