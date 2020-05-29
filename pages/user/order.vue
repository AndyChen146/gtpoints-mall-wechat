<template>
	<view class="container">
		<view class="cate-nav">
			<scroll-view scroll-x="true" class="cate-nav-body" style="width: 750rpx;">
				<view  v-for="(item,index) in navList" :class="curr_id == item.id ? 'item active':'item'" :key="index"  @tap="switchCate(item.id)">
					<view class="name">{{item.name}}</view>
				</view>
			</scroll-view>
		</view>
		
		<view class="orders">
			<view class="no_lottery" v-if=" JSON.stringify(orderList) == '{}' || orderList.length <= 0">
				<image src="../../static/images/no_order.png" class="img"></image>
				<text class="wz">暂无订单信息</text>
			</view>
			<navigator v-else :url="'/pages/user/orderDetail?id='+item.order_id" class="order" v-for="(item,index) in orderList" :key="item.order_id">
				<view class="h">
					<view class="l">订单编号：{{item.order_no}}</view>
					<view class="r" v-if="item.order_status == 0 && item.pay_status == 0">未支付</view>
					<view class="r" v-if="item.pay_status == 1 && item.shipping_status == 0">未发货</view>
					<view class="r" v-if="item.pay_status == 1 && item.shipping_status == 1">已发货</view>
					<view class="r" v-if="item.order_status == 2">已完成</view>
					<view class="r" v-if="item.order_status == 1">已取消</view>
				</view>
				<view class="goods" v-for="(vitem,index) in item.goods" :key="vitem.goods_id">
					<view class="img">
						<image :src="dealPrcture(vitem.goods_picture)"></image>
					</view>
					<view class="info">
						<text class="name">{{vitem.goods_name}}</text>
						<text class="number">共{{vitem.num}}件商品</text>
					</view>
					<view class="status"></view>
				</view>
				
				<view class="b">
					<view class="l">实付：￥{{item.pay_money}}</view>
					<view class="r" v-if="item.order_status == 0 && item.pay_status == 0">
						<button class="btn" style="margin-right: 20rpx"  @tap.stop="cancelOrder(item.order_id)" >取消订单</button>
						<button class="btn"  @tap.stop="payOrders(item.order_id)" >去付款</button>
					</view>
					<view class="r" v-if="item.pay_status == 1 && item.shipping_status == 1">
						<button class="btn"  @tap.stop="showLogistic(item.order_no)">物流跟踪</button>
						<button class="btn blue" @tap.stop="confirmReceipt(item.order_id)" >确认收货</button>
					</view>
				</view>
			</navigator>
		</view>
		
		<view class="pay" v-if="payDialogs">
			<image src="../../static/images/close.png" class="close" @click="close"></image>
			<view class="pay-list">
			    <view class="h">支付方式</view>
			    <view class="b">
			        <view class="item" @tap="payTabClick(0)">
						<view :class="pay_status == 0 ? 'checkbox checked' : 'checkbox' "></view>
			            <image src="/static/images/wxpay.png" class="icon"></image>
			            <view class="name">微信支付</view>
			        </view>
					<view class="item" @tap="payTabClick(1)">
						<view :class="pay_status == 1 ? 'checkbox checked' : 'checkbox' "></view>
					    <image src="/static/images/yue.png" class="icon"></image>
					    <view class="name">余额支付</view>
					</view>
			    </view>
			</view>
			<view class="btn" @tap="orderLottery" >立即支付</view>
		</view>
		<view class="pay_mask" v-if="payDialogs"></view>
		
		<view class="rule" v-if="logDialogs">
			<image src="../../static/images/close.png" class="close" @click="close"></image>
			<view class="rule-title">物流信息</view>
			<view class="rule_contect">
				<scroll-view scroll-y="true" v-if="logisicList.length>0"  style="height: 400rpx;">
					<view class="log-li" v-for="item in logisicList">
						<text class="log-li-a"></text>
						<view class="log-record-xx">{{item.AcceptTime}}</view>
						<view class="log-record-time">{{item.AcceptStation}}</view>
					</view>
				</scroll-view>
				<view v-else class="nologdata">暂无物流信息，请您等待~~</view>
			</view>
		</view>
		<view class="rule_mask" v-if="logDialogs"></view>
		
	</view>
