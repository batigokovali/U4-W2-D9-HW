import { pipeline } from "stream"
import Express from "express"
import { getBlogpostsJSONReadableStream } from "../../lib/fs-tools.js"
import { getBlogpostPDFReadableStream } from "../../lib/pdf-tools.js"
import { Transform } from "@json2csv/node"

const blogpostCSVRouter = Express.Router()

blogpostCSVRouter.get("/csv", (req, res, next) => {
    try {
        res.setHeader("Content-Disposition", `attachment; filename=blogposts.csv`)
        const source = getBlogpostsJSONReadableStream()
        const transform = new Transform({ fields: ["category", "title", "id"] })
        const destination = res
        pipeline(source, transform, destination, err => {
            if (err) console.log(err)
        })
    } catch (error) {
        next(error)
    }
})

export default blogpostCSVRouter