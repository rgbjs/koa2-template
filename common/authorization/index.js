import jwt from 'jsonwebtoken'
import randomKey from '../randomKey/index.js'

let { token: key, effectiveTime, verifyTime } = globalThis.config.project
if (key === '') key = randomKey(32)

/**
 * 生成一个 Token
 * @param {object} params - 需要保存在 Token 里的数据
 * @param {object} options - 生成 Token 的配置选项
 * @returns {Promise<string>} 一个符合JWT规范的字符串
 */
export const createToken = (params = {}, options = { expiresIn: effectiveTime }) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ data: params }, key, options, (err, encoded) => {
            if (err) {
                reject(err)
            } else {
                resolve(encoded)
            }
        })
    })

}

/**
 * 验证一个 Token
 * @param {string} token - 需要验证的 token
 * @param {object} options - 验证的配置选项
 * @returns {Promise<object>}
 */
export const verifyToken = (token, options = { ignoreExpiration: !verifyTime }) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, key, options, (err, decoded) => {
            if (err) {
                reject(err)
            } else {
                resolve(decoded)
            }
        })
    })
}