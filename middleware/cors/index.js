/**
 * 跨域处理 cors 中间件
 * @param {object} [options] 配置对象
 * @param {string} [options.origin] 放行的域名或跨域规则, 默认为 dynamic, 规则 dynamic 或 notAllowed 或 * 或 具体域名
 * - dynamic 动态的, 例如请求者为 https://rgbyun.com 那么跨域允许的域名也为 https://rgbyun.com [推荐]
 * - notAllowed 不允许跨越 [推荐]
 * - \* 允许所有域名跨域, 注意若设置为 * 浏览器将不会携带 cookie [不推荐]
 * - https://rgbyun.com 具体域名 [推荐]
 *  @param {string|string[]} [options.allowMethods] 允许跨域请求的方法, 默认为 ['GET', 'POST'], 例: ['GET', 'POST'] 或 'GET,POST'
 *  @param {string|string[]} [options.allowHeader] 允许改动的请求头, 默认为 ['authorization', 'content-type'], 例: ['authorization', 'content-type'] 或 'authorization,content-type'
 *  @param {number} [options.maxAge] 下次预检间隔时间, 单位秒, 默认为 86400 (一天), 例: 60
 *  @param {boolean} [options.credentials] 是否允许跨域携带凭证(cookie)请求, 默认为 true, origin 为 * 时无效, 例: true 或 false
 *  @param {string|string[]} [options.exposeHeaders] 允许js获取的响应头, 默认为 ['authorization'], 例: ['authorization', 'content-type'] 或 'authorization,content-type'
 */
export default (options = {}) => {
	const { origin, allowMethods, allowHeader, maxAge, credentials, exposeHeaders } = init(options)

	return async (ctx, next) => {
		if (origin !== 'notAllowed') {
			ctx.set({
				'Access-Control-Allow-Origin': backOrigin(origin, ctx),
				'Access-Control-Allow-Methods': allowMethods,
				'Access-Control-Allow-Headers': allowHeader,
				'Access-Control-Allow-Credentials': credentials,
				'Access-Control-Expose-Headers': exposeHeaders
			})

			if (ctx.method === 'OPTIONS') {
				// 预检请求
				ctx.set({
					'Access-Control-Max-Age': maxAge
				})
				ctx.body = null
				return
			}
		}
		await next()
	}
}

const backOrigin = (origin, ctx) => {
	if (origin === '*') return '*'
	if (origin === 'dynamic') return ctx.headers.origin
	return origin
}

const init = (options) => {
	const {
		origin = 'dynamic',
		allowMethods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'],
		allowHeader = ['authorization', 'content-type'],
		maxAge = 86400,
		credentials = true,
		exposeHeaders = ['authorization']
	} = options

	if (typeof origin !== 'string') {
		throw new TypeError('"origin" must be a string')
	}

	if (!(typeof allowMethods === 'string' || Array.isArray(allowMethods))) {
		throw new TypeError('"allowMethods" must be a string or an array of strings')
	}

	if (!(typeof allowHeader === 'string' || Array.isArray(allowHeader))) {
		throw new TypeError('"allowHeader" must be a string or an array of strings')
	}

	if (!(typeof exposeHeaders === 'string' || Array.isArray(exposeHeaders))) {
		throw new TypeError('"exposeHeaders" must be a string or an array of strings')
	}

	if (!(typeof maxAge === 'string' || typeof maxAge === 'number')) {
		throw new TypeError('"maxAge" must be a string or number')
	}

	return {
		origin,
		allowMethods: typeof allowMethods === 'string' ? allowMethods : allowMethods.join(','),
		allowHeader: typeof allowHeader === 'string' ? allowHeader : allowHeader.join(','),
		exposeHeaders: typeof exposeHeaders === 'string' ? exposeHeaders : exposeHeaders.join(','),
		maxAge,
		credentials
	}
}
