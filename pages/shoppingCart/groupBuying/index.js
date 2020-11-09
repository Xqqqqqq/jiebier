import { ShoppingCart } from '../../../api-models/shoppingCart/shoppingCart';
const shoppingCart = new ShoppingCart();
import { Index } from '../../../api-models/index/index';
const index = new Index();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    showMask: false,
    visible: false,
    imgUrls: [], // 轮播图数组
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    classifyList:[
      {
        img: '../../../static/image/classify/no-choose.png',
        title:'商品分类',
        path: ''
      },
      {
        img: '../../../static/image/classify/no-choose.png',
        title:'团团单',
        path: ''
      },
      {
        img: '../../../static/image/classify/no-choose.png',
        title:'团团钱包',
        path: ''
      },
      {
        img: '../../../static/image/classify/no-choose.png',
        title:'团团赚',
        path: ''
      },
      {
        img: '../../../static/image/classify/no-choose.png',
        title:'邀请团友',
        path: ''
      },
    ]
  },
  onShow(){
    this.getLoops()
  },
  // 获取轮播图数组
  getLoops(){
    index.getLoops().then(res => {
      if(res.code == 200){
        this.setData({
          imgUrls: res.result
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
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
  gotoRouter(e){
    let type= e.currentTarget.dataset.type
    let url= e.currentTarget.dataset.url
    wx_gotoNewUrl(type,url)
  },
})