import { logger } from '#common'
import mysql2 from 'mysql2/promise'
import initTable from '../initTable/index.js'
const { host, user, port, password, database } = globalThis.config.mysql
const { project } = globalThis.config
const { defaultLog, errorLog } = logger

// 创建连接池，设置连接池的参数
export const pool = mysql2.createPool({
	host,
	port,
	user,
	password,
	charset: 'utf8mb4',
	multipleStatements: true,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0
	// debug: true,
	// idleTimeout: 1000 * 60 * 60 * 24 // 空闲连接超时时间，单位毫秒
})

pool.on('error', (err) => {
	const text = `\n    错误类型: ${err.name}\n` + `    错误信息: ${err.message}\n` + `    错误堆栈: ${err.stack}`
	defaultLog.error('mysql错误', err, '\n')
	errorLog.error(text)
})

/**
 * 不使用日志记录的方法
 */
export const notLog = {
	query: pool.query.bind(pool),
	execute: pool.execute.bind(pool)
}

export const query = async (...args) => {
	try {
		return await pool.query(...args)
	} catch (error) {
		if (error && error.name === 'Error' && error.message === 'No database selected') {
			await query(`use ${database}`)
			const text =
				`\n    错误类型: ${error.name}\n` +
				`    错误信息: query 连接错误 => ${error.message}\n` +
				`    错误堆栈: ${error.stack}`
			errorLog.error(text)
			return pool.query(...args)
		} else {
			throw error
		}
	}
}

export const execute = async (...args) => {
	try {
		return await pool.execute(...args)
	} catch (error) {
		if (error && error.name === 'Error' && error.message === 'No database selected') {
			await query(`use ${database}`)
			const text =
				`\n    错误类型: ${error.name}\n` +
				`    错误信息: execute 连接错误 => ${error.message}\n` +
				`    错误堆栈: ${error.stack}`
			errorLog.error(text)
			return pool.execute(...args)
		} else {
			throw error
		}
	}
}

// 创建数据库
await notLog.execute(
	`create database if not exists ${database} default character set utf8mb4 default collate utf8mb4_bin`
)
await notLog.query(`use ${database}`)
await initTable({ notLog, execute, query, pool })
