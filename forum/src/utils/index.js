import store from "@/store"
import { Message } from 'element-ui'

export default {
  getBase64: (file) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      let imgResult = ''
      // FileReader对象的readAsDataURL方法可以将读取到的文件编码成base64
      reader.readAsDataURL(file)
      //处理error事件。该事件在读取操作发生错误时触发。
      reader.onerror = (error) => {
        reject(error)
      }
      //处理load事件。该事件在读取操作完成时触发
      reader.onload = () => {
        imgResult = reader.result
      }
      //处理loadend事件。该事件在读取操作结束时（要么成功，要么失败）触发。
      reader.onloadend = () => {
        resolve(imgResult)
      }
    })
  },

  /**
 * 弹出提示信息
 * @param {String} str  //提示的文字
 * @param {String} type //提示类型
 * @param {Number} time //展示时间
 */
  diyTips: (str, type, time) => {
    Message({
      message: str,
      type: type,
      duration: time || 3000,
      offset: 100
    });
  },

  getDate: (dateTimeStamp) => {
    if (dateTimeStamp == undefined) {
      return false;
    } else {
      let date = new Date(dateTimeStamp)
      //dateTimeStamp 的 时间戳
      let time = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      );
      var now = new Date().getTime();//获取当前时间的时间戳

      let daytime = 24 * 60 * 60 * 1000; //一天的时间
      let hourtime = 60 * 60 * 1000; //一小时的时间
      let mintime = 60 * 1000; //一分钟的时间
      let sectime = 1000  //一秒钟的时间

      var diffValue = now - time;

      var dayT = diffValue / daytime;
      var hourT = diffValue / hourtime;
      var minT = diffValue / mintime;
      var secT = diffValue / sectime;

      if (dayT >= 1) {
        return (parseInt(dayT) + "天前")
      }
      else if (hourT >= 1) {
        return (parseInt(hourT) + "个小时前")
      }
      else if (minT >= 1) {
        return (parseInt(minT) + "分钟前")
      } else if (secT >= 1 || secT <= 20) {
        return ("刚刚")
      } else {
        return (parseInt(secT) + "秒前")
      }
    }
  },

  /**
   * 转换为某分某时某天
   * @param {utc时间格式} dateTimeStamp 
   * @returns 某分某时某天等
   */
  timeToDate: (dateTimeStamp) => {
    if (dateTimeStamp == undefined) {
      return '';
    } else {
      let date = new Date(dateTimeStamp)
      //dateTimeStamp 的 时间戳
      let utctime = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      );
      let time = new Date(utctime)
      let Y = time.getFullYear() + '-';
      let M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-';
      let D = (time.getDate() < 10 ? '0' + time.getDate() : time.getDate()) + ' ';
      let h = (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':';
      let m = (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':';
      let s = (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds());
      return Y + M + D + h + m + s;
    }
  },

  getUserId: () => {
    if (!store.getters.getToken) return null;
    let userId = localStorage.getItem("id")
    if (!userId) {
      return null;
    }
    return JSON.parse(userId)
  }
}




