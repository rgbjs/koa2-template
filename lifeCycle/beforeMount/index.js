/**
 * 在应用挂载到端口之前
 */

import { listenError } from '#common'

export default ({ server }) => {
    server.on('error', listenError)
}