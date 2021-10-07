// multer模块,nodejs中间件,用于上传图片
const multer = require('multer')
const fs = require("fs")
/**
 * destination 如果是一个函数，则下面的路径必须是已经存在的路径，否则汇报错误：路径不存在
 *
 * destination 如果是一个字符串，则路径不需要必须存在，只要能够创建路径就OK
 */
const storage = multer.diskStorage({
  //设置文件存储位置
  destination: function (req, file, cb) {
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');;
    let dir = `${__dirname}/uploads/${year}_${month}_${day}`;

    //判断目录是否存在，没有则创建
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true //递归的方式创建目录，dir不管存不存在都可以
      });
    }
    //dir就是上传文件存放的目录
    cb(null, dir);
  },
  // 图片的文件名
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

module.exports = upload