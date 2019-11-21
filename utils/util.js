
/**
 *  时间戳格式化
 */
function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封装微信的 request
 */
function request(url, data={}, method = "GET"){
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'x-token': wx.getStorageSync('token')
      },
      success: function(res){
        if(res.statusCode == 200) {

        }else {
          reject(res.errMsg)
        }
      },
      fail: function(err){
        reject(err)
        console.log(err)
      }
    })
  })
}

//get请求
function get(url, data={}){
  return request(url,data,'GET')
}
//post请求
function post(url,data={}){
  return request(url,data,'POST')
}
/**
 *  检测微信会话是否过期
 */
function checkSeesion() {
  return new Promise(function(resolve,reject) {
    wx.checkSession({
      success: function() {
        resolve(true)
      },
      fail: function() {
        reject(false)
      }
    })
  })
}

/**
 *   判断页面是否需要登录
 */
function redirect(url) {
  if(false){
    wx.redirectTo({     //跳转到登录页
      url: ''
    })
    return false;
  }else {
    wx.redirectTo({
      url: url
    })
  }
}

/**
 *   调用微信登录
 */
function login(){
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function(res) {
        if(res.code) {
          resolve(res.code)
        }else {
          reject(res)
        }
      },
      fail: function(err) {
        reject(err)
      }
    })
  })
}

/**
 *  获取用户信息
 */
function getUserInfo() {
    return new Promise(function(resolve, reject) {
        wx.getUserInfo({
            withCredentials: true,
            success: function(res) {
                if(res.detail.errMsg === 'getUserInfo:ok') {
                    resolve(res)
                }else {
                    reject(res)
                }
            },
            fail: function(err) {
                reject(err)
            }
        })
    })
}


/**
 *   错误弹框小提示
 */
function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}




module.exports = {
  formatTime,
  request,
  get,
  post,
  checkSeesion,
  login,
  redirect,
  showErrorToast
}
