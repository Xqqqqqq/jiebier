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
  changeCompanyName(e){
    this.setData({
      'submitInfo.companyName': e.detail.detail.value
    })
  },
  changeCompanyAddress(e){
    this.setData({
      'submitInfo.companyAddress': e.detail.detail.value
    })
  },
  changeContactName(e){
    this.setData({
      'submitInfo.contactName': e.detail.detail.value
    })
  },
  changeContactTel(e){
    this.setData({
      'submitInfo.contactTel': e.detail.detail.value
    })
  },
  changeCompanyEmail(e){
    this.setData({
      'submitInfo.companyEmail': e.detail.detail.value
    })
  },
  changeLegalIdCardNum(e){
    this.setData({
      'submitInfo.legalIdCardNum': e.detail.detail.value
    })
  },
  changeBankCardNum(e){
    this.setData({
      'submitInfo.bankCardNum': e.detail.detail.value
    })
  },
  changeBankCardOpen(e){
    this.setData({
      'submitInfo.bankCardOpen': e.detail.detail.value
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
    let vm = this
    wx.chooseImage({
      count: '3',
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'http://192.168.88.125:8080/api/picture/uploadPicFile', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header:{
            'content-type': 'multipart/form-data'
          },
          success (res){
            const data = JSON.parse(res.data)
            if(data.code == 200){
              if(e.currentTarget.dataset.type == 'cardIn'){
                // 身份证正面
                vm.setData({
                  'submitInfo.legalIdCardImgPositive': data.value
                })
              }else if(e.currentTarget.dataset.type == 'cardOut'){
                // 身份证反面
                vm.setData({
                  'submitInfo.legalIdCardImgOther': data.value
                })
              }else if(e.currentTarget.dataset.type == 'cardPermit'){
                // 许可证
                vm.setData({
                  'submitInfo.licenseImg': data.value
                })
              }
            }
          }
        })
      }
    })
  },
  onSubmitForm(){
    console.log(this.data.submitInfo)
    index.companyIn({
      ...this.data.submitInfo,
      openid: '11111111',
    }).then(res => {
      if(res.code == 200){
        $Toast({
          content: '提交成功！',
          type: 'success'
        });
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  }
})