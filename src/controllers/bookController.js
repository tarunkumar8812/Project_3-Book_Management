const bookModel = require('../model/bookModel')
const userModel = require("../model/userModel")
const reviewModel = require("../model/reviewModel")
const mongoose = require("mongoose")
const moment = require("moment")
const ObjectId = mongoose.Types.ObjectId.isValid
const { validBookTitle, validBookExcerpt, validUserId, validISBN, validCategory, validSubcategory, validReview,
    validReleasdAt, validIsDeleted, validExcerpt_4_Update, validBookTitle_4_Update, validISBN_4_Update,
    validReleasdAt_4_Update } = require("../validation/validBook.js")



//<------------------------------------------------ Create Book API ------------------------------------------------>

const createBook = async function (req, res) {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please enter require data to create Book" })

        let { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt, isDeleted, ...rest } = data;

        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: `You can not fill these:-( ${Object.keys(rest)} ) data ` })


        if (validBookTitle(title) != true) return res.status(400).send({ status: false, message: `${validBookTitle(title)}` })

        if (validBookExcerpt(excerpt) != true) return res.status(400).send({ status: false, message: `${validBookExcerpt(excerpt)}` })

        if (validUserId(userId) != true) return res.status(400).send({ status: false, message: `${validUserId(userId)}` })

        if (validISBN(ISBN) != true) return res.status(400).send({ status: false, message: `${validISBN(ISBN)}` })

        if (validCategory(category) != true) return res.status(400).send({ status: false, message: `${validCategory(category)}` })

        if (validSubcategory(subcategory) != true) return res.status(400).send({ status: false, message: `${validSubcategory(subcategory)}` })

        if (validReview(reviews) != true) return res.status(400).send({ status: false, message: `${validReview(reviews)}` })

        if (validReleasdAt(releasedAt) != true) return res.status(400).send({ status: false, message: `${validReleasdAt(releasedAt)}` })

        if (validIsDeleted(isDeleted) != true) return res.status(400).send({ status: false, message: `${validIsDeleted(isDeleted)}` })


        //  ------- checking uniqueness of title -------
        let title_in_DB = await bookModel.findOne({ title: title })
        if (title_in_DB) return res.status(400).send({ status: false, message: "This title is already taken" })

        //  ------- checking uniqueness of ISBN -------
        let ISBN_in_DB = await bookModel.findOne({ ISBN: ISBN })
        if (ISBN_in_DB) return res.status(400).send({ status: false, message: "ISBN Already Exists" })

        //  ------- checking existance of user -------
        let user_in_DB = await userModel.findById({ _id: userId })
        if (!user_in_DB) return res.status(404).send({ status: false, message: "No such user exist" })

        //  ------------ creating new book ------------
        let savedData = await bookModel.create(data)
        return res.status(201).send({ status: true, message: "Book successfully created", data: savedData })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//  <--------------------------------------------------- Get Books API --------------------------------------------------->

const books = async function (req, res) {
    try {
        let queries = req.query

        if (Object.keys(queries).length == 0) {
            let bookList = await bookModel.find({ isDeleted: false }).select({ ISBN: 0, subcategory: 0, isDeleted: 0, deletedAt: 0, __v: 0, createdAt: 0, updatedAt: 0 }).collation({ locale: "en" }).sort({ title: 1 })

            if (bookList.length == 0) return res.status(404).send({ status: false, message: "No data found" })

            return res.status(200).send({ status: true, message: "list of Books", data: bookList })
        }



        const { userId, category, subcategory, ...rest } = req.query

        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: `You can not get for these:-( ${Object.keys(rest)} ) data ` })

        const filter = { isDeleted: false }

        if (userId) {
            if (userId == undefined || userId.trim() == "") return res.status(400).send({ status: false, message: "please give value of filter" })

            if (!ObjectId(userId.trim())) return res.status(400).send({ status: false, message: "Invalid UserId" })

            filter.userId = userId.trim()
        }

        if (category) {
            if (category == undefined || category.trim() == "") return res.status(400).send({ status: false, message: "please give value of filter category" })

            filter.category = category.trim()
        }

        if (subcategory) {
            if (subcategory == undefined || subcategory.trim() == "") return res.status(400).send({ status: false, message: "please give value of filter Subcategory" })

            filter.subcategory = subcategory.trim()
        }

        let bookList = await bookModel.find(filter).select({ ISBN: 0, subcategory: 0, isDeleted: 0, deletedAt: 0, __v: 0 }).collation({ locale: "en" }).sort({ title: 1 })

        if (bookList.length == 0) return res.status(404).send({ status: false, message: "No data found" })

        return res.status(200).send({ status: true, message: "list of Books", data: bookList })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}


//  <------------------------------------------- Get Book by bookId API ------------------------------------------->

const getParticularBook = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!ObjectId(bookId)) return res.status(400).send({ status: false, message: " Invalid bookId" })

        let book = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ __v: 0, ISBN: 0, deletedAt: 0 })

        if (!book) return res.status(404).send({ status: false, message: "Book not found" })

        reviewsData = await reviewModel.find({ bookId: bookId }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })

        let obj = book._doc
        obj["reviewsData"] = reviewsData
        res.status(200).send({ status: true, message: "Book found", data: obj })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//  <------------------------------------------- Update Book by bookId API ------------------------------------------->
const updateBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        const body = req.body;

        if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: "please enter require data to create Book" })

        let { title, excerpt, releasedAt, ISBN, ...rest } = req.body

        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: `You can not update these:-( ${Object.keys(rest)} ) data ` })

        const filter = { isDeleted: false }

        if (title) {
            if (validBookTitle_4_Update(title) != true) return res.status(400).send({ status: false, message: `${validBookTitle_4_Update(title)}` })

            let title_in_DB = await bookModel.findOne({ title: title });

            if (title_in_DB) return res.status(409).send({ status: false, message: " Title is already exist, Enter new book name...!" })
            filter.title = title.trim()
        }

        if (excerpt) {
            if (validExcerpt_4_Update(excerpt) != true) return res.status(400).send({ status: false, message: `${validExcerpt_4_Update(excerpt)}` })

            filter.excerpt = excerpt.trim()
        }

        if (ISBN) {
            if (validISBN_4_Update(ISBN) != true) return res.status(400).send({ status: false, message: `${validISBN_4_Update(ISBN)}` })

            let ISBN_in_DB = await bookModel.findOne({ ISBN: ISBN })

            if (ISBN_in_DB) return res.status(409).send({ status: false, message: "ISBN Already Exists" })
            filter.ISBN = ISBN
        }

        if (releasedAt) {
            if (validReleasdAt_4_Update(releasedAt) != true) return res.status(400).send({ status: false, message: `${validReleasdAt_4_Update(releasedAt)}` })

            filter.releasedAt = releasedAt
        }

        const updateBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: filter }, { new: true })

        if (updateBook === null) return res.status(404).send({ status: false, message: "No such book found...!" })

        res.status(200).send({ Status: true, message: "Success", Data: updateBook })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//  <------------------------------------------- Delete Book by bookId API ------------------------------------------->
const deleteBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId

        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) return res.status(404).send({ status: false, message: "No data found" })

        let deletedBook = await bookModel.findByIdAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } })

        res.status(200).send({ status: true, message: "Book is successfully deleted" })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createBook, getParticularBook, books, updateBookById, deleteBookById }