import { Classify } from '../../../api-models/classify/classify';
const classify = new Classify();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    tabList:[
      { id:0, name:"综合" },
      { id:1, name:"价格" },
      { id:2, name:"销量" },
    ],
    currentTab:0,
    options:{},
    classifyGoodsInfo:{
      productRegionId: '', // 地区id
      id: '', //商品id
    },
    goodsList:[]
  },
  onLoad(options){
    if(options){
      this.setData({
        options:options
      })
    }
  },
  onShow(){
    this.setData({
      goodsList:[]
    })
    if(this.data.options){
      wx.setNavigationBarTitle({
        title: this.data.options.title 
      })
      this.setData({
        'classifyGoodsInfo.productRegionId': this.data.options.productRegionId,
        'classifyGoodsInfo.id': this.data.options.id,
      })
    }
    this.productList('')
  },
  productList(ascType){
    classify.productList({
      ascType: ascType,// 排序类型1价格倒序2销量倒序
      productClassId: this.data.classifyGoodsInfo.id, //分类id
      productRegionId: this.data.classifyGoodsInfo.productRegionId, // 地区id
    }).then(res => {
      if(res.code == 200){
        this.setData({
          goodsList: res.result
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  clickTab(e){
    let cur = e.currentTarget.dataset.current;
    let id = e.currentTarget.dataset.id;
    if(this.data.currentTab == cur){
      return false;
    }else{
      this.setData({
        currentTab:cur,
      }) 
    }
    if(id == 0){
      this.productList('')
    }else{
      this.productList(id)
    }
  },
  gotoRouter(e){
    wx_gotoNewUrl('navigateTo','/pages/classify/goodsDetail/index',{
      goodsid:e.currentTarget.dataset.id, // 详细商品id
      goodsname:e.currentTarget.dataset.name, // 详细商品名称
    })
  }
})