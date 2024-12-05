const mongoose = require("mongoose");

const EmailSubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email must be provided"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid Email"
        ],
    }
}, {timestamps: true});


module.exports = mongoose.model("EmailSubscribers", EmailSubscriberSchema);