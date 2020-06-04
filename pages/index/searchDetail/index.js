Page({
  data:{
    goodsName: '',
    tabList:[
      { id:1, name:"店铺" },
      { id:2, name:"商品" },
    ],
    currentTab:0,
  },
  bindNameInput(e){
    this.setData({
      goodsName:e.detail.value
    })
  },
  clickSearch(){
    console.log(this.data.goodsName)
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