<template>
	<view class="container">
		<view class="cate-nav">
			<scroll-view scroll-x="true" class="cate-nav-body" style="width: 750rpx;">
				<view  v-for="(item,index) in navList" :class="curr_id == item.id ? 'item active':'item'" :key="index"  @tap="switchCate(item.id)">
					<view class="name">{{item.name}}</view>
				</view>
			</scroll-view>
		</view>
		<view class="main">
			<view class="area-item">
				<image src="http://iconfont.alicdn.com/t/1558603270901.jpeg@100h_100w.jpg" class="area_header" />
				<view class="area_main">
					<text class="area_username">会吃鱼的猫</text>
					<view class="area_times">2019-10-10 10:00:00</view>
					<view class="area_content">
						<text>这是啥花，亮瞎我的小眼睛。^_^</text>
						<view class="imgs">
							<image src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574759591736&di=790077cf5360c64e042343c7b5c3ae25&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201510%2F15%2F20151015210512_BNwzd.jpeg" />
							<image src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574759591736&di=790077cf5360c64e042343c7b5c3ae25&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201510%2F15%2F20151015210512_BNwzd.jpeg" />
						</view>
					</view>
					
				</view>
				<view class="back">
					<text class="text">客服回复： </text>
					<text>感谢您对我司的支持！</text>
				</view>
			</view>
			<view class="area-item">
				<image src="http://iconfont.alicdn.com/t/1558603270901.jpeg@100h_100w.jpg" class="area_header" />
				<view class="area_main">
					<text class="area_username">会吃鱼的猫</text>
					<view class="area_times">2019-10-10 10:00:00</view>
					<view class="area_content">
						<text>这是啥花，亮瞎我的小眼睛。^_^</text>
						<view class="imgs">
							<image src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574759591736&di=790077cf5360c64e042343c7b5c3ae25&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201510%2F15%2F20151015210512_BNwzd.jpeg" />
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const util = require('../../utils/util.js')
	const api = require('../../config/api.js');
	const user = require('../../services/user.js')
	const app = getApp()
	export default {
		name: '',
		data() {
			return {
				list: [],
				curr_id: 0,
				params: {
					page: 1,
					size: 10,
					explain_type: 0,
					goods_id: '8'
				},
				navList: [
					{
						id: 0,
						name: '全部'
					},
					{
						id: 1,
						name: '好评'
					},
					{
						id: 2,
						name: '中评'
					},
					{
						id: 3,
						name: '差评'
					}
				]
			}
			
		},
		//初始化
		onLoad() {
			this.getList()
		},
		// 页面显示
		onShow() {
			
		},
		//分享
		onShareAppMessage() {
			
		},
		//下拉刷新
		onPullDownRefresh(e){
			wx.stopPullDownRefresh();
		},
		methods:{
			//获取商品评论列表
			getList() {
				wx.showLoading()
				util.request(api.getEvaluList,this.params,'post').then(res=>{
					wx.hideLoading()
					console.log(res)
				})
			}
		}
	}
</script>

<style>
	.cate-nav{
	    position: fixed;
	    left:0;
	    top:0;
	    z-index: 1000;
	}
	
	.cate-nav-body{
	    height: 84rpx;
	    white-space: nowrap;   
	    background: #fff;
	    border-top: 1px solid rgba(0,0,0,.15);
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
	.main{
		margin-top: 100rpx;
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
		padding-left: 150rpx;
		padding-top: 30rpx;
		width: 100%;
	}
	
	.area-item .area_main .area_username{
		font-size: 32rpx;
		clear: both;
	}
	.area-item .area_main .area_times{
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}
	.area-item .area_main .area_content {
		width: 100%;
		padding: 10rpx 20rpx 14rpx 0;
		font-size: 26rpx;
	}
	.area-item .area_main .area_content .imgs{
		
	}
	.area-item .area_main .area_content .imgs image{
		width: 200rpx;
		height: 200rpx;
		margin: 6rpx 0;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}
	.area-item  .back{
		padding: 20rpx;
		
	}
	.area-item  .back text{
		font-size: 26rpx;
		color: #999;
	}
	.area-item  .back text.text{
		width: 130rpx;
		display: inline-block;
	}
</style>
