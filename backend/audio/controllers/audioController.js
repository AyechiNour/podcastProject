const _ = require("lodash");
const Models = require("../models");
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai")
const multer = require('multer');

const config = new Configuration({
    apiKey: process.env.OPEN_AI_API
})

const openai = new OpenAIApi(config)

exports.addAudio = async (data) => {
    try {
        let errors = [];
        const { subject, content, idArticle } = data;

        //Validate all the data coming through.

        if (_.isEmpty(subject)) errors = [...errors, "Please fill in your subject"];

        if (_.isEmpty(content)) errors = [...errors, "Please wait until we finish the content"];

        //Verify if idArticle exist
        const id = await axios.post('http://localhost:3000/article/verifArticle', { id: idArticle })
            .then((response) => {
                if (response.data.status == false) errors = [...errors, "This id didn't exist"];
            })
            .catch((error) => {
                errors = [...errors, "we can't connect to the other microservice"];
            });

        if (!_.isEmpty(errors)) {
            //If the errors array contains any then escape the function.
            return {
                status: false,
                errors: errors,
            };
        }

        //create new audio
        const audio = await Models.Audio.create({ subject: subject, content: content, idArticle: idArticle });
        console.log("Audio's auto-generated ID:", audio.id);
        if (!audio) {
            return {
                status: false,
                errors: ["Something went wrong please try again later."],
            };
        }

        return {
            status: true,
            message: ["profil has been created successfully"]
        };

    } catch (error) {
        console.log(error);
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
}

exports.deleteAudio = async (data) => {
    try {
        let errors = [];
        const idAudio = data.id;

        //delete audio
        const audio = await Models.Audio.destroy({
            where: {
                id: idAudio
            }
        });

        if (audioaddAudios) {
            return {
                status: true,
                message: ["audio deleted successfully"]
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

exports.generateImage = async (data) => {
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

        //generate Image
        const prompt = `A sketch of ${subject}`

        const img = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: "1024x1024"
        })

        console.log(img.data.data)

        return {
            status: true,
            image: img.data.data
        };

    } catch (error) {
        console.log(error);
        return {
            status: false,
            errors: ["Something went wrong please try again later."],
        };
    }
}