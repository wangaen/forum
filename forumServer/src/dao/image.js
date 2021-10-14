const express = require('express')
const router = express.Router()
const User = require('../schema/user')
const upload = require('../upload')
const tools = require('../tools/index')
const Api = require('../api/api')

const delRoot = __dirname.toString().split("dao")[0]

//删除图片
router.delete('/deleteImg', async (req, res) => {
  let status = false
  let filename = '/uploads/' + req.query.url.split('/')[3] + '/' + req.query.url.split('/')[4]
  if (await tools.deleteFile(`${delRoot}${filename}`)) {
    status = false
    console.log('\x1B[31m%s\x1B[0m', '删除文章图片失败')
  } else {
    status = true
  }
  return res.status(200).json(tools.response(200, { delStatus: status }, '删除成功'))
})

//上传用户头像图片
router.post('/user/avatar/upload', upload.single('avatar'), async (req, res) => {
  try {
    const { id: _id } = req.body
    const data = await User.findOne({ _id })
    const dataUrl = data.avatar.split('/')

    // 用户不存在时，删除图片
    if (!data) {
      if (await tools.deleteFile(req.file.path)) {
        console.log('\x1B[31m%s\x1B[0m', '用户不存在，并且没有自动删除已上传的图片')
      }
      return res.status(200).json(tools.response(-1, null, '用户不存在'))
    }

    // 上传成功，删除旧的头像图片
    let oldAvatar = dataUrl.length === 5 ? '/uploads/' + dataUrl[3] + '/' + dataUrl[4] : '/uploads/1617899625339-default-moren.png';
    //判断是否是默认图片
    if (oldAvatar != '/uploads/1617899625339-default-moren.png') {
      if (await tools.deleteFile(`${delRoot}${oldAvatar}`)) {
        console.log('\x1B[31m%s\x1B[0m', '上传成功，删除旧的头像图片出现异常')
      }
    }

    //保存到user中的avatar
    const avatar = Api.api + req.file.destination.split("/")[2] + '/' + req.file.filename
    await User.findByIdAndUpdate(_id, { avatar })
    res.status(200).json(tools.response(200, null, '更换头像图片成功'))
  } catch (err) {
    // 出现异常时，删除已上传的图片
    if (await tools.deleteFile(req.file.path)) {
      console.log('\x1B[31m%s\x1B[0m', '更换头像错误，并且没有自动删除已上传的图片')
    }
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

//上传文章图片
router.post('/article/uploadImgs', upload.array('articleImg', 5), (req, res) => {
  const files = req.files
  try {
    if (!files.length) return res.status(200).json(tools.response(-1, null, '至少选择一张图片'))
    let articleImgs = [];
    files.forEach(item => articleImgs.push(`${Api.api}${item.destination.split("/")[2]}/${item.filename}`))
    res.status(200).json(tools.response(200, articleImgs, '上传文章图片成功'))
  } catch (err) {
    // 出现异常时，删除已上传的图片
    files.forEach(async (item) => {
      if (await tools.deleteFile(item.path)) {
        console.log('\x1B[31m%s\x1B[0m', '上传文章图片异常，并且没有自动删除已上传的图片')
      }
    })
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

module.exports = router