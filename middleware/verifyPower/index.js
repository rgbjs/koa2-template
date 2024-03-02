// 权限判断
import { CheckAuthority, authorization } from '#common'

const checkAuthority = new CheckAuthority({
	baseURL: '/api',
	route: {
		admin: [
			{
				url: '/admin',
				method: '*',
				match: 'startWith'
			}
		]
	},
	whiteList: [
		{
			url: '/login',
			method: '*',
			match: 'startWith'
		}
	]
})

/**
 * 权限判断中间件
 */
export default () => {
	return async (ctx, next) => {
		const { url, method } = ctx

		const isWhiteList = checkAuthority.checkWhiteList({ url, method })
		if (isWhiteList) {
			await next()
			return
		}

		let userAuthorization = ctx.headers.authorization || ''
		userAuthorization = userAuthorization.split(' ')[1] || userAuthorization

		let tokenInfo
		try {
			tokenInfo = await authorization.verifyToken(userAuthorization)
		} catch (error) {
			console.log(error)
			ctx.body = {
				code: -1,
				msg: '登录过期'
			}
			return
		}

		ctx.state.tokenInfo = tokenInfo
		const isPower = checkAuthority.checkRoute({ url, method, ruleName: tokenInfo.data.identity })
		if (isPower) {
			await next()
			return
		}

		ctx.body = {
			code: 401,
			msg: '没有权限'
		}
	}
}
