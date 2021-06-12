let express = require('express')
let router = express.Router()

let mongoose = require('mongoose')

let User = require('./schema/user')
let Article = require('./schema/article')
let Comment = require('./schema/comment')
let Like = require('./schema/like')

let md5 = require('blueimp-md5')

let upload = require('./upload')

let tools = require('./tools/tools')

let api = require('./api/api')

// 注册
router.post('/register', async (req, res) => {
  try {
    let form = req.body;
    let data = await User.findOne({
      $or: [
        { email: form.email },
        { nickname: form.nickname }
      ]
    })
    if (data) {
      //邮箱或用户名存在
      return res.status(200).json({
        type: 'error',
        message: '邮箱或用户名存在'
      })
    }
    form.password = md5(md5(form.password))
    await User(form).save()
    res.status(200).json({
      message: 'OK',
      type: 'success',
    })
  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message
    })
  }
})

// 登录
router.post('/login', async (req, res) => {
  let { email, password } = req.body;
  try {
    let data = await User.findOne({ email, password: md5(md5(password)) }, { password: 0, __v: 0 })
    if (!data) {
      return res.status(200).json({
        type: 'error',
        message: '不存在该邮箱,或者密码不对',
      })
    }
    res.status(200).json({
      message: 'OK',
      type: 'success',
      result: data
    })
  } catch (err) {
    // 查找不到
    return res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message
    })
  }
})

//删除图片
router.delete('/delete_img', (req, res) => {
  let status = false
  let filename = '/uploads/' + req.query.url.split('/')[3]
  if (!tools.deleteFile(`${__dirname}${filename}`)) {
    status = true
    return res.status(200).json({
      type: 'success',
      message: '删除成功',
      delete_status: status
    })
  }
})


/********************************************************************************************************
 ******************************************  user  *************************************************
********************************************************************************************************/

//修改个人信息
router.put('/user/update_info', async (req, res) => {
  try {
    let data = await User.findByIdAndUpdate(req.body._id, req.body)
    if (!data) {
      return res.status(200).json({
        type: 'error',
        message: '修改失败,请重新再试！',
      })
    }
    res.status(200).json({
      message: 'OK',
      type: 'success',
    })
  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message
    })
  }
})

//修改密码
router.put('/user/update_password', async (req, res) => {
  let { _id, newpass, oldpass } = req.body
  try {
    let data = await User.findOne({ _id, password: md5(md5(oldpass)) })
    //密码不匹配
    if (!data) {
      return res.status(200).json({
        type: 'error',
        message: '密码输入错误',
      })
    }
    //旧密码正确，保存新密码
    await User.findByIdAndUpdate(_id, { password: md5(md5(newpass)) })
    res.status(200).json({
      message: 'OK',
      type: 'success',
    })
  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message
    })
  }
})

//获取个人信息
router.get('/user/get_info', async (req, res) => {
  let { id: _id } = req.query
  try {
    let data = await User.findOne({ _id }, { password: 0, __v: 0 })
    // 数据为空
    if (!data) {
      return res.status(200).json({
        type: 'error',
        message: '不存在该用户信息',
      })
    }
    res.status(200).json({
      message: 'OK',
      type: 'success',
      result: data
    })
  } catch (err) {
    // 出现异常
    return res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message
    })
  }
})

//上传用户头像图片
router.post('/user/avatar/upload', upload.single('avatar'), async (req, res) => {
  try {
    let { id: _id } = req.body
    let data = await User.findOne({ _id })
    if (!data) {
      // 出现异常时，报错并删除图片
      if (tools.deleteFile(`${__dirname}/uploads/${req.file.filename}`)) {
        console.error('更换头像错误，并且没有自动删除已上传的图片')
      }
      return res.status(500).json({
        type: 'error',
        message: '用户不存在',
      })
    }

    // 上传成功，删除旧的头像图片
    let old_avatar = '/uploads/' + data.avatar.split('/')[3];
    //判断是否是默认图片
    if (old_avatar != '/uploads/1617899625339-default-moren.png') {
      if (tools.deleteFile(`${__dirname}${old_avatar}`)) {
        console.error('上传成功，删除旧的头像图片出现异常!!!!!!!!!!!!!')
      }
    }

    //保存到user中的avatar
    let avatar = api.api + req.file.filename
    let result = await User.findByIdAndUpdate(_id, { avatar })
    if (!result) {
      return res.status(200).json({
        type: 'error',
        message: '更换头像出现异常',
      })
    }
    res.status(200).json({
      type: 'success',
      message: '更换头像成功'
    })
  } catch (err) {
    // 出现异常时，报错并删除图片
    if (tools.deleteFile(`${__dirname}/uploads/${req.file.filename}`)) {
      console.error('更换头像错误，并且没有自动删除已上传的图片')
    }
    return res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message,
    })
  }
})

