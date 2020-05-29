<template>
	<view class="main">
		<view class="over">
			<view class="name">可提现金额(元)</view>
			<view class="money">¥ {{amount}}</view>
			<navigator class="cashBtn" hover-class="none" url="/pages/withdraw/list">提现列表</navigator>
		</view>
		
		<view class="pay">
			<view class="pay_name">输入提现金额</view>
			<view class="pay_input">
				<text>¥</text>
				<input type="number" @input="money" class="input" placeholder="请输入金额" value="" />
			</view>
		</view>
		
		<view class="mode">
			<view class="mode-t">
				<text class="rule">提现说明</text>
			</view>
			<view class="mode-c">
				<view class="mode-item">1、余额提现将2-3天提醒您</view>
				<view class="mode-item">2、每天参与积分夺宝，将获得更多礼品哦~</view>
			</view>
		</view>
		<view class="btn" @tap="rechargeBtn">提现</view>
	</view>
</template>

<script>
	const api = require('../../config/api.js');
	const util = require('../../utils/util.js')
	const user = require("../../services/user.js")
	const app = getApp()	
	export default {
		data() {
			return {
				amount: '0.00',
				moneys: ''
			}
		},
		//初始化
		onLoad() {
			
		},
		// 页面显示
		onShow() {
			this.getInfo();
		},
		onShareAppMessage: function () {
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
		methods:{
			//获取可提现金额
			getInfo() {
				util.request(api.getCashOut,{},'get').then(res=>{
					if(res.code == 0) {
						this.amount = res.data.amount
					}
				})
			},
			
			//获取提现金额
			money(e) {
				this.moneys = e.detail.value;
			},
			sDigit: function (value) {
				var patrn = /^([1-9]\d*|0)(\.\d*[1-9])?$/;
				if (!patrn.exec(value)) {
			        return false;
			    }else {
			        return true;
			    }
			},
			//提现
			rechargeBtn() {
				if(this.moneys == 0) {
					wx.showToast({
						icon: 'none',
						title: '金额不能为空'
					})
					return false;
				}else if(!this.sDigit(this.moneys)) {
					wx.showToast({
						icon: 'none',
						title: '请输入正确的金额'
					})
					return false;
				}else if(parseInt(this.moneys) > parseInt(this.amount)) {
					wx.showToast({
						icon: 'none',
						title: '输入的金额不能大于可提现的金额'
					})
					return false;
				}
				
				wx.showLoading({
					mask: true,
					title: '提交中...'
				})
				
				util.request(api.cashOutBtn,{amount: this.moneys},'post').then(res=>{
					wx.hideLoading()
					if(res.code == 0) {
						wx.navigateTo({
							url: '/pages/withdraw/list'
						})
					}else {
						util.showErrorToast(res.msg);
						return false;
					}
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
	.main{
		
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
	.over{
		width: 90%;
		height: 400rpx;
		background-color: #ec544f;
		border-radius: 30rpx;
		margin: 40rpx auto;
		position: relative;
	}
	.over .cashBtn{
		position: absolute;
		width: 140rpx;
		height: 50rpx;
		border: 1px solid #ddd;
		bottom: 30rpx;
		right: 30rpx;
		border-radius: 20rpx;
		color: #fff;
		text-align: center;
		line-height: 50rpx;
		font-size: 24rpx;
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
	.mode{
		margin-top: 50rpx;
	}
	.mode .mode-t{
		text-align: center;
		padding-bottom: 20rpx;
	}
	.mode .mode-t .rule{
		position: relative;
		display: inline-block;
	}
	.mode .mode-t .rule:before{
		display: inline-block;
		width: 64rpx;
		height: 1rpx;
		top: 50%;
		background-color: #e0e0e0;
		position: absolute;
		content: '';
		left: -100rpx;
	}
	.mode .mode-t .rule:after{
		display: inline-block;
		width: 64rpx;
		height: 1rpx;
		top: 50%;
		background-color: #e0e0e0;
		position: absolute;
		content: '';
		right: -100rpx;
	}
	.mode .mode-c{
		width: 80%;
		margin: 0 auto;
	}
	.mode .mode-c .mode-item{
		font-size: 24rpx;
		line-height: 50rpx;
		color: #999;
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
