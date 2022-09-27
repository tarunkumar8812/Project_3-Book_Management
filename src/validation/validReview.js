const mongoose = require("mongoose")
const moment = require("moment")
const ObjectId = mongoose.Types.ObjectId.isValid


const validRating = function (value) {
    if (value == undefined) { return "Rating is mandatory" }
    if (typeof value !== "number") { return "Rating must be number" }

    let regex = /^[1-5]$/
    let validRegex = regex.test(value)
    if (validRegex == false) { return "Invalid Rating, ( rating should between 1-5 digit )" }

    return true
}


const validReviewedBy = function (value) {
    if (value == undefined) { return true }
    if (typeof value !== "string") { return "ReviewedBy must be string" }
    if (value.trim() == "") { return "ReviewedBy can not be empty" }

    let regex = /^[a-zA-Z .]+$/
    let validRegex = regex.test(value)
    if (validRegex == false) { return "Invalid Reviewer name, available characters( a-z A-Z . ) " }

    return true
}







const validReview = function (value) {
    if (value == undefined) { return true }
    if (typeof value !== "string") { return "Review must be string" }
    if (value.trim() == "") { return "Review can not be empty" }

    return true
}




const validRating_4_Update = function (value) {
    if (value == undefined) { return true }
    if (typeof value !== "number") { return "Rating must be number" }

    let regex = /^[1-5]$/
    let validRegex = regex.test(value)
    if (validRegex == false) { return "Invalid Rating, ( rating should between 1-5 digit )" }

    return true
}


const validReviewedBy_4_Update = function (value) {
    if (value == undefined) { return true }
    if (typeof value !== "string") { return "ReviewedBy must be string" }
    if (value.trim() == "") { return "ReviewedBy can not be empty" }

    let regex = /^[a-zA-Z .]+$/
    let validRegex = regex.test(value)
    if (validRegex == false) { return "Invalid Reviewer name, available characters( a-z A-Z . ) " }

    return true
}




const validReview_4_Update = function (value) {
    if (value == undefined) { return true }
    if (typeof value !== "string") { return "Review must be string" }
    if (value.trim() == "") { return "Review can not be empty" }

    return true
}


module.exports = { validRating, validReviewedBy, validReview, validReview_4_Update, validRating_4_Update, validReviewedBy_4_Update }
