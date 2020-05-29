<template>
	<view class="container">
		<view class="over">
			<view class="name">{{userInfo.nick}}</view>
			<view class="money">¥ {{userInfo.money}}</view>
		</view>
		<view class="pay">
			<view class="pay_name">充值金额</view>
			<view class="pay_input">
				<text>¥</text>
				<input type="number" @input="money" class="input" placeholder="请输入充值金额" value="" />
			</view>
		</view>
		<view class="mode">
			
		</view>
		<view class="btn" @tap="rechargeBtn">充值</view>
	</view>
</template>

<script>
	var util = require('../../utils/util.js');
	var api = require('../../config/api.js');
	const pay = require('../../services/pay.js');
	var app = getApp();
	export default {
		name: '',
		data() {
			return {
				userInfo: {},
				order: {},
				amount: ''
			}	
		},
		onLoad() {
			
		},
		// 页面显示
		onShow() {
			this.getInfo()
		},
		// 页面分享
		onShareAppMessage() {
			wx.showShareMenu({
				withShareTicket:true
			})
			let code = wx.getStorageSync('code');
			this.setCode(code)
			return {
				title: '@你：这里每天更新好多免费的抽奖，快来抽奖吧~',
				path: '/pages/index/index?code='+code,
				imageUrl: '../../static/images/shareImage.jpg'
			}
		},
		//下拉刷新
		onPullDownRefresh(e){
			setTimeout(function () {
				wx.stopPullDownRefresh();
			}, 1000);
		},
		methods:{
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
			money(e) {
				this.amount = e.detail.value;
			},
			rechargeBtn() {
				if(this.amount == "") {
					wx.showToast({
						icon: 'none',
						title: '金额不能为空'
					})
					return false;
				}else if(!this.sDigit(this.amount)) {
					wx.showToast({
						icon: 'none',
						title: '请输入正确的金额'
					})
					return false;
				}
				
				wx.showLoading({
					mask: true,
					title: '提交中...'
				})
				util.request(api.orderRecharge,{amount: this.amount},'post').then(res=>{
					if(res.code == 0) {
						this.getPayInfo(res.data.id)
					}else {
						wx.hideLoading();
						util.showErrorToast(res.msg)
					}
				})
				
			},
			//获取支付签名数据
			getPayInfo(id) {
				util.request(api.getPayInfo,{id: id,type: 1},'post').then(res=>{
					if(res.code == 0) {
						wx.hideLoading();
					}else {
						wx.hideLoading();
						// wx.reLaunch({
						// 	url: '/pages/pay/result?status=0'
						// })
					}
				})
			},
			sDigit: function (value) {
				var patrn = /^([1-9]\d*|0)(\.\d*[1-9])?$/;
				if (!patrn.exec(value)) {
			        return false;
			    }else {
			        return true;
			    }
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
	page{
		background-color: #fff;
	}
	.container{
		background-color: #fff;
	}
	.over{
		width: 90%;
		height: 400rpx;
		background-color: #ec544f;
		border-radius: 30rpx;
		margin: 40rpx auto;
	}
	.over .name{
		text-align: center;
		color: #fff;
		font-size: 28rpx;
		padding: 100rpx 0 40rpx 0;
	}
	.over .money{
		font-size: 60rpx;
		color: #fff;
		text-align: center;
	}
	.pay{
		margin-left: 5%;
	}
	.pay .pay_name{
		font-size: 28rpx;
		font-weight: bold;
	}
	.pay .pay_input{
		display: flex;
		height: 100rpx;
		line-height: 100rpx;
		border-bottom: 1rpx solid #d4d4d4;
	}
	.pay .pay_input text{
		font-size: 32rpx;
		font-weight: bold;
	}
	.pay .pay_input .input{
		width: 90%;
		height: 100rpx;
		color: #ec544f;
		font-size: 50rpx;
		padding-left: 20rpx;
		
	}
	.btn{
		width: 100%;
		height: 100rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		line-height: 100rpx;
		text-align: center;
		background-color: #ec544f;
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
	}
</style>
