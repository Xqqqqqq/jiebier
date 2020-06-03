//app.js
import { Index } from './api-models/index/index';
const index = new Index();
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code;
        if(code) {
          // console.log('获取用户登录凭证：' + code);
          // 获取openid
          // index.getOpenid({
          //   code:code
          // }).then(res => {
          //   if(res.code == 200){
          //     if(res.result){
          //       wx.setStorage({
          //         key: 'openId',
          //         data: res.result,
          //       })
          //     }
          //   }
          //   console.log('openId',res)
          // })
        }else{
          console.log('未获取到code', res);
        }
      }
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    //强制更新
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
        console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success:() => {
          if(res.confirm){
            updateManager.applyUpdate();
          }
        }
      })
    });
    updateManager.onUpdateFailed(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败,请手动删除进行强制更新！',
        showCancel: false
      })
    })
  },
  globalData: {
    userInfo: null,
    url:'/static/image/',
    loginStatus:false,
  }
})