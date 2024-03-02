import { rules } from '#lib'
const { checkAccount, checkPassword } = rules

export const checkLogin = ({ account, password }) => {
    if (!(checkAccount(account).code === 0 && checkPassword(password).code === 0)) {
        return {
            code: 1,
            msg: '账号或密码有误'
        }
    }

    return {
        code: 0
    }
}
