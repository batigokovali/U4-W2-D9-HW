import PdfPrinter from "pdfmake";
import imageToBase64 from "image-to-base64";
import { pipeline } from "stream" // CORE PACKAGE
import { promisify } from "util" // CORE PACKAGE
import { readFile } from "fs"
import { getBlogpostsPDFWritableStream } from "./fs-tools.js";


export const getBlogpostPDFReadableStream = async blogpost => {
    // Define font files
    const fonts = {
        Courier: {
            normal: "Courier",
            bold: "Courier-Bold",
            italics: "Courier-Oblique",
            bolditalics: "Courier-BoldOblique",
        },
        Helvetica: {
            normal: "Helvetica",
            bold: "Helvetica-Bold",
            italics: "Helvetica-Oblique",
            bolditalics: "Helvetica-BoldOblique",
        },
    }

    const printer = new PdfPrinter(fonts)

    const coverBase64 = await imageToBase64(blogpost.coverURL);

    const content = [blogpost.title, blogpost.content, blogpost.id, {
        image: `data:image/jpeg;base64,${coverBase64}`,
        width: 150,
        height: 150
    }]

    const docDefinition = {
        content: [...content],
        defaultStyle: {
            font: "Helvetica",
        },
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                font: "Courier",
            },
            subheader: {
                fontSize: 15,
                bold: false,
            },
        },
    }

    const pdfReadableStream = printer.createPdfKitDocument(docDefinition)
    pdfReadableStream.end()

    return pdfReadableStream
}

export const asyncPDFGeneration = async (blogpost) => {
    const source = await getBlogpostPDFReadableStream(blogpost)
    const destination = getBlogpostsPDFWritableStream("test.pdf")
    const promiseBasedPipeline = promisify(pipeline)
    await promiseBasedPipeline(source, destination)
}