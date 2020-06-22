import { Mine } from '../../../api-models/mine/mine';
const mine = new Mine();
import { wx_gotoNewUrl } from '../../../utils/fn'
import { Index } from '../../../api-models/index/index';
const index = new Index();
const { $Toast } = require('../../../dist/base/index');
Page({
  data:{
    orderInfoList:[],
    couponStateList:[],
  },
  onLoad(options){
    if(options.id){
      this.getDictAll(options.id)
    }
    // this.getDictAll('main_ht20200618114216550')
  },
  // 获取用户字典 
  getDictAll(id){
    let couponStateList = []
    let orderInfoList = []
    index.getDict({ dictType: 'delivery_type' }).then(res => {
      if(res.code == 200){
        couponStateList = res.result
        mine.selectOrdersDetails({
          mainOrderNo: id
        }).then(res => {
          if(res.code == 200){
            orderInfoList = res.result
            if(orderInfoList && couponStateList){
              this.setData({
                orderInfoList:this.findDictLabel(couponStateList,orderInfoList)
              })
            }
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
  },
  // 数据字典-列表转换
  findDictLabel(dictData,data){
    const newData = data.map(item => {
      return {
        ...item,
        dictLabel: dictData.find(it => it.dictValue == item.deliveryType).dictLabel
      }
    })
    return newData
  },
  openImg(e){
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.url]
    })
  },
  // 查看进度
  gotoProgress(){
    wx_gotoNewUrl('navigateTo','/pages/mine/cancelStep/index')
  },
})