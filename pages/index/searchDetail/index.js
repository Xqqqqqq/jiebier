import { Index } from '../../../api-models/index/index';
const index = new Index();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    goodsName: '',
    tabList:[
      { id:1, name:"店铺" },
      { id:2, name:"商品" },
    ],
    currentTab:0,
    shopList:[],
    goodsList:[]
  },
  onLoad(options){
    console.log(options)
    if(options.name){
      this.setData({
        goodsName:options.name
      })
    }
    // this.search(this.data.goodsName)
    this.search('英驰')
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
    console.log(this.data.goodsName)
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
  }
})