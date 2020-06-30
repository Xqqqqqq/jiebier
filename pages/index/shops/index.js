//index.js
//获取应用实例
import { Index } from '../../../api-models/index/index';
const index = new Index();
import { Classify } from '../../../api-models/classify/classify';
const classify = new Classify();
import { ShoppingCart } from '../../../api-models/shoppingCart/shoppingCart';
const shoppingCart = new ShoppingCart();
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
    rightData: [], // 分类所有数据
    rightDataList:{}, // 右侧数据
    hotList:[],
    heightArr: 0,
    zindex: 0,
    showTop: true, // 是否展示顶部热销和门店图片
    height: '',
    url: app.globalData.url,
    companyId: '', //企业id
    shopInfo:{}, //店铺头部详情部分
    type: '', // 判断点击商品还是门店进入
    showPopup:false, // 是否显示底部分页弹窗
    visible: false, //是否显示去登录的按钮
    goodsDetail:{
      productId:'', //商品id
      deliveryType: '',// 配送方式id  integer($int32)
      productNum: 1, //添加数量
      companyId: '',//店铺id
    },  // 加入购物车的参数
    canSubmit: false, // 是否可以点击加入购物车
    typeList:[],
  },
  onLoad(options){
    // let that = this
    // wx.getSystemInfo({
    //   success: function(res) {
    //     that.setData({
    //       height: res.windowHeight - 200
    //     })
    //   }
    // })
    // 获取店铺所有数据
    if(options){
      this.setData({
        companyId: options.companyId,
        type: options.type
      })
      wx.setNavigationBarTitle({
        title: options.companyName 
      })
    }
    this.selectCompanyDetails(this.data.companyId)
    // this.selectCompanyDetails('42b477acad4311ea94340242ac110002')
  },
  // 获取店铺详情
  selectCompanyDetails(companyId){
    index.selectCompanyDetails({
      companyId:companyId
    }).then(res => {
      if(res.code == 200){
        let rightDataList = res.result.companyClassList[0]
        rightDataList.productList.map(item => {
          item.typeList = []
          if(item.express && item.express== 1){
            item.typeList.push({
              id:'3',
              name: '快递',
              num: 1,
              checked: false
            })
          }
          if(item.isPick && item.isPick== 1){
            item.typeList.push({
              id:'2',
              name: '自提',
              num: 1,
              checked: false
            })
          }
          if(item.isDelivery && item.isDelivery== 1){
            item.typeList.push({
              id:'1',
              name: '商家配送',
              num: 1,
              checked: false
            })
          }
        })
        let hotList = res.result.hotProductList
        hotList.map(item => {
          item.typeList = []
          if(item.express && item.express== 1){
            item.typeList.push({
              id:'3',
              name: '快递',
              num: 1,
              checked: false
            })
          }
          if(item.isPick && item.isPick== 1){
            item.typeList.push({
              id:'2',
              name: '自提',
              num: 1,
              checked: false
            })
          }
          if(item.isDelivery && item.isDelivery== 1){
            item.typeList.push({
              id:'1',
              name: '商家配送',
              num: 1,
              checked: false
            })
          }
        })
        this.setData({
          shopInfo: res.result,
          rightData: res.result.companyClassList ? res.result.companyClassList : [],
          rightDataList:rightDataList,
          hotList:hotList
        })
        // if(this.data.type == 'goods'){
        //   this.findGoodId(this.data.rightData, options.id)
        //   this.setData({
        //     showTop: false,
        //     currentScrollId:`c_${options.id}`,
        //     rightDataList: this.findGoodId(this.data.rightData, options.id),
        //   })
        // }else{
        //   this.setData({
        //     showTop: true,
        //     rightDataList: this.data.rightData[0],
        //   })
        // }
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
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
  leftTap (e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var idSplit = e.currentTarget.dataset.id.split("c_")[1];
    if(this.data.cp_index == index){
      return false;
    }else{
      let goodsList = this.data.rightData
      let rightDataList = goodsList.find(item => item.classId == idSplit)
      rightDataList.productList.map(item => {
        item.typeList = []
        if(item.express && item.express== 1){
          item.typeList.push({
            id:'3',
            name: '快递',
            num: 1,
            checked: false
          })
        }
        if(item.isPick && item.isPick== 1){
          item.typeList.push({
            id:'2',
            name: '自提',
            num: 1,
            checked: false
          })
        }
        if(item.isDelivery && item.isDelivery== 1){
          item.typeList.push({
            id:'1',
            name: '商家配送',
            num: 1,
            checked: false
          })
        }
      })
      this.setData({
        cp_index: index,
        currentScrollId: id,
        rightDataList: rightDataList ? rightDataList : {}
      }) 
    }
  },
  bindscroll (e) {
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
  // 点击分页加入购物车图标
  openPopup(e){
    if(wx.getStorageSync('userInfo').id){
      let rightDataList = this.data.rightDataList
      let id = e.currentTarget.dataset.id
      this.data.typeList = rightDataList.productList.find(item => item.id == id)
      this.setData({
        showPopup: true,
        typeList: this.data.typeList,
        'goodsDetail.productId': id,
        'goodsDetail.companyId': e.currentTarget.dataset.company
      })
    }else{
      this.setData({
        visible: true
      })
    }
  },
  // 点击热销加入购物车图标
  openHotPopup(e){
    if(wx.getStorageSync('userInfo').id){
      let hotList = this.data.hotList
      let id = e.currentTarget.dataset.id
      this.data.typeList = hotList.find(item => item.id == id)
      this.setData({
        showPopup: true,
        typeList: this.data.typeList,
        'goodsDetail.productId': id,
        'goodsDetail.companyId': e.currentTarget.dataset.company
      })
    }else{
      this.setData({
        visible: true
      })
    }
  },
  // 点击分页弹出的底部弹窗
  typeChange(e){
    this.data.typeList.typeList.map(item => {
      item.checked = false
      if(item.id == e.detail.value){
        item.checked = true
      }
    })
    this.setData({
      typeList: this.data.typeList
    })
  },
  // 点击关闭购物车的蒙层
  closePopup(){
    this.setData({
      showPopup: false,
      canSubmit:false,
    })
  },
  // 点击分页加减商品
  quantityChange(e){
    const index = e.currentTarget.dataset.index
    let typeList = this.data.typeList
    let quantity = typeList.typeList[index].num
    if(e.currentTarget.id == 'sub'){
      if(quantity <= 1){
        $Toast({
          content: '该宝贝不能减少了哦~',
          type: 'warning'
        });
        return
      }else{
        quantity -= 1
      }
    }else if(e.currentTarget.id == 'add'){
      quantity += 1
    }
    typeList.typeList[index].num = quantity
    this.setData({
      typeList: typeList
    })
  },
  clickAddShop(){
    this.data.typeList.typeList.forEach(item => {
      if(item.checked == true){
        this.data.canSubmit = true
        this.setData({
          'goodsDetail.deliveryType': Number(item.id),
          'goodsDetail.productNum': Number(item.num),
        })
      }
      item.checked =false
    })
    if(this.data.canSubmit == true){
      classify.addCart({
        userId: wx.getStorageSync('userInfo').id, //	string 用户id
        ...this.data.goodsDetail
      }).then(res => {
        if(res.code == 200){
          // 查询购物车数量
          shoppingCart.selectCartByUserId({
            userId: wx.getStorageSync('userInfo').id
          }).then(res => {
            if(res.code == 200){
              let goodsLength = 0
              for(let i = 0; i < res.result.length; i++){
                goodsLength += res.result[i].productList.length
              }
              // 设置购物车数量
              wx.setTabBarBadge({
                index: 2,
                text: goodsLength+''
              })
            }else{
              $Toast({
                content: res.msg,
                type: 'error'
              });
            }
          })
          $Toast({
            content: "添加购物车成功！",
            type: 'success'
          });
          this.setData({
            showPopup: false,
            canSubmit:false,
            typeList:[]
          })
        }else{
          $Toast({
            content: res.msg,
            type: 'error'
          });
        }
      })
    }else{
      $Toast({
        content: '请选择配送方式！',
        type: 'warning'
      });
    }
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
  gotoShop(){
    wx_gotoNewUrl('switchTab','/pages/shoppingCart/shoppingCart/index')
  },
  // 绑定店铺
  clickBinding(){
    if(wx.getStorageSync('userInfo').id){
      index.bindCompany({
        "companyId": this.data.companyId,
        "userId":wx.getStorageSync('userInfo').id
      }).then(res => {
        if(res.code == 200){
          $Toast({
            content: '绑定成功！',
            type: 'success'
          });
        }else{
          $Toast({
            content: res.msg,
            type: 'error'
          });
        }
      })
    }else{
      this.setData({
        visible: true
      })
    }
  }





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