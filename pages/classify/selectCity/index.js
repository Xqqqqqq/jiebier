import { Classify } from '../../../api-models/classify/classify';
const classify = new Classify();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data : {
    url: app.globalData.url,
    recommendList:[],
    currentTab: -1,
    cities : [],
    height: '80', // index索引器高度
    posCity: '',
  },
  onShow(){
    this.searchRegion(); // index索引器
    if(wx.getStorageSync('userCity')){ // 获取推荐城市
      this.setData({
        recommendList: wx.getStorageSync('userCity'),
        posCity:wx.getStorageSync('posCity')
      })
      let vm = this
      let query = wx.createSelectorQuery();
      query.select('.wrap-recommend').boundingClientRect(function (rect) {
        vm.setData({
          height: (wx.getSystemInfoSync().windowHeight - rect.height- 60)+ 'px'
        })
      }).exec();
    }else{
      this.setData({
        height: (wx.getSystemInfoSync().windowHeight - 60)+ 'px'
      })
    }
  },
  searchRegion(){
    classify.searchRegion().then(res => {
      if(res.code == 200){
        this.data.cities = res.result
        let storeCity = new Array(26);
        const words = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
        words.forEach((item,index)=>{
          storeCity[index] = {
            key : item,
            list : []
          }
        })
        res.result.forEach((item)=>{
          let firstName = item.hanyuPinyin;
          let index = words.indexOf( firstName );
          storeCity[index].list.push({
            id: item.id,
            name: item.regionName,
            key: firstName
          });
        })
        this.data.cities = storeCity;
        this.setData({
          cities : this.data.cities
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
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
    if(e.currentTarget.dataset.item.regionName && e.currentTarget.dataset.item.id){
      app.globalData.selectCity.id = e.currentTarget.dataset.item.id
      app.globalData.selectCity.city = e.currentTarget.dataset.item.regionName
    }
    wx_gotoNewUrl('switchTab','/pages/classify/classify/index')
  },
  onChange(event){
    // console.log(event.detail,'click right menu callback data')
  },
  chooseName(e){
    if(e.currentTarget.dataset.item.id && e.currentTarget.dataset.item.name){
      app.globalData.selectCity.id = e.currentTarget.dataset.item.id
      app.globalData.selectCity.city = e.currentTarget.dataset.item.name
    }
    wx_gotoNewUrl('switchTab','/pages/classify/classify/index')
  },
});