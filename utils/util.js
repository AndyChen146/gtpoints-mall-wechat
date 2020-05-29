
/**
 *  时间戳格式化
 */
function formatTime(timestamp) {
	var date = new Date(timestamp * 1000)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 计算时间戳  两个时间之间
 */
function intervalTime(startTime,endTime) {
	if(endTime - startTime) {
		console.log(startTime - endTime)
	}
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
	wx.showLoading({
		mask: true
	})
    wx.request({
		url: url,
		method: method,
		header: {
			'content-type': 'application/json',
        	'x-token': wx.getStorageSync('token')
		},
		data: data,
		success: function(res){
			if(res.statusCode == 200) {
				if(res.data.code == 401){
					wx.showToast({
						title: res.data.msg,
						icon: 'none'
					})
					let pages = getCurrentPages();
					let currPage = null;
					// console.log(pages) 的到一个数组
					if (pages.length) {
						// 获取当前页面的前以页面的对象
						currPage = pages[pages.length - 1];
					}
					// 获取当前页面的前一页面的路由
					let route = currPage.route;
					let options = currPage.options;
					if(options && options.code) {
						route = route+"?code="+options.code
						wx.setStorageSync('shareUrl',route)
					}
					wx.reLaunch({
						url: '/pages/login/login?url='+route,
					})
				}else {
					resolve(res.data);
				}
			}else {
				reject(res.errMsg)
			}
		},
		fail: function(err){
			reject(err)
			console.log(err)
		},
		complete: function() {
			wx.hideLoading()
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
  intervalTime,
  request,
  get,
  post,
  checkSeesion,
  login,
  getUserInfo,
  redirect,
  showErrorToast
}
