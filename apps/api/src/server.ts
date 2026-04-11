import Fastify from "fastify"

import { registerPlugins } from "./plugins/index.js"
import { registerHealthRoute } from "./routes/health.js"

const PORT = Number(process.env.PORT ?? 3002)
const HOST = process.env.HOST ?? "0.0.0.0"

export async function buildServer() {
  const app = Fastify({ logger: true })

  await registerPlugins(app)
  registerHealthRoute(app)

  return app
}

async function start() {
  const app = await buildServer()
  await app.listen({ port: PORT, host: HOST })
}

if (process.env.NODE_ENV !== "test") {
  start().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
