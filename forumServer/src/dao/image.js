const express = require('express')
const router = express.Router()
const User = require('../schema/user')
const upload = require('../upload')
const tools = require('../tools/index')
const api = require('../api/api')


//删除图片
router.delete('/deleteImg', (req, res) => {
  let status = false
  let filename = '/uploads/' + req.query.url.split('/')[3]
  if (!tools.deleteFile(`${__dirname}${filename}`)) {
    status = true
    return res.status(200).json({
      type: 'success',
      message: '删除成功',
      deleteStatus: status
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
    let oldAvatar = '/uploads/' + data.avatar.split('/')[3];
    //判断是否是默认图片
    if (oldAvatar != '/uploads/1617899625339-default-moren.png') {
      if (tools.deleteFile(`${__dirname}${oldAvatar}`)) {
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
      msg: '上传头像失败',
      errMsg: err.message,
    })
  }
})

//上传文章图片
router.post('/article/uploadImg', upload.single('avatar'), (req, res) => {
  let articleImg = `${api.api}${req.file.filename}`
  res.json({
    type: 'success',
    message: '上传封面图片成功',
    articleImg: articleImg
  })
})

module.exports = router