const http=require('http');
const fs=require('fs');
const path=require('path');
const port=3000;
const qs=require('querystring');
const nodemailer=require("nodemailer");

const server=http.createServer((req,res)=>{
    const decodeURL=decodeURI(req.url);
    let requestedURL=decodeURL==='/' ? '/index.html' : decodeURL;
    if(req.method==='GET'){
       
const filePath=path.join(__dirname,requestedURL);


// read file
fs.readFile(filePath,(err,data)=>{

    if(err){
        // error
        res.writeHead(500,{"content-type":"text/plain"});
        res.end("Internal Server Error.");
    }else{
        // serving files
        const contype=getContentType(filePath);
        res.writeHead(200,{"content-type":contype
        });
        res.end(data);
    }
});

    }else if(req.method==='POST' && req.url==='/submit'){
        let body='';
        req.on('data',(chunk)=>{
            body +=chunk.toString();
        });
        req.on('end',()=>{
            const formData=qs.parse(body);
            // send message
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"fcleaning949@gmail.com",
        pass:"uhyzpabsbcnhduau"
    }
});
let template=`Hello Flawless Cleaning, a new message from your site with clients details below.
Name: ${formData.name}
Email: ${formData.email}
Phone:${formData.phone}
Message:${formData.message}
`;
// setup mail data 
const mailOptions={
    from:"Flawless Cleaning Site. fcleaning949@gmail.com ",
    to:"flawlesscleaningservicesllc19@gmail.com",
    subject:"Message from Flawless Cleaning site",
    text:template
};
transporter.sendMail(mailOptions,(err,info)=>{
    if(err){
        console.log(err)
    }else{
        fs.readFile('message.html',(err,data)=>{
            if(err){
                res.writeHead(404,{"content-type":"text/html"});
                res.end("ERROR");
            }else{
                res.writeHead(200,{"content-type":"text/html"});
                res.end(data);
            }
        })
    }
})
        });
    }else{
        res.writeHead(404,{"Content-type":"text/plain"});
        res.end("Not Found.");
    }
    
});


server.listen(port,()=>{
    console.log(`Server listening at port ${port}`);
});

function getContentType(filePath){
    const extname=path.extname(filePath);

    switch(extname){
        case '.html':
return 'text/html';
case '.css':
    return 'text/css';
    case '.js':
        return 'text/js';
        case '.png':
            return 'image/png';
            case'.jpg':
            case '.jpeg':
            return 'image/jpeg'
            default:
                return 'text/plain';
    }
}