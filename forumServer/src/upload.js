const multer = require('multer')

/**
 * destination 如果是一个函数，则下面的路径必须是已经存在的路径，否则汇报错误：路径不存在
 *
 * destination 如果是一个字符串，则路径不需要必须存在，只要能够创建路径就OK
 */
const storage = multer.diskStorage({
  destination: `${__dirname}/uploads/`,
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

module.exports = upload