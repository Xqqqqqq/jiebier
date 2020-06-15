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
    imgUrls: [], // 轮播图数组
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    recommendList:[],
    hotList:[],
    showRecommend: false,
    currentTab: -1,
    collapseList: [], //选择城市的数组
    selectTab: -1,
    name: '',
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
  onShow(){
    this.setData({
      selectTab: -1,
      name: '',
      currentTab: -1,
      collapseList: [], //选择城市的数组
      recommendList:[],
      showRecommend: false,
    })
    if(wx.getStorageSync('userCity')){
      this.setData({
        recommendList: wx.getStorageSync('userCity'),
        showRecommend: true,
      })
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
    this.getRegionTree()
    this.getLoops()
    this.selectProductHomePage()
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
                vm.setData({
                  recommendList: res.result.regions,
                  showRecommend: true,
                })
              }else{
                wx.setStorage({
                  key: 'showRecommend',
                  data: false,
                })
                vm.setData({
                  recommendList: res.result,
                  showRecommend: false,
                })
              }
            })
          }
        }
      })
  },
  // 获取地区分类
  getRegionTree(){
    index.getRegionTree().then(res => {
      if(res.code == '200'){
        this.setData({
          collapseList: res.result[0].children
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  // 获取轮播图数组
  getLoops(){
    index.getLoops().then(res => {
      if(res.code == 200){
        this.setData({
          imgUrls: res.result
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  // 获取首页热销商品
  selectProductHomePage(){
    let hotList = []
    index.selectProductHomePage().then(res => {
      if(res.code ==200){
        hotList = res.result
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
          hotList: hotList
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
  // 推荐城市
  clickTab(e){
    let cur = e.currentTarget.dataset.current;
    if(this.data.currentTab == cur){
      return false;
    }else{
      this.setData({
        currentTab:cur,
      }) 
    }
    if(e.currentTarget.dataset.item.regionName && e.currentTarget.dataset.item.id){
      app.globalData.selectCity.id = e.currentTarget.dataset.item.id
      app.globalData.selectCity.city = e.currentTarget.dataset.item.regionName
    }
    wx_gotoNewUrl('switchTab','/pages/classify/classify/index')
  },
  // 选择城市  // 没做完
  selectTab(e){
    let index = e.currentTarget.dataset.index;
    let indexsmall = e.currentTarget.dataset.indexsmall;
    if(this.data.selectTab == this.data.collapseList[index].children[indexsmall]){
      return false;
    }else{
      this.setData({
        selectTab:this.data.collapseList[index].children[indexsmall],
      }) 
    }
    if(e.currentTarget.dataset.name && e.currentTarget.dataset.id){
      app.globalData.selectCity.id = e.currentTarget.dataset.id
      app.globalData.selectCity.city = e.currentTarget.dataset.name
    }
    wx_gotoNewUrl('switchTab','/pages/classify/classify/index')
  },
  gotoRouter(e){
    let type= e.currentTarget.dataset.type
    let url= e.currentTarget.dataset.url
    wx_gotoNewUrl(type,url)
  },
  radioChange(e){
    // console.log(e.detail.value)
    this.data.collapseList.map(item =>{
      item.children.map(itemSmall => {
        itemSmall.checked = false
        if(itemSmall.id == e.detail.value){
          itemSmall.checked = true
        }
      })
    })
    this.setData({
      collapseList: this.data.collapseList
    })
  }
});

