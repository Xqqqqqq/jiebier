Page({
  data:{
    tabList:[
      { id:1, name:"我的订单"},
      { id:2, name:"待收货"},
      { id:3, name:"已完成"},
      { id:4, name:"已取消"},
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
  }
})