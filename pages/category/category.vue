<template>
	<view class="container">
		<view class="wrap-box" >
			<view class="right-box absolute scroll-box" ref="rightView">
				<view class="item" v-for="(target, index) in navList" :key="index">
					<view class="title">
						<text class="text">{{target.name}}</text>
					</view>
					<view class="shop-item-wrap clear">
						<view class="shop-item" v-for="(shop,vindex) in target.child" :key="shop.category_id" @tap="jumpToTarget(shop.category_id)" :data-id="shop.category_id" >
							<view>
								<image class="img" :src="shop.picture" mode=""></image>
							</view>
							<view class="nam">{{shop.name}}</view>
						</view>
					</view>
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
			navList: [],
			active: 0,
			offset: []
		}
	},
	//初始化
	onLoad() {
		this.getCateList();
		//this.getHeightItem();
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
		}, 1000);
	},
	methods: {
		// 初始化分类
		getCateList() {
			util.request(api.categoryList,{}, 'post').then(res=>{
				if(res.code === 0) {
					this.navList = res.data.list;
				}
			})
		},
		//初始化获取右侧每个高度
		getHeightItem() {
			// var scrollDB = {
			// 	left: DB.getItemOnce('classification-left-scrollTop').toNumber(),
			// 	right: DB.getItemOnce('classification-right-scrollTop').toNumber()
			// }
			// setTimeout(()=>{
			// 	_.forEach(this.$refs.rightView.querySelectorAll('.item'), (value, key)=>{
			// 		this.offset.push(value.offsetHeight*key)
			// 	})
			// 	var mySort = this.offset
			// 	this.$refs.rightView.addEventListener('scroll', ()=>{
			// 		var eScrollTop = this.$refs.rightView.scrollTop
			// 		for(var indexer = 0; indexer<mySort.length; indexer++) {
			// 			if(eScrollTop > mySort[indexer]) {
			// 				this.active = indexer
			// 			}
			// 		}
			// 	})
			// 	// setTimeout(()=>{
			// 	// 	this.$refs.left.scrollTop = scrollDB.left
			// 	// 	this.$refs.rightView.scrollTop = scrollDB.right
			// 	// },10)
			// },100)
			
			
			
		},
		
		//点击跳转
		jumpToTarget(cid) {
			wx.navigateTo({
				url: "/pages/goodlist/list?cid="+cid
			})
			// var scrollTop = this.offset[index];
			// console.log(this.offset)
			// this.$refs.rightView.scrollTop = scrollTop;
			// setTimeout(()=>{
			// 	this.active = index;
			// },10)
		},
		//传递分享code进去
		setCode(code) {
			util.request(api.setShareInfo,{code: code},'post').then(res=>{})
		}
		
	}
}
</script>

<style>
.wrap-box{
	width: 100%;
}
.absolute{
	position: absolute;
}
.scroll-box{
	-webkit-overflow-scrolling : touch;
	overflow-y: auto;
}
.wrap-box .left-menu{
	width: 140rpx;
	left: 0;
	top: 0;
	bottom: 0;
	border-right: 1px solid #efefef;
	overflow-x: hidden;	
}
.wrap-box .left-menu .item{
	margin-top: 50rpx;
	text-align: center;
	-webkit-transition: all .1s ease;
	transition: all .1s ease;
}
.wrap-box .left-menu .item.active{
	color: #ec544f;
	transform: scale(1.2);
}
.wrap-box .right-box{
	left: 0rpx;
	top: 0rpx;
	right: 0rpx;
	bottom: 0rpx;
	background-color: #fff;
}
.wrap-box .right-box .item{
	padding-top: 50rpx;
}
.wrap-box .right-box .title{
	text-align: center;
	padding-bottom: 20rpx;
}
.wrap-box .right-box .title .text{
	position: relative;
	display: inline-block;
}
.wrap-box .right-box .title .text:before{
	display: inline-block;
	width: 64rpx;
	height: 1rpx;
	top: 50%;
	background-color: #e0e0e0;
	position: absolute;
	content: '';
	left: -100rpx;
}
.wrap-box .right-box .title .text:after{
	display: inline-block;
	width: 64rpx;
	height: 1rpx;
	top: 50%;
	background-color: #e0e0e0;
	position: absolute;
	content: '';
	right: -100rpx;
}
.wrap-box .right-box .shop-item-wrap .shop-item{
	text-align: center;
	float: left;
	width: 33.3%;
	color: #757575;
	margin-bottom: 20rpx;
	font-size: 24rpx;
}
.wrap-box .right-box .shop-item-wrap .shop-item .img{
	padding-bottom: 20rpx;
	width: 100rpx;
	height: 100rpx;
}

</style>
