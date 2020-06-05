import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    tabList:[
      { id:1, name:"综合" },
      { id:2, name:"价格" },
      { id:3, name:"销量" },
    ],
    currentTab:0,
  },
  onLoad(options){
    console.log(options)
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
  gotoRouter(){
    wx_gotoNewUrl('navigateTo','/pages/classify/goodsDetail/index')
  }
})