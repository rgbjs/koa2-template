import clipboard from 'clipboardy'
import chalk from 'chalk'
import { formatDate } from 'assist-tools'
import randomKey from '##root/common/randomKey/index.js'

const success = chalk.hex('#1bd1a5')
const warning = chalk.hex('#E6A23C')
const key = randomKey()

console.clear()
console.log('')
console.log('🛠️', success('生成成功'), '🎉 🎉 🎉')
console.log('')
console.log('✨', success(formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')))
console.log('')
try {
	clipboard.writeSync(key)
	console.log('✨', success('已为您写入剪切板'))
} catch (error) {
	console.log('✨', warning('写入剪切板失败, 请手动复制'))
}

console.log('')
console.log('✨', success(key))
console.log('')
