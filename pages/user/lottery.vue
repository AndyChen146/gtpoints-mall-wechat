<template>
	<view class="container">
		<view class="tab">
			<view :class="currage == 1 ? 'tab_item active' : 'tab_item'" @tap="changeTab(1)">积分夺宝</view>
			<view :class="currage == 2 ? 'tab_item active' : 'tab_item'" @tap="changeTab(2)">免费抢购</view>
		</view>
		<view class="no_lottery" v-if="list.length <= 0">
			<image src="../../static/images/no_leottery.png" class="img"></image>
			<text class="wz">暂无奖品信息</text>
		</view>
		<view class="lottery" v-if="list.length>0">
			<view class="main_item" v-for="(item,index) in list" v-if="item.ap_id" :key="item.goods_id" @tap="openPage1(item.goods_id)">
				<template>
					<image class="main_item_img" v-if="item.goods_images == ''" src="../../static/images/default.svg"></image>
					<image class="main_item_img" v-else :src="dealPrcture(item.goods_images)"></image>
				</template>
				<view class="main_item_info">
					<view class="main_item_title">{{item.goods_name}}</view>
					<view class="progress_jd">参与积分：{{item.point}}</view>
					<view class="progress_jd">参与时间：{{item.create_time | fromDateTime}}</view>
					<view class="main_item_total">已使用积分：<text>{{item.point_total}}</text></view>
					<view class="main_item_total">商品总积分：<text>{{item.goods_point}}</text></view>
				</view>
				<template>				
					<view hover-class="none" class="main_item_btn" v-if="item.is_lucky == 1 && item.is_redemption == 0" @tap.stop="dogo2(item.id,item.ap_id)">立即领取</view>
					<view hover-class="none" class="main_item_btn nostring" v-if="item.is_lucky == 1 && item.is_redemption == 1" >已领取</view>
					<view hover-class="none" class="main_item_btn nostring" v-else>未中奖</view>
				</template>
			</view>
			<view class="main_item" v-for="(item,index) in list" v-if="item.af_id" :key="item.goods_id" @tap="openPage2(item.goods_id)">
				<template>
					<image class="main_item_img" v-if="item.goods_images == ''" src="../../static/images/default.svg"></image>
					<image class="main_item_img" v-else :src="dealPrcture(item.goods_images)"></image>
				</template>
				<view class="main_item_info">
					<view class="main_item_title">{{item.goods_name}}</view>
					<view class="progress_jd">抢购时间：{{item.create_time | fromDateTime}}</view>
					<!-- <view class="main_item_total">总数量：<text>{{item.num}}</text></view> -->
				</view>
				<template>
					<view hover-class="none" class="main_item_btn" v-if="item.is_redemption == 0" @tap.stop="dogo2(item.id,item.af_id)">立即领取</view>
					<view hover-class="none" class="main_item_btn nostring" v-if="item.is_redemption == 1" >已领取</view>
				</template>
			</view>
		</view>
	
		<view class="address" v-if="isDialogShow">
			<image src="../../static/images/close.png" class="close" @click="close"></image>
			<view class="address-box">
				<view class="address-item" @tap="selectAddress" v-if="checkedAddress.addr_id > 0">
					<view class="l">
						<text class="name">{{checkedAddress.consignee}}</text>
						<text class="default" v-if="checkedAddress.is_default === 1">默认</text>
					</view>
					<view class="m">
						<text class="mobile">{{checkedAddress.mobile}}</text>
						<text class="address_desc">{{checkedAddress.address}}</text>
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
			<view class="remark">
				<input type="textarea" @input="remark_desc" placeholder="请输入备注信息" />
			</view>
			<view class="btn" @tap="orderLottery" >立即领取</view>
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
		data() {
			return {
				checkedAddress: {},
				addrList: [],
				currage: 1,
				list: [],
				isDialogShow: false,
				active_id: '',
				remark: ''
			}
		},
		//初始化
		onLoad() {
			// let pages = getCurrentPages();
			// let { options } = pages.pop();
			// if(options.id) {
			// 	this.currage = options.id;
			// 	if(this.currage == 1) {
			// 		this.getTreaList();
			// 	}else if(this.currage == 2) {
			// 		this.getZeroList();
			// 	}
			// }
			this.getTreaList();
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
			//获取夺宝记录
			getTreaList() {
				wx.showLoading()
				util.request(api.getTreaRecordList,{page: 1,size:200},'post').then(res=>{
					wx.hideLoading()
					if(res.code == 0) {
						this.list = res.data.list;
					}
				})
			},
			//tab切换
			changeTab(index) {
				if(index == this.currage) {
					return false;
				}else {
					this.currage = index;
					if(index == 1) {
						this.getTreaList()
					}else {
						this.getZeroList()
					}
				}	
			},
			//获取免费抢购记录
			getZeroList() {
				wx.showLoading()
				util.request(api.getZeroRecordList,{page: 1,size:200},'post').then(res=>{
					wx.hideLoading()
					if(res.code == 0) {
						this.list = res.data.list;
					}
				})
			},
			//选择收货地址
			selectAddress() {
				wx.navigateTo({
					url: '/pages/lottery/addr'
				})
			},
			//获取remark信息
			remark_desc(e) {
				this.remark = e.detail.value;
			},
			// 跳转到收货地址
			addAddress() {
				wx.navigateTo({
					url: '/pages/lottery/addr'
				})
			},
			//立即领取
			orderLottery() {
				let id = this.active_id;
				let remark = this.remark;
				console.log(this.currage)
				if(this.currage == 1) {
					//this.getTreaOrder(id, remark)  //积分夺宝
				}else if(this.currage == 2) {
					this.getZeroOrder(id, remark)  //免费抢购
				}
				
				
			},
			//跳转
			openPage1(id) {
				wx.navigateTo({
					url: '/pages/Indianapolis/info?id='+id
				})
			},
			openPage2(id) {
				wx.navigateTo({
					url: '/pages/panic/info?id='+id
				})
			},
			//立即领取 积分夺宝
			dogo1(id,ap_id) {
				this.isDialogShow = true;
				this.active_id = id;
				this.getAddrList();
			},
			 
			//ajax 立即领取 积分夺宝
			getTreaOrder(id, remark) {
				var _self = this;
				wx.showLoading({
					mask: true
				})
				util.request(api.getTreaOrder, {id: id, order_remark: remark},'post').then(res=>{
					wx.hideLoading()
					if(res.code == 0) {
						wx.showModal({
							title: '领取成功',
							showCancel: false,
							content: '3-7天将收到，请保持电话畅通！',
							success(res) {
								if(res.confirm) {
									_self.isDialogShow = false;
									_self.getTreaList()
								}
							}
						})
					}
				})
			},
			
			//立即领取 免费抢购
			dogo2(id,af_id) {
				this.isDialogShow = true;
				this.active_id = id;
				this.getAddrList();
			},
			// ajax 立即领取 免费抢购
			getZeroOrder(id, remark) {
				var _self = this;
				wx.showLoading({
					mask: true
				})
				util.request(api.getZeroOrder, {id: id, order_remark: remark},'post').then(res=>{
					wx.hideLoading()
					if(res.code == 0) {
						wx.showModal({
							title: '领取成功',
							showCancel: false,
							content: '3-7天将收到，请保持电话畅通！',
							success(res) {
								if(res.confirm) {
									_self.isDialogShow = false;
									_self.getZeroList()
								}
							}
						})
					}
				})
			},
			
			dealPrcture(str) {
				let newStr = str.split(',');
				return newStr[0]
			},
			close() {
				this.isDialogShow = false;
			},
			//传递分享code进去
			setCode(code) {
				util.request(api.setShareInfo,{code: code},'post').then(res=>{})
			}
			
		},
		filters:{
			fromDateTime(times) {
				return util.formatTime(times)
			}
		}
	}
