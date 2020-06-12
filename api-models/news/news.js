import { HTTP } from '../../utils/http.js'
class News extends HTTP {
  /**
   * 	查询消息
   */
  searchNews(data){
    return this.request({
      url:'/api/member/searchNews',
      data: data,
      method:"GET"
    })
  }
}
export { News }