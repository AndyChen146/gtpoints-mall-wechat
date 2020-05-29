<template>
	<view class="container">
		<view class="main_logo">
			<image class="logo" src="../../static/images/logo.jpg"></image>
			<view class="main_logo_name">积分云购</view>
		</view>
		<view class="main">
			<view class="main_title">该程序将获取以下授权：</view>
			<view class="main_desc">获取您的公开信息（昵称、头像等）</view>
			<view class="main_checkout">
				
				<!-- <checkbox-group @change="checkboxChange">
					<checkbox :checked="checkout" class="main_checkout_box"></checkbox>
				</checkbox-group> -->
				
				<text class="main_content">我已阅读并同意</text>
				<navigator class="main_content_xy" url="/pages/pact/service" hover-class="none">《广踏积分商城服务协议》</navigator>
			</view>
			<button class="main_btn" lang="zh_CN" open-type="getUserInfo" @getuserinfo="wxLoginBtn" >微信授权登录</button>
		</view>
	</view>
</template>

<script>
const util = require('../../utils/util.js')
const api = require('../../config/api.js');
const user = require('../../services/user.js')
const app = getApp()
export default {
	name: '',
	data() {
		return {
			checkout: true,
			userInfo: {}
		}
		
	},
	//初始化
	onLoad() {
	
	},
	// 页面显示
	onShow() {
		wx.hideShareMenu()
	},
	//分享
	onShareAppMessage() {
		
	},
	methods:{
		//跳转到用户协议
		servicePage() {
			wx.navigateTo({
				url: '/pages/pact/service'
			})
		},
		//调用微信登录
		wxLoginBtn: function(e) {
			var that = this;
			if (e.detail.errMsg !== 'getUserInfo:ok') {
				if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
					return false;
				}
				util.showErrorToast('微信登录失败');
				return false;
			}
			util.login().then(res => {
				let userInfo = e.detail.userInfo;
				userInfo.code = res;
				console.log(userInfo)
				util.request(api.AuthLoginByWeixin,userInfo,'post').then(res => {
					if (res.code !== 0) {
						util.showErrorToast('微信登录失败');
						return false;
					}
					app.globalData.token = res.data.token;
					wx.setStorageSync('token', res.data.token);
					let pages = getCurrentPages();
					let { options } = pages.pop();
					let backUrl = '/' + options.url;
					if(wx.getStorageSync('shareUrl')) {
						backUrl = '/'+wx.getStorageSync('shareUrl')
					}
					that.getCode()
					wx.reLaunch({
						url: "" + backUrl+"",
					});
				})
			})
		},
		//获取分享code
		getCode() {
			util.request(api.getShareCode,{},'post').then(res=>{
				if(res.code == 0) {
					wx.setStorageSync('code',res.data.code)
				}
			})
		},
		checkboxChange(val) {
			if (this.checkout) {
				this.checkout = false;
			}else {
				this.checkout = true;
			}
		},
	}
}
</script>

<style >
	.container{
		background-color: #ffffff;
	}
	page{
		background-color: #ffffff;
	}
	.main_logo{
		width: 90%;
		border-bottom: 2rpx solid #f4f4f4;
		text-align: center;
		margin: 0 auto;
		margin-top: 100rpx;
		padding-bottom: 60rpx;
	}
	.main_logo .logo{
		width: 160rpx;
		height: 160rpx;
		margin-bottom: 30rpx;
		border-radius: 10rpx;
	}
	.main_logo .main_logo_name{
		font-size: 32rpx;
		color: #666;
	}
	.main{
		width: 90%;
		margin: 0 auto;
	}
	.main .main_title{
		margin-top: 40rpx;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 20rpx;	
	}
	.main .main_desc{
		font-size: 24rpx;
		color: #999;
		margin-bottom: 30rpx;
	}
	checkbox .wx-checkbox-input{
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		vertical-align: middle;
	}
	checkbox .wx-checkbox-input.wx-checkbox-input-checked{
	   	background: #1AAD19;
	}
	checkbox .wx-checkbox-input.wx-checkbox-input-checked::before{
		border-radius: 50%;/* 圆角 */
	   width: 40rpx;/* 选中后对勾大小，不要超过背景的尺寸 */
	   height: 40rpx;/* 选中后对勾大小，不要超过背景的尺寸 */
	   line-height: 40rpx;
	   text-align: center;
	   font-size:30rpx; /* 对勾大小 30rpx */
	   color:#fff; /* 对勾颜色 白色 */
	   background: transparent;
	   transform:translate(-50%, -50%) scale(1);
	   -webkit-transform:translate(-50%, -50%) scale(1);
	}
	.main .main_checkout{
		display: flex;
	}
	.main .main_checkout .main_content{
		font-size: 26rpx;
		line-height: 40rpx;
		margin-left: 10rpx;
	}
	.main .main_checkout .main_content_xy{
		font-size: 26rpx;
		color: #E64340;
		cursor: pointer;
	}
	.main .main_btn{
		width: 70%;
		height: 80rpx;
		background-color: #1AAD19;
		border-radius: 20rpx;
		text-align: center;
		line-height: 80rpx;
		color: #ffffff;
		font-size: 30rpx;
		margin: 100rpx auto 50rpx auto;
		cursor: pointer;
	}
	.main .main_btn.disabled{
		background-color: #999999;
	}
</style>
