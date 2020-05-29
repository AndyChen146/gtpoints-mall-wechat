<template>
	<view class="container">
		<view class="add-address">
			<view class="add-form">
				<view class="form-item">
				    <input class="input" placeholder="姓名" @input="bindinputName" :value="address.consignee" auto-focus/>
				</view>
				<view class="form-item">
				    <input class="input" @input="bindinputMobile" maxlength="11" :value="address.mobile" placeholder="手机号码"/>
				</view>
				<view class="form-item">
				    <input class="input" :value="province_name" disabled="true" @tap="chooseRegion(1)" placeholder="省份"/>
				</view>
				<view class="form-item">
				    <input class="input" :value="city_name" disabled="true" @tap="chooseRegion(2)" placeholder="城市"/>
				</view>
				<view class="form-item">
				    <input class="input" :value="district_name" disabled="true" @tap="chooseRegion(3)" placeholder="区域"/>
				</view>
				<view class="form-item">
				    <input class="input" @input="bindinputAddress" :value="address.street" placeholder="详细地址, 如街道、楼盘号等"/>
				</view>
				<view class="form-default" v-if="del_id>0">
				    <text @tap="bindIsDel">删除收货地址</text>
				</view>
			</view>
			<view class="btns">
			    <button class="cannel" @tap="cancelAddress">取消</button>
			    <button class="save" @tap="saveAddress">保存</button>
			</view>
			<view class="region-select" v-if="openSelectRegion">
				<view class="hd">
					<view class="region-selected">
						<view class="item disabled">{{title_name}}</view>
					</view>
					<view class="done" @tap="doneSelectRegion">确定</view>
				</view>
				<view class="bd">
					<scroll-view scroll-y="true" class="region-list" style="height: 490rpx;">
						<view :class="item.selected ? 'item selected' : 'item'" @tap="selectRegion(item,index)"  v-for="(item,index) in regionList" :key="item.id">{{item.name}}</view>
					</scroll-view>
			  </view>
			</view>
		</view>
		<view class="bg-mask" @tap="cancelSelectRegion" v-if="openSelectRegion"></view>
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
				address: {
					addr_id:0,
					province: 0,
					city: 0,
					district: 0,
					street: '',
					consignee: '',
					mobile: ''
				},
				openSelectRegion: false,
				province_name: '',
				city_name: '',
				district_name: '',
				title_name: '',
				regionList: [],
				region_type: 0,
				del_id: 0
			}
		},
		//初始化
		onLoad() {
			wx.hideShareMenu()
			let pages = getCurrentPages();
			let { options } = pages.pop();
			if(options.id) {
				this.del_id = options.id;
				this.getInfo(options.id) 
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
			
			//获取地址详情
			getInfo(id) {
				util.request(api.getAddreInfo,{addr_id: id},'post').then(res=>{
					if(res.code == 0) {
						this.address = {
							addr_id: res.data.addr_id,
							province: res.data.province,
							city: res.data.city,
							district: res.data.district,
							street: res.data.street,
							consignee: res.data.consignee,
							mobile: res.data.mobile,
							is_default: res.data.is_default
						}
						this.province_name = res.data.province_name;
						this.city_name = res.data.city_name;
						this.district_name = res.data.district_name;
					}
				})
			},
			
			
			chooseRegion(type){
				if(type == 1){
					this.title_name = '省份选择';
					this.getRegionList(0,type)
				}else if(type == 2 && this.address.province != 0) {
					this.title_name = '城市选择';
					this.getRegionList(this.address.province,type)
				}else if(type == 3 && this.address.city != 0){
					this.title_name = '地区选择';
					this.getRegionList(this.address.city,type)
				}else {
					wx.showToast({
						icon: 'none',
						title:'请按省市区依次选择顺序！'
					})
					return false;
				}
				this.region_type = type;
				this.openSelectRegion =  !this.openSelectRegion;
			},
			
			//获取省市区
			getRegionList(regionId,type) {
				let that = this;
				util.request(api.getAreaList,{pid: regionId},'post').then(res=>{
					if(res.code == 0) {
						this.regionList = res.data.list.map(item=>{
							if(type == 1) {
								if(item.id == that.address.province) {
									item.selected = true;
								}else {
									item.selected = false;
								}
							}else if(type == 2){
								if(item.id == that.address.city) {
									item.selected = true;
								}else {
									item.selected = false;
								}
							}else {
								if(item.id == that.address.district) {
									item.selected = true;
								}else {
									item.selected = false;
								}
							}
							return item;
						})
						
					}
				})
			},
			
			//省市区弹框之后点击
			selectRegion(item,index) {
				this.regionList.forEach(vitem=>{
					if(vitem.id == item.id) {
						vitem.selected = true;
					}else {
						vitem.selected = false;
					}
				})
				
				if(this.region_type == 1) {
					this.province_name = item.name;
					this.address.province = item.id;
				}else if(this.region_type == 2) {
					this.city_name = item.name;
					this.address.city = item.id;
				}else {
					this.district_name = item.name;
					this.address.district = item.id;
				}
			},
			
			//省市区选择确定
			doneSelectRegion() {
				this.openSelectRegion = false;
			},
			//设为默认地址
			bindIsDel() {
				let that = this;
				wx.showModal({
					title: '',
					content: '确定要删除地址？',
					success: function (res) {
						if (res.confirm) {
							let addressId = that.del_id;
							util.request(api.delAddreList, { addr_id: addressId }, 'POST').then(function (res) {
								if (res.code === 0) {
									wx.navigateBack({
										delta: 1
									})
								}
							});
						}
					}
				})
			},
			//确定
			saveAddress() {
				let address = this.address;
				if (address.consignee == '') {
					util.showErrorToast('请输入姓名');
					return false;
				}
			
				if (address.mobile == '') {
					util.showErrorToast('请输入手机号码');
					return false;
				}
			
				if (address.district == 0) {
				  util.showErrorToast('请选择省市区');
				  return false;
				}
			
				if (address.street == '') {
				  util.showErrorToast('请输入详细地址');
				  return false;
				}
				let that = this;
				this.address.is_default = this.address.is_default ? 1 : 0;
				util.request(api.addAddreList,address,'post').then(res=>{
					if(res.code == 0) {
						wx.navigateBack({
							delta: 1
						})
					}
				})
				
			},
			
			//获取用户名
			bindinputName(event) {
				this.address.consignee = event.detail.value;
			},
			bindinputMobile(event){
				this.address.mobile = event.detail.value;
			},
			bindinputAddress(event) {
				this.address.street = event.detail.value;
			},
			//取消
			cancelAddress() {
				wx.navigateBack({
					delta: 1
				})
			},
			cancelSelectRegion() {
				this.openSelectRegion = false;
			},
			//传递分享code进去
			setCode(code) {
				util.request(api.setShareInfo,{code: code},'post').then(res=>{})
			}
		}
	}
