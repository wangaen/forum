const express = require('express')
const router = express.Router()
const User = require('../schema/user')
const md5 = require('blueimp-md5')
const tools = require("../tools/index")
const tokenJwt = require("../token/token")

// 注册
router.post('/register', async (req, res) => {
  try {
    const isNullStr = tools.checkNull(req.body)
    if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
    const { nickname, password, checkPassword } = req.body;
    if (password !== checkPassword) return res.status(200).json(tools.response(-1, null, "输入两次的密码不一致"))
    let data = await User.findOne({ nickname })
    if (data) return res.status(200).json(tools.response(-1, null, "用户名存在"))
    await User({ nickname, password: md5(md5(password)) }).save()
    res.status(200).json(tools.response(200, null, "注册成功"))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

// 登录
router.post('/login', async (req, res) => {
  try {
    const isNullStr = tools.checkNull(req.body)
    if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
    let { nickname, password } = req.body;
    let data = await User.findOne({ nickname, password: md5(md5(password)) }, { password: 0, __v: 0 })
    if (!data) return res.status(200).json(tools.response(-1, null, "用户名或密码错误"))
    let token = await tokenJwt.setToken(data.nickname, data._id);
    res.status(200).json(tools.response(200, data, "登录成功", token))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

//获取个人信息
router.get('/user/getInfo', async (req, res) => {
  try {
    const { id: _id } = req.query
    const isNullStr = tools.checkNull({ id: _id })
    if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
    let data = await User.findOne({ _id }, { password: 0, __v: 0 })
    // 数据为空
    if (!data) return res.status(200).json(tools.response(-1, null, "不存在该用户信息"))
    res.status(200).json(tools.response(200, data, "获取个人信息成功"))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

//修改个人信息
router.put('/user/updateInfo', async (req, res) => {
  try {
    let data = await User.findByIdAndUpdate(req.body._id, req.body)
    if (!data) {
      return res.status(200).json(tools.response(-1, null, '修改失败，请稍后再试'))
    }
    res.status(200).json(tools.response(200, null, '修改成功'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

//修改密码
router.put('/user/updatePass', async (req, res) => {
  const isNullStr = tools.checkNull(req.body)
  if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
  const { _id, newpass, oldpass } = req.body
  try {
    const data = await User.findOne({ _id, password: md5(md5(oldpass)) })
    //密码不匹配
    if (!data) return res.status(200).json(tools.response(-1, null, '密码输入错误'))
    //旧密码正确，保存新密码
    await User.findByIdAndUpdate(_id, { password: md5(md5(newpass)) })
    res.status(200).json(tools.response(200, null, '密码修改成功'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

module.exports = router
