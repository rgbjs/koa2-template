export { type PropertyPath } from 'lodash-es'
import { type PropertyPath } from 'lodash-es'
import Session from '../index.js'

export interface JSONData {
	[key: string | number]: string | number | boolean | null | JSONData
}

/**
 * 迭代回调函数
 */
export type Eatch = (
	this: Session,
	value: [string, JSONData],
	index: number,
	sessionStore: Map<string, Record<string, any>>
) => void | any

/**
 * 配置对象
 */
export interface Config {
	/**
	 * 当前实例唯一标识
	 */
	sign?: any
	/**
	 * 当创建会话时触发
	 * - 如果返回一个 Promise 则等待该 Promise 完成
	 * - 触发时机在写入内存会话仓库之前, 如果产生错误, 内存中的会话将不会执行操作
	 * @param id 会话 ID
	 * @param content 会话内容
	 */
	onCreate?: (this: Session, id: string, content: JSONData) => void | Promise<void> | any
	/**
	 * 当更新会话时触发
	 * - 如果返回一个 Promise 则等待该 Promise 完成
	 * - 触发时机在写入内存会话仓库之前, 如果产生错误, 内存中的会话将不会执行操作
	 * @param ctx 上下文对象
	 */
	onUpdate?: (
		this: Session,
		ctx: {
			/**
			 * 会话 ID
			 */
			id: string
			/**
			 * 操作数据的路径
			 */
			prop: PropertyPath
			/**
			 * 传递的值
			 */
			value: JSONData | number | string | boolean | null
			/**
			 * 旧的值
			 */
			originData: JSONData
			/**
			 * 新的值
			 */
			newData: JSONData
		}
	) => void | Promise<void> | any
	/**
	 * 当重新设置会话时触发
	 * - 如果返回一个 Promise 则等待该 Promise 完成
	 * - 触发时机在写入内存会话仓库之前, 如果产生错误, 内存中的会话将不会执行操作
	 * @param id 会话 ID
	 * @param data 会话数据
	 */
	onSet?: (this: Session, id: string, data: JSONData) => void | Promise<void> | any
	/**
	 * 当删除会话时触发
	 * - 如果返回一个 Promise 则等待该 Promise 完成
	 * - 触发时机在写入内存会话仓库之前, 如果产生错误, 内存中的会话将不会执行操作
	 * @param id 会话 ID
	 * @param data 会话数据
	 */
	onDelete?: (this: Session, id: string) => void | Promise<void> | any
}
