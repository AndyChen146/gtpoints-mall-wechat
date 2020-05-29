<template>
	<view class="container">
		<view class="add-address">
		    <view class="add-form">
		        <view class="form-item">
		            <input class="input" placeholder="姓名" @input="bindinputName" :value="address.consignee" auto-focus/>
		        </view>
		        <view class="form-item">
		            <input class="input" @input="bindinputMobile" :value="address.mobile" placeholder="手机号码"/>
		        </view>
		        <view class="form-item">
		            <input class="input" :value="address.full_region" disabled="true" @tap="chooseRegion" placeholder="省份、城市、区县"/>
		        </view>
		        <view class="form-item">
		            <input class="input" @input="bindinputAddress" :value="address.street" placeholder="详细地址, 如街道、楼盘号等"/>
		        </view>
		        <view class="form-default">
		            <text @tap="bindIsDefault" :class="address.is_default == 1 ? 'default-input selected' : 'default-input'">设为默认地址</text>
		        </view>
		    </view>
		
		    <view class="btns">
		        <button class="cannel" @tap="cancelAddress">取消</button>
		        <button class="save" @tap="saveAddress">保存</button>
		    </view>
		
		    <view class="region-select" v-if="openSelectRegion">
		      <view class="hd">
		        <view class="region-selected">
		          <view :class="vitem.id == 0 ? 'item disabled': 'item' "  v-for="(vitem,vindex) in selectRegionList" :key="vitem.id">{{vitem.name}}</view>
		        </view>
		        <view :class="selectRegionDone ? 'done disabled' : 'done'" @tap="doneSelectRegion">确定</view>
		      </view>
		      <view class="bd">
		        
				<scroll-view scroll-y="true" class="region-list" style="height: 490rpx;">
					<view :class="item.selected ? 'item selected' : 'item'" @tap="selectRegion(item.id,item.name)"  v-for="item in regionList" :key="item.id">{{item.name}}</view>
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
				full_region: '',
				consignee: '',
				mobile: '',
				is_default: 1
			},
			addressId: 0,
			openSelectRegion: false,
			selectRegionList: [
				{ id: 0, name: '省份', parent_id: 1, type: 1 },
				{ id: 0, name: '城市', parent_id: 1, type: 2 },
				{ id: 0, name: '区县', parent_id: 1, type: 3 }
			],
			regionType: 1,
			regionList: [],
			selectRegionDone: false
		}
	},
	//初始化
	onLoad() {
		let pages = getCurrentPages();
		let { options } = pages.pop();
		if(options.id) {
			this.getInfo(options.id) 
		}
		
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
						full_region: '',
						consignee: res.data.consignee,
						mobile: res.data.mobile,
						is_default: res.data.is_default
					}
				}
			})
		},
		
		//选择省市区
		chooseRegion() {
			this.openSelectRegion =  !this.openSelectRegion;
			let address = this.address;
			if (address.province > 0 && address.city > 0 && address.district > 0) {
				let selectRegionList = this.selectRegionList;
				selectRegionList[0].id = address.province;
				selectRegionList[0].name = address.province_name;
				selectRegionList[0].parent_id = 1;
			
				selectRegionList[1].id = address.city;
				selectRegionList[1].name = address.city_name;
				selectRegionList[1].parent_id = address.province;
			
				selectRegionList[2].id = address.district;
				selectRegionList[2].name = address.district_name;
				selectRegionList[2].parent_id = address.city;
				
				this.selectRegionList = selectRegionList;
				this.regionType = 3;
				this.getRegionList(address.city);
			}else {
				this.selectRegionList = [
					{ id: 0, name: '省份', parent_id: 1, type: 1 },
					{ id: 0, name: '城市', parent_id: 1, type: 2 },
					{ id: 0, name: '区县', parent_id: 1, type: 3 }
				]
				this.regionType = 1;
				this.getRegionList(0);
			}
		},
		//设为默认地址
		bindIsDefault() {
			let address = this.address;
			this.address.is_default = !address.is_default;
		},
		//获取省市区
		getRegionList(regionId) {
			let that = this;
			let regionType = that.regionType;
			util.request(api.getAreaList,{pid: regionId},'post').then(res=>{
				if(res.code == 0) {
					this.regionList = res.data.list.map(item=>{
						if(this.selectRegionList[regionType-1].id == item.id) {
							item.selected = true;
						}else {
							item.selected = false;
						}
						return item;
					})
				}
			})
		},
		//选择省市区确定
		doneSelectRegion() {
			
		},
		//选择点击时
		selectRegion(id,name) {
			this.getRegionList(id)
		},
		
		//取消
		cancelAddress() {
			wx.navigateBack({
				delta: 1
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
			  util.showErrorToast('请输入省市区');
			  return false;
			}
		
			if (address.street == '') {
			  util.showErrorToast('请输入详细地址');
			  return false;
			}
			
			let that = this;
			util.request(api.addAddreList,address,'post').then(res=>{
				if(res.code == 0) {
					wx.reLaunch({
					    url: '/pages/user/addr',
					})
				}
			})
			
		},
		cancelSelectRegion() {
			this.openSelectRegion = false;
			//this.regionType = this.regionDoneStatus ? 3 : 1;
		},
		
		bindinputName(event) {
			this.address.consignee = event.detail.value;
		},
		bindinputMobile(event){
			this.address.mobile = event.detail.value;
		},
		bindinputAddress(event) {
			this.address.street = event.detail.value;
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

