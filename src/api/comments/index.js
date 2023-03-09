import Express from "express";
import uniqid from "uniqid"
import { getBlogposts, writeBlogposts } from "../../lib/fs-tools.js";

const commentsRouter = Express.Router()

commentsRouter.post("/:blogpostID/comments", async (req, res, next) => {
    try {
        const newBlogpostComment = { ...req.body, comment_id: uniqid(), createdAt: new Date(), updatedAt: new Date() }
        const blogpostsArray = await getBlogposts()
        const index = blogpostsArray.findIndex(blogpost => blogpost.id === req.params.blogpostID)
        blogpostsArray[index].comments.push(newBlogpostComment)
        await writeBlogposts(blogpostsArray)
        res.send(`Comment sent`)
    } catch (error) {
        next(error)
    }
})

commentsRouter.get("/:blogpostID/comments", async (req, res, next) => {
    try {
        const blogpostsArray = await getBlogposts()
        const index = blogpostsArray.findIndex(blogpost => blogpost.id === req.params.blogpostID)
        res.send(blogpostsArray[index].comments)
    } catch (error) {
        next(error)
    }
})

export default commentsRouter