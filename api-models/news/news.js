import { HTTP } from '../../utils/http.js'
class News extends HTTP {
  /**
   * 	商城消息列表
   */
   borArticleList(data){
    return this.request({
      url:'/api/borArticle/borArticleList',
      data: data,
    })
  }
  /**
   * 	商城消息详情
   */
   getborArticle(data){
    return this.request({
      url:'/api/borArticle/getborArticle',
      data: data,
    })
  }
}
export { News }