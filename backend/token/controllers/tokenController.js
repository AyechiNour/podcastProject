const _ = require("lodash");
const axios = require('axios');
const jwt = require("jsonwebtoken");

privateKey="AyechiNour"
exports.getToken = async (data) => {
    try {
       
        let errors = [];
        const { id,name } = data;

        //Validate all the data coming through.
        if (_.isNaN(id)) errors = [...errors, "Please fill in your id"];
        if (_.isEmpty(name)) errors = [...errors, "Please fill in your name"];

        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors
            };
        }

        //create new token
        let token = jwt.sign({idUser:id, nameUser:name},privateKey,{expiresIn:'10h'})
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
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
}

exports.decodeToken = async (data) => {
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

        //decode token
        const tokenDecoded = jwt.decode(tokenUser,{complete:true})
        return {
            token : tokenDecoded 
        };

    } catch (error) {
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
}