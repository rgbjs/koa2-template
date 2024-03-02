import { isId, isString, isEffectiveValue, isPositiveInt } from 'assist-tools'
import { rules } from '#lib'
const { checkName, checkAccount, checkPassword, checkHeaderImg, checkRemark } = rules

export const checkQueryList = ({ keyword, page, limit }) => {
    if (!isString(keyword, page, limit)) {
        return {
            code: 1,
            msg: '搜索参数类型有误'
        }
    }

    if (!(isEffectiveValue(page, limit) && isPositiveInt(+page, +limit))) {
        return {
            code: 1,
            msg: '查询条件有误'
        }
    }

    return {
        code: 0
    }
}

export const checkQueryId = (id) => {
    if (!(typeof id === 'string' || typeof id === 'number')) {
        return {
            code: 1,
            msg: 'ID类型有误'
        }
    }

    if (!isId(+id)) {
        return {
            code: 1,
            msg: '传递的值不是一个有效的ID'
        }
    }

    return {
        code: 0
    }
}

export const checkQueryAccount = (account) => {
    if (typeof account !== 'string') {
        return {
            code: 1,
            msg: '类型有误'
        }
    }

    return {
        code: 0
    }
}

export const checkCreateAdmin = ({ name, account, password, headerImg, remark }) => {
    const resultArr = [
        checkName(name),
        checkAccount(account),
        checkPassword(password),
        checkHeaderImg(headerImg),
        checkRemark(remark)
    ]

    const result = resultArr.find(resultItem => resultItem.code !== 0)
    if (result) return result

    return {
        code: 0
    }
}

export const checkUpdateAdmin = ({ id, name, password, headerImg, remark }) => {
    const checkIdResult = checkQueryId(id)
    if (checkIdResult.code !== 0) {
        return checkIdResult
    }

    const resultArr = [
        name === undefined ? { code: 0 } : checkName(name),
        password === undefined ? { code: 0 } : checkPassword(password),
        headerImg === undefined ? { code: 0 } : checkHeaderImg(headerImg),
        remark === undefined ? { code: 0 } : checkRemark(remark)
    ]

    const result = resultArr.find(resultItem => resultItem.code !== 0)
    if (result) return result

    return {
        code: 0
    }
}