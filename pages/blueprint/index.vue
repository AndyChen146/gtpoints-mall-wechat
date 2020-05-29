<template>
	<view class="container">
		晒图区
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
			
		},
		//下拉刷新
		onPullDownRefresh(e){
			setTimeout(function () {
				wx.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			
		}
	}
</script>

<style>
	
</style>
