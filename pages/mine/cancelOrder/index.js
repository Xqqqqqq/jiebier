Page({
  data:{
    cancelList:[
      {
        id:1,
        name:'不想要了'
      },
      {
        id:2,
        name:'其他'
      },
    ],
    cancelIndex: 0
  },
  onShow(){
    this.data.cancelList.unshift({
      id:'',
      name:'请选择'
    })
    this.setData({
      cancelList: this.data.cancelList
    })
  },
  bindCancelChange(e){
    this.setData({
      cancelIndex: e.detail.value
    })
  }
})