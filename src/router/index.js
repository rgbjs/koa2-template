import Router from 'koa-router'

const router = new Router()
const { api } = globalThis.config.project

router.use(api)

export default router
