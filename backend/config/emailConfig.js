/* Send Email configuration */

const userData = {
    USER: 'contact@lekaakou.com', 
    //PASS: 'Charlene-92'
    PASS: '2NIwz8a61s'
} 

/*const userData = {
  USER: 'rodriguekongne@gmail.com', 
  PASS: 'Charlene-91'
}

module.exports = {
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: userData.USER,
    pass: userData.PASS
  }
}*/
module.exports = {
    host: 'mail.epanzy.com',
    port: 465,
    secure: true, 
    auth: {
    user: userData.USER,
    pass: userData.PASS
  }
} 
