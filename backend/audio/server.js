require('dotenv').config();
const Express = require("express")
const audioRoute = require("./routes/audioRoute")
const app = Express()
const bodyParser = require('body-parser');


const models = require('./models')
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
// app.use(Express.json())
// app.use(audioRoute)
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads') // Set the destination folder for file uploads
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Set the filename of the uploaded file
    }
});

const upload = multer({ dest: 'uploads/' })


app.post('/addAudio', upload.single('audio'), (req, res) => {
    console.log(req.body)

    console.log(req.file)
    res.send('File uploaded successfully!');
});
models.sequelize.sync().then(function () {
    app.listen(3003, () => { console.log("Audio listening on port 3003") })
});