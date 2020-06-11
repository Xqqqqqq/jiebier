//index.js
import { Index } from '../../../api-models/index/index';
const index = new Index();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()

Page({
  data : {
    url: app.globalData.url,
    imgUrls: [], // 轮播图数组
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    recommendList:['沈阳', '北京','上海','天津','武汉','吉林','河南','四川',],
    currentTab: -1,
    collapseList: [], //选择城市的数组
    selectTab: -1,
    name: ''
  },
  onShow(){
    // 设置购物车数量
    // wx.setTabBarBadge({
    //   index: 1,
    //   text: '4'
    // })
    this.getRegionTree()
  },
  // 获取地区分类
  getRegionTree(){
    index.getRegionTree().then(res => {
      if(res.code == '200'){
        this.setData({
          collapseList: res.result[0].children
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
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
  // 推荐城市
  clickTab(e){
    let cur = e.currentTarget.dataset.current;
    if(this.data.currentTab == cur){
      return false;
    }else{
      this.setData({
        currentTab:cur,
      }) 
    }
    wx_gotoNewUrl('switchTab','/pages/classify/classify/index')
  },
  // 选择城市  // 没做完
  selectTab(e){
    let index = e.currentTarget.dataset.index;
    let indexsmall = e.currentTarget.dataset.indexsmall;
    if(this.data.selectTab == this.data.collapseList[index].children[indexsmall]){
      return false;
    }else{
      this.setData({
        selectTab:this.data.collapseList[index].children[indexsmall],
      }) 
    }
    wx_gotoNewUrl('switchTab','/pages/classify/classify/index')
    if(e.currentTarget.dataset.name && e.currentTarget.dataset.id){
      app.globalData.userCity.id = e.currentTarget.dataset.id
      app.globalData.userCity.city = e.currentTarget.dataset.name
      wx.setStorage({
        key: 'userCity',
        data: app.globalData.userCity
      })
    }
  },
  gotoRouter(e){
    let type= e.currentTarget.dataset.type
    let url= e.currentTarget.dataset.url
    wx_gotoNewUrl(type,url)
  },
  radioChange(e){
    // console.log(e.detail.value)
    this.data.collapseList.map(item =>{
      item.children.map(itemSmall => {
        itemSmall.checked = false
        if(itemSmall.id == e.detail.value){
          itemSmall.checked = true
        }
      })
    })
    this.setData({
      collapseList: this.data.collapseList
    })
  }
});