/********************************************************************************************************
 ******************************************  article  *************************************************
********************************************************************************************************/

//文章分页展示
router.get('/article/get_page_data', async (req, res) => {
  let { search, page } = req.query
  let page_num = (page == 1 ? 0 : (page - 1) * 20)
  search = search ? { $or: [{ "title": { $regex: search } }, { "content": { $regex: search } }] } : {}
  try {
    let all_data_count = await Article.find().count()
    let data = await Article.find(search).sort({ created_time: -1 }).limit(20).skip(page_num)
      .populate('user_id', { password: 0, __V: 0 })
    
    // 对文章的内容截取
    data.forEach(item => item.content = item.content.slice(0,130))

    res.status(200).json({
      type: 'success',
      message: 'OK',
      result: data,
      total: all_data_count
    })
  } catch (err) {
    res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message
    })
  }
})

//获取对应用户的所有文章
router.get('/article/user_all_articles', async (req, res) => {
  let { sort_status, page, id: user_id } = req.query
  let sort_label = sort_status == 0 ? { created_time: -1 } : sort_status == 1 ? { read_num: -1 } : { like_num: -1 }
  let page_num = (page == 1 ? 0 : (page - 1) * 10)
  try {
    let data = await Article.find({ user_id }).sort(sort_label).limit(10).skip(page_num)
    // 对文章的内容截取
    data.forEach(item => item.content = item.content.slice(0,120))
    res.status(200).json({
      type: 'success',
      message: 'OK',
      result: data,
    })
  } catch (err) {
    res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message
    })
  }
})

//获取对应用户的所有文章的总浏览量，点赞总数，文章总数
router.get('/article/total_reticle_read_like', async (req, res) => {
  try {
    const { id: user_id } = req.query
    let article_total = await Article.find({ user_id }).count()
    let like_num = 0
    let read_total = 0
    let total = await Article.aggregate([
      { $match: { user_id: mongoose.Types.ObjectId(user_id) } },
      { $group: { _id: "$user_id", read_num: { $sum: '$read_num' }, like_num: { $sum: '$like_num' } } }
    ])
    if (total.length) {
      read_total = total[0].read_num
      like_num = total[0].like_num
    }
    res.status(200).json({
      type: 'success',
      message: 'OK',
      data: [
        { name: '文章', value: article_total },
        { name: '访问量', value: read_total },
        { name: '点赞', value: like_num }
      ]
    })
  } catch (err) {
    res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message
    })
  }
})

//获取单条文章信息
router.get('/article/get_one_article_info', async (req, res) => {
  try {
    const { id: _id } = req.query
    let data = await Article.findOne({ _id }).populate('user_id', { password: 0, __v: 0 })
    res.status(200).json({
      message: 'OK',
      type: 'success',
      result: data
    })
  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message
    })
  }
})

//上传文章图片
router.post('/article/upload_img', upload.single('avatar'), (req, res) => {
  let article_img = `${api.api}${req.file.filename}`
  res.json({
    type: 'success',
    message: '上传封面图片成功',
    article_img: article_img
  })
})

// 发表文章
router.post('/article/send', async (req, res) => {
  try {
    let data = await Article(req.body).save()
    res.status(200).json({
      code: 200,
      message: 'OK',
      type: 'success',
      result: data
    })
  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: '数据写入异常',
      err: err.message
    })
  }
})

//每点击一次文章浏览量+1
router.post('/article/add_read_num', async (req, res) => {
  try {
    await Article.findByIdAndUpdate(req.body.id, { $inc: { read_num: 1 } })
    res.status(200).json({
      type: 'success',
      message: '浏览量已+1',
    })
  } catch (err) {
    res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message
    })
  }
})

//修改文章信息
router.put('/article/update', async (req, res) => {
  try {
    let data = await Article.findByIdAndUpdate(req.body.id, req.body)
    if (!data) {
      return res.status(200).json({
        type: 'error',
        message: '修改失败,请重新再试！',
      })
    }
    res.status(200).json({
      type: 'success',
      message: '修改成功'
    })
  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message
    })
  }
})

//删除文章
router.delete('/article/delete', async (req, res) => {
  try {
    let data = await Article.findByIdAndRemove(req.query.id)
    if (!data) {
      return res.status(200).json({
        type: 'error',
        message: '删除失败！',
      })
    }
    res.status(200).json({
      type: 'success',
      message: '删除成功'
    })
  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message
    })
  }
})

/********************************************************************************************************
 ******************************************  comment  *************************************************
********************************************************************************************************/

//添加文章评论
router.post('/comment/add', async (req, res) => {
  const form = req.body
  try {
    let data = await Comment(form).save()
    await Article.findByIdAndUpdate(form.article_id, { $inc: { comment_num: 1 } })
    res.status(200).json({
      message: 'OK',
      type: 'success',
      result: data
    })
  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: '数据写入异常',
      err: err.message
    })
  }
})