</script>

<style>
	.tab{
		width: 100%;
		height: 100rpx;
		background-color: #ec544f;
		display: flex;
	}
	.tab_item{
		width: 50%;
		font-size: 28rpx;
		line-height: 100rpx;
		color: #fff;
		text-align: center;
	}
	.tab_item.active{
		font-weight: bold;
		font-size: 32rpx;
		color: #ffedb3;
	}
	.lottery{
		margin-bottom: 40rpx;
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
		border-radius: 8rpx;
		position: absolute;
		left: 10rpx;
		top: 10rpx;
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
		margin-left: 260rpx;
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
		margin: 8rpx 0 8rpx 0;
		color: #999;
		font-size: 24rpx;
	}
	.main_item .main_item_info .progress_jd .times{
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
	.main_item .main_item_btn.nostring{
		background-color: #999;
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
	.address{
		width: 100%;
		height: 500rpx;
		background-color: #fff;
		border-radius: 10rpx 10rpx 0 0;
		z-index: 101;
		position: fixed;
		bottom: 0;
		left: 0;
	}
	.address .close{
		width: 60rpx;
		height: 60rpx;
		position: absolute;
		right: 20rpx;
		top: 30rpx;
	}
	.address-box{
	    width: 100%;
	    height: 166.55rpx;
	    background: url(../../static/images/address-bg-bd.png) 0 0 repeat-x;
	    background-size: 62.5rpx 10.5rpx;
	    margin-bottom: 20rpx;
	    padding-top: 10.5rpx;
		border-bottom: 1rpx dashed #d4d4d4;
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
	
	.address-box .address_desc{
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
		margin-right: 100rpx;
	}
	
	.address-box .r image{
	    width: 52.078rpx;
	    height: 52.078rpx;
	}
	.address .remark{
		width: 100%;
		height: 120rpx;
		border-bottom: 1rpx dashed #d4d4d4;
		padding: 20rpx;
		font-size: 26rpx;
		color: #999;
	}
	.address .btn{
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
</style>

