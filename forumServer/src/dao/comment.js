const express = require('express')
const router = express.Router()
const Article = require('../schema/article')
const Comment = require('../schema/comment')
const tools = require("../tools/index")

//添加文章评论
router.post('/comment/add', async (req, res) => {
  try {
    const { articleId, commentGrade, content, fromUserId, parentId } = req.body;
    const isNullStr = tools.checkNull({ articleId, commentGrade, content, fromUserId })
    if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
    let data = await Comment(req.body).save()
    await Article.findByIdAndUpdate(articleId, { $inc: { commentNum: 1 } })
    res.status(200).json(tools.response(200, data, '评论成功'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

//删除评论
router.delete('/comment/delete', async (req, res) => {
  try {
    const deleteForm = JSON.parse(req.query.deleteForm)
    let data = await Comment.deleteMany({ _id: { $in: deleteForm } })
    await Article.findByIdAndUpdate(req.query.articleId, { $inc: { commentNum: -data.n } })
    if (!data) return res.status(200).json(tools.response(-1, null, '删除失败'))
    res.status(200).json(tools.response(200, { delCount: data.deletedCount }, '删除成功'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

// //获取某一篇文章下的所有评论
router.post('/comment/allData', async (req, res) => {
  const isNullStr = tools.checkNull(req.body)
  if (isNullStr) return res.status(200).json(tools.response(-1, null, isNullStr))
  const { pageNum, sortStatus: createdTime, articleId } = req.body
  let pNum = (pageNum == 1 ? 0 : (pageNum - 1) * 10)
  try {
    let total = await Comment.find({ articleId, commentGrade: '1' }).countDocuments()
    //所有评论/一级评论
    let data = await Comment.find({ articleId, commentGrade: '1' }, { toUserId: 0, __v: 0 })
      .limit(10).skip(pNum).sort({ createdTime })
      .populate('fromUserId', { password: 0, __v: 0 })

    //二级评论
    let commentTwo = await Comment.aggregate([
      { $match: { articleId, commentGrade: '2' } },
      { $lookup: { from: "users", localField: "fromUserId", foreignField: "_id", as: "fromUserInfo" } },
      { $lookup: { from: "users", localField: "toUserId", foreignField: "_id", as: "toUserInfo" } },
      { $unwind: { path: "$fromUserInfo", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$toUserInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          "toUserId": 0, "fromUserId": 0, "__v": 0, "toUserInfo.password": 0, "toUserInfo.email": 0,
          "toUserInfo.__v": 0, "fromUserInfo.password": 0, "fromUserInfo.email": 0, "fromUserInfo.__v": 0
        }
      },
      { $group: { _id: "$parentId", equal: { $push: "$$ROOT" } } },
    ])

    //三级评论
    let commentThree = await Comment.aggregate([
      { $match: { articleId, commentGrade: '3' } },
      { $lookup: { from: "users", localField: "fromUserId", foreignField: "_id", as: "fromUserInfo" } },
      { $lookup: { from: "users", localField: "toUserId", foreignField: "_id", as: "toUserInfo" } },
      { $unwind: { path: "$fromUserInfo", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$toUserInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          "toUserId": 0, "fromUserId": 0, "__v": 0, "toUserInfo.password": 0, "toUserInfo.email": 0,
          "toUserInfo.__v": 0, "fromUserInfo.password": 0, "fromUserInfo.email": 0, "fromUserInfo.__v": 0
        }
      },
      { $group: { _id: "$parentId", equal: { $push: "$$ROOT" } } },
    ])

    //拼接
    commentTwo.forEach((item) => {
      item.equal.forEach((itemChild) => {
        commentThree.forEach(value => {
          if (itemChild._id == value._id) {
            itemChild.secondComment = value.equal
          }
        })
      })
    })

    //拼接
    data.forEach((item, index) => {
      commentTwo.forEach(value => {
        if (item._id == value._id) {
          let itemCopy = JSON.parse(JSON.stringify(item))
          itemCopy.secondComment = JSON.parse(JSON.stringify(value.equal))
          data[index] = itemCopy
        }
      })
    })
    return res.status(200).json(tools.response(200, { data, total }, '获取成功'))
  } catch (err) {
    return res.status(500).json(tools.response(500, null, err.message))
  }
})

module.exports = router
