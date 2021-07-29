import { HTTP } from '../../utils/http.js'

class Index extends HTTP {
  /**
   * 	数据字典
   */
  getDict(data){
    return this.request({
      url:'/api/dict/getDict',
      data: data,
    })
  }
  /**
   * 获取openid
   */
  getOpenid(data){
    return this.request({
      url:'/api/wx/getOpenid',
      data: data,
      method:"GET"
    })
  }
  /**
   * 	企业入驻申请
   */
  companyIn(data){
    return this.request({
      url:'/api/company/companyIn',
      data: data    
    })
  }
   /**
   * 	查询企业审核状态
   */
  getCompanyState(data){
    return this.request({
      url:'/api/company/getCompanyState',
      data: data    
    })
  }
  /**
   * 	获取地区分类
   */
  getRegionTree(){
    return this.request({
      url:'/api/region/getRegionTree',
      method: "GET"   
    })
  }
  /**
   * 	根据经纬度获取省市信息
   */
  getAddressInfo(data){
    return this.request({
      url:'/api/miniCommon/getAddressInfo',
      data: data    
    })
  }
  /**
   * 	搜索
   */
  search(data){
    return this.request({
      url:'/api/miniCommon/search',
      data: data,
      method:"GET"
    })
  }
  /**
   * 	轮播图
   */
  getLoops(){
    return this.request({
      url:'/api/miniCommon/getLoops',
      method:"GET"
    })
  }
  /**
   * 	获取首页热销商品
   */
  selectProductHomePage(){
    return this.request({
      url:'/api/product/selectProductHomePage'
    })
  }
  /**
   * 	调起支付
   */
  wxOrderPay(){
    return this.request({
      url:'/api/pay/wxOrderPay'
    })
  }
  /**
   * 	进入店铺详情
   */
  selectCompanyDetails(data){
    return this.request({
      url:'/api/product/selectCompanyDetails',
      data: data,
      method:"GET"  
    })
  }
  /**
   * 	绑定店铺
   */
  bindCompany(data){
    return this.request({
      url:'/api/member/bindCompany',
      data: data,
    })
  }
  /**
   * 	
      初始化拼团页面信息
   */
  getGroupInfo(data){
    return this.request({
      url:'/api/activity/getGroupInfo',
      data: data,
    })
  }
  /**
   * 	
    获取协议
   */
  getAgreement(){
    return this.request({
      url:'/api/member/getAgreement',
      method:"GET" 
    })
  }
  /**
   * 	
    获取首页轮播旗舰店
   */
  storeBannerList(){
    return this.request({
      url:'/api/store/storeBannerList',
      method:"GET" 
    })
  }
  /**
   * 获取旗舰店详情
   */
  getStoreDetails(data){
    return this.request({
      url:'/api/store/getStoreDetails',
      method:"GET",
      data: data
    })
  }
  /**
   * 根据openid查询用户详情
   */
   userDetailByOpenid(data){
    return this.request({
      url:'/api/member/userDetailByOpenid',
      data: data
    })
  }
  /**
   * 获取openidNew
   */
   getOpenidNew(data){
    return this.request({
      url:'/api/wx/getOpenidNew',
      method:"GET",
      data: data
    })
  }
  /**
   * 展示
   */
   getShows(){
    return this.request({
      url:'/api/miniCommon/getShows',
      method:"GET",
    })
  }
  /**
   * 首页商品展示
   */
   selectProductHomePageList(){
    return this.request({
      url:'/api/product/selectProductHomePageList',
    })
  }
  /**
   * 首页商品分类展示
   */
   selectProductClassHomePageList(data){
    return this.request({
      url:'/api/product/selectProductClassHomePageList',
      data: data
    })
  }
}
export { Index }