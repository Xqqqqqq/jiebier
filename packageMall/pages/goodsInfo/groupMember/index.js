import { Index } from '../../../../api-models/index/index';
const index = new Index();
import { wx_gotoNewUrl } from '../../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    visible: false,
    loopList:[],
    goodInfo:{},
    
  },
  onShow(){
  },
  handleOk(){
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