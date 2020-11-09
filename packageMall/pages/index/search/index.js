import { Index } from '../../../../api-models/index/index';
const index = new Index();
import { wx_gotoNewUrl } from '../../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    goodsName: '',
    historyList:[],
    currentHistoryTab:-1,
    visible: false,
  },
  onShow(){
    this.setData({
      goodsName: '',
      currentHistoryTab:-1,
      historyList: wx.getStorageSync('historyList') ? wx.getStorageSync('historyList') : []
    })
  },
  bindNameInput(e){
    this.setData({
      goodsName:e.detail.value
    })
  },
  // 点击搜索按钮
  clickSearch(){
    if(this.data.goodsName){
      this.data.historyList.unshift(this.data.goodsName)
      let historyList = this.unique(this.data.historyList).slice(0, 8)
      wx.setStorage({
        key: 'historyList',
        data: historyList
      })
    }
    wx_gotoNewUrl('navigateTo','/packageMall/pages/index/searchList/index',{
      name:this.data.goodsName
    })
  },
  // 数组去重
  unique (arr) {
    return Array.from(new Set(arr))
  },
  // 点击历史记录
  clickHistoryTab(e){
    this.setData({
      currentHotTab: -1,
      goodsName: ''
    })
    let cur = e.currentTarget.dataset.index;
    this.setData({
      currentHistoryTab:cur,
      goodsName: this.data.historyList[cur]
    }) 
  },
  clickDelete(){
    this.setData({
      visible: true
    })
  },
  handleOk(){
    wx.clearStorage('historyList')
    this.setData({
      visible: false,
      historyList: [],
      currentHistoryTab: -1,
    })
  },
  handleCancel(){
    this.setData({
      visible: false
    })
  },
})