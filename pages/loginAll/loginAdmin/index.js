import { Login } from '../../../api-models/login/login';
const login = new Login();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    submitForm:{
      password: '', //密码
      tel: '', //手机号
      telCode: '', //验证码
    },
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
  clickSubmit(){
    const regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
    if(!this.data.submitForm.password || !this.data.submitForm.tel){
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
      login.userLoginByPass({
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
  gotoUrl(e){
    let type= e.currentTarget.dataset.type
    let url= e.currentTarget.dataset.url
    wx_gotoNewUrl(type,url)
  },
})