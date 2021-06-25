//app.js
import { Index } from './api-models/index/index';
const index = new Index();
import { ShoppingCart } from './api-models/shoppingCart/shoppingCart';
const shoppingCart = new ShoppingCart();
App({
  onLaunch: function () {
    //强制更新
    this.autoUpdate()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code;
        wx.setStorage({
          key: 'code',
          data: res.code,
        })
        if(code) {
          // console.log('获取用户登录凭证：' + code);
          // 获取openid
          index.getOpenidNew({
            code:code
          }).then(res => {
            if(res.code == 200){
              if(res.result){
                wx.setStorage({
                  key: 'openId',
                  data: res.result.openid,
                })
                wx.setStorage({
                  key: 'sessionKey',
                  data: res.result.session_key,
                })
                index.userDetailByOpenid({
                  openid: res.result.openid
                }).then(res => {
                  if(res.code == 200) {
                    wx.setStorage({
                      key: 'userInfo',
                      data: res.result,
                    })
                  }
                })
              }
            }
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
    // 查询购物车数量
    if(wx.getStorageSync('userInfo')){
      shoppingCart.selectCartByUserId({
        userId: wx.getStorageSync('userInfo').id
      }).then(res => {
        if(res.code == 200){
          let goodsLength = 0
          for(let i = 0; i < res.result.length; i++){
            goodsLength += res.result[i].productList.length
          }
          // 设置购物车数量
          wx.setTabBarBadge({
            index: 3,
            text: goodsLength+''
          })
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
  autoUpdate: function() {
    var vm = this
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        if (res.hasUpdate) {
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，是否下载新版本并重启小程序？',
            success: function(res) {
              if (res.confirm) {
                vm.downLoadAndUpdate(updateManager)
              } else if (res.cancel) {
                //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                wx.showModal({
                  title: '温馨提示~',
                  content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                  showCancel:false,
                  confirmText:"确定更新",
                  success: function(res) {
                    if (res.confirm) {
                      vm.downLoadAndUpdate(updateManager)
                    }
                  }
                })
              }
            }
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  downLoadAndUpdate: function (updateManager){
    var vm=this
    wx.showLoading();
    updateManager.onUpdateReady(function () {
      wx.hideLoading()
      updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '已经有新版本了哟~',
        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
      })
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