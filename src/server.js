import Express from "express" //added "type" : "module" to the JSON file
import { join } from "path"
import cors from 'cors'
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./api/authors/index.js"
import blogpostsRouter from "./api/blogposts/index.js"
import authorAvatarsRouter from "./api/avatars/index.js"
import blogpostFilesRouter from "./api/files/index.js"
import commentsRouter from "./api/comments/index.js"
import blogpostCSVRouter from "./api/files/blogpostCSV.js"
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notfoundHandler } from "./errorHandlers.js"
import createHttpError from "http-errors"
import swaggerUi from "swagger-ui-express"
import yaml from "yamljs"


const server = Express()
const port = process.env.PORT
console.log(port)
const publicFolderPath = join(process.cwd(), "./public")
const yamlFile = yaml.load(join(process.cwd(), "./src/docs/apiDocs.yml"))

//GLOBAL MIDDLEWARES
//added this to get rid of undefined bodies in request

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

server.use(Express.static(publicFolderPath))
server.use(
    cors({
        origin: (currentOrigin, corsNext) => {
            if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
                corsNext(null, true)
            } else {
                corsNext(createHttpError(400, `Origin ${currentOrigin} is not in the whitelist!`))
            }
        }
    })
)

server.use(Express.json())

//ENDPOINTS
server.use("/authors", authorsRouter)
server.use("/authors", authorAvatarsRouter)
server.use("/blogposts", blogpostCSVRouter)
server.use("/blogposts", blogpostsRouter)
server.use("/blogposts", blogpostFilesRouter)
server.use("/blogposts", commentsRouter)
server.use("/docs", swaggerUi.serve, swaggerUi.setup(yamlFile))


//ERROR HANDLERS
server.use(badRequestHandler) // 400
server.use(unauthorizedHandler) // 401
server.use(notfoundHandler) // 404
server.use(genericErrorHandler) // 500

//ESSENTIALS
server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
})