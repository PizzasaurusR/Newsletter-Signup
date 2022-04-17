const express = require("express");
const bodyParser = require("body-parser");
const { appendFile } = require("fs");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname +"/signup.html");
})

app.post("/", function(req, res){
    
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const emailAddress = req.body.email;

    const data = {
      members: [
          {
        email_address: emailAddress,
        status : "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName  
        }
      }
    ]  
    };

    const jsonData = JSON.stringify(data);
    const url ="https://us14.api.mailchimp.com/3.0/lists/aeb5509746";
    const options = {
        method: "POST",
        auth: "ramiz1:04de0bcd314c811cd69d239cae28349a-us14"
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        } else{
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })    
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
})

// MailChimp API Key 04de0bcd314c811cd69d239cae28349a-us14
//  Mailchimp audience Id aeb5509746