</script>

<style>
	.add-address .add-form{
	    background: #fff;
	    width: 100%;
	    height: auto;
	    overflow: hidden;
	}
	
	.add-address .form-item{
	    height: 116rpx;
	    padding-left: 31.25rpx;
	    border-bottom: 1px solid #d9d9d9;
	    display: flex;
	    align-items: center;
	    padding-right: 31.25rpx;
	}
	
	.add-address .input{
	    flex: 1;
	    height: 44rpx;
	    line-height: 44rpx;
	    overflow: hidden;
	}
	
	.add-address .form-default{
	    border-bottom: 1px solid #d9d9d9;
	    height: 96rpx;
	    background: #fafafa;
	    padding-top: 28rpx;
	    font-size: 28rpx;
		padding-left: 31.25rpx;
		
	}
	.add-address .form-default text{
		color: red;
	}
	
	.default-input{
	    margin: 0 auto;
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
	
	.add-address .btns{
	    position: fixed;
	    bottom: 0;
	    left: 0;
	    overflow: hidden;
	    display: flex;
	    height: 100rpx;
	    width: 100%;
	}
	
	.add-address .cannel,.add-address .save{
	    flex: 1;
	    height: 100rpx;
	    text-align: center;
	    line-height: 100rpx;
	    font-size: 28rpx;
	    color: #fff;
	    border:none;
	    border-radius: 0;
	}
	
	.add-address .cannel{
	    background: #333;
	}
	
	.add-address .save{
	    background: #ec544f;
	}
	
	
	.region-select{
	  width: 100%;
	  height: 600rpx;
	  background: #fff;
	  position: fixed;
	  z-index: 10;
	  left:0;
	  bottom: 0;
	}
	
	.region-select .hd{
	  height: 108rpx;
	  width: 100%;
	  border-bottom: 1px solid #f4f4f4;
	  padding: 46rpx 30rpx 0 30rpx;
	}
	
	.region-select .region-selected{
	  float: left;
	  height: 60rpx;
	  display: flex;
	}
	
	.region-select .region-selected .item{
	  max-width: 140rpx;
	  margin-right: 30rpx;
	  text-align: left;
	  line-height: 60rpx;
	  height: 100%;
	  color: #333;
	  font-size: 28rpx;
	  overflow: hidden;
	      text-overflow: ellipsis;
	    white-space: nowrap;
	}
	
	.region-select .region-selected .item.disabled{
	  color: #999;
	}
	
	.region-select .region-selected .item.selected{
	  color: #ec544f;
	}
	
	.region-select .done{
	  float: right;
	  height: 60rpx;
	  width: 60rpx;
	  border: none;
	  background: #fff;
	  line-height: 60rpx;
	  text-align: center;
	  color: #333;
	  font-size: 28rpx;
	}
	
	.region-select .done.disabled{
	  color: #999;
	}
	
	
	
	.region-select .bd{
	  height: 492rpx;
	  width: 100%;
	  padding: 0 30rpx;
	}
	
	.region-select .region-list{
	  height: auto;
	  overflow: scroll;
	
	}
	
	.region-select .region-list .item{
	  width: 100%;
	  height: 104rpx;
	  line-height: 104rpx;
	  text-align: left;
	  color: #333;
	  font-size: 28rpx;
	}
	
	.region-select .region-list .item.selected{
	  color: #ec544f;
	}
	
	
	.bg-mask{
	  height: 100%;
	  width: 100%;
	  background: rgba(0, 0, 0, 0.4);
	  position: fixed;
	  top:0;
	  left:0;
	  z-index: 8;
	}

</style>
