import { wx_gotoNewUrl, getUserAddress } from '../../../utils/fn'
const app = getApp()
Page({
  data: {
    addressInfo:{},
    rightData: [{
      name: '菜品1',
      id: 'cp1',
      img: [
        {
          id:'10',
          name:'苹果wwwwwwwwwwww',
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
      ],
      cp_index: 0,// 左侧点击下标
    },
  ],
  },
  onShow(){
    this.setData({
      cp_index: 0
    })
    // getUserAddress().then(res => {
    //   console.log('sss',res)
    // })
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
  gotoPos(){
    wx_gotoNewUrl('navigateTo','/pages/classify/selectCity/index')
  },
  gotoRouter(){
    wx_gotoNewUrl('navigateTo','/pages/classify/classifyGoods/index')
  }
})