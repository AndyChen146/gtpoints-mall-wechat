<template>
	<view class="container">
		<view class="no_lottery" v-if="list.length <= 0">
			<image src="../../static/images/no_reaget.png" class="img"></image>
			<text class="wz">暂无充值记录</text>
		</view>
		<view class="recharge" v-else> 
			<view class="item" v-for="item in list" :key="item.order_no">
				<view class="h">
					<view class="l">订单编号：{{item.order_no}}</view>
					<view class="r" v-if="item.pay_status == 0">未支付</view>
					<view class="r" v-if="item.pay_status == 1">已支付</view>
				</view>
				<view class="b">
					<view class="times">充值时间：{{item.pay_time | formatTimes}}</view>
					<view class="money">充值金额：<text>¥{{item.amount}}</text></view>
				</view>
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
				list: [],
				params: {
					page: 1,
					size: 10
				},
				isRefresh: false
			}
		},
		//初始化
		onLoad() {
			this.getList();
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
				path: '/pages/user/index?code='+code,
				imageUrl: '../../static/images/shareImage.jpg'
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			this.params.page = 1;
			this.isRefresh = true;
			this.getList()
		},
		//上拉动作
		onReachBottom(){
			var page = this.params.page+1;
			this.params.page = page;
			this.getList()
		},
		methods: {
			//获取充值记录
			getList() {
				wx.showLoading()
				util.request(api.getRechargeList,this.params,'post').then(res=>{
					wx.hideLoading()
					if(res.code == 0) {
						var list = res.data.list;
						if(this.isRefresh) {
							this.list = list;
						}else {
							var templist = this.list;
							var resultlist = templist.concat(list)
							this.list = resultlist;
						}
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
</style>

