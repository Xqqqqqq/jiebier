import { wx_gotoNewUrl } from '../../../utils/fn'
Page({
  data:{

  },
  gotoUrl(e){
    let type= e.currentTarget.dataset.type
    let url= e.currentTarget.dataset.url
    wx_gotoNewUrl(type,url)
  },
})