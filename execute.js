const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const upload = require('express-fileupload');
const CONFIG = require('./config/conf');
const cookies = require('cookie-parser');
const ejs = require('ejs')
const router = require('./routes/index');
const viewRouter = require('./viewRoute/index');

app.set('view engine', ejs);
app.use(bodyparser.json());
app.use(upload());






//Configuring express server
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cookies());
app.use('/', router);
app.use('/', viewRouter);
app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));
  


app.listen(CONFIG.running_port, () => {
    console.log(`Listening To The Port Number ${CONFIG.running_port}`)
})