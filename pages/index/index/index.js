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
    collapseList: [
      {
        title: '辽宁省',
        children:[{
          id:1,
          value: '沈阳',
          checked:false
        },{
          id:2,
          value: '丹东',
          checked:false
        },{
          id:3,
          value: '大连',
          checked:false
        },]
      },
      {
        title: '北京',
        children:[{
          id:4,
          value: '啊啊',
          checked:false
        },{
          id:5,
          value: '的丹东',
          checked:false
        },{
          id:6,
          value: '任溶溶',
          checked:false
        },]
      },
    ]
  },
  onShow(){
    // wx.chooseAddress({
    //   success (res) {
    //     console.log(res.userName)
    //     console.log(res.postalCode)
    //     console.log(res.provinceName)
    //     console.log(res.cityName)
    //     console.log(res.countyName)
    //     console.log(res.detailInfo)
    //     console.log(res.nationalCode)
    //     console.log(res.telNumber)
    //   }
    // })
    // 设置购物车数量
    // wx.setTabBarBadge({
    //   index: 1,
    //   text: '4'
    // })
    // this.getLoopList()
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
  gotoRouter(e){
    console.log(e.currentTarget.dataset.type)
    console.log(e.currentTarget.dataset.url)
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

