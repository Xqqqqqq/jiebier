import { News } from '../../../api-models/news/news';
const news = new News();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    newsList:[],
    url: app.globalData.url,
    pageNum: 1,
    pageSize: 10,
    code: 0,
  },
  onLoad(){
    this.borArticleList()
  },
  borArticleList(){
    news.borArticleList({
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
    }).then(res => {
      this.data.code = res.code
      if(res.code == '200' || res.code == '-118' || res.code == '-116'){
        if(this.data.newsList) {
          this.data.newsList = [...this.data.newsList, ...res.result.list]
        }else{
          this.data.newsList = res.result.list
        }
        this.setData({
          newsList: this.data.newsList
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  gotoRouter(e){
    let id = e.currentTarget.dataset.item.id
    wx_gotoNewUrl('navigateTo','/pages/news/newsDetail/index',{
      id: id
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
   onReachBottom: function () {
    if(this.data.code != '0' && this.data.code != '-118'){
      const vm =this;
      const pageNum = vm.data.pageNum + 1;
      vm.setData({
        pageNum: pageNum, //更新当前页数
      })
      vm.borArticleList();
    }
  },
  onPullDownRefresh() {
    this.setData({
      pageNum: 1,
      newsList: []
    })
    this.borArticleList()
    wx.stopPullDownRefresh()//得到结果后关掉刷新动画
  },
})