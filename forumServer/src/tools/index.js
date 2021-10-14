let fs = require('fs')

module.exports = {
  response: (code, data = null, msg = "", token = "") => {
    if (!data) return { code, msg }
    else if (!token) return { code, data, msg }
    return { code, data, msg, token }
  },
  getSortObj: (num) => {
    let obj = {};
    switch (num) {
      case 1:
        obj = { createdTime: -1 };
        break;
      case -1:
        obj = { createdTime: 1 };
        break;
      case 2:
        obj = { readNum: -1 };
        break;
      case -2:
        obj = { readNum: 1 };
        break;
      case 3:
        obj = { likeNum: -1 };
        break;
      case -3:
        obj = { likeNum: 1 };
        break;
      case 4:
        obj = { commentNum: -1 };
        break;
      case -4:
        obj = { commentNum: 1 };
        break;
      default:
        obj = null
    }
    return obj
  },
  checkNull: (body) => {
    const keys = Object.keys(body)
    if (!keys.length) return '参数不能为空';
    for (let item of keys) {
      if (!body[item]) {
        return `${item}  不能为空`
      }
    }
    return ''
  },
  deleteFile: (file) => {
    return new Promise((resolve) => {
      fs.unlink(file, (err) => {
        if (err) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }
}