import { encryp } from '#common'

// 初始化数据库表
const { account, password } = globalThis.config.admin
export default async ({ notLog, execute, query, pool }) => {
    const createAdminTableSql = `create table if not exists admin(
        id int primary key auto_increment,
        name varchar(20) comment '名字',
        account varchar(20) comment '账号',
        password varchar(255) comment '密码',
        headerImg varchar(300) comment '头像url',
        remark text comment '备注',
        createTime datetime comment '创建时间, UTC时间',
        deleteTime datetime comment '删除时间, UTC时间'
    );`
    await notLog.execute(createAdminTableSql)

    const queryRootSql = `select * from admin where account = '${account}'`
    const root = await notLog.execute(queryRootSql)
    if (!root[0].length) {
        const encrypPassword = await encryp.encryp(password)
        const createRootSql = `insert into 
        admin(name, account, password, headerImg, remark, createTime)
        values('初始账号', '${account}', '${encrypPassword}', '', '', from_unixtime(${Date.now() / 1000}));`
        await notLog.execute(createRootSql)
    }
}