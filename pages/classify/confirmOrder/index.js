import { Classify } from '../../../api-models/classify/classify';
const classify = new Classify();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
const app = getApp()
Page({
  data:{
    addressInfo:{},
    url: app.globalData.url,
  },
  onShow(){
  },
  chooseAddress(){
    let vm = this
    wx.chooseAddress({
      success:function(res){
        console.log(res)
        if(res.errMsg == 'chooseAddress:ok'){
          vm.setData({
            addressInfo: res
          })
        }else{
          wx.showToast({
            title: '获取地址信息失败，请重试！',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail:() =>{
        vm.openConfirm()
      }
    })
  },
  openConfirm(){
    wx.showModal({
      content: '检测到您没打开地址权限，是否去设置打开？',
      confirmText: '确认',
      cancelText:'取消',
      success:function(res) {
        if(res.confirm){
          wx.openSetting({
            success: (res) => { }   //打开设置面板
          })
        }else{
          wx.showToast({
            title: '无法打开编辑地址页面！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  gotoCoupon(){
    wx_gotoNewUrl('navigateTo','/pages/mine/coupon/index')
  }
})