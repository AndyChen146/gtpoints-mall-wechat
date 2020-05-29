<template>
	<view class="container">
		<swiper class="goodsimgs" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
			<swiper-item v-for="(item,index) in picture" :key="index">
				<image :src="item" background-size="cover"></image>
			</swiper-item>
		</swiper>
		<view class="goods-info">
		    <view class="info_price">¥ {{goods.price}}</view>
			<view class="info_t">
				<text class="info_brand">{{goods.brand_name}}</text>
				<text class="info_title">{{goods.title}}</text>
			</view>
			
		</view>
		
		<!-- <view class="goods-type" @tap="openAssess">
			<text class="left">商品评价</text>
			<text class="right">查看 ></text>
		</view> -->
		
		<view class="goods-desc-title" v-if="goods_type_items.length>0">
			<text class="text">商品类型</text>
		</view>
		<view class="goods_types" v-if="goods_type_items.length>0">
			<view class="goods_types_item" v-for="(item,index) in goods_type_items" :key="item.gtv_id">
				<text class="name">{{item.gtv_name}}:</text>
				<text class="value">{{item.gtv_value}}</text>
			</view>
		</view>
		
		<view class="goods-desc-title">
			<text class="text">商品详情</text>
		</view>
		<view class="goods-desc">
			<rich-text :nodes="goods.description | formatRichText"></rich-text>
		</view>
		
		<!-- <view class="goods-btn">
			<view class="goods-btn-cart" @tap="joinShopping">立即抢购</view>
		</view> -->
		
		
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
				goods: {},
				picture: [],
				goods_type_items: [],
				goods_spec_items: [],
				goods_sku_items: [],
				desc: '<div>我是一张图片</div><img src="http://47.106.148.93:8106/uploads/picture/goods/2019/12/03/55/53e9625394ff3838d2bb0c6376051d39d20d77.jpg">',
				params: {
					goods_id: '',
					sku_id: '',
					num: 1
				},
				isDialogShow: true
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
				path: '/pages/panic/index?code='+code,
				imageUrl: '../../static/images/shareImage.jpg'
			}
		},
		//下拉刷新
		onPullDownRefresh(e){
			setTimeout(function () {
				wx.stopPullDownRefresh();
			}, 500);
		},
		methods: {
			//获取商品详情
			getInfo(id) {
				wx.showLoading({title: '加载中...'})
				util.request(api.getGoodsInfo,{goods_id: id},'post').then(res=>{
					wx.hideLoading()
					if(res.code === 0) {
						this.getShareTicket()
						this.goods = res.data;
						this.picture = res.data.picture.split(',');
						this.goods_type_items = res.data.goods_type_items;
					}
				})
			},
			//跳转到商品评价
			openAssess() {
				let pages = getCurrentPages();
				let { options } = pages.pop();
				wx.navigateTo({
					url: '/pages/assess/index?id='+options.id
				})
			},
			//加入购物车
			joinShopping() {
				this.isDialogShow = true;
				// if(this.params.sku_id != "" && this.goods_spec_items.length > 0) {
				// 	this.addCart();
				// }else {
				// 	this.params.sku_id = "";
				// 	this.addCart();
				// }
				
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
		},
		filters:{
			//处理html
			formatRichText(html) {
				var richtext=  html;
				const regex = new RegExp('<img', 'gi');
				richtext= richtext.replace(regex, `<img style="max-width: 100%;margin:10rpx auto;"`);
				return richtext;
			}
		}
	}
</script>

