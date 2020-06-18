import { Classify } from '../../../api-models/classify/classify';
const classify = new Classify();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    orderList:[],
    totalMoney:0,
    submitForm:{
      address:'', //地址
      addressDetails:'', //地址详情
      name:'', //收货人
      tel:'', //tel
      userId: '',
      couponId: '', //优惠券ID
      couponType: '', //优惠类型：0打折，1优惠券，2无
    },
    price:0, // 选择优惠券的钱数
  },
  onLoad(options){
    console.log(options)
    if(options && options.couponType){
      this.setData({
        'submitForm.address': options.address,
        'submitForm.addressDetails': options.addressDetails,
        'submitForm.name': options.name,
        'submitForm.tel': options.tel,
        'submitForm.couponId': options.couponId,
        'submitForm.couponType': options.couponType,
        price:options.price
      })
    }
  },
  onShow(){
    this.data.submitForm.productList = []
    if(wx.getStorageSync('orderList')){
      this.setData({
        orderList: wx.getStorageSync('orderList'),
        'submitForm.userId': wx.getStorageSync('userInfo').id,
      })
      if(this.data.orderList){
        this.data.orderList.map(item => {
          item.children.map(itemSmall => {
            this.data.submitForm.productList.push({
              deliveryType: itemSmall.deliveryType,
              num: itemSmall.productNum,
              productId: itemSmall.productId,
              productClassId:itemSmall.productClassId,
              price:itemSmall.productPrice
            })
          })
        })
      }
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
    if(this.data.price >0 && this.data.submitForm.couponType == '1'){
      total = total-this.data.price
    }else if(this.data.submitForm.couponType == '0'){
      total = total*0.98
    }
    // console.log('total',total)
    this.setData({
      goodsList: goodsList,
      totalMoney: total.toFixed(2)
    })
  },
  chooseAddress(){
    let vm = this
    wx.chooseAddress({
      success:function(res){
        if(res.errMsg == 'chooseAddress:ok'){
          vm.setData({
            'submitForm.address': res.provinceName + res.cityName + res.countyName,
            'submitForm.addressDetails': res.detailInfo,
            'submitForm.name': res.userName,
            'submitForm.tel': res.telNumber,
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
  gotoPay(){
    // console.log('this.data.submitForm',this.data.submitForm)
    if(!this.data.submitForm.address || !this.data.submitForm.addressDetails || !this.data.submitForm.name || !this.data.submitForm.tel){
      $Toast({
        content: "请完善收货信息！",
        type: 'warning'
      });
    }else{
      console.log('可以提交')
      classify.saveOrders({
        ...this.data.submitForm
      }).then(res => {
        if(res.code == 200){
          $Toast({
            content: "生成订单成功，可以调支付了！",
            type: 'success'
          });
        }else{
          $Toast({
            content: res.msg,
            type: 'error'
          });
        }
      })
    }
  },
  gotoCoupon(){
    if(this.data.submitForm.productList){
      wx_gotoNewUrl('navigateTo','/pages/mine/couponUse/index',{
        ...this.data.submitForm,
        productList: JSON.stringify(this.data.submitForm.productList)
      })
    }
  }
})