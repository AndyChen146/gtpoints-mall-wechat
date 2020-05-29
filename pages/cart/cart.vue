<template>
	<view class="container">
		<view class="no-cart" v-if="cartGoods.length <= 0">
		    <view class="c">
				<image src="../../static/images/no-cart.png" />
				<text>去添加点什么吧</text>
		    </view>
		</view>
		<view class="cart-view" v-else>
			<view class="list">
				<view class="group-item">
					<view class="goods">
						<view :class="isEditCart ? 'item edit' : 'item'" v-for="(item,index) in cartGoods" :key="item.cart_id">
							<view :class="item.checked ? 'checkbox checked' : 'checkbox'" @tap="checkedItem(item,index)"></view>
							<view class="cart-goods">
								<image class="img" :src="item.goods_picture"></image>
								<view class="info">
									<view class="t">
										<text class="name">{{item.goods_name}}</text>
										<text class="num">x{{item.num}}</text>
									</view>
									<view class="attr">{{ isEditCart ? '已选择:' : ''}}{{item.sku_name}}</view>
									<view class="b">
										<text class="price">￥{{item.price}}</text>
										<view class="selnum">
											<view class="cut" @tap="cutNumber(item,index)" >-</view>
											<input :value="item.num" class="number" disabled="true" type="number" />
											<view class="add" @tap="addNumber(item,index)" >+</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		
			<view class="cart-bottom">
				<view :class="checkedAllStatus ? 'checkbox checked' : 'checkbox'" @tap="checkedAll">全选({{cartTotal.checkedGoodsCount}})</view>
				<view class="total">{{!isEditCart ? '￥'+cartTotal.checkedGoodsAmount : ''}}</view>
				<view class="delete" @tap="editCart">{{!isEditCart ? '编辑' : '完成'}}</view>
				<view :class="cartTotal.checkedGoodsCount == 0 ? 'checkout disabled' : 'checkout'" @tap="deleteCart" v-if="isEditCart">删除所选</view>
				<view :class="cartTotal.checkedGoodsCount == 0 ? 'checkout disabled' : 'checkout'" @tap="checkoutOrder" v-if="!isEditCart">下单</view>
			</view>
		</view>
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
				cartGoods: [],
				isEditCart: false,
				cartTotal: {
					"goodsCount": 0,
					"goodsAmount": 0.00,
					"checkedGoodsCount": 0,
					"checkedGoodsAmount": '0.00'
				},
				checkedAllStatus: true,
				card_ids: []
			}	
		},
		onLoad() {
			
		},
		// 页面显示
		onShow() {
			this.getList();
			this.cartTotal.checkedGoodsCount = 0;
			this.cartTotal.checkedGoodsAmount = '0.00';
		},
		// 页面分享
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
		methods:{
			//获取商品列表
			getList() {
				wx.showLoading()
				util.request(api.getCartLists,{status: 0},'post').then(res=>{
					wx.hideLoading()
					if(res.code == 0) {
						this.cartGoods = res.data.list;
						this.cartGoods.forEach(el=>{
							el.checked = false;
						})
						this.cartTotal.goodsCount = res.data.num;
						this.cartTotal.goodsAmount = res.data.total;
						// this.cartTotal.checkedGoodsCount = res.data.num;
						// this.cartTotal.checkedGoodsAmount = res.data.total;
					}
					this.checkedAllStatus = false;
					
				})
			},
			
			isCheckedAll() {
				//判断购物车商品已全选
				return this.cartGoods.every(function(element, index, array) {
					if (element.checked == true) {
						return true;
					} else {
						return false;
					}
				});
				
			},
			//商品增加
			addNumber(item,index) {
				let cartItem = this.cartGoods[index];
				let number = cartItem.num + 1;
				this.cartGoods[index].num = number;
				this.updateCart(item.cart_id,number)
			},
			
			//商品减少
			cutNumber(item,index) {
				let cartItem = this.cartGoods[index];
				let number = (cartItem.num - 1 > 1) ? cartItem.num - 1 : 1;
				this.cartGoods[index].num = number;
				this.updateCart(item.cart_id,number)
			},
			
			//加减计算
			updateCart(cart_id,num) {
				let that = this;
				util.request(api.setCartGoNum,{
					cart_id: cart_id,
					num: num
				},'post').then(res=>{
					let total = 0;
					this.cartGoods.forEach(item=>{
						if(item.checked) {
							total += parseFloat(item.price)*item.num;
						}
					})
					this.cartTotal.checkedGoodsAmount = total.toFixed(2);
				})
			},
			//全选
			checkedAll() {
				let that = this;
				if(this.checkedAllStatus) {
					this.cartGoods.forEach(el=>{
						el.checked = false;
					})
					this.card_ids = [];
					this.cartTotal.checkedGoodsCount = 0;
					this.cartTotal.checkedGoodsAmount = '0.00';
				}else {
					let total = 0;
					this.cartGoods.forEach(el=>{
						el.checked = true;
						this.card_ids.push(el.cart_id)
						total += parseFloat(el.price)*el.num;
					})
					this.cartTotal.checkedGoodsAmount = total.toFixed(2);
					this.cartTotal.checkedGoodsCount = this.cartGoods.length;
				}
				this.checkedAllStatus = !this.checkedAllStatus;
			},
			//单选
			checkedItem(item,index) {
				let that = this;
				let tmpCartData = this.cartGoods.map(function (element, vindex, array) {
					if (index == vindex){
						element.checked = !element.checked;
						if(element.checked) {
							let total = parseFloat(element.price)*element.num;
							that.cartTotal.checkedGoodsAmount = (parseFloat(that.cartTotal.checkedGoodsAmount)+total).toFixed(2)
							that.cartTotal.checkedGoodsCount ++ ;
							if(that.cartTotal.checkedGoodsCount == that.cartGoods.length) {
								that.checkedAllStatus = true;
							}
						}else {
							let total = parseFloat(element.price)*element.num;
							that.cartTotal.checkedGoodsAmount = (parseFloat(that.cartTotal.checkedGoodsAmount)-total).toFixed(2)
							that.cartTotal.checkedGoodsCount -- ;
							if(that.cartTotal.checkedGoodsCount != that.cartGoods.length) {
								that.checkedAllStatus = false;
							}
						}
						
					}
					return element;
				});
				this.cartGoods = tmpCartData;
				
			},
			//编辑
			editCart() {
				let that = this;
				if(that.isEditCart) {
					this.isEditCart = !this.isEditCart
				}else {
					this.isEditCart = !this.isEditCart
				}
			},
			//删除所选
			deleteCart() {
				let that = this;
				let productIds = this.cartGoods.filter(function (element, index, array) {
					if (element.checked == true) {
						return true;
					} else {
						return false;
					}
				});
				if (productIds.length <= 0) {
				      return false;
				}
				productIds = productIds.map(function (element, index, array) {
				    if (element.checked == true) {
						return element.cart_id;
				    }
				});
				let ids = productIds.join(',')
				util.request(api.delCartLists,{
					cart_id: ids
				},'post').then(res=>{
					if(res.code == 0) {
						wx.showToast({
							title: '删除成功'
						})
						that.getList();
						that.isEditCart = false;
						that.cartTotal.goodsCount = 0;
						that.cartTotal.goodsAmount = '0.00';
						that.cartTotal.checkedGoodsCount = 0;
						that.cartTotal.checkedGoodsAmount = '0.00';

					}
				})
			},
			//下单
			checkoutOrder() {
				let that = this;
				let productIds = this.cartGoods.filter(function (element, index, array) {
					if (element.checked == true) {
						return true;
					} else {
						return false;
					}
				});
				if (productIds.length <= 0) {
				      return false;
				}
				productIds = productIds.map(function (element, index, array) {
				    if (element.checked == true) {
						return element.cart_id;
				    }
				});
				let ids = productIds.join(',')
				wx.showLoading({
					mask:true
				})
				util.request(api.getCartOrder,{
					ids: ids
				},'post').then(res=>{
					wx.hideLoading()
					if(res.code == 0) {
						wx.navigateTo({
							url: '/pages/shoping/checkout'
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
	.service-policy{
	    width: 750rpx;
	    height: 73rpx;
	    background: #f4f4f4;
	    padding: 0 31.25rpx;
	    display: flex;
	    flex-flow: row nowrap;
	    align-items: center;
	    justify-content: space-between;
	}
	.service-policy .item{
	    background: url(../../static/images/yq.png) 0 center no-repeat;
	    background-size: 10rpx;
	    padding-left: 15rpx;
	    display: flex;
	    align-items: center;
	    font-size: 25rpx;
	    color: #666;
	}
	.no-cart{
	    width: 100%;
	    height: auto;
	    margin: 0 auto;
	}
	
	.no-cart .c{
	    width: 100%;
	    height: auto;
	    margin-top: 200rpx;
	}
	
	.no-cart .c image{
	    margin: 0 auto;
	    display: block;
	    text-align: center;
	    width: 258rpx;
	    height: 258rpx;
	}
	
	.no-cart .c text{
	    margin: 0 auto;
	    display: block;
	    width: 258rpx;
	    height: 29rpx;
	    line-height: 29rpx;
	    text-align: center;
	    font-size: 29rpx;
	    color: #999;
	}
	.cart-view{
	    width: 100%;
	    height: auto;
	    overflow: hidden;
	    
	}
	
	.cart-view .list{
	    height: auto;
	    width: 100%;
	    overflow: hidden;
	    margin-bottom: 120rpx;
	}
	.cart-view .group-item{
	    height: auto;
	    width: 100%;
	    background: #fff;
	    margin-bottom: 18rpx;
	}
	
	.cart-view .item{
	    height: 164rpx;
	    width: 100%;
	    overflow: hidden;
	}
	.cart-view .item .checkbox{
	    float: left;
	    height: 34rpx;
	    width: 34rpx;
	    margin: 65rpx 18rpx 65rpx 26rpx;
	    background: url(../../static/images/wgx.png) no-repeat;
	    background-size: 34rpx;
	}
	
	.cart-view .item .checkbox.checked{
	    background: url(../../static/images/gx.png) no-repeat;
	    background-size: 34rpx;
	}
	
	.cart-view .item .cart-goods{
	    float: left;
	    height: 164rpx;
	    width: 672rpx;
	    border-bottom: 1px solid #f4f4f4;
	}
	
	.cart-view .item .img{
	    float: left;
	    height:125rpx;
	    width: 125rpx;
	    background: #f4f4f4;
	    margin: 19.5rpx 18rpx 19.5rpx 0;
	}
	
	.cart-view .item .info{
	    float: left;
	    height:125rpx;
	    width: 503rpx;
	    margin: 19.5rpx 26rpx 19.5rpx 0;
	}
	
	.cart-view .item .t{
	    margin: 8rpx 0;
	    height: 28rpx;
	    font-size: 25rpx;
	    color: #333;
	    overflow: hidden;
	}
	
	
	.cart-view .item .name{
	    height: 28rpx;
	    max-width: 90%;
	    line-height: 28rpx;
	    font-size: 25rpx;
	    color: #333;
	    overflow: hidden;
	    display: block;
	    float: left;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.cart-view .item .num{
	    height: 28rpx;
	    line-height: 28rpx;
	    float: right;
	}
	
	.cart-view .item .attr{
	    margin-bottom: 17rpx;
	    height: 24rpx;
	    line-height: 24rpx;
	    font-size: 22rpx;
	    color: #666;
	    overflow: hidden;
	}
	
	.cart-view .item .b{
	    height: 28rpx;
	    line-height: 28rpx;
	    font-size: 25rpx;
	    color: #333;
	    overflow: hidden;
	}
	
	.cart-view .item .price{
	    float: left;
		color: #ec544f;
	}
	
	.cart-view .item .open{
	    height: 28rpx;
	    width: 150rpx;
	    display: block;
	    float: right;
	    background: url(../../static/images/down.png) right center no-repeat;
	    background-size: 25rpx;
	    font-size: 25rpx;
	    color: #333;
	}
	
	.cart-view .item.edit .t{
	    display: none;
	}
	
	.cart-view .item.edit .attr{
	    text-align: right;
	    background: url(../../static/images/right.png) right center no-repeat;
	    padding-right: 25rpx;
	    background-size: 12rpx 20rpx;
	    margin-bottom: 24rpx;
	    height: 39rpx;
	    line-height: 39rpx;
	    font-size: 24rpx;
	    color: #999;
	    overflow: hidden;
	}
	
	.cart-view .item.edit .b{
	    display: flex;
	    height: 52rpx;
	    overflow: hidden;
	}
	
	.cart-view .item.edit .price{
	    line-height: 52rpx;
	    height: 52rpx;
	    flex: 1;
	}
	
	.cart-view .item .selnum{
	    display: none;
	}
	
	.cart-view .item.edit .selnum{
	    width: 235rpx;
	    height: 52rpx;
	    border: 1rpx solid #ccc;
	    display: flex;
	}
	
	.selnum .cut{
	    width: 70rpx;
	    height: 100%;
	    text-align: center;
	    line-height: 50rpx;
	}
	
	.selnum .number{
	    flex: 1;
	    height: 100%;
	    text-align: center;
	    line-height: 68.75rpx;
	    border-left: 1px solid #ccc;
	    border-right: 1px solid #ccc;
	    float: left;
	}
	
	.selnum .add{
	    width: 80rpx;
	    height: 100%;
	    text-align: center;
	    line-height: 50rpx;
	}
	
	
	.cart-view .group-item .header{
	    width: 100%;
	    height: 94rpx;
	    line-height: 94rpx;
	    padding: 0 26rpx;
	    border-bottom: 1px solid #f4f4f4;
	}
	
	.cart-view .promotion .icon{
	    display: inline-block;
	    height: 24rpx;
	    width: 15rpx;
	}
	
	.cart-view .promotion{
	    margin-top: 25.5rpx;
	    float: left;
	    height: 43rpx;
	    width: 480rpx;
	    /*margin-right: 84rpx;*/
	    line-height: 43rpx;
	    font-size: 0;
	}
	
	.cart-view .promotion .tag{
	    border: 1px solid #f48f18;
	    height: 37rpx;
	    line-height: 31rpx;
	    padding: 0 9rpx;
	    margin-right: 10rpx;
	    color: #f48f18;
	    font-size: 24.5rpx;
	}
	
	.cart-view .promotion .txt{
	    height: 43rpx;
	    line-height: 43rpx;
	    padding-right: 10rpx;
	    color: #333;
	    font-size: 29rpx;
	    overflow: hidden;
	}
	
	.cart-view .get{
	    margin-top: 18rpx;
	    float: right;
	    height: 58rpx;
	    padding-left: 14rpx;
	    border-left: 1px solid #d9d9d9;
	    line-height: 58rpx;
	    font-size: 29rpx;
	    color: #333;
	}
	.cart-bottom{
	    position: fixed;
	    bottom:0;
	    left:0;
	    height: 100rpx;
	    width: 100%;
	    background: #fff;
	    display: flex;
	}
	
	.cart-bottom .checkbox{
	    height: 34rpx;
	
	    padding-left: 60rpx;
	    line-height: 34rpx;
	    margin: 33rpx 18rpx 33rpx 26rpx;
	    background: url(../../static/images/wgx.png) no-repeat;
	    background-size: 34rpx;
	    font-size: 29rpx;
	}
	
	.cart-bottom .checkbox.checked{
	    background: url(../../static/images/gx.png) no-repeat;
	    background-size: 34rpx;
	}
	
	.cart-bottom .total{
	    height: 34rpx;
	    flex: 1;
	    margin: 33rpx 10rpx;
	    font-size: 29rpx;
		color: #ec544f;
	}
	
	
	.cart-bottom .delete{
	    height: 34rpx;
	    width: auto;
	    margin: 33rpx 18rpx;
	    font-size: 29rpx;
	}
	
	.cart-bottom .checkout{
	    height: 100rpx;
	    width: 210rpx;
	    text-align: center;
	    line-height: 100rpx;
	    font-size: 29rpx;
	    background: #ec544f;
	    color: #fff;
	}
	.cart-bottom .checkout.disabled{
		background: #D9D9D9;
	}
</style>
