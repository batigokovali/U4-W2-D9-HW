import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { createWriteStream } from "fs"

const { readJSON, writeJSON, writeFile, createReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const authorsJSONPath = join(dataFolderPath, "authors.json")
const blogpostsJSONPath = join(dataFolderPath, "blogposts.json")

const authorAvatarsPublicFolderPath = join(process.cwd(), "./public/img/authors")
const blogpostCoversPublicFolderPath = join(process.cwd(), "./public/img/blogposts")

export const getAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = authorsArray => writeJSON(authorsJSONPath, authorsArray)

export const getBlogposts = () => readJSON(blogpostsJSONPath)
export const writeBlogposts = blogpostsArray => writeJSON(blogpostsJSONPath, blogpostsArray)

export const saveAuthorsAvatars = (fileName, fileContentAsBuffer) => writeFile(join(authorAvatarsPublicFolderPath, fileName), fileContentAsBuffer)
export const saveBlogpostCovers = (fileName, fileContentAsBuffer) => writeFile(join(blogpostCoversPublicFolderPath, fileName), fileContentAsBuffer)

export const getAuthorsJSONReadableStream = () => createReadStream(authorsJSONPath)

export const getBlogpostsJSONReadableStream = () => createReadStream(blogpostsJSONPath)
export const getBlogpostsPDFWritableStream = filename => createWriteStream(join(dataFolderPath, filename))