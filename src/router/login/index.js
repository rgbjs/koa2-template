import Router from 'koa-router'
import { encryp, authorization } from '#common'
import { admin } from '#model'
import { checkLogin } from './checking.js'

const router = new Router()
const { queryAdminByAccount } = admin

router.post('/login/admin', async (ctx) => {
	let { account, password } = ctx.request.body
	const check = checkLogin({ account, password })
	if (check.code !== 0) {
		ctx.body = check
		return
	}

	const admin = await queryAdminByAccount(account)
	if (!admin) {
		ctx.body = {
			code: 1,
			msg: '账号或密码错误'
		}
		return
	}

	const verifyReuslt = await encryp.verify(password, admin.password)
	if (!verifyReuslt) {
		ctx.body = {
			code: 1,
			msg: '账号或密码错误'
		}
		return
	}

	delete admin.password
	const token = await authorization.createToken({
		...admin,
		identity: 'admin'
	})

	ctx.body = {
		code: 0,
		msg: '登录成功',
		token
	}
})

export default router
