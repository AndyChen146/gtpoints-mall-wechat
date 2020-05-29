<template>
	<view class="container">
	    <view class="total">
	      <view class="label">订单金额</view>
	      <view class="txt">¥{{actualPrice}} 元</view>
	    </view>
	    <view class="pay-list">
	        <view class="h">支付方式</view>
	        <view class="b">
	            <view class="item">
	                <image src="/static/images/wxpay.png" class="icon"></image>
	                <view class="name">微信支付</view>
	            </view>
	        </view>
	    </view>
	    
	
	    <view class="pay-btn" @tap="startPay">确定</view>
	</view>
</template>

<script>
	const api = require('../../config/api.js');
	const util = require('../../utils/util.js')
	const user = require("../../services/user.js")
	const app = getApp()
	export default {
		name: '',
		data() {
			return {
				actualPrice: '0.00'
			}
		},
		onLoad() {
			wx.hideShareMenu()
		},
		methods: {
			//订单支付
			startPay() {
				
			}
		}
	}
</script>

<style>
	.total{
	  height: 104rpx;
	  background: #fff;
	  width: 100%;
	  line-height: 104rpx;
	  padding-left: 30rpx;
	  padding-right: 30rpx;
	}
	
	.total .label{
	  float: left;
	}
	
	.total .txt{
	  float: right;
	  color: #ec544f;
	}
	
	.pay-list{
	    margin-top: 30rpx;
	    height: auto;
	    width: 100%;
	    overflow: hidden;
	}
	.pay-list .h{
	    width: 100%;
	    height: 24rpx;
	    line-height: 24rpx;
	    margin-left: 31.25rpx;
	    margin-bottom: 31.25rpx;
	}
	
	.pay-list .item{
	    height: 108rpx;
	    padding-left: 31.25rpx;
	    background: #fff;
	    display: flex;
	    align-items: center;
	    border-bottom: 1px solid #f4f4f4;
	}

	
	
	
	.pay-list .icon{
	    display: inline-block;
	    vertical-align: middle;
	    margin-right: 10.5rpx;
	    width: 56.25rpx;
	    height: 56.25rpx;
	}
	
	.pay-list .name{
	    display: inline-block;
	    vertical-align: middle;
	    height: 56.25rpx;
	    line-height: 56.25rpx;
	}
	
	.pay-btn{
	    position: fixed;
	    left: 0;
	    bottom: 0;
	    height: 100rpx;
	    width: 100%;
	    text-align: center;
	    line-height: 100rpx;
	    background: #ec544f;
	    color: #fff;
	    font-size: 30rpx;
	}
	
	.tips{
	  height: 40rpx;
	  width: 100%;
	  font-size: 24rpx;
	  color: #999;
	  line-height: 40rpx;
	  padding-left: 30rpx;
	  padding-right: 30rpx;
	}
</style>
