import http from 'http'
import Koa from 'koa'
import lifeCycle from "./lifeCycle/index.js"

await lifeCycle.beforeInit()
const app = new Koa()
await lifeCycle.inited(app)

const { project } = globalThis.config
const server = http.createServer(app.callback())
await lifeCycle.beforeMount({ app, server })

server.listen(project.port, async listenErr => {
    await lifeCycle.mounted({ app, server, listenErr })
})
