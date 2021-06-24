const { $Toast } = require('../../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    showMask: false,
    visible: false,
    tabList:[
      { id:1, name:"全部" },
      { id:2, name:"待付款" },
      { id:3, name:"待发货" },
      { id:4, name:"待收货" },
      { id:5, name:"已收货" },
    ],
    currentTab:0,
  },
  onShow(){
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
  },
  handleOk(){
    this.setData({
      visible: false
    })
    wx_gotoNewUrl('switchTab','/pages/mine/mine/index')
  },
  handleClose(){
    this.setData({
      visible: false
    })
  },
})