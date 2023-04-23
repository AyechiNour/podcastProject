const _ = require("lodash");
const Models = require("../models");

exports.verifId = async (data) => {
    try {
        let errors = [];

        let  { id } = data;

        //Validate all the data coming through.

        if (_.isEmpty(id)) errors = [...errors, "Please fill in your id"];

        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors,
            };
        }

        //verify if userId exist
        const user = await Models.user.findOne({
            where: {
                id: id
            }
        });

        if (user) {
            return {
                status: true,
                errors: ["An account with this id already exists."],
            };
        } else {
            return {
                status: false,
                message: ["An account with this id didn't exist."]
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
}