import { wx_gotoNewUrl } from '../../../utils/fn'
Page({
  data:{
    tabList:[
      { id:1, name:"我的订单"},
      { id:2, name:"待收货"},
      { id:3, name:"已完成"},
      { id:4, name:"已取消"},
    ],
    currentTab:0,
    visibleCancel: false, //取消订单弹窗
  },
  onLoad(options){
    console.log(options)
  },
  // 切换状态
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
  // 查看详情
  gotoDetail(){
    wx_gotoNewUrl('navigateTo','/pages/mine/orderDetail/index')
  },
  // 查看进度
  gotoProgress(){
    wx_gotoNewUrl('navigateTo','/pages/mine/cancelStep/index')
  },
  // 取消订单
  clickCancel(){
    this.setData({
      visibleCancel: true
    });
  },
  handleCancelFalse(){
    this.setData({
      visibleCancel: false
    });
  },
  handleCancelTrue(){
    this.setData({
      visibleCancel: false
    });
  }
})