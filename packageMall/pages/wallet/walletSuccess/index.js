import { Index } from '../../../../api-models/index/index';
const index = new Index();
import { wx_gotoNewUrl } from '../../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    tabList:[
      { id:1, name:"一级" },
      { id:2, name:"二级" },
    ],
    currentTab:0,
    visible: false,
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
})