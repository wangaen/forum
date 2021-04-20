let mongoose = require('mongoose')

// 连接数据库
  mongoose.connect('mongodb://root:000000@127.0.0.1:27017/forum?authSource=admin',
  { 
    useNewUrlParser: true ,
    useUnifiedTopology:true,
    useFindAndModify:false
  })
  .then(() => console.log( '数据库连接成功reply' ))
  .catch(err => console.log( '数据库连接失败' + err ));

let Schema = mongoose.Schema

let ReplySchema = new Schema({
  //回复类型, 2:回复——>评论， 3:回复——>回复
  reply_type:{
    type: String,
    enum: ['2','3'],
    require: true
  },
  //评论id，确定回复哪一条评论
  reply_id:{
    type: Schema.Types.ObjectId,
  },
  //回复内容
  content:{
    type: String,
    require: true,
  },
  //回复人，"A回复B" ————> A
  from_user_id:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  //被回复人，"A回复B" ————> B
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
module.exports = mongoose.model('Reply',ReplySchema)