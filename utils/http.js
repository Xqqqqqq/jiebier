import {
  config
} from './config'

class HTTP {
  request({
    url, 
    data = {},
    method = 'GET',
    header = {},
    loadingStatus = true
  }){
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method, header, loadingStatus)
    }).catch(function (reason) {
      console.log('catch:', reason);
    });
  }
  _request(url, resolve, reject, data, method, header, loadingStatus) {
    if(loadingStatus){
        wx.showLoading({
            title: '加载中...'
        })
    }
    wx.request({
      url: config.api_base_url + url,
      data: data,
      method: method,
      header: Object.assign(config.header, header),
      success: res => {
        if (loadingStatus) {
          wx.hideLoading()
        }
        resolve(res.data);
      },
      fail: err => {
        reject();
        this._show_error(err);
      }
    })
  }

  _show_error(error_msg) {
    let tip = '';
    error_msg ? tip = error_msg : tip = '抱歉，出现了一个错误';
    wx.showToast({
        title: tip,
        icon: 'none',
        duration: 2000
    })
  }
}

export { HTTP }