import xss from 'xss'
import Router from "koa-router"
import { encryp } from '#common'
import { admin } from '#model'
import {
    checkQueryId,
    checkQueryAccount,
    checkQueryList,
    checkCreateAdmin,
    checkUpdateAdmin
} from './checking.js'

const router = new Router()

const {
    queryAdminList,
    queryAdminById,
    queryAdminByAccount,
    queryCount,
    createAdmin,
    updateAdmin,
    deleteAdmin
} = admin

/** 获取管理员列表 */
router.get('/admin', async (ctx) => {
    let { keyword = '', page = '1', limit = '10' } = ctx.query
    const check = checkQueryList({ keyword, page, limit })
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    keyword = xss(keyword) // 过滤替换
    const adminList = await queryAdminList({ keyword, page, limit })
    const count = await queryCount(keyword)
    ctx.body = {
        code: 0,
        msg: '获取管理员列表成功',
        count,
        data: adminList
    }
})

/** 根据id获取指定管理员 */
router.get('/admin/:id', async (ctx) => {
    const { id } = ctx.params
    const check = checkQueryId(id)
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const admin = await queryAdminById(id)
    if (!admin) {
        ctx.body = {
            code: 1,
            msg: '管理员不存在',
        }
        return
    }

    delete admin.password
    ctx.body = {
        code: 0,
        msg: '获取管理员成功',
        data: admin
    }
})

/** 根据account(账号)获取指定管理员 */
router.get('/admin/account/:account', async (ctx) => {
    const { account } = ctx.params
    const check = checkQueryAccount(account)
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const admin = await queryAdminByAccount(account)
    if (!admin) {
        ctx.body = {
            code: 1,
            msg: '管理员不存在',
        }
        return
    }

    delete admin.password
    ctx.body = {
        code: 0,
        msg: '获取管理员成功',
        data: admin
    }
})

/** 新建一个管理员 */
router.post('/admin', async (ctx) => {
    const { name, account, password, headerImg = '', remark = '' } = ctx.request.body
    const check = checkCreateAdmin({ name, account, password, headerImg, remark })
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const admin = await queryAdminByAccount(account)
    if (admin) {
        ctx.body = {
            code: 1,
            msg: '账号已存在, 请换个账号'
        }
        return
    }

    const encrypPassword = await encryp.encryp(password)
    await createAdmin({
        name,
        account,
        password: encrypPassword,
        headerImg,
        remark: xss(remark),
        createTime: Date.now() / 1000
    })

    ctx.body = {
        code: 0,
        msg: '管理员创建成功'
    }
})

/** 修改一个管理员 */
router.put('/admin', async (ctx) => {
    const check = checkUpdateAdmin(ctx.request.body)
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const { id } = ctx.request.body
    const adminInfo = await queryAdminById(id)
    if (!adminInfo) {
        ctx.body = {
            code: 1,
            msg: '管理员不存在'
        }
        return
    }
    const {
        name = adminInfo.name,
        password = adminInfo.password,
        headerImg = adminInfo.headerImg,
        remark = adminInfo.remark
    } = ctx.request.body

    await updateAdmin({ id, name, password, headerImg, remark })

    ctx.body = {
        code: 0,
        msg: '修改成功'
    }
})

/** 删除一个管理员 */
router.delete('/admin/:id', async (ctx) => {
    const { id } = ctx.params
    const check = checkQueryId(id)
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const adminInfo = await queryAdminById(id)
    if (!adminInfo) {
        ctx.body = {
            code: 1,
            msg: '管理员不存在'
        }
        return
    }

    await deleteAdmin({ id, deleteTime: Date.now() / 1000 })

    ctx.body = {
        code: 0,
        msg: '删除管理员成功',
    }
})

export default router