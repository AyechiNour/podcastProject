const Express = require('express')
const audioRoute = Express.Router()
const bodyParser = Express.urlencoded({ extended: true })
const audioController = require('../controllers/audioController')


audioRoute.post('/getAudio', async (req, res, next) => {
    try {
        const result = await audioController.getAudio(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
		//this is used to configure the rquest issued by the client 
    }
}
);



audioRoute.post('/addAudio', async (req, res, next) => {
    try {
        const result = await audioController.addAudio(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
    }
}
);

audioRoute.delete('/deleteAudio', async (req, res, next) => {
    try {
        const result = await audioController.deleteAudio(req.body)
        res.status(200).json(result)
	} catch (error) {
        res.status(400).json(error);
    }
}
);


module.exports = audioRoute
