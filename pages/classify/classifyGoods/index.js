import { Classify } from '../../../api-models/classify/classify';
const classify = new Classify();
import { ShoppingCart } from '../../../api-models/shoppingCart/shoppingCart';
const shoppingCart = new ShoppingCart();
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
    goodsList:[],
    typeList:[],
    showPopup:false, // 是否显示底部弹窗
    visible: false, //是否显示去登录的按钮
    goodsDetail:{
      productId:'', //商品id
      deliveryType: '',// 配送方式id  integer($int32)
      productNum: 1, //添加数量
      companyId: '',//店铺id
    },  // 加入购物车的参数
    canSubmit: false, // 是否可以点击加入购物车
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
        let goodsList = res.result
        goodsList.map(item => {
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
        console.log(goodsList)
        this.setData({
          goodsList: goodsList
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  // 点击热销弹出的底部弹窗
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
  // 点击加入购物车图标
  openPopup(e){
    if(wx.getStorageSync('userInfo').id){
      let goodsList = this.data.goodsList
      let id = e.currentTarget.dataset.id
      this.data.typeList = goodsList.find(item => item.id == id)
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
  // 点击关闭购物车的蒙层
  closePopup(){
    this.setData({
      showPopup: false,
      canSubmit:false
    })
  },
  // 点击加减商品
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
          $Toast({
            content: "添加购物车成功！",
            type: 'success'
          });
          this.setData({
            showPopup: false,
            canSubmit:false
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
    if(e.currentTarget.dataset.group == '1'){
      wx_gotoNewUrl('navigateTo','/pages/index/groupBuying/index',{
        goodsid:e.currentTarget.dataset.id, // 详细商品id
      })
    }else{
      wx_gotoNewUrl('navigateTo','/pages/classify/goodsDetail/index',{
        goodsid:e.currentTarget.dataset.id, // 详细商品id
        goodsname:e.currentTarget.dataset.name, // 详细商品名称
      })
    }
  }
})