<style>
	.container {
	  margin-bottom: 100rpx;
	}
	.mask{
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
	.mask.none{
		display: none;
	}
	.goodsimgs {
	  width: 100%;
	  height: 500rpx;
	}
	
	.goodsimgs image {
	  width: 100%;
	  height: 500rpx;
	}
	.goods-info {
	  width: 750rpx;
	  overflow: hidden;
	  background: #fff;
	  padding: 30rpx;
	  border-bottom: 1px solid #d4d4d4;
	}
	.goods-info .info_price{
		color: #ec544f;
		font-size: 32rpx;
	}
	.goods-info .info_t{
		margin-top: 10rpx;
	}
	.goods-info .info_t .info_brand{
		font-size: 20rpx;
		background: #ec544f;
		color: #fff;
		padding: 6rpx 10rpx;
		border-radius: 12rpx;
	} 
	.goods-info .info_t .info_title{
		margin-left: 10rpx;
		font-size: 30rpx;
		font-weight: bold;
	}
	.goods-type{
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		border-top: 1rpx solid #d4d4d4;
		border-bottom: 1rpx solid #d4d4d4;
		display: flex;
		justify-content: space-between;
		padding: 0 30rpx;
		line-height: 100rpx;
		margin-top: 20rpx;
		
	}
	.goods-type text{
		font-size: 28rpx;
		color: #999;
	}
	.goods-desc-title{
		width: 100%;
		margin: 20rpx auto;
		text-align: center;
	}
	.goods-desc-title .text{
		position: relative;
		display: inline-block;
	}
	.goods-desc-title .text:before{
		display: inline-block;
		width: 64rpx;
		height: 1rpx;
		top: 50%;
		background-color: #e0e0e0;
		position: absolute;
		content: '';
		left: -100rpx;
	}
	.goods-desc-title .text:after{
		display: inline-block;
		width: 64rpx;
		height: 1rpx;
		top: 50%;
		background-color: #e0e0e0;
		position: absolute;
		content: '';
		right: -100rpx;
	}
	.goods-desc {
	  width: 750rpx;
	  height: auto;
	  overflow: hidden;
	  padding: 0 20rpx;
	  margin-bottom: 50rpx;
	}
	.goods-btn{
		position: fixed;
		height: 100rpx;
		width: 100%;
		display: flex;
		border-top: 1rpx solid #d4d4d4;
		bottom: 0;
		left: 0;
		background-color: #fff;
		justify-content: space-between;
		padding: 10rpx 40rpx;
	}
	.goods-btn .goods-btn-cart{
		flex: 1;
		height: 80rpx;
		text-align: center;
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 80rpx;
		border-radius: 30rpx;
		background-image: linear-gradient(to right, #ffc706, #fe9a06);
	}
	.goods_types{
		padding: 20rpx;
	}
	.goods_types .goods_types_item{
		margin-bottom: 20rpx;
	}
	.goods_types .goods_types_item .name{
		font-weight: bold;
		font-size: 24rpx;
		color: #ec544f;
	}
	.goods_types .goods_types_item .value{
		font-size: 24rpx;
		color: #999;
		margin-left: 30rpx;
	}
	.goods-btn .goods-btn-buy{
		flex: 1;
		height: 80rpx;
		text-align: center;
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 80rpx;
		border-radius: 0 30rpx 30rpx 0;
		background-image: linear-gradient(to right, #fe7203, #fc4f03);
	}
	.goods_sku{
		width: 100%;
		height: 730rpx;
		background-color: #fff;
		border-radius: 10rpx 10rpx 0 0;
		z-index: 101;
		position: fixed;
		bottom: 0;
		left: 0;
	}
	.goods_sku .close{
		width: 60rpx;
		height: 60rpx;
		position: absolute;
		right: 20rpx;
		top: 30rpx;
	}
	.goods_sku_info{
		width: 100%;
		height: 200rpx;
		display: flex;
		margin: 30rpx 20rpx 0 20rpx;
	}
	.goods_sku_info .sku_info_img{
		width: 160rpx;
		height: 160rpx;
		border: 1px solid #d4d4d4;
		border-radius: 20rpx;
	}
	.goods_sku_info .sku_info{
		margin-left: 30rpx;
	}
	.goods_sku_info .sku_info .sku_info_price{
		color: #ec544f;
		font-weight: bold;
		font-weight: 40rpx;
		margin: 20rpx 0 10rpx 0;
	}
	.goods_sku_info .sku_info .sku_info_stoke{
		color: #999;
		font-size: 24rpx;
	}
	.goods_sku_info .sku_info .sku_info_spec{
		font-size: 26rpx;
		margin-top: 10rpx;
	}
	.sku_info_btn{
		width: 100%;
		height: 100rpx;
		border-top: 1rpx solid #d4d4d4;
	}
	.sku_info_btn button{
		width: 90%;
		height: 80rpx;
		margin-top: 10rpx;
		background-image: linear-gradient(to right, #fe7203, #fc4f03);
		border-radius: 50rpx;
	}
	.scroll-box .sku_info_box{
		padding: 20rpx;
	}
	.scroll-box .sku_info_box .sku_info_item{
		border-bottom: 1rpx solid #d4d4d4;
		margin-bottom: 20rpx;
	}
	.scroll-box .sku_info_box .sku_info_item .sku_info_item_key{
		font-size: 28rpx;
	}
	.scroll-box .sku_info_box .sku_info_item .sku_info_item_value{
		margin: 20rpx 0;
		padding-bottom: 20rpx;
	}
	.scroll-box .sku_info_box .sku_info_item .sku_info_item_value text{
		padding: 10rpx 20rpx;
		background: #f4f4f4;
		font-size: 22rpx;
		margin-right: 20rpx;
		border-radius: 5rpx;
		border: 1rpx solid #d4d4d4;
	}
	.scroll-box .sku_info_box .sku_info_item .sku_info_item_value text.active{
		color: #ec544f;
		border: 1rpx solid #ec544f;
	}
	.scroll-box .sku_info_box .sku_info_num{
		padding: 14rpx 0;
		display: flex;
		justify-content: space-between;
	}
	.scroll-box .sku_info_box .sku_info_num .sku_info_item_key{
		font-size: 28rpx;
	}
	.scroll-box .sku_info_box .sku_info_num .sku_info_item_value text{
		padding: 10rpx 26rpx;
		background: #f4f4f4;
		font-size: 26rpx;
		margin-left: 10rpx;
		border-radius: 5rpx;
		border: 1rpx solid #d4d4d4;
		color: #999;
	}
	.scroll-box .sku_info_box .sku_info_num .sku_info_item_value text.num{
		color: #333;
	}
</style>
