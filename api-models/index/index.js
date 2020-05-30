import { HTTP } from '../../utils/http.js'

class Index extends HTTP {
  /**
   * 获取轮播图列表
   */
  getLoopList(){
    return this.request({
        url:'examination_war/apiExmLoopController.do?getLoopList'
    })
  }
  /**
   * 	轮播图信息
   */
  getLoop(data){
    return this.request({
        url:'examination_war/apiExmLoopController.do?getLoop',
        data: data,
    })
  }
}
export { Index }