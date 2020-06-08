const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    isLogin: app.globalData.loginStatus
  },
  gotoRouter(e){
    console.log(e.currentTarget.dataset.type)
    console.log(e.currentTarget.dataset.url)
    let type= e.currentTarget.dataset.type
    let url= e.currentTarget.dataset.url
    wx_gotoNewUrl(type,url)
  },
})