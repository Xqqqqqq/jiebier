const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    visible: false,
    score:0,
  },
  onShow(){
    if(wx.getStorageSync('userInfo')){
      this.setData({
        score: wx.getStorageSync('userInfo').integral
      })
    }else{
      this.setData({
        visible: true
      })
    }
  },
  handleOk(){
    this.setData({
      visible: false
    })
    wx_gotoNewUrl('switchTab','/pages/mine/mine/index')
  },
  handleClose(){
    this.setData({
      visible: false
    })
  },
  gotoDetail(){
    wx_gotoNewUrl('navigateTo','/pages/mine/scoreInfo/index')
  }
})