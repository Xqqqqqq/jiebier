import { wx_gotoNewUrl } from '../../../utils/fn'
Page({
  data:{
    
  },
  // 进入店铺
  gotoShops(){
    wx_gotoNewUrl('navigateTo','/pages/index/shops/index')
  }
})