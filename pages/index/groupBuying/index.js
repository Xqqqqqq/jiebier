//index.js
import { Index } from '../../../api-models/index/index';
const index = new Index();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()

Page({
  data : {
    url: app.globalData.url,
    targetTime: 0,
    clearTimer: false,
    endDate:'',
    sumGroupBuy:10, // 拼团人数上限
    visible: ''
  },
  onLoad(){
    let endDate = new Date();
    endDate.setTime(endDate.getTime()+(1000*60*60*24))
    this.data.endDate = `${this.myGetDate(endDate)} 03:00:00`
    this.setData({
      targetTime: new Date(this.data.endDate).getTime(),
    });
  },
  myGetDate(date){
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
  },
  onUnload() {
    this.setData({
        clearTimer: true
    });
  },
  submitGroup(){
    if(wx.getStorageSync('userInfo').id){

    }else{
      this.setData({
        visible: true
      })
    }
  },
  handleOk(){
    this.setData({
      visible: false
    })
    wx_gotoNewUrl('navigateTo','/pages/loginAll/loginAdmin/index')
  },
  handleClose(){
    this.setData({
      visible: false
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '超值团购',
      path: `/pages/index/groupBuying/index`,  // 路径，传递参数到指定页面。
      imageUrl:'', // 分享的封面图
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})