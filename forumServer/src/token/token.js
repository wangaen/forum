let jwt = require('jsonwebtoken');
let jwtScrect = 'wyl_forum_token';  //签名

module.exports = {

  //登录接口 生成token的方法
  setToken: (nickname, _id) => {
    return new Promise((resolve, reject) => {
      //expiresln 设置token过期的时间
      // jwt.sign()生成token
      const token = jwt.sign({ nickname, _id }, jwtScrect, { expiresIn: '10h' });
      resolve(token)
    })
  },
  //各个接口需要验证token的方法
  getToken: (token) => {
    return new Promise((resolve, reject) => {
      if (!token) {
        reject({
          error: 'token 为空'
        })
      }
      else {
        //jwt.verify()验证token
        let info = jwt.verify(token.split(' ')[1], jwtScrect);
        resolve(info);  //解析返回的值（sign 传入的值）
      }
    })
  }

}