//删除评论
router.delete('/comment/delete', async (req, res) => {
  try {
    const delete_form = JSON.parse(req.query.delete_form)
    let data = await Comment.deleteMany({ _id: { $in: delete_form } })
    await Article.findByIdAndUpdate(req.query.article_id, { $inc: { comment_num: -data.n } })
    if (!data) {
      return res.status(200).json({
        type: 'error',
        message: '删除失败!',
      })
    }
    res.status(200).json({
      type: 'success',
      message: '删除成功',
      delete_count: data.deletedCount,
    })
  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message
    })
  }
})

// //获取某一篇文章下的所有评论
router.get('/comment/get_all', async (req, res) => {
  const { page, sort_status: created_time, article_id } = req.query
  let page_num = (page == 1 ? 0 : (page - 1) * 10)
  try {
    let total = await Comment.find({ article_id, comment_grade: '1' }).count()
    //所有评论/一级评论
    let data = await Comment.find({ article_id, comment_grade: '1' }, { to_user_id: 0, __v: 0 })
      .limit(10).skip(page_num).sort({ created_time })
      .populate('from_user_id', { password: 0, __v: 0 })

    //二级评论
    let comment_two = await Comment.aggregate([
      { $match: { article_id, comment_grade: '2' } },
      { $lookup: { from: "users", localField: "from_user_id", foreignField: "_id", as: "from_user_info" } },
      { $lookup: { from: "users", localField: "to_user_id", foreignField: "_id", as: "to_user_info" } },
      { $unwind: { path: "$from_user_info", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$to_user_info", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          "to_user_id": 0, "from_user_id": 0, "__v": 0, "to_user_info.password": 0, "to_user_info.email": 0,
          "to_user_info.__v": 0, "from_user_info.password": 0, "from_user_info.email": 0, "from_user_info.__v": 0
        }
      },
      { $group: { _id: "$parent_id", equal: { $push: "$$ROOT" } } },
    ])

    //三级评论
    let comment_three = await Comment.aggregate([
      { $match: { article_id, comment_grade: '3' } },
      { $lookup: { from: "users", localField: "from_user_id", foreignField: "_id", as: "from_user_info" } },
      { $lookup: { from: "users", localField: "to_user_id", foreignField: "_id", as: "to_user_info" } },
      { $unwind: { path: "$from_user_info", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$to_user_info", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          "to_user_id": 0, "from_user_id": 0, "__v": 0, "to_user_info.password": 0, "to_user_info.email": 0,
          "to_user_info.__v": 0, "from_user_info.password": 0, "from_user_info.email": 0, "from_user_info.__v": 0
        }
      },
      { $group: { _id: "$parent_id", equal: { $push: "$$ROOT" } } },
    ])

    //拼接
    comment_two.forEach((item) => {
      item.equal.forEach((item_child) => {
        comment_three.forEach(value => {
          if (item_child._id == value._id) {
            item_child.second_comment = value.equal
          }
        })
      })
    })

    //拼接
    data.forEach((item, index) => {
      comment_two.forEach(value => {
        if (item._id == value._id) {
          let item_copy = JSON.parse(JSON.stringify(item))
          item_copy.second_comment = JSON.parse(JSON.stringify(value.equal))
          data[index] = item_copy
        }
      })
    })

    return res.status(200).json({
      message: 'OK',
      type: 'success',
      result: data,
      total: total
    })
  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: '服务端异常',
      err: err.message
    })
  }
})



/********************************************************************************************************
 ******************************************  like  *************************************************
********************************************************************************************************/

//文章点赞
router.post('/like/add_like_num', async (req, res) => {
  const { status, form: { article_id, user_id } } = req.body
  try {
    if (article_id && user_id) {
      //未点赞
      if (!status) {
        await Like(req.body.form).save()
        await Article.findByIdAndUpdate(article_id, { $inc: { like_num: 1 } })
      }
      //已点赞
      else {
        await Like.findOneAndRemove(req.body.form)
        await Article.findByIdAndUpdate(article_id, { $inc: { like_num: -1 } })
      }
      res.status(200).json({
        message: 'OK',
        type: 'success',
        result: !status ? '点赞成功' : '已取消点赞'
      })
    } else {
      res.status(400).json({
        message: '参数有误',
        type: 'error'
      })
    }
  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: '数据写入异常',
      err: err.message
    })
  }
})

//判断用户是否已点赞此文章
router.get('/like/if_like_article', async (req, res) => {
  try {
    let status = await Like.findOne(JSON.parse(req.query.form))
    res.status(200).json({
      message: 'OK',
      type: 'success',
      status: !!status
    })
  } catch (err) {
    return res.status(500).json({
      type: 'error',
      message: '数据写入异常',
      err: err.message
    })
  }
})


module.exports = router