const userData = {
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
  }