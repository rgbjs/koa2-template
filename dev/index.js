import nodemon from 'nodemon'
import path from 'path'
import '#config'

const { project, color, ip } = globalThis.config
const init = () => {
    console.clear()
    console.log('')
    console.log(color.success(project.success))
    console.log('')
    console.log(color.success(`✨ http://127.0.0.1:${project.port}`))
    console.log('')
    console.log(color.success(`✨ http://${ip}:${project.port}`))
    console.log('')
    console.log(color.success(`✨ 当前为开发模式, ${project.port} 端口监听中...`))
    console.log('')
}
init()

nodemon({
    script: path.resolve('./main.js')
})

let flag = false
nodemon.on('start', () => {
    if (flag) {
        flag = false
        init()
    }
})

nodemon.on('crash', () => {
    flag = true
    console.log('')
    console.error(color.danger('Error: 应用程序已崩溃...'))
    console.log('')
})
