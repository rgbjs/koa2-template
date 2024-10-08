import { type lifeCycle } from '#sysType'
import { cors } from '#sysMiddleware'
import koaStatic from 'koa-static'
import { bodyParser } from '@koa/bodyparser'
import router from '#router'
import { routeError } from '#lib'
import { checkAuthority } from '#middleware'

export default (ctx: lifeCycle.InitedCtx) => {
	const { app } = ctx
	app.on('error', routeError)
	app.use(cors())
	app.use(bodyParser()) // body 参数解析
	app.use(koaStatic(globalThis.config.project.webPath)) // 前端静态资源
	app.use(checkAuthority()) // 权限验证
	app.use(router.routes()) // 使用路由
}
