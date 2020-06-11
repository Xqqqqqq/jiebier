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
}
export { ShoppingCart }