</template>

<script>
const api = require('../../config/api.js');
const util = require('../../utils/util.js')
const pay = require("../../services/pay.js")
const app = getApp()	
export default {
	data() {
		return {
			curr_id: 0,
			navList: [
				{
					id: 0,
					name: '全部'
				},{
					id: 1,
					name: '待付款'
				},{
					id: 2,
					name: '待发货'
				},{
					id: 3,
					name: '待收货'
				},
				{
					id: 4,
					name: '已完成'
				}
			],
			orderList: [],
			params: {
				page: 1,
				size: 100,
				status: 0,
				stime: "",
				etime: ""
			},
			logisicList: [],
			logDialogs: false,
			pay_status: 0,
			payDialogs: false,
			order_id: ''
		}
	},
	//初始化
	onLoad() {
		let pages = getCurrentPages();
		let { options } = pages.pop();
		if(options.id) {
			this.params.status = options.id;
			this.curr_id = options.id;
			this.getList();
		}else {
			this.getList();
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
		//获取订单列表
		getList() {
			wx.showLoading()
			util.request(api.getOrderList,this.params, 'post').then(res=>{
				wx.hideLoading()
				if(res.code == 0){
					this.orderList = res.data;
				}
			})
		},
		//待点击
		switchCate(id) {
			if(this.params.status == id) {
				return false;
			}
			this.params.status = id;
			this.curr_id = id;
			this.getList()
			
		},
		//选择支付
		payTabClick(status) {
			if(status == 0) {
				this.pay_status = 0;
			}else {
				this.pay_status = 1;
			}	
		},
		//立即支付
		orderLottery() {
			console.log(this.order_id)
			if(this.pay_status == 0) {
				//走微信支付
				// pay.payOrder(order_id).then(res=>{
				// 	console.log(res)
				// })
			}else if(this.pay_status == 1) {
				//走余额支付
				this.balancePay(this.order_id)
			}	
		},
		//余额支付
		balancePay(id) {
			wx.showLoading({
				mask: true,
				title: '订单提交中...'
			})
			//"0192023a7bbd73250516f069df18b500" admin123
			util.request(api.balancePay,{id: id, pwd: "0192023a7bbd73250516f069df18b500"},'post').then(res=>{
				wx.hideLoading();
				if(res.code == 0) {
					//成功之后
					wx.reLaunch({
						url: '/pages/pay/result?status=1&id='+id
					})
				}else {
					util.showErrorToast(res.msg)
				}
			})
		},
		//去付款
		payOrders(order_id) {
			this.payDialogs = true;
			this.order_id = order_id;
		},
		//物流跟踪
		showLogistic(order_no) {
			this.logDialogs = true;
			this.showLogisticAjax(order_no)
		},
		
		//查看物流ajax
		showLogisticAjax(order_no) {
			util.request(api.getLogisicList,{order_no: order_no},'post').then(res=>{
				if(res.code == 0){
					this.logisicList = res.data.list;
				}
			})
		},
		
		//确认收货
		confirmReceipt(order_id) {
			var _self = this;
			wx.showModal({
				title: '确认收货',
				content: '是否确认收货？',
				success(res) {
					if(res.confirm) {
						_self.confirmReceiptAjax(order_id)
					}
				}
			})
		},
		confirmReceiptAjax(order_id) {
			wx.showLoading({
				mask: true
			})
			util.request(api.getOrderReceived,{order_id: order_id},'post').then(res=>{
				wx.hideLoading();
				if(res.code == 0) {
					this.getList()
				}else {
					util.showErrorToast(res.msg)
				}
			})
		},
		//取消订单
		cancelOrder(order_id) {
			var _self = this;
			wx.showModal({
				title: '取消订单',
				content: '是否取消订单？',
				success(res) {
					if(res.confirm) {
						_self.cancelOrderAjax(order_id)
					}
				}
			})
		},
		cancelOrderAjax(order_id) {
			wx.showLoading({
				mask: true
			})
			util.request(api.setOrderCancel,{order_id: order_id},'post').then(res=>{
				wx.hideLoading();
				if(res.code == 0) {
					this.getList()
				}else {
					util.showErrorToast(res.msg)
				}
			})
		},
		dealPrcture(str) {
			if(!str) return ;
			let newStr = str.split(',');
			return newStr[0]
		},
		//关闭物流信息
		close() {
			this.logDialogs = false;
			this.payDialogs = false;
		},
		//传递分享code进去
		setCode(code) {
			util.request(api.setShareInfo,{code: code},'post').then(res=>{})
		}
	}
}
</script>

<style>
	.cate-nav{
	    position: fixed;
	    left:0;
	    top:0;
	    z-index: 1000;
	}
	
	.cate-nav-body{
	    height: 84rpx;
	    white-space: nowrap;   
	    background: #fff;
	    border-top: 1px solid rgba(0,0,0,.15);
	    overflow: hidden;
	}
	
	.cate-nav .item{
	    display: inline-block;
	    height: 84rpx;
	    min-width: 130rpx;
	    padding: 0 15rpx;
	}
	
	.cate-nav .item .name{
	    display: block;
	    height: 84rpx;
	    padding: 0 20rpx;
	    line-height: 84rpx;
	    color: #333;
	    font-size: 30rpx;
	    width: auto;
	}
	
	.cate-nav .item.active .name{
	    color: #ec544f;
	    border-bottom: 2px solid #ec544f;
	}
	.orders{
	    height: auto;
	    width: 100%;
	    overflow: hidden;
		margin-top: 100rpx;;
	}
	
	.order{
	    margin-top: 20rpx;
	    background: #fff;
	}
	
	.order .h{
	    height: 83.3rpx;
	    line-height: 83.3rpx;
	    margin-left: 31.25rpx;
	    padding-right: 31.25rpx;
	    border-bottom: 1px solid #f4f4f4;
	    font-size: 30rpx;
	    color: #333;
	}
	
	.order .h .l{
	    float: left;
	}
	
	.order .h .r{
	    float: right;
	    color: #ec544f;
	    font-size: 24rpx;
	}
	
	.order .goods{
	    display: flex;
	    align-items: center;
	    height: 199rpx;
	    margin-left: 31.25rpx;
	}
	
	.order .goods .img{
	    height:145.83rpx;
	    width:145.83rpx;
	    background: #f4f4f4;
	}
	
	.order .goods .img image{
	    height:145.83rpx;
	    width:145.83rpx;
	}
	
	.order .goods .info{
	    height: 145.83rpx;
	    flex: 1;
	    padding-left: 20rpx;
	}
	
	.order .goods .name{
		width: 70%;
	    margin-top: 30rpx;
	    display: block;
	    height: 44rpx;
	    line-height: 44rpx;
	    color: #333;
	    font-size: 30rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.order .goods .number{
	    display: block;
	    height: 37rpx;
	    line-height: 37rpx;
	    color: #666;
	    font-size: 25rpx;
	}
	
	.order .goods .status{
	    width:105rpx;
	    color: #ec544f;
	    font-size: 25rpx;
	}
	
	.order .b{
	    height: 103rpx;
	    line-height: 103rpx;
	    margin-left: 31.25rpx;
	    padding-right: 31.25rpx;
	    border-top: 1px solid #f4f4f4;
	    font-size: 30rpx;
	    color: #333;
	}
	
	.order .b .l{
	    float: left;
	}
	
	.order .b .r{
	    float: right;
		display: flex;
	}
	.order .b .btn.blue{
		background: #007AFF;
		margin-left: 20rpx;
	}
	.order .b .btn{
	    margin-top: 19rpx;
	    height: 64.5rpx;
	    line-height: 64.5rpx;
	    text-align: center;
	    padding: 0 20rpx;
	    border-radius: 5rpx;
	    font-size: 28rpx;
	    color: #fff;
	    background: #ec544f;
	}
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
	.rule{
		width: 90%;
		height: auto;
		border-radius: 10rpx;
		position: fixed;
		top: 300rpx;
		left: 5%;
		background-color: #fff;
		z-index: 101;
		
	}
	.rule .rule-title{
		width: 100%;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
		padding: 30rpx;
	}
	.rule .close{
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		right: 20rpx;
		top: 20rpx;
	}
	.rule .rule_contect{
		padding: 0 30rpx 30rpx 30rpx;
	}
	.rule .rule_contect .nologdata{
		font-size: 26rpx;
		color: #666;
		text-align: center;
		line-height: 100rpx;
	}
	.rule .rule_contect .log-li{
		text-align: left;
		position: relative;
		height: 80rpx;
		
	}
	.rule .rule_contect .log-li:before{
		content: '';
		background: #edf0f5;
		width: 2rpx;
		height: 100rpx;
		position: absolute;
		left: 5rpx;
		top: 3rpx;
	}
	.rule .rule_contect .log-li .log-li-a{
		display: inline-block;
		width: 10rpx;
		height: 10rpx;
		border-radius: 100%;
		position: absolute;
		background: #0067ed;
		top: 0;
		left: 3rpx;
	}
	.rule .rule_contect .log-li .log-record-xx{
		position: absolute;
		left: 60rpx;
		top: 4rpx;
		color: #1e1f30;
		font-size: 24rpx;
		
	}
	.rule .rule_contect .log-li .log-record-time{
		position: absolute;
		line-height: 32rpx;
		left: 60rpx;
		top: 36rpx;
		color: #9fafbc;
		font-size: 24rpx;
	}
	.rule_mask,.pay_mask{
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 100;
		background: rgba(0, 0, 0, 0.7);
		top: 0;
		left: 0;
		right: 0;
		overflow: hidden;
		max-width: 61.3333333rem;
		margin: auto;
	}
	.pay{
		width: 100%;
		height: 500rpx;
		background-color: #fff;
		border-radius: 10rpx 10rpx 0 0;
		z-index: 101;
		position: fixed;
		bottom: 0;
		left: 0;
	}
	.pay-list{
	    margin-top: 30rpx;
	    height: auto;
	    width: 100%;
	    overflow: hidden;
	}
	.pay-list .h{
	    width: 100%;
	    height: 28rpx;
	    line-height: 28rpx;
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
	.pay-list .checkbox{
	    background: url(../../static/images/wgx.png) center center no-repeat;
		background-size: 100%;
		border-radius: 50%;
	    width: 40rpx;
	    height: 40rpx;
	    display: inline-block;
	    vertical-align: middle;
	    margin-right: 30rpx;
	}
	
	.pay-list .checkbox.checked{
	    background: url(../../static/images/gx.png) center center no-repeat;
		background-size: 100%;
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
	.pay .btn{
		width: 90%;
		height: 80rpx;
		position: absolute;
		background-color: #ec544f;
		color: #fff;
		margin: 0 auto;
		bottom: 20rpx;
		left: 5%;
		border-radius: 30rpx;
		text-align: center;
		font-size: 30rpx;
		line-height: 80rpx;
	}
	.pay .close{
		width: 60rpx;
		height: 60rpx;
		position: absolute;
		right: 20rpx;
		top: 30rpx;
	}
</style>

