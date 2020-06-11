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
}
export { Mine }