import { wx_gotoNewUrl } from '../../../utils/fn'
import { News } from '../../../api-models/news/news';
const news = new News();
const { $Toast } = require('../../../dist/base/index');
Page({
  data:{
    id: '',
    newsInfo: {}
  },
  onLoad(options){
    if(options.id){
      this.data.id = options.id
    }
  },
  onShow(){
    if(this.data.id) {
      this.getborArticle(this.data.id)
    }
  },
  getborArticle(id){
    news.getborArticle({
      id: id
    }).then(res => {
      if(res.code == 200){
        this.setData({
          newsInfo: res.result,
          "newsInfo.content": res.result.content.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block" ')
        })
      }
    })
  },
  // 进入店铺
  gotoShops(){
    wx_gotoNewUrl('navigateTo','/pages/index/shops/index')
  },
})