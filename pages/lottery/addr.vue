<template>
	<view class="container">
		<view class="address-list" v-if="addressList.length > 0 ">
			<view class="item" v-for="(item,index) in addressList" :key="item.addr_id" @tap="addressAddOrder(item.addr_id)" >
				<view class="l">
					<view class="name">{{item.consignee}}</view>
					<view class="default" v-if="item.is_default == 1">默认</view>
				</view>
				<view class="c">
					<view class="mobile">{{item.mobile}}</view>
					<view class="address">{{item.address}}</view>
				</view>
				<view class="r">
					<image @tap.stop="deleteAddress(item.addr_id)" class="del" src="/static/images/edit-address.png"></image>
				</view>
			</view>
		</view>
		<view class="empty-view" v-else>
		  <image class="icon" src="../../static/images/no_add.png"></image>
		  <text class="text">收货地址在哪里</text>
		</view>
		<view class="add-address" @tap="addressAddOrUpdate">新建</view>
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
			addressList: []
		}
	},
	//初始化
	onLoad() {
		
	},
	// 页面显示
	onShow() {
		this.getList();
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
		//获取收货地址
		getList() {
			util.request(api.getAddreList,{},'get').then(res=>{
				if(res.code == 0){
					this.addressList = res.data.list;
				}
			})
		},
		
		//编辑地址
		deleteAddress(id){
			wx.navigateTo({
				url: '/pages/lottery/editAddre?id=' + id
			})
		},
		
		//新增
		addressAddOrUpdate() {
			wx.navigateTo({
				url: '/pages/lottery/editAddre'
			})
		},
		addressAddOrder(id){
			util.request(api.setAddrDefault,{addr_id: id},'post').then(res=>{
				if(res.code == 0) {
					wx.navigateBack({
						delta: 1
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
	.address-list{
	    padding-left: 31.25rpx;
	    background: #fff url(../../static/images/address-bg-bd.png) 0 0 repeat-x;
	    background-size: auto 10.5rpx;
	    margin-bottom: 90rpx;
	}
	
	.address-list .item{
	    height: 156.55rpx;
	    align-items: center;
	    display: flex;
	    border-bottom: 1rpx solid #DCD9D9;
	}
	
	.address-list .l{
	    width: 165rpx;
	    overflow: hidden;
	}
	
	.address-list .name{
	    width: 125rpx;
	    height: 43rpx;
	    font-size: 29rpx;
	    color: #333;
	    margin-bottom: 5.2rpx;
	        text-overflow: ellipsis;
	    white-space: nowrap;
	    overflow: hidden;
	}
	
	.address-list .default{
	    width: 100rpx;
	    height: 50rpx;
	    line-height: 50rpx;
	    text-align: center;
	    font-size: 20rpx;
	    color: #ec544f;
	    border: 1rpx solid #ec544f;
	    visibility: visible;
	}
	
	
	.address-list .c{
	    flex: 1;
	    height: auto;
	    overflow: hidden;
	}
	
	.address-list .mobile{
	
	    height: 29rpx;
	    font-size: 29rpx;
	    line-height: 29rpx;
	    overflow: hidden;
	    color: #333;
	    margin-bottom: 6.25rpx;
	}
	
	.address-list .address{
	    height: 37rpx;
	    font-size: 25rpx;
	    line-height: 37rpx;
	    overflow: hidden;
	    color: #666;
	}
	
	.address-list .r{
	    width: 52rpx;
	    height: auto;
	    overflow: hidden;
	    margin-right: 16.5rpx;
	}
	
	.address-list .del{
	    display: block;
	    width: 52rpx;
	    height: 52rpx;
	}
	
	.add-address{
	    background: #ec544f;
	    text-align: center;
	    width: 100%;
	    height: 99rpx;
	    line-height: 99rpx;
	    position: fixed;
	    border-radius: 0;
	    border: none;
	    color: #fff;
	    font-size: 29rpx;
	    bottom: 0;
	    left:0;
	}
	
	.empty-view{
	  height: 100%;
	  width: 100%;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	}
	
	.empty-view .icon{
	  height: 248rpx;
	  width: 258rpx;
	  margin-bottom: 10rpx;
	}
	
	.empty-view .text{
	  width: auto;
	  font-size: 28rpx;
	  line-height: 35rpx;
	  color: #999;
	}
</style>

