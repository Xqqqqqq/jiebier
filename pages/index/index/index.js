//index.js
import { Index } from '../../../api-models/index/index';
const index = new Index();
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
    showRecommend: false,
    currentTab: -1,
    collapseList: [], //选择城市的数组
    selectTab: -1,
    name: ''
  },
  onShow(){
    // 设置购物车数量
    // wx.setTabBarBadge({
    //   index: 1,
    //   text: '4'
    // })
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
                  recommendList: res.result,
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

