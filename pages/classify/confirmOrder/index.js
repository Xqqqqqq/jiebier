import { Classify } from '../../../api-models/classify/classify';
const classify = new Classify();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
const app = getApp()
Page({
  data:{
    addressInfo:{},
    url: app.globalData.url,
    orderList:[],
    totalMoney:0
  },
  onShow(){
    // console.log(wx.getStorageSync('orderList'))
    if(wx.getStorageSync('orderList')){
      this.setData({
        orderList: wx.getStorageSync('orderList')
      })
      this.getTotalPrice()
    }else{
      $Toast({
        content: '没有获取到商品，请重试！',
        type: 'warning'
      });
    }
  },
  // 计算总价
  getTotalPrice(){
    let goodsList = this.data.orderList
    let total = 0
    for(let i =0; i < goodsList.length; i++){ 
      for(let j =0; j <goodsList[i].children.length; j++){
        total += Number(goodsList[i].children[j].productNum) * Number(goodsList[i].children[j].productPrice)
      }
    }
    this.setData({
      goodsList: goodsList,
      totalMoney: total.toFixed(2)
    })
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
    wx_gotoNewUrl('navigateTo','/pages/mine/couponUse/index')
  }
})