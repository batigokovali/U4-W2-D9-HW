import Express from "express";
import uniqid from "uniqid"
import { getAuthors, writeAuthors } from "../../lib/fs-tools.js";

const authorsRouter = Express.Router()

authorsRouter.post("/", async (req, res) => {
    const authorsArray = await getAuthors()
    if (authorsArray.some((a) => a.email === req.body.email)) {
        console.log("includes")
        res.status(400).send("Email already exist!")
    } else {
        console.log("Does not include, author can be added!")
        const newAuthor = { ...req.body, createdAt: new Date(), updatedAt: new Date(), id: uniqid() } //added some server generated info
        authorsArray.push(newAuthor)
        await writeAuthors(authorsArray)
        res.status(201).send({ message: newAuthor.id })
    }

})

authorsRouter.get("/", async (req, res) => {
    const authorsArray = await getAuthors()
    res.send(authorsArray)
})

authorsRouter.get("/:authorID", async (req, res) => { //dd82z1lfcleobbkne sample id
    const authorsArray = await getAuthors()
    const foundAuthor = authorsArray.find(author => author.id === req.params.authorID)
    res.status(200).send(foundAuthor)
})

authorsRouter.put("/:authorID", async (req, res) => {
    const authorsArray = await getAuthors()
    const index = authorsArray.findIndex(author => author.id === req.params.authorID)
    const oldAuthor = authorsArray[index]
    const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() }
    authorsArray[index] = updatedAuthor
    await writeAuthors(authorsArray)
    res.send(updatedAuthor)
})

authorsRouter.delete("/:authorID", async (req, res) => {
    const authorsArray = await getAuthors()
    const remainingAuthors = authorsArray.filter(author => author.id !== req.params.authorID)
    await writeAuthors(remainingAuthors)
    res.status(204).send()
})

export default authorsRouter