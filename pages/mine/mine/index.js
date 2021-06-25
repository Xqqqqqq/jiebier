// import { Mine } from '../../../api-models/index/index';
// const mine = new Mine();
import { Login } from '../../../api-models/login/login';
const login = new Login();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    userPhone: '', // 获取用户手机号
  },
  onShow(){
    // console.log(wx.getStorageSync('userInfo'))
    if(wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').tel){
      this.setData({
        userPhone: wx.getStorageSync('userInfo').tel
      })
    }
  },
  gotoRouter(e){
    let type= e.currentTarget.dataset.type
    let url= e.currentTarget.dataset.url
    wx_gotoNewUrl(type,url)
  },
  getPhoneNumber: function(e) {
    let vm = this
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      login.getWxPhone({
        encrypdata:e.detail.encryptedData,//	string	是	微信参数
        ivdata: e.detail.iv,//	string	是	微信参数
        sessionKey: wx.getStorageSync('sessionKey'),//	string	是	会话密钥
      }).then(response => {
        if(response.code == 200){
          wx.setStorage({
            key: 'userPhone',
            data: response.result,
          })
          login.userRegisterNew({
            openid: wx.getStorageSync('openId'),//	string	是	openId
            tel: wx.getStorageSync('userPhone') ? wx.getStorageSync('userPhone') : response.result,// string	是	用户电话
          }).then(res => {
            if(res.code == 200){
              wx.setStorage({
                key: 'userInfo',
                data: res.result,
              })
              vm.setData({
                userPhone: wx.getStorageSync('userInfo').tel ? wx.getStorageSync('userInfo').tel : res.result.tel
              })
            }else{
              $Toast({
                content: res.info,
                type: 'error'
              });
            }
          })
        }else{
          $Toast({
            content: response.info,
            type: 'error'
          });
        }
      })
    }else{
      $Toast({
        content: '请授权后进行操作！',
        type: 'warning'
      });
    }
  },
  // // 点击登录注册获取授权后跳转
  // onGotUserInfo(e){
  //   if (e.detail.errMsg == 'getUserInfo:ok'){ // 授权成功
  //     wx.setStorage({
  //       key: 'wxUserInfo',
  //       data: e.detail.userInfo,
  //     })
  //     this.setData({
  //       // wxUserInfo: wx.getStorageSync('wxUserInfo')
  //       wxUserInfo: e.detail.userInfo
  //     })
  //     wx_gotoNewUrl("navigateTo",'/pages/loginAll/loginAdmin/index')
  //   }else{
  //     $Toast({
  //       content: '请授权后进行操作！',
  //       type: 'warning'
  //     });
  //   }
  // },
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: '1340000'
    })
  }
})