//index.js
//获取应用实例
import { Index } from '../../../api-models/index/index';
const index = new Index();
import { Classify } from '../../../api-models/classify/classify';
const classify = new Classify();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data: {
    url: app.globalData.url,
    currentScrollId: '',// 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
    cp_index: 0,// 左侧点击下标
    leftTop: 0, // 左侧竖向滚动条位置
    left_item_height: 0,
    leftData: [{
        name: '菜品1',
        id: 'cp1'
      },
      {
        name: '菜品2',
        id: 'cp2'
      },
      {
        name: '菜品3',
        id: 'cp3'
      },
      {
        name: '菜品4',
        id: 'cp4'
      },

      {
        name: '菜品5',
        id: 'cp5'
      },
      {
        name: '菜品6',
        id: 'cp6'
      },
      {
        name: '菜品7',
        id: 'cp7'
      },
      {
        name: '菜品8',
        id: 'cp8'
      },
      {
        name: '菜品9',
        id: 'cp9'
      },
      {
        name: '菜品10',
        id: 'cp10'
      },
      {
        name: '菜品11',
        id: 'cp11'
      },
      {
        name: '菜品12',
        id: 'cp12'
      }
    ],
    rightData: [{
        name: '菜品1',
        id: 'cp1',
        img: [
          {
            id:'10',
            name:'苹果',
            img:'../../../static/image/index/card.png',
          },
          {
            id:'11',
            name:'香蕉',
            img:'../../../static/image/index/card.png',
          },
          {
            id:'12',
            name:'橙子',
            img:'../../../static/image/index/card.png',
          },
          {
            id:'13',
            name:'李子',
            img:'../../../static/image/index/card.png',
          }
        ]
      },
      {
        name: '菜品2',
        id: 'cp2',
        img: [
          {
            id:'20',
            name:'黄瓜',
            img:'../../../static/image/index/card.png',
          },
          {
            id:'21',
            name:'柿子',
            img:'../../../static/image/index/card.png',
          },
          {
            id:'22',
            name:'茄子',
            img:'../../../static/image/index/card.png',
          },
          {
            id:'23',
            name:'土豆',
            img:'../../../static/image/index/card.png',
          }
        ]
      },
      {
        name: '菜品3',
        id: 'cp3',
        img: [
          {
            id:'30',
            name:'牛奶',
            img:'../../../static/image/index/card.png',
          },
          {
            id:'31',
            name:'汽水',
            img:'../../../static/image/index/card.png',
          },
          {
            id:'32',
            name:'花生露',
            img:'../../../static/image/index/card.png',
          },
          {
            id:'33',
            name:'养乐多',
            img:'../../../static/image/index/card.png',
          },
          {
            id:'34',
            name:'冰红茶',
            img:'../../../static/image/index/card.png',
          },
          {
            id:'35',
            name:'果汁',
            img:'../../../static/image/index/card.png',
          },
        ]
      },
    ],
    rightDataList:{},
    heightArr: 0,
    zindex: 0,
    showTop: true,
    height: '',
    url: app.globalData.url,
  },
  onLoad(options){
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight - 200
        })
      }
    })
    if(options.type == 'goods'){
      this.findGoodId(this.data.rightData, options.id)
      this.setData({
        showTop: false,
        currentScrollId:`c_${options.id}`,
        rightDataList: this.findGoodId(this.data.rightData, options.id),
      })
    }else{
      this.setData({
        showTop: true,
        rightDataList: this.data.rightData[0],
      })
    }
  },
  // 查找商品上一级id
  findGoodId(arr, sourceId){
    let targetId = ''
    let rightList = {}
    arr.forEach((arrItem, index) => {
      const { img } =arrItem
      const targetData = img.find(imgItem => imgItem.id == sourceId)
      if(targetData) {
        targetId = arrItem.id
        rightList = arr.find(item => item.id == targetId)
        this.setData({
          cp_index: index,
        })
      }
    })
    return rightList
  },
  // 点击左侧
  leftTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var idSplit = e.currentTarget.dataset.id.split("c_")[1];
    if(this.data.cp_index == index){
      return false;
    }else{
      let goodsList = this.data.rightData
      let rightList = goodsList.find(item => item.id == idSplit)
      this.setData({
        cp_index: index,
        currentScrollId: id,
        rightDataList: rightList ? rightList : {}
      }) 
    }
  },
  bindscroll: function (e) {
    console.log(e.detail.scrollTop)
    if(e.detail.scrollTop > 100){
      this.setData({
        showTop: false
      })
    }else{
      this.setData({
        showTop: true
      })
    }
  },





  // 联动样式-------------------------------------------
  // onShow() {
  //   var that = this;
  //   var h = 0;
  //   var heightArr = [];
  //   // wx.createSelectorQuery返回一个 SelectorQuery 对象实例
  //   wx.createSelectorQuery().select('.sc_left_item').boundingClientRect(function (rect) { //select会选择第一个类目的盒子
  //   }).exec(function (res) {
  //     that.setData({
  //       left_item_height: res[0].height
  //     })
  //   });
  //   wx.createSelectorQuery().selectAll('.sc_right_item').boundingClientRect(function (rect) { //selectAll会选择所要含有该类名的盒子
  //   }).exec(function (res) {
  //     console.log(res)
  //     res[0].forEach((item) => {
  //       h += item.height;
  //       heightArr.push(h);
  //     })
  //     that.setData({
  //       heightArr: heightArr
  //     })
  //   })
  // },
  // // 点击左侧
  // leftTap: function (e) {
  //   var index = e.currentTarget.dataset.index;
  //   var id = e.currentTarget.dataset.id;
  //   this.setData({
  //     cp_index: index,
  //     currentScrollId: id
  //   })
  // },
  // // 滚动时触发
  // bindscroll: function (e) {
  //   if(e.detail.scrollTop > 10){
  //     this.setData({
  //       showTop: false
  //     })
  //   }else{
  //     this.setData({
  //       showTop: true
  //     })
  //   }
  //   const { scrollTop } = e.detail;
  //   const { heightArr, left_item_height } = this.data;
  //   if (scrollTop < heightArr[0]) {
  //     this.setData({
  //       cp_index: 0,
  //       leftTop: 0
  //     })
  //     return;
  //   }
  //   let index = heightArr.findIndex(item => item > scrollTop);
  //   let leftTop = index * left_item_height;
  //   this.setData({
  //     cp_index: index,
  //     leftTop
  //   })
  // },
})