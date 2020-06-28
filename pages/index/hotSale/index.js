import { Index } from '../../../api-models/index/index';
const index = new Index();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    tabList:[
      { id:1, name:"热销" },
      { id:2, name:"价格" },
      { id:3, name:"销量" },
    ],
    currentTab:0,
    typeList:[
      {
        id:'1',
        type: '商品自提',
        num:1
      },
      {
        id:'2',
        type: '商品配送',
        num:1
      },
      {
        id:'3',
        type: '商品物流',
        num:1
      },
    ],
    showPopup:false, // 是否显示底部弹窗
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
  openPopup(){
    this.setData({
      showPopup: true
    })
  },
  closePopup(){
    this.setData({
      showPopup: false
    })
  },
})