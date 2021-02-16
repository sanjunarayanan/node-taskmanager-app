const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelocomeEmail = (email,name)=>{
  try {
    sgMail.send({
      to:email,
      from:'sanju@hopescoding.com',
      subject:'Mail from Task Manager Application',
      text:`Welcome to the Task Manager Application  ${name}`
    })
  } catch (error) {
    console.log(error);
  }
}


const sendCancellationEmail = (email,name)=>{
  try {
    sgMail.send({
      to:email,
      from:'sanju@hopescoding.com',
      subject:'Mail from Task Manager Application',
      text:`Good Bye Mister ${name} . Best of Luck !!!..`
    })
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  sendWelocomeEmail,
  sendCancellationEmail
}
