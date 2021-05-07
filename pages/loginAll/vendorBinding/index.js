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
      password: '',
      username: '',
      code: wx.getStorageSync('code'),
      openid: wx.getStorageSync('openId'),
    },
  },
  bindTelInput(e){
    this.setData({
      "submitForm.username": e.detail.value
    })
  },
  bindPasInput(e){
    this.setData({
      "submitForm.password": e.detail.value
    })
  },
  clickSubmit(){
    if(!this.data.submitForm.password || !this.data.submitForm.username){
      $Toast({
        content: '请检查输入项！',
        type: 'warning'
      });
    }else{
      login.companySetOpenid({
        ...this.data.submitForm
      }).then(res => {
        if(res.code == '200'){
          $Toast({
            content: res.msg,
            type: 'success',
            duration: 0,
            mask: false
          });
          setTimeout(() => {
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
  },
})