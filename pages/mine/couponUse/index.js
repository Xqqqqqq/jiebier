import { Mine } from '../../../api-models/mine/mine';
const mine = new Mine();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    submitForm:{},
    couponList:[],
    currentTab:-1,
    couponId: '', //优惠券ID
    couponType: '', //优惠类型：0打折，1优惠券，2无
    disabled: false, //'是否可以使用折扣'
    options:''
  },
  onLoad(options){
    if(options){
      this.setData({
        options: options
      })
    }
  },
  onShow(){
    if(this.data.options){
      this.data.submitForm = this.data.options
      this.data.submitForm.productList = JSON.parse(this.data.submitForm.productList)
      this.getCouponList()
    }
  },
  getCouponList(){
    mine.getCouponList({
      ...this.data.submitForm
    }).then(res => {
      if(res.code == 200){
        this.setData({
          couponList:res.result.available,
          disabled: res.result.isMember == 0 ? false : true
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  typeChange(e){
    if(this.data.disabled == true){
      console.log('不是物业联名会员不可使用折扣')
    }else{
      wx_gotoNewUrl('navigateTo','/pages/classify/confirmOrder/index',{
        ...this.data.submitForm,
        couponType: e.detail.value,
        productList: JSON.stringify(this.data.submitForm.productList)
      })
    }
  },
  gotoUse(e){
    console.log(e.currentTarget.dataset)
    let cur = e.currentTarget.dataset.current;
    if(this.data.currentTab == cur){
      return false;
    }else{
      this.setData({
        currentTab:cur,
      }) 
      wx_gotoNewUrl('navigateTo','/pages/classify/confirmOrder/index',{
        ...this.data.submitForm,
        couponType: '1',
        couponId:e.currentTarget.dataset.id,
        price: e.currentTarget.dataset.price,
        productList: JSON.stringify(this.data.submitForm.productList)
      })
    }
  }
})