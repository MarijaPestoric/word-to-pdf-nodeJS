const express = require("express");
const upload = require("express-fileupload");
const docxConverter = require('docx-pdf');
const path = require('path');
const fs = require('fs');
const app = express();
const nodemailer = require('nodemailer');
const alert = require("alert");
const dir = "./uploads";
const counter = "./counter";

require('dotenv').config();


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'));

const extend_pdf = '.pdf'
const extend_docx = '.docx'


var down_name

app.use(upload());



app.get('/', function(req, res) {
    res.sendFile(__dirname+ "/public/home.html");

});

app.post("/upload", (req, res) => {

    if(req.files.upfile){
      const file = req.files.upfile;
      const name = file.name;
      type = file.mimetype;
      const uploadpath = __dirname + "/uploads/" + name;
      const File_name = name.split('.')[0];
      const Ext_name = ("." + name.split('.')[1]);
  
      down_name = File_name;
      file.mv(uploadpath, (err) => {
        if(err) {
          console.log("File upload failed!", name, err);
        } else if(extend_docx !== Ext_name) {
            console.log("This is not a word document!");
            alert("This file does not seem to be a DOCX file.");
            const delete_path_doc = process.cwd() + `/uploads/${down_name}${Ext_name}`;
            console.log("That file with wrong format is deleted.");
            try {
              fs.unlinkSync(delete_path_doc)
              
              
            } catch(err) {
            console.error(err)
            }
            
  
        }
        else { 
            console.log("File uploaded!", name);
            const initialPath = path.join(__dirname, `./uploads/${File_name}${extend_docx}`);
            const upload_path = path.join(__dirname, `./uploads/${File_name}${extend_pdf}`);
            docxConverter(initialPath,upload_path,function(err,result){
            if(err)
            {
                console.log(err);
            }  else 
            {
                console.log('result'+result);
                
                res.sendFile(__dirname +'/public/download.html')
            }
           
            });
        }
      })
    } else {
      
      res.send("No file selected!");
     
    }
  })

  app.get('/download', (req,res) =>{
    
   
    res.download(__dirname + `/uploads/${down_name}${extend_pdf}`,`${down_name}${extend_pdf}`,(err) =>{
      console.log(down_name);
      if(err){
        res.send(err);

      } else {

        console.log('Docx file deleted');
        const delete_path_doc = process.cwd() + `/uploads/${down_name}${extend_docx}`;

        try {

          fs.unlinkSync(delete_path_doc)

        } catch(err) {
        console.error(err)
        }
      }
    })
  })

app.post("/sendmail", (req,res) => {
 
  var email = req.body.email;
  console.log(email);
console.log(email);
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: "word2pdf2021@gmail.com",
        pass: process.env.PASSWORD
    }
});

const mailOptions = {
    from: "word2pdf2022@gmail.com",
    to: email,
    subject: "Your PDF file is ready",
    html: "<h1>Thank you for using word2PDF converter!</h1>",
    attachments: [
      {
          filename: `${down_name}${extend_pdf}`,                                         
          path: `./uploads/${down_name}${extend_pdf}`
      }]
}

transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {

      
      console.log('Email sent: ' + info.response);
      res.sendFile(__dirname + "/public/done.html")
     
    }
  });
  })

app.listen(3000, function(){
    console.log("Server starter running on port 3000!");
});
   