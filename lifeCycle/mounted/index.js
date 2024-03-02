/**
 * 在应用挂载到端口之后
 */

const { NODE_ENV, project, color } = globalThis.config
export default () => {
	if (NODE_ENV === 'production') {
		console.clear()
		console.log('')
		console.log(color.success(project.success))
		console.log('')
		console.log(color.success(`✨ 当前为生产模式, ${project.port} 端口监听中...`))
		console.log('')
	}
}
