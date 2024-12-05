const Users = require("../models/Users");

const getUser = async (req, res) => {
    const {authId} = req.params;
    try {
        const user = await Users.findOne({authId});
        if(!user){
            return res.status(404).json(`User with auth Id ${authId} does not exist`);
        }
        return res.status(200).json(user);
    } catch(error) {
        return res.status(500).json(`An unexpected error occurred`);
    }
};

module.exports = {getUser};