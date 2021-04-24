import axios from 'axios'
import {Message} from 'element-ui' 

// axios.defaults.baseURL = 'http://127.0.0.1:3000'
axios.defaults.baseURL = 'http://8.129.208.48:3000'

//超时时间
axios.defaults.timeout = 15000;
//全局响应拦截处理
axios.interceptors.response.use(
  response => {
    if (response.headers['content-type'] == "application/file") {
      //文件流
      return response;
    } else if (response.status == "200") {
      // 正常200返回
      return response.data;
    } else {              
      // 非200正常返回
      Message({
        type: 'error',
        message: '服务器繁忙,请稍后再试！',
        offset: 100
      });
      return Promise.reject(new Error('服务器繁忙,请稍后再试！')) // 非正常返回
    }
  },
  error => {  
    Message({
      type: 'error',
      message: '服务器响应错误,请稍后再试！',
      offset: 100
    });
    return Promise.reject(error)
  }
);

const createServe = {

  // get多一个config为了要处理下载文件等
  get: (url, req, config={}) => {
    config.params = formatParams(req);
    return axios.get(url, config).then(res => {
      return res
    })
  },
  
  delete: (url, req) => {
    let params = formatParams(req);
    let config = {params: params};
    return axios.delete(url, config).then(res => {
      return res
    })
  },

  post: (url, req, config) => {
    return axios.post(url, req, config).then(res => {
      return res
    })
  },
  
  put: (url, req) => {
    return axios.put(url, req).then(res => {
      return res
    })
  }
};

// 转化请求数据的格式get delete方法使用
function formatParams(obj) {
  if (!obj) return '';   //如果参数为空则返回空就行
  let keys = Object.keys(obj);
  for (let key of keys) {
    // 如果参数是一个数组那么进行转化
    if (Array.isArray(obj[key])) {
      obj[key] = obj[key].join(',')
    }
  }
  return obj
}

export default createServe