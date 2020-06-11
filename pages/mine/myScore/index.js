const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
  },
  gotoDetail(){
    wx_gotoNewUrl('navigateTo','/pages/mine/scoreInfo/index')
  }
})