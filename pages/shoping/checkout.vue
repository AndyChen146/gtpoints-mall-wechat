<template>
	<view class="container">
		<view class="address-box">
			<view class="address-item" @tap="selectAddress" v-if="checkedAddress.addr_id > 0">
				<view class="l">
					<text class="name">{{checkedAddress.consignee}}</text>
					<text class="default" v-if="checkedAddress.is_default === 1">默认</text>
				</view>
				<view class="m">
					<text class="mobile">{{checkedAddress.mobile}}</text>
					<text class="address">{{checkedAddress.address}}</text>
				</view>
				<view class="r">
					<image src="/static/images/address_right.png"></image>
				</view>
			</view>
			<view class="address-item address-empty" @tap="addAddress" v-else>
				<view class="m">
				   还没有收货地址，去添加
				</view>
				<view class="r">
					<image src="/static/images/address_right.png"></image>
				</view>
			</view>
		</view>
	
		<view class="order-box">
			<view class="order-item">
				<view class="l">
					<text class="name">商品合计</text>
				</view>
				<view class="r">
					<text class="txt">￥{{goodsTotalPrice}}</text>
				</view>
			</view>
			<view class="order-item">
				<view class="l">
					<text class="name">运费</text>
				</view>
				<view class="r">
					<text class="txt">￥{{freightPrice}}</text>
				</view>
			</view>
			<view class="order-item">
				<view>
					<textarea :value="order_remark" @input="bindOrderRemark" placeholder="备注信息,小于100字符" maxlength="100" />
				</view>
			</view>
		</view>
		
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
		
		<view class="goods-items">
			<view class="item" v-for="(item,index) in checkedGoodsList" :key="item.cart_id">
				<view class="img">
					<image :src="item.goods_picture"></image>
				</view>
				<view class="info">
					<view class="t">
						<text class="name">{{item.goods_name}}</text>
						<text class="number">x{{item.num}}</text>
					</view>
					<view class="m">{{item.sku_name}}</view>
					<view class="b">￥{{item.price}}</view>
				</view>
			</view>
		</view>
		
		<view class="order-total">
			<view class="l">实付：￥{{actualPrice}}</view>
			<view class="r" @tap="submitOrder">去付款</view>
		</view>
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
				checkedAddress: {},
				addrList: [],
				goodsTotalPrice: "0.00", //商品总价
				freightPrice: "0.00",    //快递费
				actualPrice: '0.00',
				checkedGoodsList: [],
				order_remark: '',
				pay_status: 0,
				order_id: '',
			}	
		},
		onLoad() {
			
		},
		// 页面显示
		onShow() {
			this.getList();
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
		methods: {
			//获取商品列表
			getList() {
				util.request(api.getCartLists,{status: 1},'post').then(res=>{
					if(res.code == 0){
						this.checkedGoodsList = res.data.list;
						this.goodsTotalPrice = res.data.total;
						this.actualPrice = res.data.total;
						this.getAddrList();
						
					}
				})
			},
			//获取默认地址
			getAddrList() {
				util.request(api.getAddreList,{},'get').then(res=>{
					if(res.code == 0) {
						this.addrList = res.data.list;
						this.addrList.forEach(item=>{
							if(item.is_default == 1) {
								this.checkedAddress = item;
							}
						})
					}
				})
			},
			
			//支付切换
			payTabClick(status) {
				if(status == 0) {
					this.pay_status = 0;
				}else {
					this.pay_status = 1;
				}
			},
			
			//增加地址
			addAddress() {
				wx.navigateTo({
					url: '/pages/shoping/addr'
				})
			},
			//选择地址
			selectAddress() {
				wx.navigateTo({
					url: '/pages/shoping/addr'
				})
			},
			//获取备注信息
			bindOrderRemark(e) {
				this.order_remark = e.detail.value;
			},
			//去付款
			submitOrder() {
				var that = this;
				if(JSON.stringify(this.checkedAddress) == "{}") {
					util.showErrorToast('您还没收货地址哦！')
					return false;
				}
				
				if(this.pay_status == 0) {
					wx.showLoading({
						mask: true,
						title: '订单提交中...'
					})
					if(that.order_id != "") {
						that.getPayInfo(that.order_id)
					}else {
						util.request(api.getOrderCart,{order_remark: this.order_remark},'post').then(res=>{
							if(res.code == 0) {
								this.getPayInfo(res.data.id)
								that.order_id = res.data.id;
							}else {
								wx.hideLoading();
								util.showErrorToast(res.msg)
							}
						})
					}
					
				}else if(this.pay_status == 1){
					wx.showModal({
						title: '余额支付',
						content: '余额支付将自动扣除充值金额资金',
						success(res){
							if (res.confirm) {
								wx.showLoading({
									mask: true,
									title: '订单提交中...'
								})
								if(that.order_id != "") {
									that.balancePay(that.order_id)
								}else {
									util.request(api.getOrderCart,{order_remark: that.order_remark},'post').then(res=>{
										if(res.code == 0) {
											that.balancePay(res.data.id)
											that.order_id = res.data.id;
										}else {
											wx.hideLoading();
											util.showErrorToast(res.msg)
										}
									})
								}
							}
						}
					})
				}
			},
			//余额支付
			balancePay(id) {
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
			
			//获取支付签名数据
			getPayInfo(id) {
				util.request(api.getPayInfo,{id: id,type: 1},'post').then(res=>{
					if(res.code == 0) {
						wx.hideLoading();
					}else {
						wx.hideLoading();
						wx.reLaunch({
							url: '/pages/pay/result?status=0'
						})
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
	.address-box{
	    width: 100%;
	    height: 166.55rpx;
	    background: url(../../static/images/address-bg-bd.png) 0 0 repeat-x;
	    background-size: 62.5rpx 10.5rpx;
	    margin-bottom: 20rpx;
	    padding-top: 10.5rpx;
	}
	
	.address-item{
	    display: flex;
	    height: 155.55rpx;
	    background: #fff;
	    padding: 41.6rpx 0 41.6rpx 31.25rpx;
	}
	
	.address-item.address-empty{
	  line-height: 75rpx;
	  text-align: center;
	}
	
	.address-box .l{
	    width: 180rpx;
	    height: 100%;
	}
	
	.address-box .l .name{
	    margin-left: 6.25rpx;
	    margin-top: -7.25rpx;
	    display: block;
	    width: 125rpx;
	    height: 43rpx;
	    line-height: 43rpx;
	    font-size: 30rpx;
	    color: #333;
	    margin-bottom: 5rpx;
	
	}
	
	.address-box .l .default{
	    margin-left: 6.25rpx;
	    display: block;
	    width: 62rpx;
	    height: 33rpx;
	    border-radius: 5rpx;
	    border: 1px solid #b4282d;
	    font-size: 20.5rpx;
	    text-align: center;
	    line-height: 29rpx;
	    color: #b4282d;
	}
	
	.address-box .m{
	    flex: 1;
	    height: 72.25rpx;
	    color: #999;
	}
	
	.address-box .mobile{
	    display: block;
	    height: 29rpx;
	    line-height: 29rpx;
	    margin-bottom: 6.25rpx;
	    font-size: 30rpx;
	    color:#333;
	}
	
	.address-box .address{
	    display: block;
	    height: 37.5rpx;
	    line-height: 37.5rpx;
	    font-size: 25rpx;
	    color:#666;
	}
	
	.address-box .r{
	    width: 77rpx;
	    height: 77rpx;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	}
	
	.address-box .r image{
	    width: 52.078rpx;
	    height: 52.078rpx;
	}
	
	.coupon-box{
	    width: 100%;
	    height: auto;
	    overflow: hidden;
	    background: #fff;
	}
	
	.coupon-box .coupon-item{
	    width: 100%;
	    height: 108.3rpx;
	    overflow: hidden;
	    background: #fff;
	    display: flex;
	    padding-left: 31.25rpx;
	}
	
	.coupon-box .l{
	    flex: 1;
	    height: 43rpx;
	    line-height: 43rpx;
	    padding-top: 35rpx;
	}
	
	.coupon-box .l .name{
	    float: left;
	    font-size: 30rpx;
	    color: #666;
	}
	
	.coupon-box .l .txt{
	    float: right;
	    font-size: 30rpx;
	    color: #666;
	}
	
	.coupon-box .r{
	    margin-top: 15.5rpx;
	    width: 77rpx;
	    height: 77rpx;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	}
	
	.coupon-box .r image{
	    width: 52.078rpx;
	    height: 52.078rpx;
	}
	
	.order-box{
	    margin-top: 20rpx;
	    width: 100%;
	    height: auto;
	    overflow: hidden;
	    background: #fff;
		padding-bottom: 6rpx;
	}
	
	.order-box .order-item{
	    height: 104.3rpx;
	    overflow: hidden;
	    background: #fff;
	    display: flex;
	    margin-left: 31.25rpx;
	    padding-right: 31.25rpx;
	    padding-top: 26rpx;
	    border-bottom: 1px solid #d9d9d9;
	}
	
	.order-box .order-item .l{
	    float: left;
	    height: 52rpx;
	    width: 50%;
	    line-height: 52rpx;
	    overflow: hidden;
	}
	
	.order-box .order-item .r{
	    float: right;
	    text-align: right;
	    width: 50%;
	    height: 52rpx;
	    line-height: 52rpx;
	    overflow: hidden;
	}
	.order-box .order-item textarea{
		width: 600rpx;
		height: 80rpx;
	}
	.order-box .order-item.no-border{
	    border-bottom: none;
	}
	
	.goods-items{
	    margin-top: 20rpx;
	    width: 100%;
	    height: auto;
	    overflow: hidden;
	    background: #fff;
	    padding-left: 31.25rpx;
	    margin-bottom: 120rpx;
	}
	
	.goods-items .item{
	    height: 192rpx;
	    padding-right: 31.25rpx;
	    display: flex;
	    align-items: center;
	    border-bottom: 1px solid rgba(0,0,0,0.15);
	}
	
	.goods-items .item.no-border{
	    border-bottom: none;
	}
	
	
	.goods-items .item:last-child{
	    border-bottom: none;
	}
	
	.goods-items .img{
	    height: 145.83rpx;
	    width: 145.83rpx;
	    background-color: #f4f4f4;
	    margin-right: 20rpx;
	}
	
	.goods-items .img image{
	    height: 145.83rpx;
	    width: 145.83rpx;
	}
	
	.goods-items .info{
	    flex: 1;
	    height: 145.83rpx;
	    padding-top: 5rpx;
	}
	
	.goods-items .t{
	    height:  33rpx;
	    line-height: 33rpx;
	    margin-bottom: 10rpx;
	    overflow: hidden;
	    font-size: 30rpx;
	    color: #333;
		
		
	}
	
	.goods-items .t .name{		
		height: 28rpx;
		max-width: 68%;
		overflow: hidden;
		display: block;
		float: left;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.goods-items .t .number{
	    text-align: right;
	}
	
	.goods-items .m {
	    height:  29rpx;
	    overflow: hidden;
	    line-height: 29rpx;
	    margin-bottom: 25rpx;
	    font-size: 25rpx;
	    color: #666;
	}
	
	.goods-items .b {
	    height:  41rpx;
	    overflow: hidden;
	    line-height: 41rpx;
	    font-size: 30rpx;
	    color: #333;
	}
	
	.order-total{
	    position: fixed;
	    left:0;
	    bottom: 0;
	    height: 100rpx;
	    width: 100%;
	    display: flex;
	}
	
	.order-total .l{
	    flex: 1;
	    height: 100rpx;
	    line-height: 100rpx;
	    color: #ec544f;
	    background: #fff;
	    font-size: 33rpx;
	    padding-left: 31.25rpx;
	    border-top: 1rpx solid rgba(0,0,0,0.2);
	    border-bottom: 1rpx solid rgba(0,0,0,0.2);
	}
	
	.order-total .r{
	    width: 233rpx;
	    height: 100rpx;
	    background: #ec544f;
	    border: 1px solid #ec544f;
	    line-height: 100rpx;
	    text-align: center;
	    color: #fff;
	    font-size: 30rpx;
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
</style>
