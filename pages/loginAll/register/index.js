import { Login } from '../../../api-models/login/login';
const login = new Login();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    submitForm:{
      headPortrait: '', //头像
      openid: '',
      password: '', //密码
      tel: '', //手机号
      telCode: '', //验证码
      username: '', //微信昵称
    },
    rePassword: '', //确认密码
    url: app.globalData.url,
    disabled:false,
    btnName:"发送验证码",
    countDown:60,
  },
  onShow(){
    if(wx.getStorageSync('wxUserInfo')){
      this.setData({
        'submitForm.headPortrait': wx.getStorageSync('wxUserInfo').avatarUrl,
        'submitForm.username': wx.getStorageSync('wxUserInfo').nickName
      })
    }
    if(wx.getStorageSync('openId')){
      this.setData({
        'submitForm.openid': wx.getStorageSync('openId'),
      })
    }
  },
  // 获取验证码
  getCode() {
    const regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
    if(this.data.submitForm.tel == '' || this.data.submitForm.tel == undefined || this.data.submitForm.tel == null) {
      $Toast({
        content: '请输入手机号！',
        type: 'warning'
      });
    }else if(!regPhone.test(this.data.submitForm.tel)){
      $Toast({
        content: '请输入正确的手机号！',
        type: 'warning'
      });
    }else{
      if(this.data.disabled == false){
        login.registerSendCode({
          phone: this.data.submitForm.tel,
        }).then(res => {
          if(res.code == '200') {
            $Toast({
              content: '发送验证码成功！',
              type: 'success'
            });
            const timer = setInterval(() => {
              if(this.data.countDown < 1) {
                clearInterval(timer);
                this.data.countDown = 60;
                this.setData({
                  disabled: false,
                  btnName: "发送验证码"
                })
                return;
              }else{
                this.data.countDown--;
                this.setData({
                  btnName: this.data.countDown + "s",
                  disabled: true,
                })
              }
            },1000);
          }else{
            $Toast({
              content: res.msg,
              type: 'error'
            });
          }
        })
      }
    }
  },
  bindTelInput(e){
    this.setData({
      "submitForm.tel": e.detail.value
    })
  },
  bindPasInput(e){
    this.setData({
      "submitForm.password": e.detail.value
    })
  },
  bindrePInput(e){
    this.setData({
      "rePassword": e.detail.value
    })
  },
  bindCodeInput(e){
    this.setData({
      "submitForm.telCode": e.detail.value
    })
  },
  clickSubmit(){
    const regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
    if(!this.data.submitForm.password || !this.data.submitForm.tel || !this.data.submitForm.telCode){
      $Toast({
        content: '请检查输入项！',
        type: 'warning'
      });
    }else if(!regPhone.test(this.data.submitForm.tel)){
      $Toast({
        content: '请输入正确的手机号！',
        type: 'warning'
      });
    }else if(this.data.submitForm.password != this.data.rePassword){
      $Toast({
        content: '两次输入密码不一致！',
        type: 'warning'
      });
    }else{
      login.userRegister({
        ...this.data.submitForm
      }).then(res => {
        if(res.code == '200'){
          app.globalData.loginStatus = true
          $Toast({
            content: res.msg,
            type: 'success',
            duration: 0,
            mask: false
          });
          setTimeout(() => {
            wx.setStorage({
              key: 'userInfo',
              data: res.result,
            })
            wx.setStorage({
              key: 'loginStatus',
              data: true,
            })
            wx_gotoNewUrl('switchTab','/pages/mine/mine/index')
            $Toast.hide();
          }, 1000);
        }else{
          $Toast({
            content: res.msg,
            type: 'error'
          });
        }
      })
    }
  }
})