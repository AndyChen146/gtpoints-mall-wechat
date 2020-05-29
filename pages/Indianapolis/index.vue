<template>
	<view class="container">
		<view class="main_top">
			<!-- <image class="main_img" src="../../static/images/jfdb_bg.jpg"></image> -->
			
			<swiper class="banner" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
				<swiper-item v-for="item in navList" :key="item.id">
				<navigator :url="item.picture">
					<image :src="item.picture" background-size="cover"></image>
				</navigator>
				</swiper-item>
			</swiper>
			<view class="main_rule">
				<text class="" @tap="rulePage">活动说明 ></text>
				<navigator class="rf" url="/pages/user/lottery?id=1">我的 ></navigator>
			</view>
		</view>
		<view class="cate-nav">
			<scroll-view scroll-x="true" class="cate-nav-body" style="width: 750rpx;">
				<view  v-for="item in navList" :class="params.ap_id == item.ap_id ? 'item active' : 'item'" :key="item.ap_id" @tap="typeChange(item.ap_id,item.stime)">
					<view class="name">{{item.name}}</view>
				</view>
			</scroll-view>
		</view>
		<view class="main_box">
			<view class="main_nodata" v-if="list.length<=0">
				<image src="../../static/images/no_goods.png" class="img"></image>
				<text class="text">暂无夺宝商品记录</text>
			</view>
			<view v-else class="main_item" v-for="(item,index) in list" :key="item.goods_id" @tap="openPage(item.goods_id)">
				<image class="main_item_img" :src="dealPrcture(item.goods_images)"></image>
				<template>
					<view class="main_item_status" v-if="item.status == 1">进行中</view>
					<view class="main_item_status" v-if="item.status == 0">已结束</view>
				</template>
				<view class="main_item_info">
					<view class="main_item_title">{{item.goods_name}}</view>
					<!-- <view class="main_item_desc">SKECHERS 斯凯奇 女士新款针织款针织款针织</view> -->
					<!-- <view class="main_time">距结束：<text class="main_times">03</text>:<text class="main_times">03</text >:<text class="main_times">03</text></view>	 -->
					<view class="progress_jd">夺宝进度：{{percentage(item.goods_point,item.point_total)}}%</view>
					<progress class="main_item_progress" :percent="percentage(item.goods_point,item.point_total)" stroke-width="10" border-radius="6" active="true" duration="30" backgroundColor="#d4d4d4" activeColor="yellow"></progress>
					<view class="main_item_total">总积分：<text>{{item.goods_point}}</text></view>
				</view>
				<template>
					<view class="main_item_btn" v-if="item.status == 1" @tap.stop="dogo(item.id,item.ap_id)">立即夺宝</view>
					<view class="main_item_btn" v-else>去查看 ></view>
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
				navList: [],
				list: [],
				params: {
					ap_id: '',
					page: 1,
					size: 10
				},
				plist: [],
				stime: ''
			}
		},
		//初始化
		onLoad() {
			this.getTypeList()
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
				path: '/pages/Indianapolis/index?code='+code,
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
			//获取免费夺宝列表
			getTypeList() {
				var _self = this;
				util.request(api.getTerasList,{page: 1, size: 10},'post').then(res=>{
					if(res.code == 0) {
						this.getShareTicket()
						this.navList = res.data.list;
						this.params.ap_id = res.data.list[0].ap_id;
						//this.stime = res.data.list[0].stime;
						this.getList();
						
					}
				})
			},
			//获取对应的商品列表
			getList() {
				wx.showLoading({
					title: '加载中...'
				})
				util.request(api.getTreaGlist,this.params,'post').then(res=>{
					wx.hideLoading()
					if(res.code == 0) {
						this.list = res.data.list;
					}
				})
			},
			dealPrcture(str) {
				let newStr = str.split(',');
				return newStr[0]
			},
			//夺宝类型切换
			typeChange(type,stime) {
				this.params.ap_id = type;
				// let ntime = parseInt(new Date().getTime()/1000);
				// this.stime = util.intervalTime(stime, ntime);
				//console.log(this.stime)
				this.getList()
			},
			//计算百分比
			percentage(total,rnum) {
				return parseInt(((rnum/total)*100))
			},
			//去夺宝
			dogo(id,ap_id) {
				var _self = this;
				this.getAdList(id,ap_id);
				
				
			},
			
			//夺宝服务接口
			dogos(id,ap_id) {
				var _self = this;
				wx.showLoading({
					mask: true,
					title: '正在夺宝中...'
				})
				util.request(api.getTreasDoGo,{
					id: id,
					ap_id: ap_id
				},'post').then(res=>{
					wx.hideLoading()
					if(res.code == 0) {
						wx.showModal({
							title: '完成',
							showCancel: false,
							content: '可点击“我的”查看夺宝记录',
							success(res) {
								if(res.confirm) {
									_self.getList()
								}
							}
						})
					}else {
						wx.showToast({
							icon: 'none',
							title: res.msg
						})
					}
				})
			},
			
			//检测收货地址是否为空
			async getAdList(id,ap_id) {
				await util.request(api.getAddreList,{},'get').then(res=>{
					if(res.code == 0){
						if(res.data.list && res.data.list.length <=0) {
							 wx.showModal({
								title: '提示',
								showCancel: false,
								content: '暂无收获地址',
								confirmText: '立即前往',
								success(res) {
									if(res.confirm) {
										wx.navigateTo({
											url: '/pages/user/addr'
										})
									}
								}
							})
							return false;
						}else {
							this.dogos(id,ap_id)
						}
					}
				})
			},
			
			
			openPage(id){
				wx.navigateTo({
					url: '/pages/Indianapolis/info?id='+id
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
			},
			rulePage() {
				wx.navigateTo({
					url: '/pages/user/caption'
				})
			}
		}
	}
</script>

<style>
	.main_top{
		width: 100%;
		position: relative;
	}
	.main_rule{
		width: 100%;
		height: 80rpx;
		background-color: #fb928c;
		position: absolute;
		left: 0;
		bottom: 0;
		padding: 0 30rpx;
		display: flex;
		justify-content: space-between;
	}
	.main_rule text{
		color: #fff;
		font-size: 26rpx;
		line-height: 80rpx;
	}
	.main_rule .rf{
		color: #fff;
		font-size: 26rpx;
		line-height: 80rpx;
	}
	.main_top .banner{
		width: 100%;
		height: 480rpx;
	}
	.banner image {
	  width: 100%;
	  height: 480rpx;
	}
	.main_top .main_title{
		color: #ffffff;
		position: absolute;
		font-size: 40rpx;
		top: 120rpx;
		left: 100rpx;
		font-weight: bold;
	}
	.cate-nav{
		border-bottom: 1rpx solid #d6d6d6;
	}
	.cate-nav-body{
	    height: 84rpx;
	    white-space: nowrap;   
	    background: #fff;
	    border-top: 1rpx solid rgba(0,0,0,.15);
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
	.main_box{
		padding: 0 20rpx;
	}
	.main_item{
		width: 100%;
		height: 240rpx;
		background-color: #ffffff;
		margin-top: 20rpx;
		position: relative;
		padding: 10rpx;
		border-radius: 8rpx;
		clear: both;
	}
	.main_item .main_item_img{
		width: 240rpx;
		height: 220rpx;
		float: left;
		border-radius: 8rpx;
	}
	.main_item .main_item_status{
		width: 240rpx;
		height: 60rpx;
		position: absolute;
		bottom: 10rpx;
		left: 10rpx;
		color: #fff;
		font-size: 24rpx;
		line-height: 60rpx;
		text-align: center;
		background-color: rgba(255,153,153,.5);
		border-radius: 0 0 10rpx 10rpx;
	}
	.main_nodata{
		padding-top: 100rpx;
		text-align: center;
		
	}
	.main_nodata .img{
		width: 100rpx;
		height: 100rpx;
		display: block;
		margin: 0 auto 20rpx auto;
	}
	.main_nodata .text{
		text-align: center;
		font-size: 24rpx;
		color: #999;
	}
	.main_item .main_item_info{
		margin-left: 20rpx;
		float: left;
		width: 416rpx;
	}
	.main_item .main_item_info .main_item_title{
		font-size: 30rpx;
		height: 40rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

	}
	.main_item .main_item_info .main_time{
		font-size: 20rpx;
		margin-bottom: 10rpx;
	}
	.main_item .main_item_info .main_item_total{
		font-size: 26rpx;
		margin-top: 8rpx;
	}
	.main_item .main_item_info .main_item_total text{
		color: red;
		font-weight: bold;
	}
	.main_item .main_item_info .main_time .main_times{
		background-color: #666;
		color: #fff;
		font-size: 20rpx;
		padding: 3rpx 6rpx;
		border-radius: 4rpx;
		margin:10rpx;
	}
	.main_item .main_item_info .main_item_desc{
		font-size: 24rpx;
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		line-clamp: 1;
		color: #999;
		padding-right: 10rpx;
	}
	.main_item .main_item_info .progress_jd{
		width: 400rpx;
		text-align: right;
		margin: 20rpx 0 10rpx 0;
		color: #999;
		font-size: 24rpx;
	}
	.main_item .main_item_info .main_item_progress{
		width: 400rpx;
		height: 30rpx;
		border-radius: 10rpx;
	}
	.main_item .main_item_btn{
		position: absolute;
		cursor: pointer;
		width: 140rpx;
		height: 50rpx;
		background-color: red;
		bottom: 20rpx;
		right: 20rpx;
		color: #ffffff;
		font-size: 26rpx;
		line-height: 50rpx;
		text-align: center;
		border-radius: 30rpx;
	}
</style>
