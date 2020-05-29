<template>
	<view class="main">
		<view class="title">夺宝说明</view>
		<view class="desc">
			1、每日转发群内免费获得1积分，转发朋友圈与微信群赠送的积分不予累计。
		</view>
		<view class="desc">2、现金充值2元赠送1积分无上限以此类推，充值赠送的积分可以累计并且无上限。</view>
		<view class="desc">
			3、本商城可充值可提现，夺宝与其他活动只消耗您的积分，充值的金额只限在本商城购买商品。
		</view>
		<view class="desc">
			4、夺宝开奖结果，当达到以系统设置的积分数时，即时开奖，系统随机开出幸运得主，例如: 0-1999  开出得奖号码为 168  如果您参与时的积分号码为168 那么恭喜您中奖， 参与积分数可单人购满。
		</view>
		<view class="desc">
			5、本商城所有物品包邮！  所有活动真实有效！
		</view>
	</view>
</template>

<script>
	const api = require('../../config/api.js');
	const util = require('../../utils/util.js')
	const app = getApp()	
	export default {
		name: '',
		data() {
			return {
				
			}
		},
		onLoad() {
			
		},
		// 页面显示
		onShow() {
			
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
			//传递分享code进去
			setCode(code) {
				util.request(api.setShareInfo,{code: code},'post').then(res=>{})
			}
		}
	}
</script>

<style>
	page {
		background-color: #ffffff !important;
	}
	.main{
		width: 100%;
	}
	.title{
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		margin: 40rpx auto;
		font-size: 40rpx;
		font-weight: bold;
	}
	.desc{
		padding: 0 30rpx;
		font-size: 28rpx;
		margin-bottom: 10rpx;
	}
</style>
