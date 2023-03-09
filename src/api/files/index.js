import Express from "express"
import multer from "multer"
import { extname } from "path"
import { saveBlogpostCovers, getBlogposts, writeBlogposts } from "../../lib/fs-tools.js"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { pipeline } from "stream"
import createHttpError from "http-errors"
import { getBlogpostsJSONReadableStream } from "../../lib/fs-tools.js"
import { asyncPDFGeneration, getBlogpostPDFReadableStream } from "../../lib/pdf-tools.js"
import { Transform } from "@json2csv/node"
import { sendEmail } from "../../lib/email-tools.js"

const blogpostFilesRouter = Express.Router()

const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "U4-W1-D4/blogposts",
        },
    }),
}).single("cover")

blogpostFilesRouter.post("/:blogpostID/uploadCover/single", cloudinaryUploader, async (req, res, next) => {
    try {
        console.log("FILE:", req.file)
        // const blogpostsArray = await getBlogposts()
        // const index = blogpostsArray.findIndex(blogpost => blogpost.id === req.params.blogpostID)
        // const oldBlogpost = blogpostsArray[index]
        // const updatedBlogpost = { ...oldBlogpost, ...req.body, coverURL: `http://localhost:3001/img/blogposts/${fileName}`, updatedAt: new Date() }
        // blogpostsArray[index] = updatedBlogpost
        // await writeBlogposts(blogpostsArray)

        res.send({ message: "blogpost cover uploaded :D" })
    } catch (error) {
        next(error)
    }

})

blogpostFilesRouter.get("/:blogpostID/pdf", async (req, res, next) => {

    const blogposts = await getBlogposts()
    const blogpostWithID = blogposts.find(blogpost => blogpost.id === req.params.blogpostID)
    if (blogpostWithID) {
        res.setHeader("Content-Disposition", `attachment; filename=${req.params.blogpostID}.pdf`)
        const source = await getBlogpostPDFReadableStream(blogpostWithID)
        const destination = res
        pipeline(source, destination, err => {
            if (err) {
                next(err)
            }
        })
    } else {
        next(createHttpError(404, `Blogpost with id ${req.params.blogpostID} not found!`))
    }
})


blogpostFilesRouter.get("/:blogpostID/asyncPDF", async (req, res, next) => {
    try {
        const blogposts = await getBlogposts()
        const blogpostWithID = blogposts.find(blogpost => blogpost.id === req.params.blogpostID)
        if (blogpostWithID) {
            console.log(blogpostWithID)
            await asyncPDFGeneration(blogpostWithID)
            res.send({ message: "PDF GENERATED CORRECTLY" })
        } else {
            next(createHttpError(404, `Blogpost with id ${req.params.blogpostID} not found!`))
        }
    } catch (error) {
        next(error)
    }

})



export default blogpostFilesRouter