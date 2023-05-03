const asyncHandler = require('express-async-handler')
var bcrypt = require("bcryptjs");
var nodemailer = require('nodemailer');
const model = require('../models')
const transport = require('../config/emailConfirmation.js');
const generateToken = require('../utils/generateToken.js');
/* const { token } = require('morgan');
const { confirmationToken } = require('../models'); */
const User = model.user
const ConfirmationToken = model.confirmationToken


// @desc    Auth user & get token
// @route   GET /api/users/login
// @access  public

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email: email } })

    //var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if(user && bcrypt.compareSync(req.body.password, user.password)){
        if(!user.isLocked){
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            })
        } else {
            res.status(401)
            throw new Error('isLocked')
        }
    } else {
        res.status(401)
        throw new Error('Email et/ou Password invalide(s)')
    }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public

const registrerUser = asyncHandler(async (req, res) => {
    const { name, phone, email, password } = req.body
    const _id = Date.now().toString()
    const emailExists = await User.findOne({ where: { email: email } })
    const phoneExists = await User.findOne( { where: { phone: phone } })

    if(emailExists){
        res.status(400)
        throw new Error('Cette adresse email est déjà utilisée.')
    } 
    if(phoneExists){
        res.status(400)
        throw new Error('Ce numéro de téléphone est déjà utilisé.')
    } 
    const user = await User.create({
        _id,
        name,
        phone,
        email,
        password: bcrypt.hashSync(password)
    })
    
    if(user) {
        var date = new Date();
        var userId = user._id
        var token = generateToken(userId)
        var dateMillis = date.getTime();

        //JavaScript doesn't have a "time period" object, so I'm assuming you get it as a string
        var timePeriod = "24:00:00"; //I assume this is 15 minutes, so the format is HH:MM:SS

        var parts = timePeriod.split(/:/);
        var timePeriodMillis = (parseInt(parts[0], 10) * 60 * 60 * 1000) +
                            (parseInt(parts[1], 10) * 60 * 1000) + 
                            (parseInt(parts[2], 10) * 1000);

        var newDate = new Date();
        newDate.setTime(dateMillis + timePeriodMillis);
        var expiredAt = new Date(newDate)
        console.log(expiredAt)
        confirmationEmail = await ConfirmationToken.create({
            token,
            expiredAt,
            userId
        })
        link = "http://localhost:3000/registration/confirmation/" + token;
        confirmEmail(user.name, user.email,link,"Votre message")
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isLocked: user.isLocked,
        })
    } else {
        res.status(400)
        throw new Error('Données invalides')
    }
})

// @desc    Email confirmation
// @route   GET /api/users/confirmation/:token
// @access  public

const emailConfirmation = asyncHandler(async (req, res) => {
    const confirmation = await ConfirmationToken.findOne({where: {token: req.params.id}})
    //console.log(confirmation.userId)
    if(confirmation) {
        var dateNow = Date.now()
        //console.log("dateNow =>", dateNow)
        //console.log("expiredAt =>", confirmation.expiredAt)
        if(dateNow < confirmation.expiredAt) {
            const user = await User.findByPk(confirmation.userId)
            user.isLocked = false
            const updatedUser = await user.save()
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                phone: updatedUser.phone,
                email: updatedUser.email,
                isLocked: updatedUser.isLocked,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id),
            })
        } else {
            res.status(404)
            throw new Error('expiré')
        }
    }else {
        res.status(404)
        throw new Error('Token introuvable')
    }
})

// @desc    Get user & profile
// @route   GET /api/users/profile
// @access  private

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user._id)

    if(user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })

    } else {
        res.status(404)
        throw new Error("Utilisateur introuvable")
    }
})

// @desc    Update user profile
// @route   GET /api/users/profile
// @access  private

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user._id)

    if(user) {
        user.name = req.body.name || user.name
        user.phone = req.body.phone || user.phone
        user.email = req.body.email || user.email
        if(req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            phone: updatedUser.phone,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        })
    } else {
        res.status(404)
        throw new Error('Utilisateur introuvable')
    }
})

// @desc    Get all users
// @route   GET /api/users
// @access  private/Admin

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll({})
    res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users//id
