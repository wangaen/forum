let pass = ""
var validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    if (value.length < 3 || value.length > 18) {
      callback(new Error("长度在 3 到 18 个字符"))
    } else {
      pass = value
      callback();
    }
  }
};
var confirmPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== pass) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

export const registerRule = {
  nickname: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur", },
  ],
  password: [
    { validator: validatePass, trigger: 'blur' }
  ],
  checkPassword: [
    { validator: confirmPass, trigger: 'blur' }
  ],
}

export const loginRule = {
  nickname: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur", },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
  ],
}

let newpass = ""
var updatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入新密码'));
  } else {
    if (value.length < 3 || value.length > 18) {
      callback(new Error("长度在 3 到 18 个字符"))
    } else {
      newpass = value
      callback();
    }
  }
};
var updateConfirmPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'));
  } else if (value !== newpass) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

export const updatePassRule = {
  oldpass: [
    { required: true, message: "请输入旧密码", trigger: "blur" },
    { min: 3, max: 18, message: "长度在 3 到 18 个字符", trigger: "blur", },
  ],
  newpass: [
    { validator: updatePass, trigger: 'blur' }
  ],
  okpass: [
    { validator: updateConfirmPass, trigger: 'blur' }
  ],
}