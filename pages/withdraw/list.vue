<template>
	<view class="container">
		<view class="no_lottery" v-if="list.length <= 0">
			<image src="../../static/images/no_reaget.png" class="img"></image>
			<text class="wz">暂无提现记录</text>
		</view>
		<view class="recharge" v-else> 
			<view class="item" v-for="item in list" :key="item.order_no">
				<view class="h">
					<view class="l">提现编号：{{item.order_no}}</view>
					<view class="r" v-if="item.status == 1">申请中</view>
					<view class="r" v-if="item.status == 2">已取消</view>
					<view class="r" v-if="item.status == 3">平台已受理</view>
					<view class="r" v-if="item.status == 4">平台已驳回</view>
					<view class="r" v-if="item.status == 5">提现成功</view>
				</view>
				<view class="b">
					<view class="times">提现时间：{{item.create_time | formatTimes}}</view>
					<view class="status" v-if="item.status == 4">驳回原因：{{item.message}}</view>
					<view class="money">提现金额：<text>¥{{item.amount}}</text></view>
				</view>
				<button type="primary" v-if="item.status == 1" class="button" @tap="cancelBtn(item.id)" hover-class="none">取消提现</button>
			</view>
		</view>
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
				params: {
					page: 1,
					size: 1000
				},
				list: []
			}
		},
		//初始化
		onLoad() {
			this.getList();
			wx.hideShareMenu()
		},
		// 页面显示
		onShow() {},
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
		methods: {
			//获取提现列表
			getList() {
				util.request(api.getCashOutList,this.params,'post').then(res=>{
					if(res.code == 0) {
						this.list = res.data.list;
					}
				})
			},
			//取消提现
			cancelBtn(id) {
				wx.showLoading({
					mask: true,
				})
				util.request(api.cashOutCancel,{id:id},'post').then(res=>{
					wx.hideLoading()
					if(res.code == 0) {
						wx.showToast({
							icon: 'none',
							title: '取消成功'
						})
						this.getList();
					}
				})
			},
			//传递分享code进去
			setCode(code) {
				util.request(api.setShareInfo,{code: code},'post').then(res=>{})
			}
			
		},
		filters:{
			formatTimes(times) {
				return util.formatTime(times)
			}
		}
	}
</script>

<style>
	.no_lottery{
		text-align: center;
		margin-top: 200rpx;
	}
	.no_lottery .img{
		width: 100rpx;
		height: 100rpx;
		display: block;
		margin: 0 auto;
		margin-bottom: 20rpx;
	}
	.no_lottery .wz{
		font-size: 28rpx;
		color: #999;
	}
	.recharge{
	    height: auto;
	    width: 100%;
	    overflow: hidden;
	}
	.item{
		margin-top: 20rpx;
		background: #fff;
		position: relative;
	}
	.item .h{
		height: 83.3rpx;
		line-height: 83.3rpx;
		padding-left: 31.25rpx;
		padding-right: 31.25rpx;
		border-bottom: 1px solid #f4f4f4;
		font-size: 30rpx;
		color: #333;
	}
	.item .h .l{
		float: left;
	}
	.item .h .r{
		float: right;
		color: #ec544f;
		font-size: 24rpx;
	}
	.item .b{
		padding: 32rpx;
	}
	.item .b .times{
		font-size: 24rpx;
		color: #999;
		margin-bottom: 10rpx;
	}
	.item .b .money text{
		color: #ec544f;
	}
	.item .b .status{
		font-size: 24rpx;
		color: #666;
		margin-bottom: 10rpx;
	}
	.item .button {
		position: absolute;
		font-size: 24rpx;
		color: #ec544f;
		border: 1px solid #ec544f;
		border-radius: 10rpx;
		width: 160rpx;
		height: 50rpx;
		bottom: 20rpx;
		right: 20rpx;
		text-align: center;
		line-height: 50rpx;
		background-color: #fff;
		
	}
</style>
