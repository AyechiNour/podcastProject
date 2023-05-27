const _ = require("lodash");
const Models = require("../models");
const axios = require('axios');
require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai")

const config = new Configuration({
    apiKey: process.env.OPEN_AI_API
})
const openai = new OpenAIApi(config)

exports.addArticle = async (data) => {
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
        const tokenDecoded = await axios.post('http://localhost:3000/authorisation/decodeToken', { tokenUser: token })
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
        const article = await Models.Article.create({ subject: subject, content: content, status: false, idUser: idUser });

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

exports.getArticle = async (data) => {
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
        const tokenDecoded = await axios.post('http://localhost:3000/authorisation/decodeToken', { tokenUser: token })
        if (!tokenDecoded) {
            return {
                status: false,
                errors: ["Something went wrong please try again later."]
            }
        }

        //get articles
        const articles = await Models.Article.findAll({
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

exports.getArticleNonConverted = async (data) => {
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
        const tokenDecoded = await axios.post('http://localhost:3000/authorisation/decodeToken', { tokenUser: token })

        if (!tokenDecoded) {
            return {
                status: false,
                errors: ["Something went wrong please try again later."]
            }
        }

        //get articles
        const articles = await Models.Article.findAll({
            where: {
                idUser: tokenDecoded.data.token.payload.idUser,
                status:false
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

exports.deleteArticle = async (data) => {
    try {
        let errors = [];
        const idArticle = data.id;
       
        //delete article
        const articles = await Models.Article.destroy({
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

exports.verifIdArticle = async (data) => {
    try {
        let errors = [];

        let { id } = data;
        //Validate all the data coming through.

        if (_.isNaN(id)) errors = [...errors, "Please fill in your id"];

        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors,
            };
        }

        //verify if articleId exist
        const article = await Models.Article.findOne({
            where: {
                id: id
            }
        });


        if (article) {
            return {
                status: true,
                errors: ["An article with this id already exists."],
            };
        } else {
            return {
                status: false,
                message: ["An article with this id didn't exist."]
            };
        }
    } catch (error) {
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
}

exports.generateArticle = async (data) => {
    try {

        let errors = [];
        const subject = data.subject;

        //Validate all the data coming through.

        if (_.isEmpty(subject)) errors = [...errors, "Please fill in your subject"];

        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors,
            };
        }

        //generate article
        const prompt = `write an article about ${subject} in french`

        const article = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 2048,
            temperature: 0.9
        })

        return {
            status: true,
            articles: article.data.choices[0].text
        };

    } catch (error) {
        console.log(error)
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }

}

exports.updateStatusArticle = async (data) => {
    try {
        let errors = [];

        let { id } = data;
        const token = data.token;

        //Validate all the data coming through.
        if (_.isNaN(id)) errors = [...errors, "Please fill in your id"];

        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors,
            };
        }

        //get article
        const convertedArticle = await Models.Article.findAll({
            where: {
                id: id
            }
        });

        //delete article
        const articles = await Models.Article.destroy({
            where: {
                id: id
            }
        });

        await axios.post('http://localhost:3000/article/addConvertedArticle', { subject: convertedArticle[0].dataValues.subject, content:convertedArticle[0].dataValues.content ,token:token })

        //verify if articleId exist
        const article = await Models.Article.update({
            status: true,
        }, {
            where: {
                id: id
            }
        });

        if (article) {
            return {
                status: true,
                errors: ["Status Article Updates."],
            };
        } else {
            return {
                status: false,
                message: ["An article with this id didn't exist."]
            };
        }
    } catch (error) {
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
}