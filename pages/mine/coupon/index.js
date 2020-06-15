import { Mine } from '../../../api-models/mine/mine';
const mine = new Mine();
import { Index } from '../../../api-models/index/index';
const index = new Index();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    tabList:[
      { id:1, name:"未使用"},
      { id:2, name:"已使用"},
      { id:3, name:"已过期"},
    ],
    currentTab:0,
    couponList:[], // 优惠券数组
    couponStateList:[],
    visible: false,
  },
  onShow(){
    this.getDictAll('1')
  },
  // 获取用户字典 
  getDictAll(type){
    if(wx.getStorageSync('userInfo').id){
      let couponStateList = []
      let couponList = []
      index.getDict({ dictType: 'coupon_state' }).then(res => {
        if(res.code == 200){
          couponStateList = res.result
          mine.userCouponList({
            id: wx.getStorageSync('userInfo').id
          }).then(res => {
            if(res.code == 200){
              couponList = res.result
              if(type == 1){
                this.setData({
                  couponList: res.result.normalList
                })
              }else if(type == 2){
                this.setData({
                  couponList: res.result.usedlList
                })
              }else if(type ==3){
                this.setData({
                  couponList: res.result.invalidlList
                })
              }
              // if(couponList && couponStateList){
              //   this.setData({
              //     couponList:this.findDictLabel(couponStateList,couponList)
              //   })
              // }
            }else{
              $Toast({
                content: res.msg,
                type: 'error'
              });
            }
          })
        }else {
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
  // 数据字典-列表转换
  findDictLabel(dictData,data){
    const newData = data.map(item => {
      return {
        ...item,
        dictLabel: dictData.find(it => it.dictValue == item.state).dictLabel
      }
    })
    return newData
  },
  // 切换状态
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
    this.getDictAll(id)
  },
})