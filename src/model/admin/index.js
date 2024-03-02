import { execute } from '../db/index.js'

const queryAdminListSql = `select 
id, name, account, headerImg, remark, createTime 
from admin 
where (name like concat('%', ?, '%') or account like concat('%', ?, '%')) and deleteTime is null order by id desc limit ?, ?`

/**
 * 获取管理员列表
 * - 列表中不包含 `password` 字段
 * @param {object} options 配置选项
 * @param {string} options.keyword 关键字, 对 name 和 account 进行模糊查找
 * @param {number} options.page 页码, 大于 0 的正整数
 * @param {number} options.limit 需要多少条数据
 * @returns {Promese<object[]>} 返回一个管理员列表
 */
export const queryAdminList = async ({ keyword, page, limit }) => {
    page = (page - 1) * limit
    const result = await execute(queryAdminListSql, [keyword, keyword, String(page), String(limit)])
    return result[0]
}


const queryCountSql = `select count(id) as count
from admin
where (name like concat('%', ?, '%') or account like concat('%', ?, '%')) and deleteTime is null;`

/**
 * 获取管理员列表的长度
 * @param {string} keyword 关键字, 对 name 和 account 进行模糊查找
 * @returns {Promese<number>} 根据条件过滤后统计的总条数
 */
export const queryCount = async (keyword) => {
    const result = await execute(queryCountSql, [keyword, keyword])
    return result[0][0].count
}


const queryAdminByIdSql = `select
id, name, account, password, headerImg, remark, createTime
from admin
where id = ? and deleteTime is null;`

/**
 * 根据 id 查询一个管理员
 * @param {number} id 管理员的id
 * @returns {Promese<object>} 返回一个指定管理员, 如果不存在则返回 undefined
 */
export const queryAdminById = async (id) => {
    const result = await execute(queryAdminByIdSql, [String(id)])
    return result[0][0]
}


const queryAdminByAccountSql = `select
id, name, account, password, headerImg, remark, createTime
from admin
where account = ? and deleteTime is null;`

/**
 * 根据 account 查询一个管理员
 * @param {string} account 管理员的account
 * @returns {Promese<object>} 返回一个指定管理员, 如果不存在则返回 undefined
 */
export const queryAdminByAccount = async (account) => {
    const result = await execute(queryAdminByAccountSql, [account])
    return result[0][0]
}


const createAdminSql = `insert into 
admin(name, account, password, headerImg, createTime, remark)
values(?, ?, ?, ?, from_unixtime(?), ?);`

/**
 * 创建一个管理员
 * @param {object} options 参数对象
 * @param {string} options.name 管理员名字
 * @param {string} options.account 管理员账号
 * @param {string} options.password 管理员密码
 * @param {string} options.headerImg 管理员头像地址
 * @param {number} options.createTime 管理员创建时间(unix时间戳)
 * @param {string} options.remark 备注
 * @returns {Promese<void>} 
 */
export const createAdmin = async ({ name, account, password, headerImg, createTime, remark }) => {
    await execute(createAdminSql, [name, account, password, headerImg, String(createTime), remark])
}


const updateAdminSql = `update admin 
set name = ?, password = ?, headerImg = ?, remark = ? 
where id = ? and deleteTime is null;`
/**
 * 修改一个管理员
 * @param {object} options 参数对象
 * @param {number} options.id 管理员ID
 * @param {string} options.name 管理员名字
 * @param {string} options.password 管理员密码
 * @param {string} options.headerImg 管理员头像地址
 * @param {string} options.remark 备注
 * @returns {Promese<void>} 
 */
export const updateAdmin = async ({ name, password, headerImg, remark, id }) => {
    await execute(updateAdminSql, [name, password, headerImg, remark, String(id)])
}


const deleteAdminSql = `update admin set deleteTime = from_unixtime(?) where id = ? and deleteTime is null;`
/**
 * 删除一个管理员
 * @param {object} options 参数对象
 * @param {number} options.id 管理员ID
 * @param {number} options.deleteTime 删除时间(unix时间戳)
 * @returns {Promese<void>} 
 */
export const deleteAdmin = async ({ deleteTime, id }) => {
    await execute(deleteAdminSql, [String(deleteTime), String(id)])
}
