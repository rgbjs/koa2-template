import randomKey from '#root/common/randomKey/index.js'
import chalk from 'chalk'
import { formatDate } from 'assist-tools'

const success = chalk.hex("#1bd1a5")
console.clear()
console.log('')
console.log('🛠️', success('生成成功'), '🎉 🎉 🎉')
console.log('')
console.log('✨', success(formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')))
console.log('')
console.log('✨', success(randomKey()))
console.log('')