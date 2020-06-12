// import { Mine } from '../../../api-models/index/index';
// const mine = new Mine();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    isLogin: app.globalData.loginStatus,
    wxUserInfo: {}, // 获取微信信息
  },
  onShow(){
    if(this.data.isLogin == true){
      if(wx.getStorageSync('wxUserInfo')){
        this.setData({
          wxUserInfo: wx.getStorageSync('wxUserInfo')
        })
      }
    }
  },
  gotoRouter(e){
    let type= e.currentTarget.dataset.type
    let url= e.currentTarget.dataset.url
    wx_gotoNewUrl(type,url)
  },
  // 点击登录注册获取授权后跳转
  onGotUserInfo(e){
    if (e.detail.errMsg == 'getUserInfo:ok'){ // 授权成功
      wx.setStorage({
        key: 'wxUserInfo',
        data: e.detail.userInfo,
      })
      this.setData({
        // wxUserInfo: wx.getStorageSync('wxUserInfo')
        wxUserInfo: e.detail.userInfo
      })
      wx_gotoNewUrl("navigateTo",'/pages/loginAll/loginAdmin/index')
    }else{
      wx.showToast({
        title: '请授权后进行操作！',
        icon: 'none',
        duration: 2000
      });
    }
  },
})