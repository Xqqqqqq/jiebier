import { wx_gotoNewUrl } from '../../../utils/fn'
Page({
  data:{
    
  },
  // 查看进度
  gotoProgress(){
    wx_gotoNewUrl('navigateTo','/pages/mine/cancelStep/index')
  },
  // 进入店铺
  gotoShops(){
    wx_gotoNewUrl('navigateTo','/pages/index/shops/index')
  }
})