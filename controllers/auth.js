const EmailSubscribers = require("../models/EmailSubscribers");
const Users = require("../models/Users");

const register = async (req, res) => {
  try {
    const { name, email, authId } = req.body;
    if (!name || !email || !authId) {
        return res.status(400).json({ message: "Name, Email and authId must be provided" });
    };
    const user = await Users.create({name, email, authId});
    return res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.email) {
        return res.status(409).json({ message: "Email already exists. Please use a different email." });
    }
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
};

const subscribeEmail = async (req, res) => {
  try {
    const {email} = req.body;
    if(!email){
      return res.status(400).json("email is required in the request body");
    };
    //check if email exists in db
    const emailRes = await EmailSubscribers.findOne({email});
    if(emailRes){
      return res.status(409).json("email already exists");
    }
    const userSub = await     EmailSubscribers.create({email});
    res.status(201).json({"message":"email subscription successful", ...userSub})
  } catch (error) {
    res.status(400).json({"message":"Error creating user:", error});
  }
}

module.exports = { register, subscribeEmail };