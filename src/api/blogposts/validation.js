import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const BlogpostsSchema = {
    category: {
        in: ["body"],
        isString: {
            errorMessage: "Category is a mandatory field and needs to be a string!"
        }
    },
    title: {
        in: ["body"],
        isString: {
            errorMessage: "Title is a mandatory field and needs to be a string!"
        }
    },
    cover: {
        in: ["body"],
        isString: {
            errorMessage: "Cover is a mandatory field and needs to be a string!"
        }
    },
    "readTime.value": {
        in: ["body"],
        isNumeric: {
            errorMessage: "Value is a mandatory field and needs to be a number!"
        },
    },
    "readTime.unit": {
        in: ["body"],
        isString: {
            errorMessage: "Unit is a mandatory field and needs to be a time unit!"
        },
    },
    "author.name": {
        in: ["body"],
        isString: {
            errorMessage: "Author name is a mandatory field and needs to be a string!"
        },
    },
    "author.avatar": {
        in: ["body"],
        isString: {
            errorMessage: "Avatar is a mandatory field and needs to be a string (image link)!"
        },
    },
    content: {
        in: ["body"],
        isString: {
            errorMessage: "Content is a mandatory field and needs to be a object!"
        },
    },
}

export const checkBlogpostsSchema = checkSchema(BlogpostsSchema)

export const triggerBadRequest = (req, res, next) => {
    const errors = validationResult(req)
    console.log(errors.array())
    if (errors.isEmpty()) {
        next()
    } else {
        next(createHttpError(400, "Errors during blogpost validation", { errorsList: errors.array() }))
    }
}