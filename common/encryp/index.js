import bcrypt from 'bcrypt'

const { encryptKey, salt } = globalThis.config.project
const startKey = Math.floor(encryptKey.substr(0, encryptKey.length / 2))
const endKey = encryptKey.substr(startKey.length)

/**
 * 加密
 * @param {string} awaitEncrypStr 需要加密的字符串
 * @returns {Promise<string>} hash 后的字符串
 */
export const encryp = async (awaitEncrypStr) => {
    return await bcrypt.hash(startKey + awaitEncrypStr + endKey, salt)
}


/**
 * 验证是否通过(验证明文hash后是否同hashStr一致)
 * @param {string} awaitVerifyStr 需要验证的明文字符串
 * @param {string} hashStr 已被加密过的字符串
 * @returns {Promise<boolean>}
 */
export const verify = async (awaitVerifyStr, hashStr) => {
    return await bcrypt.compare(startKey + awaitVerifyStr + endKey, hashStr)
}