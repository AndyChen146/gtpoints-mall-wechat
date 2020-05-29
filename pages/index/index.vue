<template>
	<view class="container">
		<view class="main">
			<view class="main_top">
				<view class="tops_store">
					<view class="store_t">
						<text class="store_text">{{userInfo.score}}</text>
						<text class="store_dw">分</text>
					</view>
					<navigator hover-class="none" open-type="switchTab" class="store_btn" url="/pages/user/index">积分值</navigator>
				</view>
				<view class="tops_line"></view>
				<view class="tops_money">
					<view class="money_t">
						<text class="money_text">{{userInfo.money}}</text>
						<text class="money_dw">元</text>
					</view>
					<navigator class="money_btn" hover-class="none" url="/pages/withdraw/index">提&nbsp;现</navigator>
				</view>
			</view>
		</view>
		<view class="main_enter">
			<view class="main_menu">
				<navigator open-type="switchTab" class="menu_item" url="/pages/home/home" hover-class="none">
					<view class="menu_img blue">
						<image src="/static/images/shop.png" class="menu_icon" />
					</view>
					<text class="menu_text">商城</text>
				</navigator>
				<navigator class="menu_item" url="/pages/Indianapolis/index" hover-class="none">
					<view class="menu_img green">
						<image src="/static/images/doubao.png" class="menu_icon" />
					</view>
					<text class="menu_text">积分夺宝</text>
				</navigator>
				<navigator class="menu_item" url="/pages/panic/index" hover-class="none">
					<view class="menu_img sky">
						<image src="/static/images/qiangg.png" class="menu_icon" />
					</view>
					<text class="menu_text">免费抢购</text>
				</navigator>
				<navigator class="menu_item" url="/pages/user/caption" hover-class="none">
					<view class="menu_img red">
						<image src="/static/images/shuom.png" class="menu_icon" />
					</view>
					<text class="menu_text">夺宝规则</text>
				</navigator>
			</view>
		</view>
		<view class="share_title">
			<text class="share_title_left">幸福晒图区</text>
			<text class="share_title_me" @tap="partBlueTap">参与晒图</text>
			<!-- <navigator hover-class="none" url="/pages/blueprint/blueprint" class="share_title_me">我也要晒图</navigator> -->
		</view>
		<view class="main_bottom">
			<view class="area-item">
				<view class="area_main">
					<view class="area_content">
						<rich-text :nodes="content|formatRichText" class="nodes"></rich-text>
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
			userInfo: {},
			content: ''
		}
	},
	//初始化
	onLoad() {
		
	},
	// 页面显示
	onShow() {
		this.getInfo()
	},
	
	onShareAppMessage: function () {
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
	methods: {
		//获取个人中心信息
		getInfo() {
			util.request(api.getUserInfo,{},'get').then(res=>{
				if(res.code == 0) {
					this.userInfo = res.data.user_id;
					this.getBlueTap();
					this.getShareTicket()
				}
			})
		},
		//参与晒图
		partBlueTap() {
			wx.showModal({
				title: '提示',
				content: '抱歉您未中奖，无法晒图。'
			})
		},
		
		//获取幸福晒图区内容
		getBlueTap() {
			wx.showLoading()
			util.request(api.getArticleInfo,{id: 2},'post').then(res=>{
				wx.hideLoading()
				if(res.code == 0) {
					this.content = res.data.content;
				}
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
		
	},
	filters:{
		//处理html
		formatRichText(html) {
			let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
				match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
				match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
				match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
				return match;
			});
			newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
				match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
				return match;
			});
			newContent = newContent.replace(/<br[^>]*\/>/gi, '');
			newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"');
			return newContent;
		}
	}
}
</script>

