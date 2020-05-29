<template>
	<view class="container">
		<view class="order-info">
			<view class="item-a">下单时间：{{orderInfo.create_time}}</view>
			<view class="item-b">订单编号：{{orderInfo.order_no}}</view>
			<view class="item-b" v-if="orderInfo.otder_type == 1">活动类型：积分夺宝</view>
			<view class="item-b" v-if="orderInfo.otder_type == 2">活动类型：免费抢购</view>
			<view class="item-c">
				<template>
					<view class="l" v-if="orderInfo.otder_type == 0">实付：<text class="cost">￥{{orderInfo.order_money}}</text></view>
					<view class="l" v-else>实付：<text class="cost">￥0.00</text></view>
				</template>
				
				<view class="r">
					<view class="btn" v-if="orderInfo.order_status == 0 && orderInfo.pay_status == 0" >未付款</view>
					<view class="btn" v-if="orderInfo.pay_status == 1 && orderInfo.shipping_status == 1" >已发货</view>
					<view class="btn" v-if="orderInfo.pay_status == 1 && orderInfo.shipping_status == 0" >未发货</view>
					<view class="btn" v-if="orderInfo.order_status == 1" >已取消</view>
					<view class="btn" v-if="orderInfo.order_status == 2">已完成</view>
				</view>
			</view>
		</view>
		
		<view class="order-goods">
			<view class="h">
				<view class="label">商品信息</view>
				<view class="status">{{orderInfo.order_status_text}}</view>
			</view>
			<view class="goods">
				<view class="item" v-for="(item,index) in orderGoods" :key="item.goods_id">
					<view class="img">
						<image :src="dealPrcture(item.goods_picture)"></image>
					</view>
					<view class="info">
						<view class="t">
							<text class="name">{{item.goods_name}}</text>
							<text class="number">x{{item.num}}</text>
						</view>
						<view class="attr">{{item.sku_name}}</view>
						<view class="price">￥{{item.price}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="order-bottom">
			<view class="address">
				<view class="t">
					<text class="name">{{orderInfo.receiver_name}}</text>
					<text class="mobile">{{orderInfo.receiver_mobile}}</text>
				</view>
				<view class="b">{{orderInfo.receiver_address}}</view>
			</view>
			<view class="total">
				<view class="t">
					<text class="label">商品合计：</text>
					<text class="txt">￥{{orderInfo.shipping_money}}</text>
				</view>
				<view class="t">
					<text class="label">运费：</text>
					<text class="txt">包邮</text>
				</view>
			</view>
			<view class="pay-fee">
				<text class="label">实付：</text>
				<template>
					<text class="txt" v-if="orderInfo.otder_type == 0">￥{{orderInfo.order_money}}</text>
					<text class="txt" v-else>￥0.00</text>
				</template>
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
			orderInfo: {},
			orderGoods: []
		}
	},
	//初始化
	onLoad() {
		let pages = getCurrentPages();
		let { options } = pages.pop();
		if(options.id) {
			this.getInfo(options.id);
		}
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
	onPullDownRefresh(e){
		setTimeout(function () {
			wx.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		//获取订单详情
		getInfo(id) {
			util.request(api.getOrderInfo,{order_id: id},'post').then(res=>{
				if(res.code == 0) {
					this.orderInfo = res.data.order;
					this.orderGoods = res.data.goods;
				}
			})
		},
		dealPrcture(str) {
			if(!str) return ;
			let newStr = str.split(',');
			return newStr[0]
		},
		//取消订单
		cancelOrder() {
			
		},
		//去付款
		payOrders() {
			
		},
		//传递分享code进去
		setCode(code) {
			util.request(api.setShareInfo,{code: code},'post').then(res=>{})
		}
	}
}
</script>

<style>
	.order-info{
	    padding-top: 25rpx;
	    background: #fff;
	    height: auto;
	    overflow: hidden;
	}
	
	.item-a{
	    padding-left: 31.25rpx;
	    height: 42.5rpx;
	    padding-bottom: 12.5rpx;
	    line-height: 30rpx;
	    font-size: 30rpx;
	    color: #666;
	}
	
	.item-b{
	    padding-left: 31.25rpx;
	    height: 29rpx;
	    line-height: 29rpx;
	    margin-top: 12.5rpx;
	    margin-bottom: 41.5rpx;
	    font-size: 30rpx;
	    color: #666;
	}
	
	.item-c{
	    margin-left: 31.25rpx;
	    border-top: 1px solid #f4f4f4;
	    height: 103rpx;
	    line-height: 103rpx;
	}
	
	.item-c .l{
	    float: left;
	}
	
	.item-c .r{
	    height: 103rpx;
	    float: right;
	    display: flex;
	    align-items: center;
	    padding-right: 16rpx;
	}
	
	.item-c .r .btn{
	    float: right;
		color: #ec544f;
	}
	
	.item-c .cost{
	    color: #ec544f;
	}
	
	.item-c .btn{
	    line-height: 66rpx;
	    border-radius: 5rpx;
	    text-align: center;
	    margin: 0 15rpx;
	    padding: 0 20rpx;
	    height: 66rpx;
	}
	
	.item-c .btn.active{
	    background: #ec544f;
	    color: #fff;
	}
	
	.order-goods{
	    margin-top: 20rpx;
	    background: #fff;
	}
	
	.order-goods .h{
	    height: 93.75rpx;
	    line-height: 93.75rpx;
	    margin-left: 31.25rpx;
	    border-bottom: 1px solid #f4f4f4;
	    padding-right: 31.25rpx;
	}
	
	.order-goods .h .label{
	    float: left;
	    font-size: 30rpx;
	    color: #333;
	}
	
	.order-goods .h .status{
	    float: right;
	    font-size: 30rpx;
	    color: #ec544f;
	}
	
	.order-goods .item{
	    display: flex;
	    align-items: center;
	    height: 192rpx;
	    margin-left: 31.25rpx;
	    padding-right: 31.25rpx;
	    border-bottom: 1px solid #f4f4f4;
	}
	
	.order-goods .item:last-child{
	    border-bottom: none;
	}
	
	.order-goods .item .img{
	    height: 145.83rpx;
	    width: 145.83rpx;
	    background: #f4f4f4;
	}
	
	.order-goods .item .img image{
	    height: 145.83rpx;
	    width: 145.83rpx;
	}
	
	.order-goods .item .info{
	    flex: 1;
	    height: 145.83rpx;
	    margin-left: 20rpx;
	}
	
	.order-goods .item .t{
	    margin-top: 8rpx;
	    height: 33rpx;
	    line-height: 33rpx;
	    margin-bottom: 10.5rpx;
	}
	
	.order-goods .item .t .name{
		width: 64%;
	    display: block;
	    float: left;
	    height: 33rpx;
	    line-height: 33rpx;
	    color: #333;
	    font-size: 30rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.order-goods .item .t .number{
	    height: 33rpx;
	    text-align: right;
	    line-height: 33rpx;
	    color: #333;
	    font-size: 30rpx;
	}
	
	.order-goods .item .attr{
	    height: 29rpx;
	    line-height: 29rpx;
	    color: #666;
	    margin-bottom: 25rpx;
	    font-size: 25rpx;
	}
	
	.order-goods .item .price{
	    height: 30rpx;
	    line-height: 30rpx;
	    color: #333;
	    font-size: 30rpx;
	}
	
	.order-bottom{
	    margin-top: 20rpx;
	    padding-left: 31.25rpx;
	    height: auto;
	    overflow: hidden;
	    background: #fff;
	}
	
	.order-bottom .address{
	    height: 128rpx;
	    padding-top: 25rpx;
	    border-bottom: 1px solid #f4f4f4;
	}
	
	.order-bottom .address .t{
	    height: 35rpx;
	    line-height: 35rpx;
	    margin-bottom: 7.5rpx;
	}
	
	.order-bottom .address .name{
	    display: inline-block;
	    height: 35rpx;
	    width: 140rpx;
	    line-height: 35rpx;
	    font-size: 25rpx;
	}
	
	.order-bottom .address .mobile{
	    display: inline-block;
	    height: 35rpx;
	    line-height: 35rpx;
	    font-size: 25rpx;
	}
	
	.order-bottom .address .b{
	    height: 35rpx;
	    line-height: 35rpx;
	    font-size: 25rpx;
	}
	
	.order-bottom .total{
	    height: 106rpx;
	    padding-top: 20rpx;
	    border-bottom: 1px solid #f4f4f4;
	}
	
	.order-bottom .total .t{
	    height: 25rpx;
	    line-height: 25rpx;
	    margin-bottom: 7.5rpx;
	    display: flex;
	}
	
	.order-bottom .total .label{
	    width: 140rpx;
	    display: inline-block;
	    height: 35rpx;
	    line-height: 35rpx;
	    font-size: 25rpx;
	}
	
	.order-bottom .total .txt{
	    flex: 1;
	    display: inline-block;
	    height: 35rpx;
	    line-height: 35rpx;
	    font-size: 25rpx;
	}
	
	.order-bottom .pay-fee{
	    height: 81rpx;
	    line-height: 81rpx;
	}
	
	.order-bottom .pay-fee .label{
	    display: inline-block;
	    width: 140rpx;
	    color: #ec544f;
	}
	
	.order-bottom .pay-fee .txt{
	    display: inline-block;
	    width: 140rpx;
	    color: #ec544f;
	}
</style>

