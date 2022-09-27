const bookModel = require('../model/bookModel')
const reviewModel = require('../model/reviewModel')
const moment = require("moment")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId.isValid
const { validRating, validReviewedBy, validReview, validReview_4_Update, validRating_4_Update, validReviewedBy_4_Update } = require("../validation/validReview.js")



// <------------------------------------------------- Create Book reviewby bookId API -------------------------------------------------> 
const createReview = async function (req, res) {
    try {
        let bookIdInParam = req.params.bookId

        if (!ObjectId(bookIdInParam)) { return res.status(400).send({ status: false, message: "bookId in Param is not in format" }) }

        let data = req.body

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please give data to create review" })

        let { reviewedBy, rating, review, isDeleted, ...rest } = data

        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: `You can not fill these:-( ${Object.keys(rest)} ) data ` })


        if (validRating(rating) != true) return res.status(400).send({ status: false, message: `${validRating(rating)}` })

        if (validReviewedBy(reviewedBy) != true) return res.status(400).send({ status: false, message: `${validReviewedBy(reviewedBy)}` })

        if (validReview(review) != true) return res.status(400).send({ status: false, message: `${validReview(review)}` })



        data["bookId"] = bookIdInParam

        let date = Date.now()
        let reviewedAt = moment(date).format('YYYY-MM-DD')
        data['reviewedAt'] = reviewedAt

        if (isDeleted) { data.isDeleted = false }


        //  ------- checking existance of book -------
        let book_in_DB = await bookModel.findOne({ _id: bookIdInParam, isDeleted: false })
        if (!book_in_DB) return res.status(404).send({ status: false, message: `No data found for bookId (${bookIdInParam})` })

        //  ------------- creating review -------------
        let reviewsData = await reviewModel.create(data)

        //  --------- updating reviews in book ---------
        let bookReviwes = await bookModel.findOneAndUpdate({ _id: bookIdInParam }, { $inc: { reviews: +1 } }, { new: true }).select({ updatedAt: 0, __v: 0, isDeleted: 0 })


        //  --------- merging book and reviews ---------
        let result = bookReviwes.toObject()
        result.reviewsData = reviewsData

        return res.status(201).send({ status: true, message: "Reviewes Added Succesfully", data: result })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


// <------------------------------------------------- Update Book Review by bookId API ------------------------------------------------->
const updateReview = async function (req, res) {
    try {
        let bookIdInParam = req.params.bookId;
        let reviewIdInParam = req.params.reviewId;
        let data = req.body;


        if (!ObjectId(bookIdInParam)) return res.status(400).send({ status: false, message: "Invalid BookId" })

        if (!ObjectId(reviewIdInParam)) return res.status(400).send({ status: false, message: "Invalid reviewId" })

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please enter require data to update review" })


        const { review, rating, reviewedBy, ...rest } = data

        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: `You can not update these:-( ${Object.keys(rest)} ) data` })

        if (validReview_4_Update(review) != true) return res.status(400).send({ status: false, message: `${validReview_4_Update(review)}` })

        if (validRating_4_Update(rating) != true) return res.status(400).send({ status: false, message: `${validRating_4_Update(rating)}` })

        if (validReviewedBy_4_Update(reviewedBy) != true) return res.status(400).send({ status: false, message: `${validReviewedBy_4_Update(reviewedBy)}` })


        //  ------- checking existance of book -------
        let book_in_DB = await bookModel.findOne({ _id: bookIdInParam, isDeleted: false });
        if (!book_in_DB) return res.status(404).send({ status: false, message: "Book not found" });

        //  ------- checking existance of review -------
        let review_in_DB = await reviewModel.findOne({ _id: reviewIdInParam, isDeleted: false });
        if (!review_in_DB) return res.status(404).send({ status: false, message: "Review not found" });

        if (review_in_DB.bookId != bookIdInParam) return res.status(400).send({ status: false, message: "BookId in param isn't matching with reviews docment's bookId " })

        //  ------- updating existance of Review-------
        let updateReview = await reviewModel.findOneAndUpdate({ _id: reviewIdInParam }, { $set: data }, { new: true });

        let result = book_in_DB.toObject();
        result.reviewsData = updateReview;
        res.status(200).send({ status: true, message: "Review Update Successfully", date: result });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


// <------------------------------------------------- Delete review by bookId API ------------------------------------------------->
const deleteByBookId_ReviewId = async function (req, res) {
    try {

        const { bookId, reviewId } = req.params

        if (!ObjectId(bookId)) { return res.status(400).send({ status: false, message: "bookId in param is not in format" }) }

        if (!ObjectId(reviewId)) { return res.status(400).send({ status: false, message: "reviewId in param is not in format" }) }

        //  ------- checking existance of bookId -------
        const book_in_DB = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book_in_DB) return res.status(404).send({ status: false, message: "No book found" })

        //  ------- checking existance of reviewId -------
        const review_in_DB = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!review_in_DB) return res.status(404).send({ status: false, message: "No review found" })

        if (review_in_DB.bookId != bookId) return res.status(400).send({ status: false, message: "BookId in param isn't matching with reviews docment's bookId so can't delete review" })

        if (book_in_DB.reviews == 0) return res.status(404).send({ status: false, message: "review is already 0" })

        //  ------- updating review count in book -------
        const updatedBook = await bookModel.findByIdAndUpdate(bookId, { $inc: { "reviews": -1 } }, { new: true })

        //  -------------- deleting review --------------
        const updatedReview = await reviewModel.findByIdAndUpdate(reviewId, { isDeleted: true }, { new: true })

        return res.status(200).send({ status: true, message: "review is successfully deleted" })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createReview, updateReview, deleteByBookId_ReviewId }