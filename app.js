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
          index.getOpenid({
            code:code
          }).then(res => {
            if(res.code == 200){
              if(res.result){
                wx.setStorage({
                  key: 'openId',
                  data: res.result,
                })
              }
            }
            // console.log('openId',res)
          })
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
    // 获取定位
    if(wx.getStorageSync('userCity')){
      wx.setStorage({
        key: 'userCity',
        data: wx.getStorageSync('userCity')
      })
      wx.setStorage({
        key: 'showRecommend',
        data: true,
      })
    }else{
      let vm = this
      wx.getSetting({
        success(res){
          let status = res.authSetting['scope.userLocation']
          if (status !== undefined && status !== true){
            wx.showModal({
              title: '请求授权当前位置',
              content: '需要获取您的地理位置，请确认授权',
              success(res) {
                if(res.cancel){
                  //取消授权
                  wx.showToast({
                    title: '拒绝授权,无法获取当前位置！',
                    icon: 'none',
                    duration: 1000
                  })
                }else if(res.confirm){
                  wx.openSetting({
                    success (res) {
                      if (res.authSetting["scope.userLocation"] == true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                        vm.geo();
                      }else{
                        wx.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 1000
                        })
                      }
                    }
                  })
                }
              }
            })
          }else if(status == undefined) {
            vm.geo();
          }else {
            vm.geo();
          } 
        }
      })
    }
  },
  geo(){
    let vm =this
    wx.getLocation({
      type: 'gcj02',
      success (res) {
        // console.log('地址',res)
        vm.globalData.positionAddress.latitude = res.latitude
        vm.globalData.positionAddress.longitude = res.longitude
        if(vm.globalData.positionAddress.latitude && vm.globalData.positionAddress.longitude){
          index.getAddressInfo({
            "lat": vm.globalData.positionAddress.latitude,
            "lng": vm.globalData.positionAddress.longitude
          }).then(res => {
            if(res.code == '200'){
              vm.globalData.userCity = res.result.regions
              wx.setStorage({
                key: 'userCity',
                data: vm.globalData.userCity
              })
              wx.setStorage({
                key: 'showRecommend',
                data: true,
              })
              wx.setStorage({
                key: 'posCity',
                data: res.result.city,
              })
            }else{
              wx.setStorage({
                key: 'showRecommend',
                data: false,
              })
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    url:'/static/image/',
    loginStatus:false,
    selectCity: {
      id:'',
      name:''
    }, //用户所选城市
    positionAddress:{
      latitude: '',
      longitude: ''
    }, // 用户定位城市经纬度
    userCity: [], //推荐城市
  }
})