const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const mailGun = require('nodemailer-mailgun-transport');
const serverless = require('serverless-http');
const https = require('https');

const port = 3000;

require('dotenv').config();


const app = express();


app.set('view engine ', 'ejs');
app.use(express.static("public"));


//data parsing
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/index',function(req,res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/contact',function(req,res){
    res.sendFile(__dirname + '/contact.html');
});
app.get('/writing',function(req,res){
    res.sendFile(__dirname + '/writing.html');
});
app.get('/project',function(req,res){
    res.sendFile(__dirname + '/project.html');
});
app.get('/resume',function(req,res){
    res.sendFile(__dirname + '/resume.html');
});




app.listen(port, () => {
    console.log(`server running on port ${port}`);
});



app.post("/send_email", (req, res) => {
    const first = req.body.firstName;
    const last = req.body.lastName;
    const email = req.body.mail;
    const sub = req.body.subject;
    const msg = req.body.message;
    const full = first + ' ' +last+ ' ' +email;


const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
      }
    });



const mailOptions = {
    from: full,
    to: process.env.AUTH_EMAIL,
    // cc: process.env.AUTH_EMAIL2,
    subject: sub,
    text: email + ' ' + msg,

};

transporter.sendMail(mailOptions)
    .then(() => {
        //Successful message
        res.sendFile(__dirname + '/success.html');
    })
    .catch((error) => {
        //An error occurred
        console.log(error);
        res.json({
            status: 'FAILED',
            message: 'An error occured!'})

})

});