// @access  private/Admin

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.destroy({ where: {_id: req.params.id} })
    
    if (user) {
        //await user.remove()
        res.json({ message: 'Utilisateur supprimé' })
    } else {
        res.status(404)
        throw new Error('Utilisateur introuvable')
    }
})

// @desc    Get user b Id
// @route   GET /api/users/:id
// @access  private/Admin

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id)//.select('-password')
    
    if (user) {
        res.json(user)
    }
    else {
        res.status(404)
        throw new Error('Utilisateur introuvable')
    }
})

// @desc    Update user 
// @route   GET /api/users/:id
// @access  private

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id)

    if(user) {
        user.name = req.body.name || user.name
        user.phone = req.body.phone || user.phone
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error('Utilisateur introuvable')
    }
})

// @desc    Contact Us 
// @route   POST /api/users/contactus
// @access  public

const contactUs = asyncHandler(async (req, res) => {
    var name = req.body.name
    var email = req.body.email
    var message = req.body.message
    var content = `name: ${name} \n email: ${email} \n message: ${message} `

    var mail = {
        from: name,
        to: 'contact@lekaakou.com',  // Change to email address that you want to receive messages on
        subject: 'New Message from Lekaakou',
        text: content
    }

    var transporter = nodemailer.createTransport(transport)
    transporter.sendMail(mail, (err, data) => {
        if (err) {
          res.json({
            status: 'fail'
          })
        } else {
          res.json({
           status: 'success'
          })
        }
    })
})

const confirmEmail = asyncHandler(async (userName, userEmail, link, sendMessage) => {
    var name = userName
    var email = userEmail
    var message = sendMessage
    var content = `name: ${name} \n email: ${email} \n message: ${message} `

    var mail = {
        from: "rodriguende@gmail.com",
        to: userEmail,  // Change to email address that you want to receive messages on
        subject: 'Confirmation de votre adresse email',
        text: content,
        html: buildEmail(name, link)
    }
    var transporter = nodemailer.createTransport(transport)
    transporter.sendMail(mail)

    /* var transporter = nodemailer.createTransport(transport)
    transporter.sendMail(mail, (err, data) => {
        if (err) {
          res.json({
            status: 'fail'
          })
          console.log('status => fail')
        } else {
          res.json({
           status: 'success'
          })
          console.log('status => success')
        }
    }) */
    console.log("Email => ", userEmail)
})

const buildEmail = (firstName, link)=>{
    return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
            "\n" +
            "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
            "\n" +
            "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
            "    <tbody><tr>\n" +
            "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
            "        \n" +
            "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
            "          <tbody><tr>\n" +
            "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
            "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
            "                  <tbody><tr>\n" +
            "                    <td style=\"padding-left:10px\">\n" +
            "                  \n" +
            "                    </td>\n" +
            "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
            "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Confirm your email</span>\n" +
            "                    </td>\n" +
            "                  </tr>\n" +
            "                </tbody></table>\n" +
            "              </a>\n" +
            "            </td>\n" +
            "          </tr>\n" +
            "        </tbody></table>\n" +
            "        \n" +
            "      </td>\n" +
            "    </tr>\n" +
            "  </tbody></table>\n" +
            "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
            "    <tbody><tr>\n" +
            "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
            "      <td>\n" +
            "        \n" +
            "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
            "                  <tbody><tr>\n" +
            "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
            "                  </tr>\n" +
            "                </tbody></table>\n" +
            "        \n" +
            "      </td>\n" +
            "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
            "    </tr>\n" +
            "  </tbody></table>\n" +
            "\n" +
            "\n" +
            "\n" +
            "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
            "    <tbody><tr>\n" +
            "      <td height=\"30\"><br></td>\n" +
            "    </tr>\n" +
            "    <tr>\n" +
            "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
            "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
            "        \n" +
            "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi " + firstName + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> Thank you for registering. Please click on the below link to activate your account: </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\"" + link + "\">Activate Now</a> </p></blockquote>\n Link will expire in 24 heures. <p>See you soon</p>" +
            "        \n" +
            "      </td>\n" +
            "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
            "    </tr>\n" +
            "    <tr>\n" +
            "      <td height=\"30\"><br></td>\n" +
            "    </tr>\n" +
            "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
            "\n" +
            "</div></div>";
}


module.exports = { authUser, registrerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser, contactUs, emailConfirmation }