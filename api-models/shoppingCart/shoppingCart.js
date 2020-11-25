import { HTTP } from '../../utils/http.js'
class ShoppingCart extends HTTP {
  /**
   * 	购物车列表
   */
  selectCartByUserId(data){
    return this.request({
      url:'/api/company/selectCartByUserId',
      data: data,
      method:"GET"
    })
  }
  /**
   * 	删除购物车记录
   */
  delCart(data){
    return this.request({
      url:'/api/company/delCart',
      data: data,
      method:"GET"
    })
  }
  /**
   * 	操作购物车
   */
  operationCart(data){
    return this.request({
      url:'/api/company/operationCart',
      data: data,
    })
  }
}
export { ShoppingCart }