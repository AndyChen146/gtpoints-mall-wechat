<template>
	<view class="container">
		<view class="box">
			<view class="assess">
				<text>商品评价：</text>
				<view :class="assess_id == item.id ? 'item active' : 'item'" @tap="changeAssess(item.id)" v-for="item in assess" :key="item.id">{{item.name}}</view>
			</view>
			<view class="anonymous">
				<text>是否匿名：</text>
				<text @tap="bindIsDefault(params.is_anonymous)" :class="params.is_anonymous == 1 ? 'default-input selected' : 'default-input'"></text>
			</view>
		</view>
		<view class="desc">
			<textarea class="desc_textarea" @input="bindTextarea" maxlength="200" placeholder="对评价补充, 更客观,更全面~"></textarea>
			<view class="uplaod">
				<!-- <image class="desc_img" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574759591736&di=790077cf5360c64e042343c7b5c3ae25&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201510%2F15%2F20151015210512_BNwzd.jpeg"></image> -->
				<view class="desc_uplaod" @tap="uplaodImage">+</view>
			</view>
		</view>
		<view class="btn">
			<button class="botton" @tap="backIndex" hover-class="none">取消</button>
			<button class="botton submit" @tap="submit">提交</button>
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
				assess_id: 1,
				params: {
					order_id: '',
					goods_id: '',
					content: '',
					images: '',
					is_anonymous: 1,
					explain_type: 1,
				},
				assess: [
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
			
		},
		//分享
		onShareAppMessage() {
			
		},
		methods:{
			//图片上传
			uplaodImage() {
				wx.chooseImage({
					count: 2,
					sizeType: 'original',
					sourceType: 'album', 
					success: function(res) {
						const tempFilePaths = res.tempFilePaths;
						console.log(res)
					},
				})
			},
			
			//取消
			backIndex() {
				wx.navigateBack({
					delta:1
				})
			},
			
			//提交
			submit() {
				console.log(this.params)
				// util.request(api.getEvaluateOrder,this.params,'post').then(res=>{
				// 	if(res.code == 0) {
				// 		wx.navigateBack({
				// 			delta:1
				// 		})
				// 	}
				// })
			},
			//选择评价
			changeAssess(id) {
				this.assess_id = id;
				this.params.explain_type = id;
			},
			//是否匿名
			bindIsDefault(is_anonymous) {
				this.params.is_anonymous = is_anonymous === 1 ? 0 : 1
			},
			//获取内容
			bindTextarea(e) {
				this.params.content = e.detail.value;
			}
		}
	}
</script>

<style>
	page{
		background-color: #ffffff;
	}
	.container{
		background-color: #ffffff;
	}
	.box{
		padding: 30rpx;
		border-bottom: 2rpx solid #d4d4d4;
	}
	.box .assess{
		display: flex;
	}
	.box .assess text{
		font-size: 28rpx;
	}
	.box .assess .item{
		width: 80rpx;
		height: 40rpx;
		line-height: 40rpx;
		margin-left: 20rpx;
		border: 1rpx solid #999;
		font-size: 24rpx;
		text-align: center;
		border-radius: 6rpx;
	}
	.box .assess .item.active{
		border: 1rpx solid #ec544f;
		color: #ec544f;
	}
	.box .anonymous{
		margin-top: 20rpx;
		display: flex;
	}
	.default-input{
	    margin-left: 20rpx;
	    display: block;
	    width: 240rpx;
	    height: 40rpx;
	    padding-left: 50rpx;
	    line-height: 40rpx;
	    background: url(../../static/images/wgx.png) left center no-repeat;
		background-size: 14%;
	    font-size: 28rpx;
	}
	.default-input.selected{
	    background: url(../../static/images/gx.png) left center no-repeat;
		background-size: 14%;
	    
	}
	.desc{
		padding: 30rpx;
	}
	.desc_textarea{
		width: 100%;
		height: 200rpx;
	}
	.uplaod{
		width: 100%;
		display: flex;
	}
	.uplaod .desc_img{
		width: 200rpx;
		height: 200rpx;
		border-radius: 10rpx;
		margin-right: 10rpx;
	}
	.uplaod .desc_uplaod{
		width: 200rpx;
		height: 200rpx;
		background-color: #f4f4f4;
		border-radius: 10rpx;
		text-align: center;
		font-size: 50rpx;
		line-height: 200rpx;
		color: #999;
		
	}
	.btn{
		width: 100%;
		height: 100rpx;
		display: flex;
		margin-top: 40rpx;
	}
	.botton{
		width: 40%;
		border: none;
	}
	.submit {
		color: #ffffff;
		background-color: #23a0ff;
	}
</style>
