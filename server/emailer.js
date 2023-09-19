const firebase = require("./firebaseAdmin");

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function monitorAndEmail() {

  let updateThreshold = new Date();
  updateThreshold.setHours(updateThreshold.getHours() - 1)
  firebase.firestore.collection("art").where("lastUpdated", ">=", updateThreshold).get().then((newArtworks) => {
    console.log("Querying results");
    if (newArtworks.docs.length != 0) {
      const a= {
        to: 'alam.shahul@gmail.com', // Change to your recipient
        from: 'dtr-webmasters@mit.edu', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: updateTime.getHours() + ':' + updateTime.getMinutes() + ':' + updateTime.getSeconds(),
        html: updateTime.getHours() + ':' + updateTime.getMinutes() + ':' + updateTime.getSeconds()
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
    }
  })
  .catch((error) => {
      console.log("We ran out of requests for today.")
  })
}

module.exports = monitorAndEmail;
