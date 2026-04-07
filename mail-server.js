import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs';
const PORT = 3200;

const app = express();
const abspath = path.resolve('html');
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'upload');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+ "-" +file.originalname);
    }

   
});
const upload = multer({storage:storage});

app.set('view engine','ejs');
app.use(express.static(abspath))
app.use(express.urlencoded({extended:false}));

app.get("/",(req,resp)=>{
    resp.render('email');
});
app.post("/email-send",upload.single('file'), async (req,resp)=>{
    try{
        console.log(req.body);
    const tranporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        family:4,
    auth:{
        user:req.body.from,
        pass:req.body.password

    }
});
    
    const mailOptions={
        from:req.body.from,
        to:req.body.To,
        cc:req.body.cc,
        bcc:req.body.bcc,
        subject:req.body.subject,
        text:req.body.mail, 
        
    
    };

    if(req.file){
          mailOptions.attachments = [{
            filename:req.file.originalname,
            path:req.file.path
        }];

    }
    if(!req.body.mail && !req.file){
        return resp.send("write mail or send files");
    }  
   
    const info = await tranporter.sendMail(mailOptions)
    console.log("Success",info);
    resp.send(""message send");

}
         catch(error){
         console.log("error");
resp.send(error.message);
         }
     
        if(req.file){
            fs.unlink(req.file.path,(err)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log("file Deleted");
                }
            })
        
    });
 
});

  
app.listen(PORT,()=>{
    console.log("server start",PORT)
});

