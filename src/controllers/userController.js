const userModel = require("../model/userModel")
const jwt = require('jsonwebtoken')
const { validTitle, validName, validPhone, validEmail, validPassword,
	validAddress, validStreet, validCity, validPincode, validPW_4_Login } = require("../validation/validUser.js")


//<-------------------------------------------- Create User API ------------------------------------------->
const createUser = async function (req, res) {
	try {
		const body = req.body
		const { title, name, phone, email, password, address, ...rest } = req.body

		if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: "Please fill data in body" })

		if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: `You can not fill these:-( ${Object.keys(rest)} ) data ` })


		if (validTitle(title) != true) return res.status(400).send({ status: false, message: `${validTitle(title)}` })

		if (validName(name) != true) return res.status(400).send({ status: false, message: `${validName(name)}` })

		if (validPhone(phone) != true) return res.status(400).send({ status: false, message: `${validPhone(phone)}` })

		if (validEmail(email) != true) return res.status(400).send({ status: false, message: `${validEmail(email)}` })

		if (validPassword(password) != true) return res.status(400).send({ status: false, message: `${validPassword(password)}` })


		if (address != undefined) {

			if (validAddress(address) != true) return res.status(400).send({ status: false, message: `${validAddress(address)}` })

			const { street, city, pincode } = address

			if (validStreet(street) != true) return res.status(400).send({ status: false, message: `${validStreet(street)}` })

			if (validCity(city) != true) return res.status(400).send({ status: false, message: `${validCity(city)}` })

			if (validPincode(pincode) != true) return res.status(400).send({ status: false, message: `${validPincode(pincode)}` })
		}

		//  ------- checking uniqueness of phone no. -------
		let phone_in_DB = await userModel.findOne({ phone: phone })
		if (phone_in_DB) return res.status(409).send({ status: false, message: "Phone no. is already registered" })

		//  ---------checking uniqueness of email ---------
		let email_in_DB = await userModel.findOne({ email: email })
		if (email_in_DB) return res.status(409).send({ status: false, message: "Email is already registered" })


		//  -------------- creating new user --------------
		const newUser = await userModel.create(body)
		return res.status(201).send({ status: true, message: "User successfully Registerd", data: newUser })
	}
	catch (err) {
		return res.status(500).send({ status: false, message: err.message })
	}
}


//<-------------------------------------------- User Login API ------------------------------------------->

const userLogin = async function (req, res) {
	try {
		const body = req.body
		if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: "Please fill data in body" })

		const { email, password, ...rest } = req.body

		if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: `You can not fill these:-( ${Object.keys(rest)} ) data` })

		if (validEmail(email) != true) return res.status(400).send({ status: false, message: `${validEmail(email)}` })

		if (validPW_4_Login(password) != true) return res.status(400).send({ status: false, message: `${validPW_4_Login(password)}` })


		let user_in_DB = await userModel.findOne({ email: email, password: password, isDeleted: false });
		if (!user_in_DB) return res.status(401).send({ status: false, message: "invalid credentials (email or the password is not corerct)" })

		let token = jwt.sign(
			{
				userId: user_in_DB._id.toString(),
				exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // After 24 hour it will expire 
				iat: Math.floor(Date.now() / 1000)
			}, "FunctionUp Group No 57");

		res.setHeader("x-api-key", token);

		let data = {
			token: token,
			userId: user_in_DB._id.toString(),
			exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // After 24 hour it will expire 
			iat: Math.floor(Date.now() / 1000)

		}
		res.status(201).send({ status: true, message: "Token has been successfully generated.", data: data });
	}
	catch (err) {
		res.status(500).send({ status: false, message: "Error", error: err.message })
	}

}



module.exports = { createUser, userLogin }



