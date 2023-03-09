import Express from "express";
import uniqid from "uniqid"
import createHttpError from "http-errors";
import authorsRouter from "../authors/index.js";
import { checkBlogpostsSchema, triggerBadRequest } from "./validation.js"
import { getBlogposts, writeBlogposts } from "../../lib/fs-tools.js";
import { sendEmail } from "../../lib/email-tools.js";

const blogpostsRouter = Express.Router()

blogpostsRouter.post("/", checkBlogpostsSchema, triggerBadRequest, async (req, res, next) => {
    try {
        const newBlogpost = { ...req.body, id: uniqid(), createdAt: new Date(), updatedAt: new Date() }
        const blogpostsArray = await getBlogposts()
        blogpostsArray.push(newBlogpost)
        await writeBlogposts(blogpostsArray)
        const email = "batigokovali@icloud.com"
        await sendEmail(email)
        res.send({ id: newBlogpost.id })
    } catch (error) {
        next(error)
    }
})

blogpostsRouter.get("/", async (req, res, next) => {
    const blogposts = await getBlogposts()
    if (req.query && req.query.category) {
        const filteredBlogposts = blogposts.filter(blogpost => blogpost.category === req.query.category)
        res.send(filteredBlogposts)
    }
    res.send(blogposts)
})

blogpostsRouter.get("/:blogpostID", async (req, res, next) => {
    try {
        const blogpostsArray = await getBlogposts()
        const foundBlogpost = blogpostsArray.find(blogpost => blogpost.id === req.params.blogpostID)
        console.log(foundBlogpost)
        if (foundBlogpost) {
            res.send(foundBlogpost)
        } else {
            next(createHttpError(404, `Blogpost with id ${req.params.blogpostID} not found, try again!`))
        }
    } catch (error) {
        next(error)
    }
})

blogpostsRouter.put("/:blogpostID", async (req, res, next) => {
    try {
        const blogpostsArray = await getBlogposts()
        const index = blogpostsArray.findIndex(blogpost => blogpost.id === req.params.blogpostID)

        if (index !== -1) {
            const oldBlogpost = blogpostsArray[index]
            const updatedBlogpost = { ...oldBlogpost, ...req.body, updatedAt: new Date() }
            blogpostsArray[index] = updatedBlogpost
            await writeBlogposts(blogpostsArray)
            res.send(updatedBlogpost)
        } else {
            next(createHttpError(404, `Blogpost with id ${req.params.blogpostID} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

blogpostsRouter.delete("/:blogpostID", async (req, res, next) => {
    try {
        const blogpostsArray = await getBlogposts()
        const remainingBlogposts = blogpostsArray.filter(blogpost => blogpost.id !== req.params.blogpostID)

        if (blogpostsArray.length !== remainingBlogposts.length) {
            await writeBlogposts(remainingBlogposts)
            res.status(204).send()
        } else {
            next(createHttpError(404, `Blogpost with id ${req.params.blogpostID} not found :D`))
        }
    } catch (error) {
        next(error)
    }
})

authorsRouter.get("/:authorID/blogposts", async (req, res, next) => {
    try {
        const blogpostsArray = await getBlogposts()
        const blogpostsWithAuthorsID = blogpostsArray.filter(blogpostWithID => blogpostWithID.author.id === req.params.authorID)
        res.send(blogpostsWithAuthorsID)
    } catch (error) {
        next(error)
    }
})

export default blogpostsRouter