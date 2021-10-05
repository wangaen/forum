import router from "@/router"
import store from "@/store"
import { diyTips } from '@/utils/tools/tools'

export const getUserId = () => {
  if (!store.getters.getToken) return null;
  let userId = localStorage.getItem("id")
  if (!userId) {
    return null;
  }
  return JSON.parse(userId)
}