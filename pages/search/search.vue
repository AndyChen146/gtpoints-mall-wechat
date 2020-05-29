<template>
	<view class="container">
		搜索
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
			
		}	
	},
	onLoad() {
		
	},
	// 页面显示
	onShow() {
		
	},
	// 页面分享
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
