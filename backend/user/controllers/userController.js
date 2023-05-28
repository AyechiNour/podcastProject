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
        
                if (coordCorrect) {
                    const userMeta = await Models.metauser.findOne({
                        idUser: coordCorrect.dataValues.id
                    });
        
                    const response = await axios.post('http://podcastproject-gateway-1:3000/authorisation/getToken', { id: coordCorrect.dataValues.id, name: userMeta.dataValues.metavalue });
        
                    if (response.data.status == false) {
                        errors = [...errors, "Problem with Token"];
                    } else {
                        tokenUser = response.data.token;
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
        const hash = await bcrypt.hash(password, saltRounds);
        const user = await Models.user.create({ email: email, password: hash });
        const metaUser = await Models.metauser.create({ metakey: "name", metavalue: name, idUser: user.dataValues.id });
        const response = await axios.post('http://podcastproject-gateway-1:3000/authorisation/getToken', { id: user.dataValues.id, name: name });
  
        if (response.data.status == false) {
          errors = [...errors, "Problem with Token"];
        } else {
          tokenUser = response.data.token;
        }
      }
      return {
        status: true,
        token: tokenUser
      };
    } catch (error) {
      console.log(error)
    }
  }
  