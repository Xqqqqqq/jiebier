//index.js
import { Index } from '../../../api-models/index/index';
const index = new Index();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()

Page({
  data : {
    imgUrls: [], // 轮播图数组
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    recommendList:['沈阳', '北京','上海','天津','武汉','吉林','河南','四川',],
    currentTab: -1,
  },
  onShow(){
    // 设置购物车数量
    // wx.setTabBarBadge({
    //   index: 1,
    //   text: '4'
    // })
    this.getLoopList()
  },
  // 获取轮播图数组
  getLoopList(){
    index.getLoopList().then(res => {
      if(res.code == '0'){
        this.setData({
          imgUrls: res.data.loopList
        })
      }
    })
  },
  // 计算商品增加或减少
  quantityChange(e){
    const index = e.currentTarget.dataset.index;
    let goodsList = this.data.goodsList;
    let quantity = goodsList[index].num
    if(e.target.id == 'sub'){
      if(quantity <= 1){
        wx.showToast({
          title: '该宝贝不能减少了哦~',
          icon: 'none',
          duration: 1500
        })
        return
      }else{
        quantity -= 1
      }
    }else if(e.target.id == 'add'){
      quantity +=1
    }
    goodsList[index].num = quantity
    this.setData({
      goodsList: goodsList
    })
    this.getTotalPrice()
  },
  gotoHot(){
    wx_gotoNewUrl('navigateTo','/pages/index/hotSale/index')
  },
  clickTab(e){
    let cur = e.currentTarget.dataset.current;
    if(this.data.currentTab == cur){
      return false;
    }else{
      this.setData({
        currentTab:cur,
      }) 
    }
  }
});

