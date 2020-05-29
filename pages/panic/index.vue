<template>
	<view class="container">
		<view class="main_top">
			<!-- <image class="main_img" src="../../static/images/mfqg_bg.jpg"></image> -->
			<swiper class="banner" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
				<swiper-item v-for="item in navList" :key="item.id">
				<navigator :url="item.picture">
					<image :src="item.picture" background-size="cover"></image>
				</navigator>
				</swiper-item>
			</swiper>
			<view class="main_rule">
				<text class="" @tap="ruleDialog">活动说明 ></text>
				<navigator class="rf" url="/pages/user/lottery?id=2">我的 ></navigator>
			</view>
		</view>
		<view class="cate-nav">
			<scroll-view scroll-x="true" class="cate-nav-body" style="width: 750rpx;">
				<view  v-for="item in navList" :class="params.af_id == item.af_id ? 'item active' : 'item'" :key="item.af_id" @tap="typeChange(item.af_id,item.stime)">
					<view class="name">{{item.name}}</view>
				</view>
			</scroll-view>
		</view>
		<view class="main_box">
			<view class="main_nodata" v-if="list.length<=0">
				<image src="../../static/images/no_goods.png" class="img"></image>
				<text class="text">暂无抢购商品记录</text>
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
					<view class="progress_jd">抢购进度：{{percentage(item.total,item.rush_num)}}%</view>
					<progress class="main_item_progress" :percent="percentage(item.total,item.rush_num)" stroke-width="10" border-radius="6" active="true" duration="30" backgroundColor="pink" activeColor="red"></progress>
					<view class="main_item_total">总数：<text>{{item.total}}</text></view>
				</view>
				<template>
					<view class="main_item_btn" v-if="item.status == 1" @tap.stop="dogo(item.id,item.af_id)">立即抢购</view>
					<view class="main_item_btn" v-else>去查看 ></view>
				</template>
			</view>
		</view>
		
		<view class="rule" v-if="ruleDialogs">
			<image src="../../static/images/close.png" class="close" @click="close"></image>
			<view class="rule-title">免费抢购说明</view>
			<view class="rule_contect">
				<scroll-view scroll-y="true"  style="height: 300rpx;">
					<text>1、本活动只需在当天转发微信与朋友圈便可取得免费抢购资格。</text>
					<text class="">
						2、系统将放入不确定数量的物品免费开抢，活动开始时，在规定时间内，只要您手快抢到，将免费包邮赠送给您！
					</text>
					<text>
						3、本商城所有物品包邮！  所有活动真实有效！
					</text>
				</scroll-view>
			</view>
		</view>
		<view class="mask" v-if="ruleDialogs"></view>
		
		<view class="share" @tap="closeShare"  v-if="shareDialog">
			<image src="../../static/images/share.png" mode=""></image>
		</view>
		<view class="share_mask" @tap="closeShare" v-if="shareDialog"></view>
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
					af_id: '',
					page: 1,
					size: 10
				},
				stime: '',
				ruleDialogs: false,
				shareDialog: false
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
				path: '/pages/panic/index?code='+code,
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
			//获取免费抢购列表
			getTypeList() {
				util.request(api.getZeroBlist,{page: 1, size: 10},'post').then(res=>{
					if(res.code == 0) {
						this.getShareTicket()
						this.navList = res.data.list;
						this.params.af_id = res.data.list[0].af_id;
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
				util.request(api.getZeroGlist,this.params,'post').then(res=>{
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
			//抢购类型切换
			typeChange(type,stime) {
				this.params.af_id = type;
				// let ntime = parseInt(new Date().getTime()/1000);
				// this.stime = util.intervalTime(stime, ntime);
				//console.log(this.stime)
				this.getList()
			},
			//活动规则弹框
			ruleDialog() {
				this.ruleDialogs = true;
			},
			close() {
				this.ruleDialogs = false;
			},
			closeShare() {
				this.shareDialog = false;
			},
			//计算百分比
			percentage(total,rnum) {
				return parseInt(((rnum/total)*100))
			},
			//去抢购
			dogo(id,af_id) {
				this.getAdList(id,af_id);
			},
			dogos(id,af_id) {
				var _self = this;
				wx.showLoading({
					mask: true,
					title: '正在抢购中...'
				})
				util.request(api.getZeroGdoGo,{
					id: id,
					af_id: af_id
				},'post').then(res=>{
					wx.hideLoading()
					if(res.code == 0) {
						wx.showModal({
							title: '完成',
							showCancel: false,
							content: '可点击“我的”查看抢购记录',
							success(res) {
								if(res.confirm) {
									_self.getList()
								}
							}
						})
					}else if(res.code == 413){
						_self.shareDialog = true;
					}else{
						wx.showToast({
							icon: 'none',
							title: res.msg
						})
					}
				})
			},
			//检测收货地址是否为空
			async getAdList(id,af_id) {
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
							this.dogos(id,af_id)
						}
					}
				})
			},
			openPage(id){
				wx.navigateTo({
					url: '/pages/panic/info?id='+id
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
	.rule{
		width: 90%;
		height: auto;
		border-radius: 10rpx;
		position: fixed;
		top: 200rpx;
		left: 5%;
		background-color: #fff;
		z-index: 101;
		
	}
	.share{
		width: 80%;
		height: auto;
		border-radius: 10rpx;
		position: fixed;
		top: 20rpx;
		right: 5%;
		z-index: 102;
	}
	.share image{
		width: 100%;
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
	.rule .rule_contect text{
		display: block;
		font-size: 26rpx;
		line-height: 40rpx;
		margin-bottom: 20rpx;
	}
	.mask,.share_mask{
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
	.main_top .banner{
		width: 100%;
		height: 480rpx;
	}
	.banner image {
	  width: 100%;
	  height: 480rpx;
	}
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
	.main_top .main_img{
		width: 100%;
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
