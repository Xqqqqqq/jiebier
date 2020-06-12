import { ShoppingCart } from '../../../api-models/shoppingCart/shoppingCart';
const shoppingCart = new ShoppingCart();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    clickName: '完成',
    showDelete: false,
    isAllSelect: false,
    totalMoney: 0,
    goodsList:[],
    goodsLength: 0,
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
    this.setData({
      isAllSelect: false,
      goodsList: []
    })
    this.selectCartByUserId()
    this.getTotalPrice()
  },
  selectCartByUserId(){
    shoppingCart.selectCartByUserId({
      userId: '1'
    }).then(res => {
      if(res.code == 200){
        let goodsLength = 0
        const goodsList = res.result.map(item => {
          return {
            ...item,
            isSelect: false
          }
        })
        for(let i = 0; i < goodsList.length; i++){
          goodsLength += goodsList[i].productList.length
        }
        this.setData({
          goodsList: goodsList,
          goodsLength: goodsLength
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
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
        goodsList[i].productList.map(itemSmall => {
          itemSmall.isSmallSelect = true
        })
      }else{
        goodsList[i].productList.map(itemSmall => {
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
  // 点击商品旁边的checkbox
  goodsSelect(e){
    const index = e.currentTarget.dataset.index
    const indexsmall = e.currentTarget.dataset.indexsmall
    let goodsList = this.data.goodsList
    const isSmallSelect = goodsList[index].productList[indexsmall].isSmallSelect
    goodsList[index].productList[indexsmall].isSmallSelect = !isSmallSelect
    let selectNum = 0 // 统计选中商品
    for(let i =0; i < goodsList.length; i++){
      for(let j=0; j< goodsList[i].productList.length; j++){
        if(goodsList[i].productList[j].isSmallSelect == true){
          selectNum++
        }
      }
    }
    if(selectNum == goodsList[index].productList.length){
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
      for(let j = 0; j <goodsList[i].productList.length; j++){
        goodsList[i].productList[j].isSmallSelect = isAllSelect
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
    let quantity = goodsList[index].productList[indexsmall].productNum
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
    goodsList[index].productList[indexsmall].productNum = quantity
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
        for(let j =0; j <goodsList[i].productList.length; j++){
          total += Number(goodsList[i].productList[j].productNum) * Number(goodsList[i].productList[j].productPrice)
        }
      }
    }
    this.setData({
      goodsList: goodsList,
      totalMoney: total.toFixed(2)
    })
  }
})