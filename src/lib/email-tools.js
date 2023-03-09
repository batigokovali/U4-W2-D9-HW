import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendEmail = async (recipientAdress) => {
    try {
        const msg = {
            to: recipientAdress,
            from: process.env.SENDGRID_SENDER_EMAIL_ADDRESS,
            subject: "First test email :D",
            text: "test :D",
            html: "<strong>I like watermelons<strong>"
        }
        let response = await sgMail.send(msg)
        console.log(response[0].statusCode)
        console.log(response[0].headers)
    } catch (error) {
        console.log(error)
    }

}