import { Classify } from '../../../api-models/classify/classify';
const classify = new Classify();
import { ShoppingCart } from '../../../api-models/shoppingCart/shoppingCart';
const shoppingCart = new ShoppingCart();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl, getUserAddress } from '../../../utils/fn'
const app = getApp()
Page({
  data: {
    url: app.globalData.url,
    selectCity:{},
    addressInfo:{},
    goodsData: [],
    rightData:{},
    cp_index: 0,// 左侧点击下标
    urlType:'1', // 判断是调到二级分类还是调到店铺详情
  },
  onShow(){
    this.setData({
      // cp_index: 0,
      selectCity: app.globalData.selectCity
    })
    // 查询购物车数量
    if(wx.getStorageSync('userInfo').id){
      shoppingCart.selectCartByUserId({
        userId: wx.getStorageSync('userInfo').id
      }).then(res => {
        if(res.code == 200){
          let goodsLength = 0
          for(let i = 0; i < res.result.length; i++){
            goodsLength += res.result[i].productList.length
          }
          // 设置购物车数量
          wx.setTabBarBadge({
            index: 3,
            text: goodsLength+''
          })
        }
      })
    }
  },
  onLoad(){
    this.productClass()
  },
  productClass(){
    classify.productClass().then(res => {
      if(res.code == '200'){
        let leftInfo = res.result.find(item => item.regionName == '旗舰店')
        let goodsData = res.result
        goodsData.unshift(leftInfo)
        this.setData({
          goodsData: this.unique(goodsData),
          rightData: res.result[0],
          urlType: this.unique(goodsData)[0].regionType
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  unique(arr) {
    return Array.from(new Set(arr))
  },
  // 点击左侧
  leftTap(e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var idSplit = e.currentTarget.dataset.id.split("c_")[1];
    this.data.urlType = e.currentTarget.dataset.type
    if(this.data.cp_index == index){
      return false;
    }else{
      let goodsList = this.data.goodsData
      let rightData = goodsList.find(item => item.id == idSplit)
      this.setData({
        cp_index: index,
        currentScrollId: id,
        rightData: rightData ? rightData : {}
      }) 
    }
  },
  gotoPos(){
    wx_gotoNewUrl('navigateTo','/pages/classify/selectCity/index')
  },
  gotoRouter(e){
    if(this.data.urlType == '2'){
      wx_gotoNewUrl('navigateTo','/pages/index/shops/index',{
        companyId:e.currentTarget.dataset.id
      })
    }else if(this.data.urlType == '3'){
      wx_gotoNewUrl('navigateTo','/pages/index/flagshipStore/index',{
        id:e.currentTarget.dataset.id
      })
    }else{
      wx_gotoNewUrl('navigateTo','/pages/classify/classifyGoods/index',{
        productRegionId: this.data.selectCity.id ? this.data.selectCity.id : '',
        id:e.currentTarget.dataset.id,
        title: e.currentTarget.dataset.name,
      })
    }
  }
})