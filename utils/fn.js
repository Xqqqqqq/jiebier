// 跳转url
/**
 * @param {*跳转方式 string} type 必填
 * @param {*跳转地址值 string} url 必填
 * @param {*跳转参数 json} params 选填
 * @param {*成功回调 func} successBack  选填
 * @param {*失败回调 func} failBack  选填
 * @param {*每次都回发生的回调 func} completeBack  选填
 */// 跳转url
/**
 * @param {*跳转方式 string} type 必填
 * @param {*跳转地址值 string} url 必填
 * @param {*跳转参数 json} params 选填
 * @param {*成功回调 func} successBack  选填
 * @param {*失败回调 func} failBack  选填
 * @param {*每次都回发生的回调 func} completeBack  选填
 */
export function wx_gotoNewUrl(type, url, parmas = {}, successBack, failBack, completeBack) {
  let str = "?"
  for (let key in parmas) {
    str = `${str}&${key}=${parmas[key]}`
  }
  if (type == 'navigateTo') {
    wx.navigateTo({
      url: url+str,
      success: function (res) {
        if (successBack && typeof successBack == "Function") {
          successBack(res)
        }
      },
      fail: function (err) {
        if (failBack && typeof failBack == "function") {
          failBack(err);
        }
      },
      complete: function (res) {
        if (completeBack && typeof completeBack == "function") {
          completeBack(res);
        }
      }
    })
  }else if(type == 'redirectTo'){
    wx.redirectTo({
      url: url+str,
      success: function (res) {
        if (successBack && typeof successBack == "Function") {
          successBack(res)
        }
      },
      fail: function (err) {
        if (failBack && typeof failBack == "function") {
          failBack(err);
        }
      },
      complete: function (res) {
        if (completeBack && typeof completeBack == "function") {
          completeBack(res);
        }
      }
    })
  }else if(type == 'switchTab'){
    wx.switchTab({
      url: url+str,
      success: function (res) {
        if (successBack && typeof successBack == "Function") {
          successBack(res)
        }
      },
      fail: function (err) {
        if (failBack && typeof failBack == "function") {
          failBack(err);
        }
      },
      complete: function (res) {
        if (completeBack && typeof completeBack == "function") {
          completeBack(res);
        }
      }
    })
  }
}

// 判断用户地理位置授权
export function getUserAddress(){
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res){
        let status = res.authSetting['scope.userLocation']
        if (status !== undefined && status !== true){
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success(res) {
              if(res.cancel){
                //取消授权
                wx.showToast({
                  title: '拒绝授权,无法获取当前位置！',
                  icon: 'none',
                  duration: 1000
                })
                wx.switchTab({
                  url: '/pages/index/index/index',
                })
              }else if(res.confirm){
                wx.openSetting({
                  success (res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      wx.getLocation({
                        type: 'gcj02',
                        success (res) {
                          resolve(res)
                        }
                      })
                    }else{
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                      wx.switchTab({
                        url: '/pages/index/index/index',
                      })
                    }
                  }
                })
              }
            }
          })
        }else if(status == undefined) {
          wx.getLocation({
            type: 'gcj02',
            success (res) {
              resolve(res)
            }
          })
        }else {
          wx.getLocation({
            type: 'gcj02',
            success (res) {
              console.log('333', res)
              resolve(res)
            }
          })
        } 
      }
    })
  }).catch(function (reason) {
    console.log('catch:', reason);
  });
}