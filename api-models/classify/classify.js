import { HTTP } from '../../utils/http.js'
class Classify extends HTTP {
  /**
   * 	用户端获取商品类型列表
   */
  productClass(){
    return this.request({
      url:'/api/product/productClass',
    })
  }
  /**
   * 	用户端获取商品详情
   */
  productDetail(data){
    return this.request({
      url:'/api/product/productDetail',
      data:data
    })
  }
   /**
   * 	用户端获取商品列表
   */
  productList(data){
    return this.request({
      url:'/api/product/productList',
      data:data
    })
  }
   /**
   * 	加入购物车
   */
  addCart(data){
    return this.request({
      url:'/api/company/addCart',
      data:data
    })
  }
   /**
   * 	地址列表
   */
  searchRegion(){
    return this.request({
      url:'/api/miniCommon/searchRegion',
      method:'GET'
    })
  }
}
export { Classify }