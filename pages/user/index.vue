<template>
	<view class="container">
		<view class="bg"></view>
		<view class="user">
			<view class="user-t">
				<image :src="userInfo.avatar" class="tx"></image>
				<view class="user-info">
					<view class="username">{{userInfo.nick}}</view>
					<view class="user-store">
						<!-- <view class="store">
							积分: <text class="num">1</text>
						</view> -->
						<view class="store" >
							余额: <text class="num">¥{{userInfo.money}}</text>
						</view>
						<view class="btn" @tap="rechargePage"><image src="../../static/images/user_cz.png" class="icon"></image><text class="text">充值</text></view>
					</view>
				</view>
			</view>
			<view class="user-order">
				<navigator url="/pages/user/order?id=1" class="user-order-item" hover-class="none">
					<text class="number">{{order.unpaid}}</text>
					<text class="desc">待付款</text>
				</navigator>
				<navigator url="/pages/user/order?id=2" class="user-order-item" hover-class="none">
					<text class="number">{{order.unshipped}}</text>
					<text class="desc">待发货</text>
				</navigator>
				<navigator url="/pages/user/order?id=3" class="user-order-item" hover-class="none">
					<text class="number">{{order.unreceived}}</text>
					<text class="desc">待收货</text>
				</navigator>

			</view>
		</view>
		<view class="menu">
			<navigator url="/pages/user/lottery?id=1" class="menu-item" hover-class="none">
				<image src="../../static/images/user_jp.png" class="icon"></image>
				<text class="text">我的奖品</text>
				<image src="../../static/images/address_right.png" class="right"></image>
			</navigator>
			<navigator url="/pages/user/order" class="menu-item" hover-class="none">
				<image src="../../static/images/user_dd.png" class="icon"></image>
				<text class="text">我的订单</text>
				<image src="../../static/images/address_right.png" class="right"></image>
			</navigator>
			<navigator url="/pages/user/recharge" class="menu-item" hover-class="none">
				<image src="../../static/images/user_cz.png" class="icon"></image>
				<text class="text">充值记录</text>
				<image src="../../static/images/address_right.png" class="right"></image>
			</navigator>
			<navigator url="/pages/user/addr" class="menu-item" hover-class="none">
				<image src="../../static/images/user_dz.png" class="icon"></image>
				<text class="text">管理收货地址</text>
				<image src="../../static/images/address_right.png" class="right"></image>
			</navigator>
			<!-- <navigator url="/pages/user/caption" class="menu-item" hover-class="none">
				<image src="../../static/images/user_gssm.png" class="icon"></image>
				<text class="text">公司说明</text>
				<image src="../../static/images/address_right.png" class="right"></image>
			</navigator> -->
		</view>
	</view>
</template>

<script>
	const api = require('../../config/api.js')
	const util = require('../../utils/util.js')
	const user = require("../../services/user.js")
	const app = getApp()	
	export default {
		data() {
			return {
				order: {},
				userInfo: {}
				
			}
		},
		//初始化
		onLoad() {

		},
		// 页面显示
		onShow() {
			this.getInfo();
		},
		//分享
		onShareAppMessage() {
			wx.showShareMenu({
				withShareTicket:true
			})
			let code = wx.getStorageSync('code');
			this.setCode(code)
			return {
				title: '@你：这里每天更新好多免费的抽奖，快来抽奖吧~',
				path: '/pages/user/index?code='+code,
				imageUrl: '../../static/images/shareImage.jpg'
			}
		},
		//下拉刷新
		onPullDownRefresh(e){
			setTimeout(function () {
				wx.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			//获取个人中心信息
			getInfo() {
				util.request(api.getUserInfo,{},'get').then(res=>{
					if(res.code == 0) {
						this.userInfo = res.data.user_id;
						this.order = res.data.order;
						this.getShareTicket()
					}
				})
			},
			//跳转到充值页面
			rechargePage() {
				wx.navigateTo({
					url: '/pages/pay/recharge'
				})
			},
			//获取分享数据得到的群信息
			getShareTicket() {
				let ticket = wx.getStorageSync('ticket');
				let pages = getCurrentPages();
				let { options } = pages.pop();
				var that = this;
				if(ticket && options.code != "") {
					wx.getShareInfo({
						shareTicket: ticket,
						success:function(res) {
							let params = {
								code: options.code ? options.code : "",
								iv: res.iv,
								data: res.encryptedData
							}	
							console.log(params)
							that.getShareInfos(params)
						}
					})
				}
			},
			
			//新增分享记录
			getShareInfos(params) {
				util.request(api.setShareRechge, params,'post').then(res=>{
					console.log(res)
				})
			},
			//传递分享code进去
			setCode(code) {
				util.request(api.setShareInfo,{code: code},'post').then(res=>{})
			}
		}
	}
</script>

<style>
	.bg{
		width: 100%;
		height: 260rpx;
		background-color: #ec544f;
	}
	.user{
		width: 90%;
		height: 500rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 2px 1px 6px #888888;
		position: absolute;
		left: 5%;
		top: 10rpx;
	}
	.user-t{
		width: 100%;
		height: 250rpx;
		position: relative;
		
	}
	.user-t .tx{
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		position: absolute;
		top: 50rpx;
		left: 30rpx;
		border: 1rpx solid #d4d4d4;
	}
	.user-t .user-info{
		padding-left: 220rpx;
		padding-top: 70rpx;
	}
	.user-t .user-info .username{
		font-size: 32rpx;
	}
	.user-t .user-info .user-store{
		padding-top: 30rpx;
		display: flex;
	}
	.user-t .user-info .user-store .store{
		line-height: 50rpx;
		font-size: 26rpx;
	}
	.user-t .user-info .user-store .store .num{
		margin-left: 8rpx;
		color: #ec544f;
		font-weight: bold;
	}
	.user-t .user-info .user-store .btn{
		width: 140rpx;
		height: 50rpx;
		border: 2rpx solid #ec544f;
		border-radius: 20rpx;
		text-align: center;
		margin-left: 40rpx;
	}
	.user-t .user-info .user-store .btn .icon{
		width: 38rpx;
		height: 38rpx;
		vertical-align: middle;
		margin-top: -2rpx;
	}
	.user-t .user-info .user-store .btn .text{
		font-size: 24rpx;
		line-height: 50rpx;
		margin-left: 6rpx;
	}
	.user-order{
		display: flex;
	}
	.user-order .user-order-item{
		width: 33%;
		text-align: center;
		padding-top: 60rpx;
	}
	.user-order .user-order-item text{
		display: block;
	}
	.user-order .user-order-item text.number{
		font-size: 40rpx;
		font-weight: bold;
	}
	.user-order .user-order-item text.desc{
		font-size: 30rpx;
		margin-top: 30rpx;
		color: #999;
	}
	.menu{
		width: 90%;
		background-color: #fff;
		border-radius: 10rpx;
		box-shadow: 2px 1px 6px #888888;
		margin: 290rpx auto 0rpx auto;
		padding: 0 30rpx;
		margin-bottom: 50rpx;
	}
	.menu-item{
		height: 120rpx;
		position: relative;
		width: 100%;
	}
	.menu-item .icon{
		width: 50rpx;
		height: 50rpx;
		top: 35rpx;
		position: absolute;
		left: 0rpx;
	}
	.menu-item .text{
		line-height: 120rpx;
		color: #333;
		font-size: 32rpx;
		margin-left: 75rpx;
		
	}
	.menu-item .right{
		width: 50rpx;
		height: 50rpx;
		top: 35rpx;
		position: absolute;
		right: 0rpx;
	}
</style>

