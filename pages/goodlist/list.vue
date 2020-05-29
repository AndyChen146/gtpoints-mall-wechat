<template>
	<view class="container">
		<view class="search">
			<image v-if="params.kw == ''" class="icon"></image>
			<input type="text" class="input" :value="params.kw" placeholder="请输入商品名称" @input="searchInt" @confirm="searchConfirm"/>
		</view>
		<view class="filterBox">
			<view :class="params.sort_type == 1 ? 'label active' : 'label' " @tap="searchlist(1)">默认</view>
			<view :class="params.sort_type == 2 ? 'label active' : 'label' " @tap="searchlist(2)">价格</view>
			<view :class="params.sort_type == 4 ? 'label active' : 'label' " @tap="searchlist(4)">销量</view>
			<view class="label" @tap="searchsort">排序
				<image v-if="params.sort_val == 1" src="../../static/images/l_bottom.png" class="jt bottom"></image>
				<image v-if="params.sort_val == 0" src="../../static/images/l_top.png" class="jt top"></image>
			</view>
		</view>
		
		<view class="no_data" v-if="list.length<=0">
			<image src="../../static/images/no_goods.png" class="pic"></image>
			<view class="text">暂无商品信息</view>
		</view>
		
		<view class="hot" v-if="list && list.length>0">
			<view class="hot-item" v-for="(item,index) in list" :key="item.goods_id">
				<navigator :url="'../goods/index?id='+item.goods_id" hover-class="none">
					<image v-if="item.picture" :src="dealPrcture(item.picture)" class="img"></image>
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
const app = getApp()
export default {
	name: '',
	data() {
		return {
			list: [],
			keyword: '',
			params: {
				category_id: "",
				kw: "",
				sort_type: 1,   //1上架时间 2价格 3评论 4销量
				sort_val: 1,    // 0升序 1降序
			}
		}
	},
	//初始化
	onLoad() {
		//检测是否有url参数
		let pages = getCurrentPages();
		let { options } = pages.pop();
		if(options.cid) {
			this.params.category_id = options.cid;
			this.getList()
		}else if(options.keyword) {
			this.params.kw = options.keyword;
			this.getList()
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
		
		//获取商品列表
		getList() {
			wx.showLoading({title: '加载中...'})
			util.request(api.getGoodsList,this.params,'post').then(res=>{
				wx.hideLoading()
				if(res.code === 0) {
					this.list = res.data.list;
				}
			})
		},
		//筛选点击
		searchlist(type) {
			this.params.sort_type = type;
			this.getList()
		},
		searchsort() {
			let sort = this.params.sort_val;
			this.params.sort_val = sort == 1 ? 0 : 1;
			this.getList()
		},
		dealPrcture(str) {
			if(!str) return ;
			let newStr = str.split(',');
			return newStr[0]
		},
		//input 聚焦
		searchInt(e) {
			this.params.kw = e.detail.value;
		},
		searchConfirm(e) {
			this.params.kw = e.detail.value;
			this.getList()
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
	  border-bottom: 1rpx solid #d4d4d4;
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
	.filterBox{
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		margin-top: 20rpx;
		background-color: #fff;
		border-top: 1rpx solid #d4d4d4;
		border-bottom: 1rpx solid #d4d4d4;
	}
	.filterBox .label{
		width: 25%;
		font-size: 28rpx;
		text-align: center;
		display: inline-block;
	}
	.filterBox .label .jt{
		width: 32rpx;
		height: 32rpx;
		vertical-align: middle;
	}
	.filterBox .label .bottom{
		margin-left: 6rpx;
		margin-top: -16rpx;
	}
	.filterBox .label .top{
		
		margin-top: 10rpx;
		margin-left: 6rpx;
	}
	.filterBox .label.active{
		color: #ec544f;
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
		  display: block;
		  color: #999;
		  overflow: hidden;
		  text-overflow: ellipsis;
		  white-space: nowrap;
		  line-height: 50rpx;
		  font-size: 25rpx;
	}
	.hot .hot-item .right .price{
		display: block;
		line-height: 30rpx;
		font-size: 30rpx;
		color: #ec544f;
	}
	.no_data{
		padding: 200rpx 0;
		text-align: center;
	}
	.no_data .pic{
		width: 120rpx;
		height: 120rpx;
	}
	.no_data .text{
		font-size: 24rpx;
		margin-top: 20rpx;
		color: #999;
	}
</style>
