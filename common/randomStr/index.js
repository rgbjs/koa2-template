const random = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const getCode = () => {
    return random(2, 36).toString(36)
}

/**
 * 获取一个指定长度的字符串(0-9-a-z)
 * @param   {number}  num  指定字符长度 , 若为 0 或不传将返回一个空串
 * @return  {string} 返回一个指定长度的随机字符串  
 */
export default (num = 0) => {
    let result = ''
    while (result.length < +num) {
        result += getCode()
    }
    return result
}
