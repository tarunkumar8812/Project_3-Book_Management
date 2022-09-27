
// ------------- validation of user title -------------
const validTitle = function (value) {
    if (value == undefined) { return "Title is mandatory" }
    if (typeof value !== "string") { return "Title must be string" }
    if (value.trim() == "") { return "Title can not be empty" }

    let titles = ["Mr", "Mrs", "Miss"]
    for (let e of titles) {
        if (e == value.trim()) { return true }
    }
    return `Invalid Title, available Titles ( ${titles} )`
}

// ------------- validation of user name -------------

const validName = function (value) {
    if (value == undefined) { return "Name is mandatory" }
    if (typeof value !== "string") { return "Name must be string" }
    if (value.trim() == "") { return "Name can not be empty" }
    if (value.trim().length < 3) { return "Minimum 2 chacracters are required for name" }
    if (value.trim().length > 30) { return "Maximum 30 chacracters are allowed for name" }

    let regex = /^([a-zA-Z .]){2,30}$/
    let validRegex = regex.test(value.trim())
    if (validRegex == false) { return `Name in wrong format, available characters are ( A-Z a-z . )` }

    return true
}

// ------------- validation of phone no. -------------

const validPhone = function (value) {
    if (value == undefined) { return "Phone no. is mandatory" }
    if (typeof value !== "string") { return "Phone no. must be string" }
    if (value.trim() == "") { return "Phone no. can not be empty" }
    if (value.trim().length != 10) { return "Phone no. must be of 10 digits" }

    let regex = /^[6-9]{1}[0-9]{9}$/
    let validRegex = regex.test(value.trim())
    if (validRegex == false) { return `Phone no. must be indian` }

    return true
}

// ------------- validation of email -------------

const validEmail = function (value) {
    if (value == undefined) { return "Email is mandatory" }
    if (typeof value !== "string") { return "Email must be string" }
    if (value.trim() == "") { return "Email can not be empty" }

    let regex2 = /^[a-zA-Z0-9.]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}/;
    let validRegex2 = regex2.test(value.trim())
    if (validRegex2 == false) { return `Invalid Email, ex:- ( abc123@gmail.com )` }

    let regex1 = /^(?=.*[A-Za-z])/
    let validRegex1 = regex1.test(value.trim()[0])
    if (validRegex1 == false) { return `First letter of Email must be alphabet` }

    return true
}

// ------------- validation of password -------------

const validPassword = function (value) {
    if (value == undefined) { return "Password is mandatory" }
    if (typeof value !== "string") { return "Password must be string" }
    if (value.trim() == "") { return "Password can not be empty" }
    if (value.trim().length < 8) { return "Use strong password, minimum 8 chacracters are required" }
    if (value.trim().length > 15) { return "Too long password, maximum 15 chacracters are allowed" }

    // let regex = /^(?!.*)(?=.*[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%^&*()+=]).{8,15}$/  // <----ye original wala hai
    let regex = /^(?=.*[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%^&*()+=]).{8,15}$/
    let validRegex = regex.test(value.trim())
    if (validRegex == false) { return `Use strong password, must contain ( a-z A-Z 0-9 [!@#\$%\^&\*] )` }

    return true
}




// ------------- validation of address -------------

const validAddress = function (value) {
    if (typeof value !== "object") { return "Address must be object" }
    if (Array.isArray(value)) { return "Address must be object" }
    if (Object.keys(value).length == 0) { return "Address can not be empty, have to fill atleast one of these ( street, city, pincode, )" }

    let { street, city, pincode, ...rest } = value
    if (Object.keys(rest).length > 0) { return `You can not fill these:-( ${Object.keys(rest)} ) data ` }

    return true
}

// ------------- validation of street -------------

const validStreet = function (value) {

    if (value == undefined) { return true }
    if (typeof value !== "string") { return "Street must be string" }
    if (value.trim() == "") { return "Street can not be empty" }
    if (value.trim().length < 10) { return "Minimum 10 chacracters are required for Street" }
    if (value.trim().length > 100) { return "Maximum 100 chacracters are allowed for Street" }

    let regex = /^([a-zA-Z 0-9 .,-/]){10,100}$/
    let validRegex = regex.test(value.trim())
    if (validRegex == false) { return `Street in wrong format, available characters are ( A-Z a-z 0-9 .,- )` }

    return true
}

// ------------- validation of city -------------

const validCity = function (value) {
    if (value == undefined) { return true }
    if (typeof value !== "string") { return "City must be string" }
    if (value.trim() == "") { return "City can not be empty" }
    if (value.trim().length < 4) { return "Minimum 4 chacracters are required for City" }
    if (value.trim().length > 20) { return "Maximum 20 chacracters are allowed for City" }

    let regex = /^([a-zA-Z .,]){2,30}$/
    let validRegex = regex.test(value.trim())
    if (validRegex == false) { return `City in wrong format, available characters are ( A-Z a-z ., )` }

    return true
}



// --------------- validation of pincode -----------------

const validPincode = function (value) {
    if (value == undefined) { return true }
    if (typeof value !== "string") { return "Pincode must be string" }
    if (value.trim() == "") { return "Pincode can not be empty" }
    if (value.trim().length != 6) { return "Pincode must be of 6 digits" }

    let regex = /^[0-9]/
    let validRegex = regex.test(value.trim())
    if (validRegex == false) { return `Pincode in wrong format, available characters are ( 0-9 )` }

    return true
}


const validPW_4_Login = function (value) {
    if (value == undefined) { return "Password is mandatory" }
    if (typeof value !== "string") { return "Password must be string" }
    if (value.trim() == "") { return "Password can not be empty" }
    if (value.trim().length < 8) { return "Use strong password, minimum 8 chacracters are required" }
    if (value.trim().length > 15) { return "Too long password, maximum 15 chacracters are allowed" }

    return true
}


module.exports = { validTitle, validName, validPhone, validEmail, validPassword, validAddress, validStreet, validCity, validPincode ,validPW_4_Login}