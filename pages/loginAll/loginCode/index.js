import { Login } from '../../../api-models/login/login';
const login = new Login();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    disabled:false,
    btnName:"发送验证码",
    countDown:60,
    submitForm:{
      password: '', //密码
      tel: '', //手机号
      telCode: '', //验证码
    },
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
      login.loginSendCode({
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
                btnName: this.data.countDown + "s"
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
  },
  bindTelInput(e){
    this.setData({
      "submitForm.tel": e.detail.value
    })
  },
  bindCodeInput(e){
    this.setData({
      "submitForm.telCode": e.detail.value
    })
  },
  clickSubmit(){
    const regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
    if(!this.data.submitForm.tel || !this.data.submitForm.telCode){
      $Toast({
        content: '请检查输入项！',
        type: 'warning'
      });
    }if(!regPhone.test(this.data.submitForm.tel)){
      $Toast({
        content: '请输入正确的手机号！',
        type: 'warning'
      });
    }else{
      login.userLoginByCode({
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
            wx_gotoNewUrl('switchTab','/pages/mine/mine/index')
            $Toast.hide();
          }, 3000);
        }else{
          $Toast({
            content: res.msg,
            type: 'error'
          });
        }
      })
    }
  },
  gotoUrl(){
    wx_gotoNewUrl('navigateTo','/pages/loginAll/loginAdmin/index')
  }
})