const _ = require("lodash");
const Models = require("../models");
const axios = require('axios');
require('dotenv').config();

exports.addConvertedArticle = async (data) => {
    try {
        let errors = [];
        const subject = data.subject
        const content = data.content
        const token = data.token

        //Validate all the data coming through.

        if (_.isEmpty(subject)) errors = [...errors, "Please fill in your subject"];

        if (_.isEmpty(content)) errors = [...errors, "Please wait until we finish the content"];

        if (_.isEmpty(token)) errors = [...errors, "Please fill in your token"];

        //decodeToken
        const tokenDecoded = await axios.post('http://podcastproject-gateway-1:3000/authorisation/decodeToken', { tokenUser: token })
        if (!tokenDecoded) {
            return {
                status: false,
                errors: ["Something went wrong please try again later."]
            }
        }

        const idUser = tokenDecoded.data.token.payload.idUser
    
        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors,
            };
        }

        //create new article
        const article = await Models.ConvertedArticle.create({ subject: subject, content: content, status: true, idUser: idUser });

        if (!article) {
            return {
                status: false,
                errors: ["Something went wrong please try again later."],
            };
        }

        return {
            status: true,
            message: ["article has been added successfully"]
        };

    } catch (error) {
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
}

exports.getConvertedArticle = async (data) => {
    try {
        let errors = [];
        const token = data.token
    
        //Validate all the data coming through.

        if (_.isEmpty(token)) errors = [...errors, "Please fill in your token"];

        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors,
            };
        }

        //decodeToken
        const tokenDecoded = await axios.post('http://podcastproject-gateway-1:3000/authorisation/decodeToken', { tokenUser: token })
        if (!tokenDecoded) {
            return {
                status: false,
                errors: ["Something went wrong please try again later."]
            }
        }

        //get articles
        const articles = await Models.ConvertedArticle.findAll({
            where: {
                idUser: tokenDecoded.data.token.payload.idUser,
            }
        });

        return {
            status: true,
            articles: articles
        };

    } catch (error) {
        return {
            status: false,
            errors: ["Something went wrong please try again later."]
        };
    }
}

exports.deleteConvertedArticle = async (data) => {
    try {
        let errors = [];
        const idArticle = data.id;
       
        //delete article
        const articles = await Models.ConvertedArticle.destroy({
            where: {
                id: idArticle
            }
        });

        if (articles) {
            return {
                status: true,
                message: ["article deleted successfully"]
            };
        }

    } catch (error) {
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
}