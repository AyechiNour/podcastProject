const _ = require("lodash");
const Models = require("../models");
const axios = require('axios');

exports.verifId = async (data) => {
    try {
        let errors = [];

        let { id } = data;

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

exports.signIn = async (data) => {
    try {
        let errors = [];
        let { email, password } = data;
        var tokenUser = null;
        //Validate all the data coming through.
        if (_.isEmpty(email)) errors = [...errors, "Please fill in your email"];
        if (_.isEmpty(password)) errors = [...errors, "Please fill in your password"];

        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors,
            };
        }

        const User = await Models.user.findOne({
            where: {
                email: email
            }
        });

        if (User) {
            const coordCorrect = await Models.user.findOne({
                where: {
                    email: email,
                    password: password
                }
            });
            if (coordCorrect) {
                console.log("nour",coordCorrect.dataValues.id)
                const userMeta = await Models.metauser.findOne({
                   idUser: coordCorrect.dataValues.id
                })
                console.log("cooooord",userMeta)
                const Token = await axios.post('http://localhost:3000/authorisation/getToken', { id: coordCorrect.dataValues.id, name: userMeta.dataValues.metavalue })
                    .then((response) => {
                        if (response.data.status == false) errors = [...errors, "Problem with Token"];
                        else {
                            tokenUser = response.data.token,
                            console.log("resultat", tokenUser)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        errors = [...errors, "we can't connect to the other microservice"];
                    });
                console.log(Token)
                return {
                    status: true,
                    token: tokenUser
                };
            } else {
                return {
                    status: false,
                    errors: "Email or password are incorrect",
                };
            }

        } else {
            return {
                status: false,
                errors: "Email or password are incorrect",
            };
        }

    } catch (error) {
        console.log(error)
    }
}

exports.signUp = async (data) => {
    try {
        var tokenUser = null;
        let errors = [];
        let { name, email, password } = data;

        //Validate all the data coming through.
        if (_.isEmpty(name)) errors = [...errors, "Please fill in your name"];
        if (_.isEmpty(email)) errors = [...errors, "Please fill in your email"];
        if (_.isEmpty(password)) errors = [...errors, "Please fill in your password"];

        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors,
            };
        }

        const User = await Models.user.findOne({
            where: {
                email: email,
                password: password
            }
        });

        if (User) {
            return {
                status: false,
                errors: "User exists",
            };
        } else {
            const user = await Models.user.create({ email: email, password: password });
            console.log(user.dataValues.id)
            const metaUser = await Models.metauser.create({ metakey: "name", metavalue: name, idUser: user.dataValues.id })
            const TokenUser = await axios.post('http://localhost:3000/authorisation/getToken', { id: user.dataValues.id , name: name})
                .then((response) => {
                    if (response.data.status == false) errors = [...errors, "Problem with Token"];
                    else {
                        tokenUser = response.data.token,
                        console.log("resultat --------------------------------", response.data)
                    }
                })
                .catch((error) => {
                    console.log(error)
                    errors = [...errors, "we can't connect to the other microservice"];
                });
        }
        return {
            status: true,
            token: tokenUser
        };
    } catch (error) {
        console.log(error)
    }
}