import { HTTP } from '../../utils/http.js'
class Login extends HTTP {
  /**
   * 	用户注册
   */
  userRegister(data){
    return this.request({
      url:'/api/member/userRegister',
      data: data,
    })
  }
  /**
   * 	注册发送验证码
   */
  registerSendCode(data){
    return this.request({
      url:'/api/member/registerSendCode',
      data: data,
      method:"GET"
    })
  }
  /**
   * 	账号密码登录
   */
  userLoginByPass(data){
    return this.request({
      url:'/api/member/userLoginByPass',
      data: data,
    })
  }
  /**
   * 	验证码登录
   */
  userLoginByCode(data){
    return this.request({
      url:'/api/member/userLoginByCode',
      data: data,
    })
  }
  /**
   * 	登录发送验证码
   */
  loginSendCode(data){
    return this.request({
      url:'/api/member/loginSendCode',
      data: data,
      method:"GET"
    })
  }
}
export { Login }