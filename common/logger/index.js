/**
 * 日志类型:
 * - 中断日志 崩溃
 * - 错误日志 警告
 * - 普通日志 分析
 * - 请求日志 详情
 * - 访问日志 统计
 * - 输出日志 提醒(默认)
 */

import path from 'path'
import log4js from 'log4js'
const { root } = globalThis.config
log4js.configure({
    appenders: {
        /** 中断日志 */
        stopErrorLog: {
            type: 'dateFile',
            filename: path.join(root, '/logs/stopErrorLog/stop.log'),
            pattern: 'yyyy-MM-dd',
            keepFileExt: true, // 保留文件后缀
            maxLogSize: 1024 * 1024, // 每个文件最大1MB
            fileNameSep: '_',
            numBackups: 500,
            layout: {
                type: "pattern",
                pattern: '级别: %p%n'
                    + '主机: %h%n'
                    + '记录时间: %d{yyyy-MM-dd hh:mm:ss}%n'
                    + '文件路径: %f%n'
                    + '调用定位: %f:%l:%o%n'
                    + '调用堆栈: %n%s%n'
                    + '记录数据: %m%n',
            }
        },

        /** 错误日志 */
        errorLog: {
            type: 'dateFile',
            filename: path.join(root, '/logs/errorLog/error.log'),
            pattern: 'yyyy-MM-dd',
            keepFileExt: true, // 保留文件后缀
            maxLogSize: 1024 * 1024, // 每个文件最大1MB
            fileNameSep: '_',
            numBackups: 500,
            layout: {
                type: "pattern",
                pattern: '级别: %p%n'
                    + '主机: %h%n'
                    + '记录时间: %d{yyyy-MM-dd hh:mm:ss}%n'
                    + '文件路径: %f%n'
                    + '调用定位: %f:%l:%o%n'
                    + '调用堆栈: %n%s%n'
                    + '记录数据: %m%n',
            }
        },

        /** 普通日志 */
        currency: {
            type: 'dateFile',
            filename: path.join(root, '/logs/currencyLog/currency.log'),
            pattern: 'yyyy-MM-dd',
            keepFileExt: true, // 保留文件后缀
            maxLogSize: 1024 * 1024, // 每个文件最大1MB
            fileNameSep: '_',
            numBackups: 500,
            layout: {
                type: "pattern",
                pattern: '级别: %p%n'
                    + '主机: %h%n'
                    + '记录时间: %d{yyyy-MM-dd hh:mm:ss}%n'
                    + '文件路径: %f%n'
                    + '调用定位: %f:%l:%o%n'
                    + '调用堆栈: %n%s%n'
                    + '记录数据: %m%n',
            }
        },

        /** 请求日志 */
        requestLog: {
            type: 'dateFile',
            filename: path.join(root, '/logs/requestLog/request.log'),
            pattern: 'yyyy-MM-dd',
            keepFileExt: true, // 保留文件后缀
            maxLogSize: 1024 * 1024, // 每个文件最大1MB
            fileNameSep: '_',
            numBackups: 500,
            layout: {
                type: "pattern",
                pattern: '级别: %p%n'
                    + '主机: %h%n'
                    + '记录时间: %d{yyyy-MM-dd hh:mm:ss}%n'
                    + '文件路径: %f%n'
                    + '调用定位: %f:%l:%o%n'
                    + '调用堆栈: %n%s%n'
                    + '记录数据: %m%n',
            }
        },

        /** 访问日志 */
        accessLog: {
            type: 'dateFile',
            filename: path.join(root, '/logs/accessLog/access.log'),
            pattern: 'yyyy-MM-dd',
            keepFileExt: true, // 保留文件后缀
            maxLogSize: 1024 * 1024, // 每个文件最大1MB
            fileNameSep: '_',
            numBackups: 500,
            layout: {
                type: "pattern",
                pattern: '级别: %p%n'
                    + '主机: %h%n'
                    + '记录时间: %d{yyyy-MM-dd hh:mm:ss}%n'
                    + '文件路径: %f%n'
                    + '调用定位: %f:%l:%o%n'
                    + '调用堆栈: %n%s%n'
                    + '记录数据: %m%n',
            }
        },

        /** 输出日志 */
        console: {
            type: 'console'
        },
    },

    categories: {
        /** 中断日志 */
        stopErrorLog: {
            enableCallStack: true,
            level: 'all',
            appenders: ['stopErrorLog'],
            pm2: true
        },

        /** 错误日志 */
        errorLog: {
            enableCallStack: true,
            level: 'all',
            appenders: ['errorLog'],
            pm2: true
        },

        /** 普通日志 */
        currencyLog: {
            enableCallStack: true,
            level: 'all',
            appenders: ['currency'],
            pm2: true
        },

        /** 请求日志 */
        requestLog: {
            enableCallStack: true,
            level: 'all',
            appenders: ['requestLog'],
            pm2: true
        },

        /** 访问日志 */
        accessLog: {
            enableCallStack: true,
            level: 'all',
            appenders: ['accessLog'],
            pm2: true
        },

        /** 输出日志 */
        default: {
            enableCallStack: true,
            level: 'all',
            appenders: ['console'],
            pm2: true
        },
    },
})

 /** 中断日志 崩溃 */
export const stopErrorLog = log4js.getLogger('stopErrorLog')
/** 错误日志 警告 */
export const errorLog = log4js.getLogger('errorLog')
/** 普通日志 分析 */
export const currencyLog = log4js.getLogger('currencyLog')
/** 请求日志 详情 */
export const requestLog = log4js.getLogger('requestLog')
/** 访问日志 统计 */
export const accessLog = log4js.getLogger('accessLog')
/** 输出日志 提醒(默认) */
export const defaultLog = log4js.getLogger()

// 未正常退出时将没记录完的日志继续记录完
process.on('exit', () => {
    log4js.shutdown()
})

// 中断异常记录
process.on('uncaughtException', (err, origin) => {
    defaultLog.error('进程中断错误', err, '\n')
    stopErrorLog.error(
        `\n    异常源: ${origin} => ${origin === 'uncaughtException' ? '同步错误' : 'Promise 被拒绝错误'}\n`
        + `    错误类型: ${err?.name}\n`
        + `    错误信息: ${err?.message}\n`
        + `    错误堆栈: ${err?.stack}`
    )

    log4js.shutdown(() => {
        process.exit(1)
    })
})
