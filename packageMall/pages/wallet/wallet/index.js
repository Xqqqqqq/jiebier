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
  },
})