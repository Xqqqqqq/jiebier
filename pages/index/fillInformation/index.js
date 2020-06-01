//index.js
import { Index } from '../../../api-models/index/index';
const index = new Index();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    submitInfo:{
      companyName: '',//企业名称
      companyAddress: '',//企业地址
      companyClass: '',//	企业种类
      contactName: '',//企业法人姓名
      contactTel: '',//联系电话
      companyEmail: '',//企业邮箱
      companyType: '',//企业类型 1：个人 2：企业
      legalIdCardNum: '',//法人身份证号
      legalIdCardNum: '',//法人身份证号
      legalIdCardImgOther: '',//法人身份证反面
      legalIdCardImgPositive: '',//法人身份证正面
      bankCardNum: '',//银行卡账号
      bankCardOpen: '',//开户行
      licenseImg: '',//经营许可证
      openid: '', //微信openid  必填
    },
    statusList: [], //状态数组
    statusIndex: '',
    typeList: [], //类型数组
    typeIndex: '',
  },
  onShow(){
    this.getDictAll()
    // index.companyIn({
    //   openid: '11111111'
    // }).then(res => {
    //   console.log(res)
    // })
  },
  // 获取用户字典 
  getDictAll(){
    // 企业状态
    index.getDict({ dictType: 'company_status' }).then(res => {
      if(res.code == 200){
        this.setData({
          statusList: res.result
        })
      }else {
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
    // 企业类型
    index.getDict({ dictType: 'company_type' }).then(res => {
      if(res.code == 200){
        this.setData({
          typeList: res.result
        })
      }else {
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  bindStatusChange(e){
    this.setData({
      statusIndex: e.detail.value,
      'submitInfo.companyClass': this.data.statusList[e.detail.value].dictValue,
    })
  },
  bindTypeChange(e){
    this.setData({
      typeIndex: e.detail.value,
      'submitInfo.companyType': this.data.typeList[e.detail.value].dictValue,
    })
  },
  chooseImage(e){
    console.log(e.currentTarget.dataset.type)
    wx.chooseImage({
      count: '1',
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths)
      }
    })
  }
})