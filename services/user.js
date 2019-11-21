/**
 *   用户相关服务
 */
import { login, checkSeesion, request, getUserInfo} from '../utils/util.js'


//调用微信登录
function loginByWeixin() {
    let code = null;
    return new Promise(function (resolve, reject){
        login().then(res=>{
            code = res.code;
            return getUserInfo()
        }).then(userInfo=>{
            request(url,{},'POST').then(res=>{  //走登录接口
                // if(res) {

                // }
            }).catch(err=>{
                reject(err)
            })
        }).catch(err=>{
            reject(err)
        })
    })
}


//判断用户是否登录
function checkLogin() {
    return new Promise(function (resolve, reject) {
        if(wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
            checkSeesion().then(()=>{
                resolve(true)
            }).catch(()=>{
                reject(false)
            })
        }else{
            reject(false)
        }
    })
}

module.exports = {
    loginByWeixin,
    checkLogin
}