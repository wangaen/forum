const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Article = require('../schema/article')
const Like = require('../schema/like')
const tools = require("../tools/index")

//获取对应用户的所有文章
router.post('/article/allArticles', async (req, res) => {
  try {
    const isNullStr = tools.checkNull(req.body)
    if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
    let { sortStatus, pageNum, userId } = req.body
    let sortLabel = tools.getSortObj(sortStatus);
    let skipNum = (pageNum == 1 ? 0 : (pageNum - 1) * 10)
    let data = await Article.find({ userId }, { contentHtml: 0 }).sort(sortLabel).limit(10).skip(skipNum)
    res.status(200).json(tools.response(200, data, '获取成功'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

//获取对应用户的所有文章的总浏览量，点赞总数，文章总数
router.post('/article/RaticleReadLike', async (req, res) => {
  try {
    const isNullStr = tools.checkNull(req.body)
    if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
    const { userId } = req.body
    let articleTotal = await Article.find({ userId }).countDocuments()
    let likeNum = 0
    let readTotal = 0
    let commentNum = 0
    let total = await Article.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$userId", readNum: { $sum: '$readNum' }, likeNum: { $sum: '$likeNum' }, commentNum: { $sum: '$commentNum' } } }
    ])
    if (total.length) {
      readTotal = total[0].readNum
      likeNum = total[0].likeNum
      commentNum = total[0].commentNum
    }
    const data = [
      { name: '文章量', value: articleTotal },
      { name: '访问量', value: readTotal },
      { name: '点赞量', value: likeNum },
      { name: '评论量', value: commentNum }
    ]
    res.status(200).json(tools.response(200, data, '获取成功'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

//文章分页展示
router.post('/article/getArticleData', async (req, res) => {
  let { search, pageNum } = req.body
  const isNullStr = tools.checkNull({ pageNum })
  if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
  let skipNum = (pageNum == 1 ? 0 : (pageNum - 1) * 20)
  search = search ? { $or: [{ "title": { $regex: search } }, { "contentText": { $regex: search } }] } : {}
  try {
    let data = await Article.find(search, { contentHtml: 0 }).sort({ createdTime: -1 }).limit(20).skip(skipNum)
      .populate('userId', { password: 0, __V: 0 })
    let articleTotal = await Article.find(search, { contentHtml: 0 }).sort({ createdTime: -1 }).countDocuments()
    let articleData = { articleData: data, total: articleTotal }
    res.status(200).json(tools.response(200, articleData, '获取成功'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

//获取单条文章信息
router.post('/article/getOneArticleInfo', async (req, res) => {
  try {
    const isNullStr = tools.checkNull(req.body)
    if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
    const { id: _id } = req.body
    let data = await Article.findOne({ _id }, { contentText: 0 }).populate('userId', { password: 0, __v: 0 })
    if (!data) return res.status(200).json(tools.response(-1, null, '给文章不存在'))
    res.status(200).json(tools.response(200, data, '获取成功'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

//修改文章信息
router.put('/article/update', async (req, res) => {
  try {
    const isNullStr = tools.checkNull({ id: req.body.id })
    if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
    let data = await Article.findByIdAndUpdate(req.body.id, req.body)
    if (!data) return res.status(200).json(tools.response(-1, null, '修改失败'))
    res.status(200).json(tools.response(200, null, '修改成功'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

// 发表文章
router.post('/article/send', async (req, res) => {
  try {
    const { title, contentHtml, userId } = req.body
    const isNullStr = tools.checkNull({ title, contentHtml, userId })
    if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
    let data = await Article(req.body).save()
    res.status(200).json(tools.response(200, data, '发布成功'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

//删除文章
router.delete('/article/delete', async (req, res) => {
  try {
    const { id } = req.query
    const isNullStr = tools.checkNull({ id })
    if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
    let data = await Article.findByIdAndRemove(id)
    if (!data) {
      return res.status(200).json(tools.response(-1, null, '删除文章失败'))
    }
    res.status(200).json(tools.response(200, null, '删除文章成功'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

//每点击一次文章浏览量+1
router.post('/article/addReadNum', async (req, res) => {
  try {
    const isNullStr = tools.checkNull(req.body)
    if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
    let data = await Article.findByIdAndUpdate(req.body.id, { $inc: { readNum: 1 } })
    if (!data) res.status(200).json(tools.response(-1, data, '访问量更新失败'))
    res.status(200).json(tools.response(200, null, '访问量更新成功'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

//判断用户是否已点赞此文章
router.get('/like/isLikeArticle', async (req, res) => {
  try {
    const isNullStr = tools.checkNull(req.query)
    if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
    let data = await Like.findOne(JSON.parse(req.query.form))
    res.status(200).json(tools.response(200, !!data, '判断成功'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

//文章点赞
router.post('/like/addLikeNum', async (req, res) => {
  try {
    const { status, form: { articleId, userId } } = req.body
    const isNullStr = tools.checkNull({ articleId, userId })
    if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
    //未点赞
    if (!status) {
      await Like(req.body.form).save()
      await Article.findByIdAndUpdate(articleId, { $inc: { likeNum: 1 } })
    } else {
      //已点赞
      await Like.findOneAndRemove(req.body.form)
      await Article.findByIdAndUpdate(articleId, { $inc: { likeNum: -1 } })
    }
    res.status(200).json(tools.response(200, null, !status ? '点赞成功' : '已取消点赞'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

module.exports = router