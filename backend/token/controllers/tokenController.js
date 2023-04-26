const _ = require("lodash");
const axios = require('axios');
const jwt = require("jsonwebtoken");

privateKey="AyechiNour"
exports.getToken = async (data) => {
    try {
        let errors = [];
        const { id } = data;
        console.log(id)
        //Validate all the data coming through.
        if (_.isEmpty(id)) errors = [...errors, "Please fill in your id"];

        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors
            };
        }

        //create new token
        let token = jwt.sign({idUser:id},privateKey,{expiresIn:'10h'})
        console.log(token)
        if (!token) {
            return {
                status: false,
                errors: ["Something went wrong please try again later."]
            };
        }

        return {
            status: true,
            token: token
        };

    } catch (error) {
        console.log(error);
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
}

exports.verifToken = async (data) => {
    try {
        let errors = [];
        const { tokenUser } = data;
        //Validate all the data coming through.
        if (_.isEmpty(tokenUser)) errors = [...errors, "empty!!"];

        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors
            };
        }

        //verif token
        jwt.verify(tokenUser,privateKey)
        return {
            status: true 
        };

    } catch (error) {
        console.log(error);
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
}