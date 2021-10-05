import store from '@/store'
import { diyTips } from '@/utils/tools/tools'
import router from "@/router"

// token判断登录状态，user一旦存在就不允许修改
export const userAuthority = () => {
  let beforeToken = localStorage.getItem("token")
  let afterToken = null
  let beforeUser = JSON.stringify(localStorage.getItem("id"))
  let afterUser = null
  const timer = setInterval(() => {
    afterToken = localStorage.getItem("token")
    afterUser = JSON.stringify(localStorage.getItem("id"))
    if (afterToken !== beforeToken) {
      beforeToken = localStorage.getItem("token")
      store.commit("setToken", JSON.parse(afterToken))
      !afterToken && localStorage.removeItem("token")
    }
    if (afterToken && beforeUser && beforeUser !== afterUser) {
      diyTips("获取用户信息失败，请重新登录-权限", "warning")
      localStorage.clear()
      beforeUser = JSON.stringify(localStorage.getItem("id"))
      router.currentRoute.path !== "/" && router.push("/")
    }
  }, 500)
  return timer
}