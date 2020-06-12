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
  },
  onLoad(options){
    if(options){
      wx.setNavigationBarTitle({
        title: options.goodsname 
      })
      this.setData({
        "goodsDetail.productId":options.goodsid
      })
    }
    this.productDetail(this.data.goodsDetail.productId)
    // this.productDetail('ffgdsgfdfdg')
  },
  productDetail(id){
    classify.productDetail({
      id: id
    }).then(res => {
      // console.log(res)
      if(res.code == 200){
        if(res.result.productOutVo.express == 1){
          this.data.typeList.push({
            id:'1',
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
            id:'3',
            name: '商家配送'
          })
        }
        this.setData({
          goodInfo: res.result,
          typeList:this.data.typeList,
          'goodsDetail.deliveryType':Number(this.data.typeList[0].id),
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
    if(e.target.id == 'sub'){
      if(quantity <= 1){
        $Toast({
          content: '该宝贝不能减少了哦~',
          type: 'warning'
        });
        return
      }else{
        quantity -= 1
      }
    }else if(e.target.id == 'add'){
      quantity += 1
    }
    this.setData({
      'goodsDetail.productNum': quantity
    })
  },
  addShop(){
    console.log(this.data.goodsDetail)
    classify.addCart({
      userId:'1', //	string 用户id
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
  },
  bindTypeChange(e){
    this.setData({
      typeIndex: e.detail.value,
      'goodsDetail.deliveryType':Number(this.data.typeList[e.detail.value].id)
    })
  },
  gotoShopcart(){
    wx_gotoNewUrl('switchTab','/pages/shoppingCart/shoppingCart/index')
  },
  gotoShop(){
    wx_gotoNewUrl('navigateTo','/pages/index/shops/index')
  },
})