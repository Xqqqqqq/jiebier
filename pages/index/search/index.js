import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    goodsName: '',
    historyList:[
      {
        id:1,
        name:"苹果"
      },
      {
        id:2,
        name:"香蕉"
      },
      {
        id:3,
        name:"西瓜"
      },
      {
        id:4,
        name:"李子"
      },
      {
        id:5,
        name:"葡萄"
      },
    ],
    currentHistoryTab:-1,
    hotList:[
      {
        id:1,
        name:"苹果"
      },
      {
        id:2,
        name:"香蕉"
      },
      {
        id:3,
        name:"西瓜"
      },
      {
        id:4,
        name:"李子"
      },
      {
        id:5,
        name:"葡萄"
      },
    ],
    currentHotTab:-1,
  },
  bindNameInput(e){
    this.setData({
      goodsName:e.detail.value
    })
  },
  clickSearch(){
    wx_gotoNewUrl('navigateTo','/pages/index/searchDetail/index')
    console.log(this.data.goodsName)
  },
  clickHistoryTab(e){
    this.setData({
      currentHotTab: -1,
      goodsName: ''
    })
    let cur = e.currentTarget.dataset.index;
    if(this.data.currentHistoryTab == cur){
      return false;
    }else{
      this.setData({
        currentHistoryTab:cur,
        goodsName: this.data.historyList[cur].name
      }) 
    }
  },
  clickHotTab(e){
    this.setData({
      currentHistoryTab: -1,
      goodsName: ''
    })
    let cur = e.currentTarget.dataset.index;
    if(this.data.currentHotTab == cur){
      return false;
    }else{
      this.setData({
        currentHotTab:cur,
        goodsName: this.data.hotList[cur].name
      }) 
    }
  },
})