import { HTTP } from '../../utils/http.js'
class Mine extends HTTP {
  /**
   * 	根据用户id查询用户优惠券列表
   */
  userCouponList(data){
    return this.request({
      url:'/api/coupon/userCouponList',
      data: data,
    })
  }
  /**
   * 	可使用优惠券列表
   */
  getCouponList(data){
    return this.request({
      url:'/api/coupon/getCouponList',
      data: data,
    })
  }
  /**
   * 	获取用户会员信息
   */
  getMembersInfo(data){
    return this.request({
      url:'/api/member/getMembersInfo',
      data: data,
      method:'GET'
    })
  }
  /**
   * 	查询订单列表
   */
  selectOrdersList(data){
    return this.request({
      url:'/api/orders/selectOrdersList',
      data: data,
      method:'GET'
    })
  }
  /**
   * 	查询订单详情
   */
  selectOrdersDetails(data){
    return this.request({
      url:'/api/orders/selectOrdersDetails',
      data: data,
      method:'GET'
    })
  }
  /**
   * 	用户申请订单退款
   */
  ordersRefund(data){
    return this.request({
      url:'/api/orders/ordersRefund',
      data: data,
      method:'GET'
    })
  }
}
export { Mine }