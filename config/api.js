/**
 *   接口api地址 统一管理
 */

const ApiRootUrl = 'https://www.jifenduobao.com:8106/api/';

module.exports = {
    IndexUrl: 		   ApiRootUrl+ 'index/index',    				//首页数据接口案例
	AuthLoginByWeixin: ApiRootUrl+ 'app.passport/login',  			//微信登录
	getUserInfoBy:	   ApiRootUrl+ '/api/app.member/setInfo',		//获取用户信息
	AdBannerList: 	   ApiRootUrl+ 'app.ad/getInfo',  				//获取商城首页banner
	categoryList: 	   ApiRootUrl+ 'hub.category/getList',     		//获取分类列表
	HotGoodsList: 	   ApiRootUrl+ 'app.goods/getHotList',    		//获取热门商品
	getGoodsList: 	   ApiRootUrl+ 'app.goods/getList',       		//获取商品列表
	getGoodsInfo: 	   ApiRootUrl+ 'app.goods/getInfo',       		//获取商品详情
	getEvaluList: 	   ApiRootUrl+ 'app.evaluate/getList',    		//获取商品评论列表
	
	//免费抢购
	getZeroBlist: 	   ApiRootUrl+ 'app.zero_buy/getList',    		//获取免费抢购列表
	getZeroGlist: 	   ApiRootUrl+ 'app.zero_buy/getGoodsList',		//获取免费抢购商品列表
	//getZeroGinfo:      ApiRootUrl+ 'app.zero_buy/doGo',           //获取免费抢购商品详情
	getZeroGdoGo:      ApiRootUrl+ 'app.zero_buy/doGo',             //立即抢购
	getZeroRecordList: ApiRootUrl+ 'app.zero_buy/getRecordList',    //获取抢购记录
	getZeroOrder:      ApiRootUrl+ 'app.order/zeroBuy',             //免费抢购即领取商品
	
	//立即夺宝
	getTerasList: 	   ApiRootUrl+ 'app.treasure/getList',    		//获取积分夺宝列表
	getTreaGlist: 	   ApiRootUrl+ 'app.treasure/getGoodsList', 	//获取积分夺宝商品列表
	//getTreaGinfo:      ApiRootUrl+ 'app.zero_buy/doGo',           //获取积分夺宝商品详情
	getTreasDoGo:	   ApiRootUrl+ 'app.treasure/doGo', 			//立即夺宝
	getTreaRecordList: ApiRootUrl+ 'app.treasure/getRecordList',    //获取积分夺宝记录
	getTreaOrder:	   ApiRootUrl+ 'app.order/scoreRushBuy', 		//积分夺宝-即领取商品
	
	//购物车
	addGoodsCart: 	   ApiRootUrl+ 'app.car/add',             		//商品加入购物车
	setCartGoNum:	   ApiRootUrl+ 'app.car/setNum',				//购物车修改商品数量
	getCartLists:	   ApiRootUrl+ 'app.car/getList',				//获取购物车商品列表
	delCartLists:	   ApiRootUrl+ 'app.car/del',					//购物车删除商品
	getCartOrder:	   ApiRootUrl+ 'app.car/genOrder',				//购物车生产订单
	
	//收货地址
	getAddreList: 	   ApiRootUrl+ 'app.address/getList',   		//获取收货地址列表
	addAddreList:	   ApiRootUrl+ 'app.address/setAddr',			//新增收货地址
	setAddrDefault:	   ApiRootUrl+ 'app.address/setDefault', 		//设置默认地址
	delAddreList:	   ApiRootUrl+ 'app.address/del',				//删除收货地址
	getAddreInfo:	   ApiRootUrl+ 'app.address/getInfo',			//获取收货地址详情
	
	//订单
	getOrderList:	   ApiRootUrl+ 'app.order/getList',				//获取订单列表
	getOrderCart:	   ApiRootUrl+ 'app.order/cart',			    //生产支付订单
	getEvaluateOrder:  ApiRootUrl+ 'app.evaluate/add',				//评论订单商品
	setOrderCancel:    ApiRootUrl+ 'app.order/cancel',				//取消订单
	getOrderInfo:	   ApiRootUrl+ 'app.order/getInfo',				//订单详情
	getOrderReceived:  ApiRootUrl+ 'app.order/received',			//确认收货
	setRechargeOrder:  ApiRootUrl+ 'app.order/recharge',			//生产充值订单
	getLogisicList:	   ApiRootUrl+ 'hub.order/getLogisticsList',	//查看物流
	
	//支付
	getPayInfo:		   ApiRootUrl+ 'app.pay/getInfo',				//获取付签名数据
	getPayStatus:	   ApiRootUrl+ 'app.pay/getStatus',				//获取支付状态,验证是否支付成功还是失败
	balancePay:		   ApiRootUrl+ 'app.pay/balance',				//余额支付
	
	//充值
	getRechargeList:   ApiRootUrl+ 'app.recharge/getList',          //充值记录
	orderRecharge:	   ApiRootUrl+ 'app.order/recharge',			//生产充值订单
	
	//分享
	getShareCode:	   ApiRootUrl+ 'app.share/getCode',				//获取分享代码
	setShareRechge:	   ApiRootUrl+ 'app.share/setShare',			//新增分享记录
	setShareInfo:	   ApiRootUrl+ 'app.share/setInfo',				//分享后调用,验证哪个用户分享的
	
	//省市区
	getAreaList:	   ApiRootUrl+ 'hub.area/getList',				//获取省市区
	
	//个人中心信息
	getUserInfo:	   ApiRootUrl+ 'app.member/getSummanyInfo',		//获取个人中心
	getArticleInfo:	   ApiRootUrl+ 'hub.article/getInfo', 		//获取内容详细, 关于我们 1 幸福晒图区 2
	
	//提现
	getCashOutList:	   ApiRootUrl+ 'app.member/getCashOutList',		//获取提现列表
	getCashOut:		   ApiRootUrl+ 'app.member/getCashOutMoney',	//获取可提现金额
	cashOutBtn:		   ApiRootUrl+ 'app.order/cashOut',				//申请提现
	cashOutCancel:	   ApiRootUrl+ 'app.member/setCashOutCancel',   //取消提现
	
	
	
	
	
}