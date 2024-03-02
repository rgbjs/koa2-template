import { logger } from '#common'

const { currencyLog, defaultLog } = logger

/** 路由错误 */
export default (err) => {
    const text = `\n    错误类型: ${err.name}\n`
        + `    错误信息: ${err.message}\n`
        + `    错误堆栈: ${err.stack}`
    defaultLog.error('路由错误', err, '\n')
    currencyLog.error(text)
}