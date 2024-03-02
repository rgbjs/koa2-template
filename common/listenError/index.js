const { project, color } = globalThis.config

/** 监听端口失败 */
export default (err) => {
    console.log('')
    console.log(color.danger(project.fail))
    console.log('')
    throw err
}