import crypto from 'crypto'

const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/**
 * 生成一个指定长度的安全随机字符串
 * @param {number} len - 生成的安全随机字符串长度, 默认为 32
 * @param {string} randomStr - 生成的安全随机字符串随机取值范围, 默认为 a-zA-Z0-9
 * @returns {string} 返回一个指定长度的安全随机字符串
 */
export default (len = 32, randomStr = str) => {
    let result = ''
    for (let i = 0; i < len; i++) {
        const randomIndex = crypto.randomInt(str.length)
        result += str.charAt(randomIndex)
    }
    return result
}