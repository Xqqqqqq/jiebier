Page({
  data:{
    tabList:[
      { id:1, name:"热销" },
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
  }
})