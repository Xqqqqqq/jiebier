import { Classify } from '../../../api-models/classify/classify';
const classify = new Classify();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    goodsDetail:{
      productId:'', //商品id
      deliveryType: '',// 配送方式id  integer($int32)
      productNum: 1, //添加数量
      companyId: '',//店铺id
    },
    goodInfo:{},
    typeList:[], // 配送方式
    typeIndex: 0,
    visible: false,
    title:'',
  },
  onLoad(options){
    if(options){
      wx.setNavigationBarTitle({
        title: options.goodsname 
      })
      this.setData({
        "goodsDetail.productId":options.goodsid,
        title: options.goodsname
      })
      this.productDetail(options.goodsid)
    }
  },
  productDetail(id){
    classify.productDetail({
      id: id
    }).then(res => {
      if(res.code == 200){
        if(res.result.productOutVo.express == 1){
          this.data.typeList.push({
            id:'3',
            name: '快递'
          })
        }
        if(res.result.productOutVo.isPick == 1){
          this.data.typeList.push({
            id:'2',
            name: '自提'
          })
        }
        if(res.result.productOutVo.isDelivery == 1){
          this.data.typeList.push({
            id:'1',
            name: '商家配送'
          })
        }
        this.setData({
          goodInfo: res.result,
          typeList:this.data.typeList,
          'goodsDetail.deliveryType':this.data.typeList.length >0 ? Number(this.data.typeList[0].id) : '',
          "goodsDetail.companyId":res.result.productOutVo.companyId
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  // 点击加减商品
  quantityChange(e){
    let quantity = this.data.goodsDetail.productNum
    if(e.currentTarget.id == 'sub'){
      if(quantity <= 1){
        $Toast({
          content: '该宝贝不能减少了哦~',
          type: 'warning'
        });
        return
      }else{
        quantity -= 1
      }
    }else if(e.currentTarget.id == 'add'){
      quantity += 1
    }
    this.setData({
      'goodsDetail.productNum': quantity
    })
  },
  addShop(){
    if(wx.getStorageSync('userInfo').id){
      classify.addCart({
        userId: wx.getStorageSync('userInfo').id, //	string 用户id
        ...this.data.goodsDetail
      }).then(res => {
        if(res.code == 200){
          $Toast({
            content: "添加购物车成功！",
            type: 'success'
          });
        }else{
          $Toast({
            content: res.msg,
            type: 'error'
          });
        }
      })
    }else{
      this.setData({
        visible: true
      })
    }
  },
  handleOk(){
    this.setData({
      visible: false
    })
    wx_gotoNewUrl('switchTab','/pages/mine/mine/index')
  },
  handleClose(){
    this.setData({
      visible: false
    })
  },
  bindTypeChange(e){
    this.setData({
      typeIndex: e.detail.value,
      'goodsDetail.deliveryType':Number(this.data.typeList[e.detail.value].id)
    })
  },
  // 点击去购物车
  gotoShopcart(){
    wx_gotoNewUrl('switchTab','/pages/shoppingCart/shoppingCart/index')
  },
  // 点击去店铺详情
  gotoShop(){
    wx_gotoNewUrl('navigateTo','/pages/index/shops/index',{
      companyId: this.data.goodInfo.productOutVo.companyId,
      companyName: this.data.goodInfo.productOutVo.companyName,
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: this.data.title,
      path: `/pages/classify/goodsDetail/index?goodsid=${this.data.goodsDetail.productId}&goodsname=${this.data.title}`
    }
  },
  onShareTimeline(){
    return{
      title: this.data.title,
      query: `goodsid=${this.data.goodsDetail.productId}&goodsname=${this.data.title}`
    }
  }
})