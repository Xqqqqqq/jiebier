import { News } from '../../../api-models/news/news';
const news = new News();
import { Index } from '../../../api-models/index/index';
const index = new Index();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    newsList:[],
    url: app.globalData.url,
    visible: false,
  },
  onLoad(){
    this.getDictAll()
  },
  // 获取用户字典 
  getDictAll(){
    if(wx.getStorageSync('userInfo').id){
      let couponStateList = []
      let newsList = []
      index.getDict({ dictType: 'news_type' }).then(res => {
        if(res.code == 200){
          couponStateList = res.result
          news.searchNews({
            userId: wx.getStorageSync('userInfo').id
          }).then(res => {
            if(res.code == 200){
              newsList = res.result
              if(newsList && couponStateList){
                this.setData({
                  newsList:this.findDictLabel(couponStateList,newsList)
                })
              }
              console.log(this.data.newsList)
            }else{
              $Toast({
                content: res.msg,
                type: 'error'
              });
            }
          })
        }else {
          $Toast({
            content: res.msg,
            type: 'error'
          });
        }
      })
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
    wx_gotoNewUrl('switchTab','/pages/mine/mine/index')
  },
  handleClose(){
    this.setData({
      visible: false
    })
  },
  gotoRouter(e){
    if(e.currentTarget.dataset.item.newsType == 1){ // 订单信息

    }else if(e.currentTarget.dataset.item.newsType == 2) { //商品消息
      wx_gotoNewUrl('navigateTo','/pages/classify/goodsDetail/index',{
        goodsid:e.currentTarget.dataset.item.keyword, // 详细商品id
        goodsname:'订单详情', // 详细商品名称
      })
    }else if(e.currentTarget.dataset.item.newsType == 0) { // 系统消息
      console.log('系统消息，不可点击')
    }
    // wx_gotoNewUrl('navigateTo','/pages/news/newsDetail/index')
  },
  // 数据字典-列表转换
  findDictLabel(dictData,data){
    const newData = data.map(item => {
      return {
        ...item,
        dictLabel: dictData.find(it => it.dictValue == item.newsType).dictLabel
      }
    })
    return newData
  },
})