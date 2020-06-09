import { wx_gotoNewUrl } from '../../../utils/fn'
Page({
  data:{

  },
  gotoUrl(){
    wx_gotoNewUrl('navigateTo','/pages/loginAll/loginAdmin/index')
  }
})