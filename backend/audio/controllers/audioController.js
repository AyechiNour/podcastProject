const _ = require("lodash");
const Models = require("../models");
const axios = require('axios');
const say = require('say');
const path = require('path');

const { Configuration, OpenAIApi } = require("openai")


const config = new Configuration({
  apiKey: process.env.OPEN_AI_API
})

const openai = new OpenAIApi(config)

exports.getAudio = async (data) => {
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

    // console.log("data", tokenDecoded.data.token.payload.idUser)

    //get articles
    const articles = await axios.post('http://localhost:3000/article/getArticle', { token: token })
    // console.log( articles)
    if (!articles) {
      return {
        status: false,
        errors: ["Something went wrong please try again later."]
      }
    }

    const articlesData = articles.data.articles

    const finalAudio = []
    await Promise.all(articlesData.map(async (data) => {
      const audio = await Models.Audio.findOne({
        where: {
          idArticle: data.id
        }
      });
      if (!_.isNull(audio)) {
        finalAudio.push(audio.dataValues)
      }

    }))

    return {
      status: true,
      audios: finalAudio
    };

  } catch (error) {
    console.log(error);
    return {
      status: false,
      errors: ["Something went wrong please try again later."]
    };
  }
};


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
    const fil=`${id}${id * 10000}.wav`;

    const filename = path.join(__dirname, '../uploads', fil);
    say.export(content, null, 1, filename, async (err) => {
      if (err) {
        // await t.rollback(); // rollback the transaction
        return {
          status: false,
          errors: ["Something went wrong please try again later."],
        };
      } else {
        const audio = await Models.Audio.create(
          { subject: subject, url: fil, idArticle: id },
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

