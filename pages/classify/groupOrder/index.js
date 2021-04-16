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
      productList:[],
      openId: '',
      couponType: 2
    },
    groupId: '',
    groupInfo:{},
    status:'创建'
  },
  onLoad(options){
    if(options){
      this.setData({
        'submitForm.address': options.address,
        'submitForm.addressDetails': options.addressDetails,
        'submitForm.name': options.name,
        'submitForm.tel': options.tel,
      })
    }
  },
  onShow(){
    this.data.submitForm.productList = []
    if(wx.getStorageSync('groupInfo')){
      this.data.submitForm.productList[0] = wx.getStorageSync('groupInfo')
      this.setData({
        groupInfo: wx.getStorageSync('groupInfo'),
        'submitForm.productList': this.data.submitForm.productList,
        'submitForm.userId': wx.getStorageSync('userInfo').id,
        'submitForm.openId': wx.getStorageSync('openId'),
      })
    }else{
      $Toast({
        content: '没有获取到商品，请重试！',
        type: 'warning'
      });
    }
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
    if(!this.data.submitForm.address || !this.data.submitForm.addressDetails || !this.data.submitForm.name || !this.data.submitForm.tel){
      $Toast({
        content: "请完善收货信息！",
        type: 'warning'
      });
    }else{
      console.log(this.data.submitForm)
      if(wx.getStorageSync('groupInfo').status == '创建'){
        classify.createGroup({
          ordersBo: this.data.submitForm,
          groupId: this.data.groupId, // 团购id
          productId:this.data.groupInfo.productId,
          userId: wx.getStorageSync('userInfo').id
        }).then(res => {
          if(res.code == 200){
            if(res.result){
              let result = JSON.parse(res.result)
              let resultInfo = JSON.parse(result.ysepay_online_weixin_pay_response.jsapi_pay_info)
              wx.requestPayment({
                'timeStamp': resultInfo.timeStamp,
                'nonceStr': resultInfo.nonceStr,
                'package': resultInfo.package,
                'signType': resultInfo.signType,
                'paySign': resultInfo.paySign,
                'success': function (res) {
                  console.log("支付成功");
                },
                'fail': function (res) {
                  //支付失败后的回掉
                  console.log("支付失败");
                }
              })
              // wx.requestPayment({
              //   'timeStamp': result.timeStamp,
              //   'nonceStr': result.nonceStr,
              //   'package': result.package,
              //   'signType': result.signType,
              //   'paySign': result.paySign,
              //   'success': function (res) {
              //     console.log("支付成功");
              //   },
              //   'fail': function (res) {
              //     //支付失败后的回掉
              //     console.log("支付失败");
              //   }
              // })
            }
          }else{
            $Toast({
              content: res.msg,
              type: 'error'
            });
          }
        })
      }else if(wx.getStorageSync('groupInfo').status == '参与'){
        classify.joinGroup({
          ordersBo: this.data.submitForm,
          groupId:this.data.groupId, // 团购id
          productId:this.data.groupInfo.productId,
          userId: wx.getStorageSync('userInfo').id
        }).then(res => {
          if(res.code == 200){
            if(res.result){
              let result = JSON.parse(res.result)
              wx.requestPayment({
                'timeStamp': result.miniPayRequest.timeStamp,
                'nonceStr': result.miniPayRequest.nonceStr,
                'package': result.miniPayRequest.package,
                'signType': result.miniPayRequest.signType,
                'paySign': result.miniPayRequest.paySign,
                'success': function (res) {
                  console.log("支付成功");
                },
                'fail': function (res) {
                  //支付失败后的回掉
                  console.log("支付失败");
                }
              })
              // let resultInfo = JSON.parse(result.ysepay_online_weixin_pay_response.jsapi_pay_info)
              // wx.requestPayment({
              //   'timeStamp': resultInfo.timeStamp,
              //   'nonceStr': resultInfo.nonceStr,
              //   'package': resultInfo.package,
              //   'signType': resultInfo.signType,
              //   'paySign': resultInfo.paySign,
              //   'success': function (res) {
              //     console.log("支付成功");
              //   },
              //   'fail': function (res) {
              //     //支付失败后的回掉
              //     console.log("支付失败");
              //   }
              // })
            }
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
})