<style>
.container{
	
}
.main{
	width: 100%;
	height: 260rpx;
	background: #fff;
}
.main_top{
	width: 100%;
	height: 260rpx;
	background-image:linear-gradient(to bottom, #ec544f, #e57571);
	position: relative;
	display: flex;
	padding: 30rpx 0;
	border-radius: 0 0 50% 50%;
}
.tops_store{
	width: 49%;
	text-align: center;
}
.tops_store .store_btn{
	width: 140rpx;
	height: 50rpx;
	background-color: #ffffff;
	border-radius: 30rpx;
	font-size: 26rpx;
	margin: 0 auto;
	line-height: 50rpx;
	color: #f5655c;
	text-align: center;
	margin-top: 20rpx;
}
.tops_store .store_t .store_text{
	font-size: 70rpx;
	font-weight: bold;
	margin-right: 10rpx;
	color: #ffffff;
}
.tops_store .store_t .store_dw{
	color: #ffffff;
}

.tops_line{
	width: 1rpx;
	height: 140rpx;
	box-shadow: 0 0 10rpx #f4f4f4;
	background: #ffffff;
	text-align: center;
}
.tops_money{
	width: 49%;
	text-align: center;
}

.tops_money .money_t .money_text{
	font-size: 66rpx;
	font-weight: bold;
	margin-right: 10rpx;
	color: #ffffff;
}
.tops_money .money_t .money_dw{
	color: #ffffff;
}
.tops_money .money_btn{
	width: 140rpx;
	height: 50rpx;
	background-color: #ffffff;
	border-radius: 30rpx;
	font-size: 26rpx;
	margin: 0 auto;
	line-height: 50rpx;
	color: #f5655c;
	text-align: center;
	margin-top: 20rpx;
}

.main_enter{
	width: 100%;
	background-color: #ffffff;
	height: 250rpx;
	clear: both;
}
.main_menu{
	display: flex;
	padding: 38rpx 30rpx 20rpx 30rpx;
}
.main_menu .menu_item{
	width: 25%;
	height: 160rpx;
	text-align: center;
}
.main_menu .menu_item .menu_img{
	width: 110rpx;
	height: 110rpx;
	border-radius: 50%;
	display: block;
	margin-left: 20rpx;
	margin: 0 auto 16rpx auto;
}
.blue{
	background-image: linear-gradient(to bottom, #74b2d7,#2294dd);
}
.green{
	background-image: linear-gradient(to bottom, #2fd5d5,#15cba3);
}
.sky{
	background-image: linear-gradient(to bottom, #e942e7,#a648e7);
}
.red{
	background-image: linear-gradient(to bottom, #ff6b60,#f64754);
}
.main_menu .menu_item .menu_img .menu_icon{
	width: 50rpx;
	height: 50rpx;
	margin-top: 30rpx;
}
.main_menu .menu_item .menu_text{
	text-align: center;
	font-size: 28rpx;
}
.nodes img{
	border-radius: 20rpx;
}
.main_bottom{
	width: 100%;
}
.share_title{
	height: 80rpx;
	line-height: 80rpx;
	padding: 0 30rpx;
}
.share_title .share_title_left{
	color: red;
	font-size: 32rpx;
	font-weight: bold;
}
.share_title .share_title_me{
	text-align: right;
	float: right;
	color: #666;
	font-size: 24rpx;
	line-height: 80rpx;
	color: #007AFF;
}
.area-item{
	position: relative;
	width: 100%;
	background-color: #ffffff;
	margin-bottom: 8rpx;
}
.area-item .area_header{
	width: 100rpx;
	height: 100rpx;
	background-color: #f4f4f4;
	border-radius: 50%;
	position: absolute;
	top: 30rpx;
	left: 20rpx;
}
.area-item .area_main{
	padding-left: 30rpx;
	padding-top: 30rpx;
	width: 100%;
}

.area-item .area_main .area_username{
	font-size: 32rpx;
	clear: both;
}
.area-item .area_main .area_content {
	width: 100%;
	padding: 2rpx 20rpx 14rpx 0;
	font-size: 26rpx;
}
.area-item .area_main .area_content image{
	width: 96%;
	margin-top: 20rpx;
	margin-bottom: 6rpx;
	border-radius: 8rpx;
}
</style>
