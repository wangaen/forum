let mongoose = require('mongoose')

// 连接数据库
  mongoose.connect('mongodb://root:000000@127.0.0.1:27017/forum?authSource=admin',
  { 
    useNewUrlParser: true ,
    useUnifiedTopology:true,
    useFindAndModify:false
  })
  .then(() => console.log( '数据库连接成功like' ))
  .catch(err => console.log( '数据库连接失败' + err ));

let Schema = mongoose.Schema

let likeSchema = new Schema({
  user_id:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  article_id:{
    type: Schema.Types.ObjectId,
    ref: 'Article',
    require: true,
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

module.exports = mongoose.model('Like',likeSchema)