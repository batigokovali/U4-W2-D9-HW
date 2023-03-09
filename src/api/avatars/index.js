import Express from "express"
import multer from "multer"
import { extname } from "path"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { saveAuthorsAvatars } from "../../lib/fs-tools.js"

const authorAvatarsRouter = Express.Router()

const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "U4-W1-D4/avatars",
        },
    }),
}).single("avatar")

authorAvatarsRouter.post("/:authorID/uploadAvatar/single", cloudinaryUploader, async (req, res, next) => {
    try {
        console.log("FILE:", req.file)
        res.send({ message: "Avatar uploaded!" })
    } catch (error) {
        next(error)
    }
})

export default authorAvatarsRouter