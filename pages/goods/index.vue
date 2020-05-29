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
		<view class="goods-type" @tap="clicktype" v-if="goods_spec_items.length>0">
			<text class="left">参数选择</text>
			<text class="right">></text>
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
		
		<view class="goods-btn">
			<navigator url="/pages/cart/cart" class="cart-goods" hover-class="none" open-type="switchTab">
				<text class="num" v-if="cart_num>0">{{cart_num}}</text>
				<image src="/static/images/ic_menu_shoping_nor.png" class="cart-goods-img" mode=""></image>
				<text class="cart-goods-text">购物车</text>
			</navigator>
			<view class="goods-btn-cart" @tap="dialogs(1)">加入购物车</view>
			<view class="goods-btn-buy" @tap="dialogs(2)">立即购买</view>
		</view>
		
		<view class="goods_sku" v-if="isDialogShow">
			<image src="../../static/images/close.png" class="close" @click="close"></image>
			<view class="goods_sku_info">
				<template>
					<image v-if="sku_info.picture ==''" :src="picture[0]" class="sku_info_img"></image>
					<image v-else :src="sku_info.picture" class="sku_info_img"></image>
				</template>
				<template>
					<view class="sku_info" v-if="goods_spec_items.length>0">
						<view class="sku_info_price">¥{{sku_info.price}}</view>
						<view class="sku_info_stoke">库存：{{sku_info.stock}}</view>
						<view class="sku_info_spec">选择：{{sku_info.title}}</view>
					</view>
					<view class="sku_info" v-else>
						<view class="sku_info_price">¥{{goods.price}}</view>
						<view class="sku_info_stoke">库存：{{goods.stock}}</view>
						<view class="sku_info_spec"></view>
					</view>
				</template>
				
				
			</view>
			<scroll-view scroll-y="true" class="scroll-box" style="height: 400rpx;">
				<view class="sku_info_box" >
					<template v-if="goods_spec_items.length>0">
						<view class="sku_info_item" v-for="(item,index) in goods_spec_items" v-if="index==0" :key="index">
							<view class="sku_info_item_key">{{item.name}}</view>
							<view class="sku_info_item_value">
								<text v-for="(v,vindex) in item.value" :class="activeClass0  == vindex ? 'active' : ''" @tap="changeSku(item,v,vindex,index)" :key="vindex">{{v.spec_value_name}}</text>
							</view>
						</view>
						<view class="sku_info_item" v-for="(item,index) in goods_spec_items" v-if="index==1" :key="index">
							<view class="sku_info_item_key">{{item.name}}</view>
							<view class="sku_info_item_value">
								<text v-for="(v,vindex) in item.value" :class="activeClass1  == vindex ? 'active' : ''" @tap="changeSku(item,v,vindex,index)" :key="vindex">{{v.spec_value_name}}</text>
							</view>
						</view>
						<view class="sku_info_item" v-for="(item,index) in goods_spec_items" v-if="index==2" :key="index">
							<view class="sku_info_item_key">{{item.name}}</view>
							<view class="sku_info_item_value">
								<text v-for="(v,vindex) in item.value" :class="activeClass2  == vindex ? 'active' : ''" @tap="changeSku(item,v,vindex,index)" :key="vindex">{{v.spec_value_name}}</text>
							</view>
						</view>
					</template>
					
					<view class="sku_info_num">
						<view class="sku_info_item_key">购买数量</view>
						<view class="sku_info_item_value">
							<text class="" @tap="jianNum">-</text>
							<text class="num">{{params.num}}</text>
							<text class="" @tap="addNum">+</text>
						</view>
					</view>
				</view>
			</scroll-view>
			
			<view class="sku_info_btn">
				<block v-if="is_change">
					<button type="primary" @tap="submit">确定</button>
				</block>
				<block v-else>
					<view class="goods-btn-cart" @tap="joinShop">加入购物车</view>
					<view class="goods-btn-buy" @tap="buyShop">立即购买</view>
				</block>
			</view>
			
		</view>
		<view :class="isDialogShow ? 'mask':'mask none' " ></view>
		
		
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
				desc: '',
				params: {
					goods_id: '',
					sku_id: '',
					num: 1
				},
				isDialogShow: false,
				activeClass0: -1,
				activeClass1: -1,
				activeClass2: -1,
				sku_ids: "",
				sku_id0: "",
				sku_id1: "",
				sku_id2: "",
				sku_info: {
					picture: "",
					price: "0.00",
					sku_id: "",
					stock: 0,
					title: ''
				},
				is_add: 1,
				is_change: true,
				cart_num: 0
			}
		},
		//初始化
		onLoad() {
			let pages = getCurrentPages();
			let { options } = pages.pop();
			if(options.id) {
				this.params.goods_id = options.id;
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
				path: '/pages/home/home?code='+code,
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
						this.getCartList();
						this.goods = res.data;
						this.picture = res.data.picture.split(',');
						this.goods_type_items = res.data.goods_type_items;
						this.goods_sku_items = res.data.goods_sku_items;
						this.goods_spec_items = res.data.goods_spec_items;
					}
				})
			},
			//获取购物车数量
			getCartList() {
				util.request(api.getCartLists,{status: 0},'post').then(res=>{
					if(res.code == 0) {
						this.cart_num = res.data.num;
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
			//参数选择弹框
			clicktype() {
				this.isDialogShow = true;
				this.is_change = false;
			},
			//加入购物车
			dialogs(index) {
				this.is_add = index;
				this.isDialogShow = true;
				this.is_change = true;
				
			},
			
			close() {
				this.isDialogShow = false;
			},
			//sku选择
			changeSku(item,v,vindex,index) {
				if(index == 0) {
					this.activeClass0 = vindex;
					this.sku_id0 = item.spec_id+":"+v.spec_value_id
					if(this.sku_id1 != "" && this.sku_id2 == "") {
						this.sku_ids = this.sku_id0+";"+this.sku_id1;
					}else if(this.sku_id1 != "" && this.sku_id2 != ""){
						this.sku_ids = this.sku_id0+";"+this.sku_id1+";"+this.sku_id2;
					}else {
						this.sku_ids = this.sku_id0;
					}
					
				}else if(index == 1){
					this.activeClass1 = vindex;
					this.sku_id1 = item.spec_id+":"+v.spec_value_id;
					if(this.sku_id2 != "") {
						this.sku_ids = this.sku_id0+";"+this.sku_id1+";"+this.sku_id2;
					}else {
						this.sku_ids = this.sku_id0+";"+this.sku_id1;
					}
				}else if(index == 2){
					this.activeClass2 = vindex;
					this.sku_id2 = item.spec_id+":"+v.spec_value_id;
					this.sku_ids = this.sku_id0+";"+this.sku_id1+";"+this.sku_id2;
				}
				this.goods_sku_items.forEach(item=>{
					if(this.sku_ids == item.attr_value_items) {
						this.sku_info.picture = item.picture;
						this.sku_info.price = item.price;
						this.sku_info.sku_id = item.sku_id;
						this.sku_info.title = item.sku_name;
						this.sku_info.stock = item.stock;
					}
				})
			},
			//数量减
			jianNum() {
				if(this.params.num == 1) {
					return false;
				}
				this.params.num-- ;
			},
			//数量加
			addNum() {
				if(this.params.num == 999) {
					return false;
				}
				this.params.num++ ;
			},
			//从选择中加入购物车
			joinShop() {
				if(this.goods_spec_items.length>0 && this.sku_info.sku_id == "") {
					return wx.showToast({
						icon: 'none',
						title:'请选择sku参数'
					})
				}
				this.params.sku_id = this.sku_info.sku_id;
				this.addCart()
			},
			//从选择中购买
			buyShop() {
				if(this.goods_spec_items.length>0 && this.sku_info.sku_id == "") {
					return wx.showToast({
						icon: 'none',
						title:'请选择sku参数'
					})
				}
				this.params.sku_id = this.sku_info.sku_id;
				this.addCartPage();
				
			},
			//提交
			submit() {
				if(this.goods_spec_items.length>0 && this.sku_info.sku_id == "") {
					return wx.showToast({
						icon: 'none',
						title:'请选择sku参数'
					})
				}
				this.params.sku_id = this.sku_info.sku_id;
				
				if(this.is_add === 1) {
					//走加入购物车
					this.addCart();
				}else {
					//走立即购买
					this.addCartPage();
				}
			},
			
			addCartPage() {
				wx.showLoading({
					title: '提交中....',
					mask: true
				})
				util.request(api.addGoodsCart, this.params,'post').then(res=>{
					wx.hideLoading()
					if(res.code == 0) {
						wx.reLaunch({
							url: '/pages/cart/cart'
						})
					}else {
						wx.showToast({
							icon: 'none',
							title: res.msg
						})
					}
				})
			},
			
			
			//加入购物车走服务端
			addCart() {
				wx.showLoading({
					title: '提交中....',
					mask: true
				})
				
				util.request(api.addGoodsCart, this.params,'post').then(res=>{
					wx.hideLoading()
					if(res.code == 0) {
						wx.showToast({
							title: '加入购物车成功'
						})
						this.isDialogShow = false;
					}else {
						wx.showToast({
							icon: 'none',
							title: res.msg
						})
					}
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
				if(regex) {
					richtext= richtext.replace(regex, `<img style="max-width: 100%;margin:10rpx auto;"`);
				}
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
	.goods-btn .cart-goods{
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
		position: relative;
	}
	.goods-btn .cart-goods .num{
		position: absolute;
		width: 20rpx;
		height: 20rpx;
		top: 0rpx;
		right: 10rpx;
		font-size: 24rpx;
		color: #E64340;
		text-align: center;
		line-height: 20rpx;
		z-index: 10;
		font-weight: bold;
	}
	.goods-btn .cart-goods .cart-goods-img{
		width: 50rpx;
		height: 50rpx;
		display: block;
	}
	.goods-btn .cart-goods .cart-goods-text{
		font-size: 20rpx;
		color: #999;

	}
	.goods-btn .goods-btn-cart{
		flex: 1;
		height: 80rpx;
		text-align: center;
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 80rpx;
		border-radius: 30rpx 0 0 30rpx;
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
		width: 460rpx;
	}
	.sku_info_btn{
		width: 100%;
		height: 100rpx;
		display: flex;
		border-top: 1rpx solid #d4d4d4;
	}
	.sku_info_btn .goods-btn-cart{
		width: 40%;
		height: 80rpx;
		text-align: center;
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 80rpx;
		border-radius: 30rpx 0 0 30rpx;
		background-image: linear-gradient(to right, #ffc706, #fe9a06);
		margin-top: 10rpx;
		margin-left: 10%;
	}
	.sku_info_btn .goods-btn-buy{
		width: 40%;
		height: 80rpx;
		text-align: center;
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 80rpx;
		border-radius: 0 30rpx 30rpx 0;
		background-image: linear-gradient(to right, #fe7203, #fc4f03);
		margin-top: 10rpx;
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
