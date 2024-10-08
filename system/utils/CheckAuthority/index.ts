import path from 'path'
import { isType, readOnly } from 'assist-tools'
import {
	Config,
	Rule,
	Check,
	MatchMap,
	FormatRule,
	Method,
	ExtractRouterKeys,
	ParseRouter,
	ParseRouterItem,
	CustomMatch,
	CheckWhiteListConfig
} from './types/index.js'
import output from '../output/index.js'

const matchMap: MatchMap = {
	default(url, method, rule) {
		try {
			if (!rule.method.includes(method)) {
				return false
			}
			if (url === rule.url) {
				return true
			}
		} catch {}
		return false
	},

	startWith(url, method, rule) {
		try {
			if (!rule.method.includes(method)) {
				return false
			}
			if (url.startsWith(rule.url) || url === rule.url) {
				return true
			}
		} catch {}
		return false
	},

	include(url, method, rule) {
		try {
			if (!rule.method.includes(method)) {
				return false
			}
			if (url.includes(rule.url)) {
				return true
			}
		} catch {}
		return false
	}
}

const methodArr: Method[] = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH']

/**
 * 身份鉴权
 */
class CheckAuthority<T extends Config> {
	#baseURL: string
	#router: ParseRouter = {}
	#whiteList: ParseRouterItem[]

	/**
	 * 身份鉴权
	 * @param config 配置对象
     * @example
    new CheckAuthority({
        baseURL: '/api',
        route: {
            admin: [
                {
                    url: '/admin',
                    method: '*',
                    match: 'startWith'
                },
                {
                    url: '/user',
                    method: '*',
                    match: 'startWith'
                }
            ],
            user: [
                {
                    url: '/user',
                    method: 'PUT',
                }
            ]
        },
        whiteList: [
            {
                url: '/login',
                method: '*',
                match: 'startWith'
            },
            {
                url: '/file',
                method: '*',
                match: 'startWith'
            }
        ],
    })
	 */
	constructor(config: T = {} as T) {
		const { baseURL = '/', router = {}, whiteList = [] } = config
		this.#init(baseURL, router, whiteList)
		this.#baseURL = baseURL
		const names = Object.keys(router)
		names.forEach((name) => {
			this.#router[name] = router[name].map((rule) => this.#formatRule(rule))
		})
		this.#whiteList = whiteList.map((rule) => this.#formatRule(rule))
	}

	/**
	 * 获取解析后的配置(只读)
	 */
	get config() {
		return readOnly({
			baseURL: this.#baseURL,
			route: this.#router,
			whiteList: this.#whiteList
		})
	}

	#init(
		baseURL: string,
		route: {
			[key: string]: Rule[]
		},
		whiteList: Rule[]
	) {
		if (isType(baseURL) !== 'string') {
			throw new TypeError('"baseURL" mast be a string')
		}

		if (isType(route) !== 'object') {
			throw new TypeError('"route" mast be a object')
		}

		if (isType(whiteList) !== 'array') {
			throw new TypeError('"whiteList" mast be a array')
		}
	}

	#formatRule(rule: Rule): FormatRule {
		let { url, method, match = 'default' } = rule

		if (typeof url !== 'string') {
			throw new TypeError('"url" must be a string')
		}
		url = path.join(this.#baseURL, url).replaceAll('\\', '/')

		const err = `"method" must be a * or ${methodArr} or array`
		if (!(typeof method === 'string' || Array.isArray(method))) {
			throw new TypeError(err)
		}

		if (method === '*') {
			method = methodArr
		} else if (typeof method === 'string') {
			method = method.trim().toLocaleUpperCase() as Method
			if (!methodArr.includes(method)) {
				throw new TypeError(err)
			}
			method = [method]
		} else if (Array.isArray(method)) {
			method = method.map((item) => {
				const method = String(item).trim().toLocaleUpperCase() as Method
				if (!methodArr.includes(method)) {
					throw new TypeError(err)
				}
				return method
			})
		}

		const matchList = ['default', 'startWith', 'include']
		type TMatchList = (typeof matchList)[number]
		if (!(matchList.includes(match as TMatchList) || typeof match === 'function')) {
			throw new TypeError(err)
		}
		if (typeof match !== 'function') {
			match = matchMap[match].bind(this)
		}

		return { url, method, match: match as CustomMatch }
	}

	/**
	 * 判断路由是否通过校验(验证路由规则配置和白名单配置)
	 * @param config 配置对象
	 */
	check(config: Check<ExtractRouterKeys<T>>): boolean {
		let { url, method, ruleName } = config
		method = method.toUpperCase() as Method
		const isWhiteList = this.#whiteList.find((rule) =>
			rule.match(url, method, { url: rule.url, method: rule.method })
		)
		if (isWhiteList) return true
		const rules = this.#router[ruleName]
		if (!rules) {
			output.warning(`CheckAuthority: check - route => "${String(ruleName)}" rules does not exist`)
			return false
		}
		const result = rules.find((rule) => rule.match(url, method, { url: rule.url, method: rule.method }))
		return !!result
	}

	/**
	 * 判断路由是否通过路由规则校验(忽略白名单配置)
	 * @param config 配置对象
	 */
	checkRoute(config: Check<ExtractRouterKeys<T>>): boolean {
		let { url, method, ruleName } = config
		method = method.toUpperCase() as Method
		const rules = this.#router[ruleName]
		if (!rules) {
			output.warning(`CheckAuthority: checkRoute - route => "${String(ruleName)}" rules does not exist`)
			return false
		}
		const result = rules.find((rule) => rule.match(url, method, { url: rule.url, method: rule.method }))
		return !!result
	}

	/**
	 * 判断路由是否通过白名单校验
	 * @param config 配置对象
	 */
	checkWhiteList(config: CheckWhiteListConfig): boolean {
		let { url, method } = config
		method = method.toUpperCase() as Method
		const isWhiteList = this.#whiteList.find((rule) =>
			rule.match(url, method, { url: rule.url, method: rule.method })
		)
		return !!isWhiteList
	}
}

export default CheckAuthority
