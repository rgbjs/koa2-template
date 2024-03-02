/**
 * 在 koa 应用实例后, 所有中间件use()之前
 */

import router from '#router'
import { bodyParser } from '@koa/bodyparser'
import koaStatic from 'koa-static'
import { routeError } from '#common'
import { verifyPower, cors } from '#middleware'

const { project } = globalThis.config
export default async (app) => {
	app.on('error', routeError)
	app.use(cors({ origin: project.cors })) // 跨域配置
	app.use(koaStatic(project.dist)) // 前端静态资源
	app.use(bodyParser()) // body 参数解析
	app.use(verifyPower()) // 路由权限判断
	app.use(router.routes())
}
