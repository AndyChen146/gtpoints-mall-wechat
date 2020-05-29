<template>
	<view class="container">
		<view class="search">
			<image class="icon"></image>
			<input type="text" class="input" :value="keyword" placeholder="请输入商品名称" @input="searchInt" @confirm="searchConfirm"/>
		</view>
		<swiper class="banner" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
			<swiper-item v-for="item in banner" :key="item.id">
			<navigator :url="item.url">
				<image :src="item.content" background-size="cover"></image>
			</navigator>
			</swiper-item>
		</swiper>
		<view class="m-menu">
			<navigator class="item" hover-class="none" v-if="index<6" v-for="(item,index) in channel" :url="'/pages/category/category?id='+item.category_id"  :key="item.category_id">
				<image :src="item.picture" background-size="cover"></image>
				<text>{{item.name}}</text>
			</navigator>
			<!-- <navigator class="item" url="/pages/category/category" hover-class="none">
				<image src="../../static/images/all.png" background-size="cover"></image>
				<text>全部</text>
			</navigator> -->
		</view>
		<view class="hot_title">热门商品</view>
		<view class="hot">
			<view class="hot-item" v-for="(item,index) in hotlist" :key="item.goods_id">
				<navigator :url="'../goods/index?id='+item.goods_id" hover-class="none">
					<image :src="dealPrcture(item.picture)" class="img"></image>
					<view class="right">
						<view class="text">
							<text class="name">{{item.title}}</text>
							<text class="desc">{{item.title}}</text>
							<text class="price">￥{{item.price}}</text>
						</view>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
const api = require('../../config/api.js');
const util = require('../../utils/util.js')
const user = require("../../services/user.js")
//获取应用实例
const app = getApp()
export default {
	name: '',
	data() {
		return {
			banner: [],
			channel: [],
			searchIcon: true,
			hotlist: [],
			keyword: ""
		}	
	},
	onLoad() {
		this.getAdList();
	},
	// 页面显示
	onShow() {
		
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
		//初始化banner
		getAdList() {
			util.login().then(res => {
				return util.request(api.AdBannerList, { code: 'Home_Top' }, 'post').then(res => {
					if(res.code === 0) {
						this.banner = res.data;
						this.getCateList();
						this.getHotList();
						this.getShareTicket()
					}
				})
			})
		},
		// 初始化分类
		getCateList() {
			util.request(api.categoryList,{}, 'post').then(res=>{
				if(res.code === 0) {
					this.channel = res.data.list;
				}
			})
		},
		//获取热门商品
		getHotList() {
			util.request(api.HotGoodsList,{total: 10},'post').then(res=>{
				if(res.code === 0) {
					this.hotlist = res.data;
				}
			})
		},
		dealPrcture(str) {
			let newStr = str.split(',');
			return newStr[0]
		},
		//input 聚焦
		searchInt(e) {
			this.keyword = e.detail.value;
		},
		searchConfirm(e) {
			wx.navigateTo({
				url: '/pages/goodlist/list?keyword='+e.detail.value
			})
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
		
	}
}
</script>

<style>
	.search {
	  height: 88rpx;
	  width: 100%;
	  padding: 0 30rpx;
	  background: #fff;
	  display: flex;
	  align-items: center;
	  position: relative;
	}
	
	.search .input {
	  width: 690rpx;
	  height: 56rpx;
	  background: #ededed;
	  border-radius: 8rpx;
	  display: flex;
	  padding-left: 80rpx;
	}
	
	.search .icon {
	  background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/search2-2fb94833aa.png) center no-repeat;
	  background-size: 100%;
	  width: 28rpx;
	  height: 28rpx;
	  position: absolute;
	  left: 70rpx;
	}
	
	.search .txt {
	  height: 42rpx;
	  line-height: 42rpx;
	  color: #666;
	  padding-left: 10rpx;
	  font-size: 30rpx;
	}
	
	.banner {
	  width: 750rpx;
	  height: 417rpx;
	}
	
	.banner image {
	  width: 100%;
	  height: 417rpx;
	}
	.m-menu {
	  display: flex;
	  height: 181rpx;
	  width: 750rpx;
	  flex-flow: row nowrap;
	  align-items: center;
	  justify-content: space-between;
	  background-color: #fff;
	}
	
	.m-menu .item {
	  flex: 1;
	  display: block;
	  padding: 20rpx 0;
	}
	
	.m-menu image {
	  display: block;
	  width: 58rpx;
	  height: 58rpx;
	  margin: 0 auto;
	  margin-bottom: 12rpx;
	}
	
	.m-menu text {
	  display: block;
	  font-size: 24rpx;
	  text-align: center;
	  margin: 0 auto;
	  line-height: 1;
	  color: #333;
	}
.hot{
	width: 100%;
	height: auto;
	overflow: hidden;
	position: relative;
	background: #fff;
	padding: 30rpx 0;
}
.hot_title{
	height: 80rpx;
	line-height: 80rpx;
	padding: 0 30rpx;
	color: red;
	font-size: 32rpx;
	font-weight: bold;
}
.hot .hot-item{
	float: left;
	width: 50%;
	margin-bottom: 20rpx;
	text-align: center;
	
}
.hot .hot-item .img{
	border-radius: 6rpx;
	width: 302rpx;
	height: 302rpx;
}
.hot .hot-item .right{
	text-align: left;
	margin-left: 32rpx;
}
.hot .hot-item .right .name{
	width: 94%;
	text-align: left;
	display: -webkit-box;
	overflow: hidden;
	font-size: 30rpx;
	color: #333;
	line-height: 40rpx;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.hot .hot-item .right .desc{
	width: 94%;
	  display: block;
	  color: #999;
	  line-height: 40rpx;
	  height: 40rpx;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	  font-size: 25rpx;
	  
	  

}
.hot .hot-item .right .price{
	display: block;
	line-height: 30rpx;
	font-size: 30rpx;
	color: #ec544f;
}
</style>
