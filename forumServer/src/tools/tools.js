let fs = require('fs')

exports.deleteFile = (file) => {
  fs.unlink(file,(err) => {
    if(err){
      return err
    }else{
      return null
    }
  })
}