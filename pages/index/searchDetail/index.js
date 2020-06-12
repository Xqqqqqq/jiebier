import { Index } from '../../../api-models/index/index';
const index = new Index();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    goodsName: '',
    tabList:[
      { id:1, name:"店铺" },
      { id:2, name:"商品" },
    ],
    currentTab:0,
    shopList:[],
    goodsList:[],
    options: {}
  },
  onLoad(options){
    if(options.name){
      this.setData({
        options:options
      })
    }
  },
  onShow(){
    this.setData({
      shopList:[],
      goodsList:[],
      currentTab:0,
    })
     if(this.data.options){
      this.setData({
        goodsName:this.data.options.name ? this.data.options.name : ''
      })
    }
    this.search(this.data.goodsName)
  },
  search(key){
    index.search({
      key:key
    }).then(res => {
      if(res.code ==200){
        this.setData({
          shopList: res.result.companyList,
          goodsList: res.result.productList
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  bindNameInput(e){
    this.setData({
      goodsName:e.detail.value
    })
  },
  clickSearch(){
    this.search(this.data.goodsName)
  },
  clickTab(e){
    let cur = e.currentTarget.dataset.current;
    if(this.data.currentTab == cur){
      return false;
    }else{
      this.setData({
        currentTab:cur,
      }) 
    }
  },
  gotoDetail(e){
    wx_gotoNewUrl('navigateTo','/pages/classify/goodsDetail/index',{
      goodsid:e.currentTarget.dataset.id, // 详细商品id
      goodsname:e.currentTarget.dataset.name, // 详细商品名称
    })
  }
})