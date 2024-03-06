// 测试阶段, 暂停使用
import '#config'
import path from 'path'

const { root } = globalThis.config

export default {
	target: 'node',
	entry: './main.js',
	experiments: {
		outputModule: true
	},
	output: {
		filename: 'bundle.js',
		path: path.join(root, './dist'),
		publicPath: '/',
		asyncChunks: true,
		chunkFormat: 'module'
	},
	stats: {
		errorDetails: true
	},
	resolve: {
		alias: {
			'##root': root,
			'##src': path.join(root, './src'),
			'#config': path.join(root, './config/index.js'),
			'#middleware': path.join(root, './middleware/index.js'),
			'#common': path.join(root, './common/index.js'),
			'#router': path.join(root, './src/router/index.js'),
			'#utils': path.join(root, './src/utils/index.js'),
			'#lib': path.join(root, './src/lib/index.js'),
			'#model': path.join(root, './src/model/index.js'),
			'#state': path.join(root, './src/state/index.js')
		}
	}
}
