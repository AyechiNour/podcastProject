const _ = require("lodash");
const Models = require("../models");
const axios = require('axios');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
            console.log("1")
            const result = await new Promise((resolve, reject) => {
                bcrypt.compare(password, User.dataValues.password, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        
            if (result) {
                const coordCorrect = await Models.user.findOne({
                    where: {
                        email: email,
                        password: User.dataValues.password
                    }
                });
        
                console.log("aaa")
                if (coordCorrect) {
                    console.log("bbbb")
                    const userMeta = await Models.metauser.findOne({
                        idUser: coordCorrect.dataValues.id
                    });
        
                    const response = await axios.post('http://localhost:3000/authorisation/getToken', { id: coordCorrect.dataValues.id, name: userMeta.dataValues.metavalue });
        
                    if (response.data.status == false) {
                        errors = [...errors, "Problem with Token"];
                    } else {
                        tokenUser = response.data.token;
                        console.log(tokenUser);
                        return {
                            status: true,
                            token: tokenUser
                        };
                    }
                } else {
                    return {
                        status: false,
                        errors: "Email or password are incorrect",
                    };
                }
            }
        } else {
            return {
                status: false,
                errors: "Email or password are incorrect",
            };
        }
        console.log("2")
        return {
            status: false,
            errors: "error",
        };
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
            }
        });

        if (User) {
            return {
                status: false,
                errors: "User exists",
            };
        } else {
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                // Store hash in your password DB.
                if (_.isEmpty(err)) {
                    const user = await Models.user.create({ email: email, password: hash });
                    console.log(user.dataValues.id)
                    const metaUser = await Models.metauser.create({ metakey: "name", metavalue: name, idUser: user.dataValues.id })
                    const TokenUser = await axios.post('http://localhost:3000/authorisation/getToken', { id: user.dataValues.id, name: name })
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