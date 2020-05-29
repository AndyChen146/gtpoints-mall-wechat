
<script>
	const api = require('./config/api.js');
	const util = require('./utils/util.js')
	export default {
		onLaunch: function() {
			let codes = wx.getStorageSync('code')
			if(codes && codes != "") {
				this.getCode();
			}
			
		},
		onShow: function(options) {
			if(options && options.shareTicket && options.scene == 1044) {
				wx.setStorageSync('ticket',options.shareTicket)	
			}
		},
		onHide: function() {
			//console.log('App Hide')
		},
		methods:{
			//获取分享code
			getCode() {
				util.request(api.getShareCode,{},'post').then(res=>{
					if(res.code == 0) {
						wx.setStorageSync('code',res.data.code)
					}
				})
			}
		}
	}
	App({
		onLaunch: function () {
			try {
				this.globalData.userInfo = JSON.parse(wx.getStorageSync('userInfo'));
				this.globalData.token = wx.getStorageSync('token');
			} catch (e) {
				//   console.log(e);
			}
		},
	
		globalData: {
			userInfo: {
				nickname: '',
				avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
			},
			token: '',
		}
	});
	
</script>

<style>
	/*每个页面公共css */
	.container {
		box-sizing: border-box;
		background-color: #f4f4f4;
		font-family: PingFangSC-Light,helvetica,'Heiti SC';
		height: 100%;
	} 
	
	view,image,text,navigator{
		box-sizing: border-box;
		padding:0;
		margin:0;
	
	}
	page {
		background: #f4f4f4;
	}
	view,text{
		font-family: PingFangSC-Light,helvetica,'Heiti SC';
		font-size: 28rpx;
		color: #333;
	}
	.clear {
		zoom: 1;
	}
	.clear:after{
		content: "";
		display: block;
		clear: both;
	}
</style>
