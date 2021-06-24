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
    memberList:[],
    couponStateList:[],
  },
  onShow(){
    this.getMembersInfo()
  },
  getMembersInfo(){
    if(wx.getStorageSync('userInfo').id){
      let couponStateList = []
      let memberList = []
      index.getDict({ dictType: 'member_type' }).then(res => {
        if(res.code == 200){
          couponStateList = res.result
          mine.getMembersInfo({
            userId: wx.getStorageSync('userInfo').id
          }).then(res => {
            if(res.code == 200){
              memberList = res.result
              if(memberList && couponStateList){
                this.setData({
                  memberList:this.findDictLabel(couponStateList,memberList)
                })
              }
              console.log(this.data.memberList)
            }else{
              $Toast({
                content: res.msg,
                type: 'error'
              });
            }
          })
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
  },
  // 数据字典-列表转换
  findDictLabel(dictData,data){
    const newData = data.map(item => {
      return {
        ...item,
        dictLabel: dictData.find(it => it.dictValue == item.membersType).dictLabel
      }
    })
    return newData
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
})