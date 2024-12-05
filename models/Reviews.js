const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    text: {
        type: number,
    }
},
{ timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;