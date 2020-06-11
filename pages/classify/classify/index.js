import { Classify } from '../../../api-models/classify/classify';
const classify = new Classify();
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
  },
  onShow(){
    this.productClass()
    this.setData({
      cp_index: 0,
      selectCity: app.globalData.selectCity
    })
    // getUserAddress().then(res => {
    //   console.log('sss',res)
    // })
  },
  productClass(){
    classify.productClass().then(res => {
      if(res.code == '200'){
        this.setData({
          goodsData: res.result,
          rightData: res.result[0]
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  // 点击左侧
  leftTap(e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var idSplit = e.currentTarget.dataset.id.split("c_")[1];
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
    wx_gotoNewUrl('navigateTo','/pages/classify/classifyGoods/index',{
      productRegionId: this.data.selectCity.id ? this.data.selectCity.id : '',
      id:e.currentTarget.dataset.id,
      title: e.currentTarget.dataset.name,
    })
  }
})