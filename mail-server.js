import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import multer from 'multer';

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
app.post("/email-send",upload.single('file'),(req,resp)=>{
    const tranporter = nodemailer.createTransport({
    service:'gmail',
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
            file:req.file.originalname,
            path:req.file.path
        }];

    }
    if(!req.body.mail && !req.file){
        return resp.send("write mail or send files");
    }
        
    
 
    console.log(req.body);
    console.log(req.file);
    tranporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error);
        }else{
            resp.send("mail successfully send");
        }
    });

    
});
app.listen(3200);