const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    clickName: '编辑',
    showDelete: true,
    isAllSelect: false,
    totalMoney: 0,
    goodsList:[
      {
        id:1,
        name:'嘻唰唰店',
        goods:[
          {
            goodsId:10,
            name:'xixi',
            num:1,
            price:10,
          },
          {
            goodsId:11,
            name:'haha',
            num:3,
            price:20,
          },
          {
            goodsId:12,
            name:'hoho',
            num:5,
            price:30,
          },
        ]
      },
      {
        id:2,
        name:'卖水果的',
        goods:[
          {
            goodsId:20,
            name:'pingguo',
            num:2,
            price:40,
          },
          {
            goodsId:21,
            name:'xiangjiao',
            num:4,
            price:50,
          },
          {
            goodsId:22,
            name:'boluo',
            num:6,
            price:60,
          },
        ]
      },
      {
        id:3,
        name:'卖菜的',
        goods:[
          {
            goodsId:30,
            name:'黄瓜',
            num:4,
            price:70,
          },
          {
            goodsId:31,
            name:'西红柿',
            num:2,
            price:80,
          },
          {
            goodsId:32,
            name:'茄子',
            num:5,
            price:90,
          },
        ]
      },
    ],
    typeList:[
      {
        id:1,
        name: '商品自提'
      },
      {
        id:2,
        name: '商品配送'
      },
      {
        id:3,
        name: '商品物流'
      },
    ],
    showMask: false
  },
  onShow(){
    const goodsList = this.data.goodsList.map(item => {
      return {
        ...item,
        isSelect: false
      }
    })
    this.setData({
      goodsList: goodsList,
    })
    this.getTotalPrice()
  },
  changeName(){
    if(this.data.clickName == '编辑'){
      this.setData({
        clickName: '完成',
        showDelete: false
      })
    }else if(this.data.clickName == '完成'){
      this.setData({
        clickName: '编辑',
        showDelete: true
      })
    }
  },
  // 点击商品自提打开蒙层
  openMask(){
    this.setData({
      showMask: true
    })
  },
  closeMask(){
    this.setData({
      showMask: false
    })
  },
  radioChange(e){
    console.log(e.detail.value)
  },
  // 点击门店旁的checkbox
  switchSelect(e){
    let goodsList = this.data.goodsList
    const index = e.currentTarget.dataset.index
    let selectNum = 0 // 统计选中商品
    const isSelect = goodsList[index].isSelect
    goodsList[index].isSelect = !isSelect
    for(let i=0;i<goodsList.length; i++){
      if(goodsList[i].isSelect == true){
        selectNum++
        goodsList[i].goods.map(itemSmall => {
          itemSmall.isSmallSelect = true
        })
      }else{
        goodsList[i].goods.map(itemSmall => {
          itemSmall.isSmallSelect = false
        })
      }
    }
    if(selectNum == goodsList.length){
      this.setData({
        isAllSelect: true
      })
    }else{
      this.setData({
        isAllSelect: false
      })
    }
    this.getTotalPrice()
    this.setData({
      goodsList: goodsList
    })
  },
  // 点击商品旁边的checkbox  没做完
  goodsSelect(e){
    const index = e.currentTarget.dataset.index
    const indexsmall = e.currentTarget.dataset.indexsmall
    let goodsList = this.data.goodsList
    const isSmallSelect = goodsList[index].goods[indexsmall].isSmallSelect
    goodsList[index].goods[indexsmall].isSmallSelect = !isSmallSelect
    let selectNum = 0 // 统计选中商品
    for(let i =0; i < goodsList.length; i++){
      for(let j=0; j< goodsList[i].goods.length; j++){
        if(goodsList[i].goods[j].isSmallSelect == true){
          selectNum++
        }
      }
    }
    if(selectNum == goodsList[index].goods.length){
      goodsList[index].isSelect = true
    }else{
      goodsList[index].isSelect = false
    }
    this.getTotalPrice()
    this.setData({
      goodsList: goodsList
    })
  },
  // 商品全选
  selectAll(){
    let isAllSelect = this.data.isAllSelect
    isAllSelect = !isAllSelect
    let goodsList = this.data.goodsList
    for(let i =0; i <goodsList.length; i++){
      goodsList[i].isSelect = isAllSelect
      for(let j = 0; j <goodsList[i].goods.length; j++){
        goodsList[i].goods[j].isSmallSelect = isAllSelect
      }
    }
    this.getTotalPrice()
    this.setData({
      isAllSelect: isAllSelect,
      goodsList: goodsList
    })
  },
  // 点击加减商品
  quantityChange(e){
    const index = e.currentTarget.dataset.index
    const indexsmall = e.currentTarget.dataset.indexsmall
    let goodsList = this.data.goodsList
    let quantity = goodsList[index].goods[indexsmall].num
    if(e.target.id == 'sub'){
      if(quantity <= 1){
        $Toast({
          content: '该宝贝不能减少了哦~',
          type: 'warning'
        });
        return
      }else{
        quantity -= 1
      }
    }else if(e.target.id == 'add'){
      quantity += 1
    }
    goodsList[index].goods[indexsmall].num = quantity
    this.getTotalPrice()
    this.setData({
      goodsList: goodsList
    })
  },
  // 计算总价
  getTotalPrice(){
    let goodsList = this.data.goodsList
    let total = 0
    for(let i =0; i < goodsList.length; i++){
      if(goodsList[i].isSelect){
        for(let j =0; j <goodsList[i].goods.length; j++){
          total += goodsList[i].goods[j].num * goodsList[i].goods[j].price
        }
      }
    }
    this.setData({
      goodsList: goodsList,
      totalMoney: total.toFixed(2)
    })
  }
})