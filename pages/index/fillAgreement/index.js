import { Index } from '../../../api-models/index/index';
const index = new Index();
//获取应用实例
const app = getApp()
Page({
  data:{
    nodes:'',
    type: '', //判断是入驻协议还是服务条款
  },
  onLoad(option){
    if(option.type){
      this.setData({
        type: option.type
      })
      wx.setNavigationBarTitle({
        title: option.type == 1 ? '入驻协议' : '服务条款'
      })
    }
  },
  onShow(){
    index.getAgreement().then(res => {
      if(res.code == 200){
        this.setData({
          nodes: this.data.type == 1 ? res.result.settledAgreement : res.result.termsService
        })
      }
    })
  }
})