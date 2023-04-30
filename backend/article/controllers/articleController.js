const _ = require("lodash");
const Models = require("../models");
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai")

const config = new Configuration({
    apiKey:"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"
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
        console.log(tokenDecoded)
        if (!tokenDecoded) {
            return {
                status: false,
                errors: ["Something went wrong please try again later."]
            }
        }
        
        const idUser= tokenDecoded.data.token.payload.idUser
        console.log("idUser",idUser)

        //Verify if UserId exist
        // const id = await axios.post('http://localhost:3000/user/verifUser', { id: idUser })
        //     .then((response) => {
        //         if (response.data.status == false) errors = [...errors, "This id didn't exist"];
        //     })
        //     .catch((error) => {
        //         errors = [...errors, "we can't connect to the other microservice"];
        //     });

        // console.log("idExist",id)

        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors,
            };
        }

        console.log("avant article")
        //create new article
        const article = await Models.Article.create({ subject: subject, content: content, status: false, idUser: idUser });
        // console.log(article)
        console.log("article's auto-generated ID:", article.id);
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
        console.log(error);
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
        console.log(token)

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
        console.log("----------------------------",tokenDecoded)
        if (!tokenDecoded) {
            return {
                status: false,
                errors: ["Something went wrong please try again later."]
            }
        }
        
        console.log("data",tokenDecoded.data.token.payload.idUser)

        //get articles
        const articles = await Models.Article.findAll({
            where: {
                idUser: tokenDecoded.data.token.payload.idUser
            }
        });

        return {
            status: true,
            articles: articles
        };

    } catch (error) {
        console.log(error);
        return {
            status: false,
            errors: ["Something went wrong please try again later."]
        };
    }
}

exports.getArticleNonConverted = async (data) => {
    try {
        let errors = [];
        const tokenNonConverted = data.token
        console.log(tokenNonConverted)

        //Validate all the data coming through.

        if (_.isEmpty(tokenNonConverted)) errors = [...errors, "Please fill in your token"];

        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors,
            };
        }

        //decodeToken
        const tokenDecodedNonConverted = await axios.post('http://localhost:3000/authorisation/decodeToken', { tokenUser: token })
        if (!tokenDecodedNonConverted) {
            return {
                status: false,
                errors: ["Something went wrong please try again later."]
            }
        }
        
        console.log("data",tokenDecodedNonConverted.data.token.payload.idUser)

        //get articles
        const articles = await Models.Article.findAll({
            where: {
                idUser: tokenDecoded.data.token.payload.idUser,
                status: false
            }
        });

        return {
            status: true,
            articles: articles
        };

    } catch (error) {
        console.log(error);
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
}

exports.deleteArticle = async (data) => {
    try {
        let errors = [];
        const idArticle = data.id;
        console.log(data)
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
        console.log(error);
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
}

exports.verifIdArticle = async (data) => {
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
        console.log(error);
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
        const prompt = `write an article about ${subject}`

        const article = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 2048,
            temperature: 1
        })

        console.log(article.data.choices[0].text)

        return {
            status: true,
            articles: article.data.choices[0].text
        };

    } catch (error) {
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
    
}