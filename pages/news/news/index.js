import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{

  },
  gotoRouter(){
    wx_gotoNewUrl('navigateTo','/pages/news/newsDetail/index')
  },
})