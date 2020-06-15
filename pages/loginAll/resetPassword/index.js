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
  onLoad(options){
    if(options){
      this.setData({
        'submitForm.tel': options.tel,
        'submitForm.telCode': options.telCode,
      })
    }
  },
  bindPasInput(e){
    this.setData({
      "submitForm.password": e.detail.value
    })
  },
  clickSubmit(){
    if(!this.data.submitForm.password){
      $Toast({
        content: '请检查输入项！',
        type: 'warning'
      });
    }else{
      login.forgetPassSetNewPass({
        ...this.data.submitForm,
      }).then(res => {
        if(res.code == '200'){
          $Toast({
            content: res.msg,
            type: 'success',
            duration: 0,
            mask: false
          });
          setTimeout(() => {
            wx_gotoNewUrl('navigateTo','/pages/loginAll/loginAdmin/index')
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
  },
  gotoUrl(){
    wx_gotoNewUrl('navigateTo','/pages/loginAll/loginCode/index')
  }
})