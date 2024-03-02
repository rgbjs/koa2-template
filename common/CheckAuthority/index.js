import { isType } from 'assist-tools'
import path from 'path'

const matchMap = {
    default(url, method, rule) {
        try {
            if (!rule.method.includes(method)) {
                return false
            }
            if (url === rule.url) {
                return true
            }
        } catch { }
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
        } catch { }
        return false
    },

    include(url, method, rule) {
        try {
            if (!rule.method.includes(method)) {
                return false
            }
            if (url.include(rule.url)) {
                return true
            }
        } catch { }
        return false
    }
}

/**
 * @typedef Route
 * @property {string} url 请求路径
 * @property {'*'|string|array} method 请求方法
 * @property {Function|'default'|'startWith'|'include'} match 匹配规则
 */

/**
 * 身份鉴权
 */
class CheckAuthority {
    #baseURL
    #route = {}
    #whiteList

    /**
     * @param {object} config 配置对象
     * @param {string} config.baseURL 基础路径, 默认为 '/' , 配置该项后, route 和 whiteList 中的 url 可省略基础路径
     * @param {{[key:string]: Route}} config.route 路由规则
     * @param {{[key:string]: Route}} config.whiteList 白名单路由规则
     */
    constructor(config) {
        const { baseURL = '/', route = {}, whiteList = [] } = config
        this.#init(baseURL, route, whiteList)
        this.#baseURL = baseURL
        const names = Object.keys(route)
        names.forEach(name => {
            this.#route[name] = route[name].map(rule => this.#formatRule(rule))
        })
        this.#whiteList = whiteList.map(rule => this.#formatRule(rule))
    }

    #init(baseURL, route, whiteList) {
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

    #formatRule(rule) {
        let { url, method, match = 'default' } = rule

        if (typeof url !== 'string') {
            throw new TypeError('"url" must be a string')
        }
        url = path.join(this.#baseURL, url)

        if (!(typeof method === 'string' || Array.isArray(method))) {
            throw new TypeError('"method" must be a string or string array')
        }
        if (method === '*') {
            method = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH']
        } else if (typeof method === 'string') {
            method = method.split(',').map(item => item.toUpperCase().trim())
        } else if (Array.isArray(method)) {
            method = method.map(item => item.toUpperCase().trim())
        }

        const matchList = ['default', 'startWith', 'include']
        if (!(matchList.includes(match) || typeof match === 'function')) {
            throw new TypeError('"method" must be a string or string array')
        }
        if (typeof match !== 'function') {
            match = matchMap[match].bind(this)
        }

        return { url, method, match }
    }

    /**
     * 判断路由是否通过校验
     * @param {object} config 配置对象
     * @param {string} url 请求路径
     * @param {string} method 请求方法
     * @param {string} ruleName 使用的规则
     * @returns {boolean}
     */
    check(config) {
        let { url, method, ruleName } = config
        url = path.join(url)
        method = method.toUpperCase()
        const isWhiteList = this.#whiteList.find(rule => rule.match(url, method, { url: rule.url, method: rule.method }))
        if (isWhiteList) return true
        const rules = this.#route[ruleName]
        if (!rules) {
            throw new Error(`CheckAuthority: check - route => "${ruleName}" rules does not exist`)
        }
        const result = rules.find(rule => rule.match(url, method, { url: rule.url, method: rule.method }))
        return !!result
    }

    /**
     * 判断路由是否通过路由规则校验
     * @param {object} config 配置对象
     * @param {string} url 请求路径
     * @param {string} method 请求方法
     * @param {string} ruleName 使用的规则
     * @returns {boolean}
     */
    checkRoute(config) {
        let { url, method, ruleName } = config
        url = path.join(url)
        method = method.toUpperCase()
        const rules = this.#route[ruleName]
        if (!rules) {
            throw new Error(`CheckAuthority: checkRoute - route => "${ruleName}" rules does not exist`)
        }
        const result = rules.find(rule => rule.match(url, method, { url: rule.url, method: rule.method }))
        return !!result
    }

    /**
     * 判断路由是否通过白名单校验
     * @param {object} config 配置对象
     * @param {string} url 请求路径
     * @param {string} method 请求方法
     * @returns {boolean}
     */
    checkWhiteList(config) {
        let { url, method } = config
        url = path.join(url)
        method = method.toUpperCase()
        const isWhiteList = this.#whiteList.find(rule => rule.match(url, method, { url: rule.url, method: rule.method }))
        return !!isWhiteList
    }
}

export default CheckAuthority
