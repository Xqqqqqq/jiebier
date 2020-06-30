import { Mine } from '../../../api-models/mine/mine';
const mine = new Mine();
import { wx_gotoNewUrl } from '../../../utils/fn'
const { $Toast } = require('../../../dist/base/index');
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    tabList:[
      { id:'', name:"我的订单"},
      { id:1, name:"未完成"},
      { id:2, name:"已完成"},
      { id:3, name:"已取消"},
    ],
    currentTab:0,
    visibleReturn: false, //申请退货弹窗
    mainorderno:'', //申请退货
    orderList:[],
    couponStateList:[],
    visible: false, // 登录弹窗
  },
  onShow(){
    this.selectOrdersList('')
  },
  selectOrdersList(condition){
    if(wx.getStorageSync('userInfo').id){
      mine.selectOrdersList({
        condition:condition,
        userId:wx.getStorageSync('userInfo').id
      }).then(res => {
        if(res.code == 200){
          // console.log(res)
          this.setData({
            orderList: res.result
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
    this.selectOrdersList(id)
  },
  // 查看详情
  gotoDetail(e){
    wx_gotoNewUrl('navigateTo','/pages/mine/orderDetail/index',{
      id:e.currentTarget.dataset.id
    })
  },
  // 查看进度
  gotoProgress(){
    wx_gotoNewUrl('navigateTo','/pages/mine/cancelStep/index')
  },
  // 申请退货
  gotoReturn(e){
    // console.log(e.currentTarget.dataset.mainorderno)
    this.setData({
      visibleReturn: true,
      mainorderno: e.currentTarget.dataset.mainorderno
    });
  },
  handleReturnFalse(){
    this.setData({
      visibleReturn: false
    });
  },
  handleReturnTrue(){
    if(this.data.mainorderno){
      mine.ordersRefund({
        mainOrderNo: this.data.mainorderno
      }).then(res => {
        if(res.code == 200){
          $Toast({
            content: "申请成功，等待审核！",
            type: 'success'
          });
          setTimeout(() => {
            this.setData({
              orderList:[],
              couponStateList:[]
            })
            this.selectOrdersList('')
          }, 2000);
        }else{
          $Toast({
            content: res.msg,
            type: 'error'
          });
        }
      })
    }else{
      $Toast({
        content: '未获取到订单号，请重试！',
        type: 'error'
      });
    }
    this.setData({
      visibleReturn: false
    });
  }
})