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
   /**
   * 	忘记密码点击下一步
   */
  forgetPassNext(data){
    return this.request({
      url:'/api/member/forgetPassNext',
      data: data,
    })
  }
   /**
   * 	忘记密码发送验证码
   */
  forgetPassSendCode(data){
    return this.request({
      url:'/api/member/forgetPassSendCode',
      data: data,
    })
  }
   /**
   * 	忘记密码设置新密码
   */
  forgetPassSetNewPass(data){
    return this.request({
      url:'/api/member/forgetPassSetNewPass',
      data: data,
    })
  }
  /**
   * 	厂商绑定账号密码
   */
   companySetOpenid(data){
    return this.request({
      url:'/api/company/companySetOpenid',
      data: data,
    })
  }
  /**
   * 	厂商解绑账号密码
   */
   companyUnSetOpenid(data){
    return this.request({
      url:'/api/company/companyUnSetOpenid',
      data: data,
    })
  }
  /**
   * 	解密与微信绑定的手机号
   */
   getWxPhone(data){
    return this.request({
      url:'/api/wx/getWxPhone',
      data: data,
    })
  }
}
export { Login }