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
}
export { Index }