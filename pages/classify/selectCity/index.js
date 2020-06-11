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
  },
  onShow(){
    this.searchRegion()
    if(wx.getStorageSync('userCity')){
      this.setData({
        recommendList: wx.getStorageSync('userCity')
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
        this.data.cities.forEach((item)=>{
          // let firstName = item.hanyuPinyin.substring(0,1);
          let firstName = item.hanyuPinyin;
          let index = words.indexOf( firstName );
          storeCity[index].list.push({
            id: item.id,
            name: item.regionName,
            key: firstName
          });
        })
        this.data.cities = storeCity;
        // console.log(this.data.cities)
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