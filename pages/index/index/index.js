//index.js
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
  data : {
    url: app.globalData.url,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    loop: true,
    indexInfo: {}, // 首页数据
    x:0,
    currentTab: 0,
    currentName: '热销商品',
    pageNum:1,
    pageSize: 10,
    homeList: [], // 热销商品
    hotInfo:{
      columnName: '',
      homePageProductList: []
    }, // 分类商品数组
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
    code: 0, // 判断是否可加载
    value: {
      columnType: '', //专栏类型1热销2特价
      productClassId: '', //商品分类id
    }
  },
  onLoad(){
    if(wx.getStorageSync('userCity')){
    }else{
      // 获取定位
      let vm = this
      wx.getSetting({
        success(res){
          let status = res.authSetting['scope.userLocation']
          if (status !== undefined && status !== true){
            wx.showModal({
              title: '请求授权当前位置',
              content: '需要获取您的地理位置，请确认授权',
              success(res) {
                if(res.cancel){
                  //取消授权
                  wx.showToast({
                    title: '拒绝授权,无法获取当前位置！',
                    icon: 'none',
                    duration: 1000
                  })
                }else if(res.confirm){
                  wx.openSetting({
                    success (res) {
                      if (res.authSetting["scope.userLocation"] == true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                        vm.geo();
                      }else{
                        wx.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 1000
                        })
                      }
                    }
                  })
                }
              }
            })
          }else if(status == undefined) {
            vm.geo();
          }else {
            vm.geo();
          } 
        }
      })
    }
    this.getShows()
  },
  geo(){
    let vm =this
      wx.getLocation({
        type: 'gcj02',
        success (res) {
          if(res.latitude && res.longitude){
            index.getAddressInfo({
              "lat": res.latitude,
              "lng": res.longitude
            }).then(res => {
              if(res.code == '200'){
                wx.setStorage({
                  key: 'userCity',
                  data: res.result.regions
                })
                wx.setStorage({
                  key: 'showRecommend',
                  data: true,
                })
                wx.setStorage({
                  key: 'posCity',
                  data: res.result.city,
                })
              }else{
                wx.setStorage({
                  key: 'showRecommend',
                  data: false,
                })
              }
            })
          }
        }
      })
  },
  // 获取首页数据
  getShows(){
    index.getShows().then(res => {
      if(res.code ==200){
        res.result.borProductClassList.unshift({
          id:'',
          regionName: '热销商品'
        })
        this.setData({
          indexInfo: res.result
        })
        this.selectProductHomePageList()
        this.data.value = {
          columnType: '', //专栏类型1热销2特价
          productClassId: '', //商品分类id
        }
        this.selectProductClassHomePageList(this.data.value)
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  // 点击轮播图跳转
  clickSwiper(e){
    if(e.currentTarget.dataset.id){
      wx_gotoNewUrl('navigateTo','/pages/index/flagshipStore/index',{
        id:e.currentTarget.dataset.id
      })
    }
  },
  // 点击更多
  clickMore(e){
    this.setData({
      currentTab: -1,
      pageNum: 1,
      hotInfo: {},
      homeList: []
    })
    // console.log(e.currentTarget.dataset.name)
    this.data.value = {
      columnType: e.currentTarget.dataset.type, //专栏类型1热销2特价
      productClassId: '', //商品分类id
    }
    this.selectProductClassHomePageList(this.data.value)
  },
  // 获取首页商品
  selectProductHomePageList(){
    let homeList = []
    index.selectProductHomePageList().then(res => {
      this.data.code = 0
      if(res.code ==200){
        homeList = res.result
        homeList.map(item => {
          item.homePageProductList.map(itemSmall => {
            itemSmall.typeList = []
            if(itemSmall.express && itemSmall.express== 1){
              itemSmall.typeList.push({
                id:'3',
                name: '快递',
                num: 1,
                checked: false
              })
            }
            if(itemSmall.isPick && itemSmall.isPick== 1){
              itemSmall.typeList.push({
                id:'2',
                name: '自提',
                num: 1,
                checked: false
              })
            }
            if(itemSmall.isDelivery && itemSmall.isDelivery== 1){
              itemSmall.typeList.push({
                id:'1',
                name: '商家配送',
                num: 1,
                checked: false
              })
            }
          })
        })
        this.setData({
          homeList: homeList
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  // 获取首页分类商品
  selectProductClassHomePageList(value){
    index.selectProductClassHomePageList({
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      value: value
    }).then(res => {
      this.data.code = res.code
      if(res.code == '200' || res.code == '-118' || res.code == '-116'){
        this.data.hotInfo.columnName = res.result.columnName
        if(this.data.hotInfo.homePageProductList) {
          this.data.hotInfo.homePageProductList = [...this.data.hotInfo.homePageProductList, ...res.result.homePageProductList]
        }else{
          this.data.hotInfo.homePageProductList = res.result.homePageProductList
        }
        this.data.hotInfo.homePageProductList.map(item => {
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
          hotInfo: this.data.hotInfo
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
    this.data.typeList.map(item => {
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
      // let homeList = this.data.homeList
      // let id = e.currentTarget.dataset.id
      // this.data.typeList = homeList.find(item => item.id == id)
      let item = e.currentTarget.dataset.item
      this.data.typeList = item.typeList
      this.setData({
        showPopup: true,
        typeList: this.data.typeList,
        'goodsDetail.productId': item.id,
        'goodsDetail.companyId': item.companyId
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
    let quantity = typeList[index].num
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
    typeList[index].num = quantity
    this.setData({
      typeList: typeList
    })
  },
  clickAddShop(){
    this.data.typeList.forEach(item => {
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
                index: 3,
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
    wx_gotoNewUrl('switchTab','/pages/mine/mine/index')
  },
  handleClose(){
    this.setData({
      visible: false
    })
  },
  // 点击热销中的商品去商品详情
  gotoDetail(e){
    wx_gotoNewUrl('navigateTo','/pages/classify/goodsDetail/index',{
      goodsid:e.currentTarget.dataset.id, // 详细商品id
      goodsname:e.currentTarget.dataset.name, // 详细商品名称
    })
  },
  // 分类滚动
  switchTap(e){
    let screenWidth = wx.getSystemInfoSync().windowWidth;
    let itemWidth = screenWidth/5;
    let { index,id } = e.currentTarget.dataset;
    const { borProductClassList } = this.data.indexInfo;
    let scrollX = itemWidth * index - itemWidth*2;
    let maxScrollX = (borProductClassList.length+1) * itemWidth;
    if(scrollX<0){
      scrollX = 0;
    } else if (scrollX >= maxScrollX){
      scrollX = maxScrollX;
    }
    this.setData({
      x: scrollX,
      currentTab: index,
      pageNum: 1,
      hotInfo: {},
      homeList: []
    })
    if(index == 0){
      this.getShows()
    }else{
      this.data.value = {
        columnType: '', //专栏类型1热销2特价
        productClassId: id, //商品分类id
      }
      this.selectProductClassHomePageList(this.data.value)
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.code != '0' && this.data.code != '-118'){
      const vm =this;
      const pageNum = vm.data.pageNum + 1;
      vm.setData({
        pageNum: pageNum, //更新当前页数
      })
      vm.selectProductClassHomePageList(this.data.value);
    }
  },
  onPullDownRefresh() {
    this.setData({
      currentTab: 0,
      pageNum: 1,
      hotInfo: {},
      homeList: []
    })
    this.getShows()
    wx.stopPullDownRefresh()//得到结果后关掉刷新动画
  },
  gotoRouter(e){
    let type= e.currentTarget.dataset.type
    let url= e.currentTarget.dataset.url
    wx_gotoNewUrl(type,url)
  },
  onShareAppMessage: function (res) {
    return {
      title: '界壁儿',
      path: `/pages/index/index/index`
    }
  },
  onShareTimeline(){
    return{
      title: '界壁儿',
    }
  }
});

