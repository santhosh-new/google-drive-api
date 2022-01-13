/** Imports start */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const {google} = require('googleapis');
const path = require('path');
const fs = require('fs');
const { response } = require('express');
  /* Imports end */

/** App declaration start */
const app = express();
/** App declaration end */

/** Dot env config start */
dotenv.config();
/** Dot env confif end */

/** App use start */
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
/** App use end */

/** App initialization start */
app.listen(process.env.PORT,()=>{console.log("app is running")});
/** App initialization end */

/** Routes start */
app.get('/test',(request, response)=> { 
    response.json({success:true, message: 'server is running'})
});

app.get('/upload-file',async (request, response)=> { 
  const fileStatus = await uploadFile();
  if(fileStatus.status === 200) { 
    response.json({success: true, message: 'file uploaded successfully!', data: fileStatus})
  } else { 
    response.json({success: false, message: 'unable to upload file', data: fileStatus})
  }
});
/** Routes end */

/** Google drive const start */
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
/** Google drive const end */

/** OAuth2 client configuration start */
const oauth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
    'version': 'v3',
    'auth': oauth2Client
})
/** OAuth2 client configuration end */

/** Defining file path start */
const filepath = path.join(__dirname, 'sample.jpg');
var fileMetadata = {
    'name': 'Sample',
    'mimeType': 'image/jpg'
  };
  var media = {
    mimeType: 'image/jpg',
    body: fs.createReadStream(filepath)
  };
/** Defining file path end */

/** File manipluation functions start */

async function uploadFile() {
  let result = ''; 
    try {
        const apiResponse = await drive.files.create({requestBody:fileMetadata, media: media});
        result = apiResponse;
    } catch (error) {
        result = error;
    }
    return result;
}

// uploadFile();

/** File manipluation functions end */

