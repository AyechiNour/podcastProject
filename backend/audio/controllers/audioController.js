const _ = require("lodash");
const Models = require("../models");
const axios = require('axios');
const say = require('say');

const { Configuration, OpenAIApi } = require("openai")


const config = new Configuration({
    apiKey: process.env.OPEN_AI_API
})

const openai = new OpenAIApi(config)

exports.addAudio = async (data) => {
    // const t = await Models.sequelize.transaction(); // start a transaction
  
    try {
      let errors = [];
      const { id, subject, content } = data;
  
      // Validate all the data coming through.
      if (_.isEmpty(subject)) errors = [...errors, "Please fill in your subject"];
      if (_.isEmpty(content)) errors = [...errors, "Please wait until we finish the content"];
  
      // Verify if idArticle exist
      const response = await axios.post("http://localhost:3000/article/verifArticle", { id: id });
      if (response.data.status == false) errors = [...errors, "This id didn't exist"];
  
      if (!_.isEmpty(errors)) {
        // await t.rollback(); // rollback the transaction
        return {
          status: false,
          errors: errors,
        };
      }
  
      const filename = `${id}${subject}.wav`;
  
      say.export(content, null, 1, filename, async (err) => {
        if (err) {
          // await t.rollback(); // rollback the transaction
          return {
            status: false,
            errors: ["Something went wrong please try again later."],
          };
        } else {
          const audio = await Models.Audio.create(
            { subject: subject, url: filename, idArticle: id },
            // { transaction: t } // pass the transaction to the create method
          );
  
          console.log("Audio's auto-generated ID:", audio.id);
  
          if (!audio) {
            // await t.rollback(); // rollback the transaction
            return {
              status: false,
              errors: ["Something went wrong please try again later."],
            };
          }
  
          const response = await axios.post("http://localhost:3000/article/updateArticleStatus", { id: id });
          if (response.data.status == false) {
            // await t.rollback(); // rollback the transaction
            return {
              status: false,
              errors: ["Something went wrong please try again later."],
            };
          }
        }
      });
  
      // await t.commit(); // commit the transaction
  
      return {
        status: true,
        message: ["Audio has been created successfully"],
      };
    } catch (error) {
      console.log(error);
      // await t.rollback(); // rollback the transaction
      return {
        status: false,
        errors: ["Something went wrong please try again later."],
      };
    }
  };
  

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

