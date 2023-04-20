const express = require('express')
var mysql = require('mysql');
const cors = require('cors')
const morgan = require('morgan');
const _ = require('lodash');
let Client = require('ssh2-sftp-client');
const extract = require('extract-zip')
const decompress = require('decompress');
var csv = require("csvtojson");
let csvToJson = require('convert-csv-to-json');
const { parse } = require("csv-parse");
const path = require('path');
const dotenv = require('dotenv')
const sgMail = require('@sendgrid/mail')
const moment = require('moment');
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//console.log(process.env.SENDGRID_API_KEY);
const extractDir = path.join(__dirname, '/public/unzip/');
const fs = require('fs')
const app = express()
const port = 4500
const bodyParser = require("body-parser");
const { generateJsonFileFromCsv } = require('convert-csv-to-json/src/csvToJson');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));

fs.appendFile('sqlfile/mynewfile1.sql', 'Hello content!', function (err) {
  if (err) throw err;
  console.log('Saved!');
});

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

// connet may chu sftp
class SFTPClient {
  constructor() {
    this.client = new Client();
  }

  async connect(options) {
    console.log(`Connecting to ${options.host}:${options.port}`);
    try {
      await this.client.connect(options);
      return true;
    } catch (err) {
      console.log('Failed to connect:', err);
      return false;
    }
  }

  async listFiles(remoteDir, fileGlob) {
    console.log(`Listing ${remoteDir} ...`);
    let fileObjects;
    try {
      fileObjects = await this.client.list(remoteDir, fileGlob);
    } catch (err) {
      console.log('Listing failed:', err);
    }
    const fileNames = [];
    for (const file of fileObjects) {
      if (file.type === 'd') {
        console.log(`${new Date(file.modifyTime).toISOString()} PRE ${file.name}`);
      } else {
        console.log(`${new Date(file.modifyTime).toISOString()} ${file.size} ${file.name}`);
      }
      fileNames.push(file.name);
    }
    return fileNames;
  }

  async downloadFile(remoteFile, localFile) {
    console.log(`Downloading ${remoteFile} to ${localFile} ...`);
    let n = 0;
    let fileLocal = localFile+"";
    fileLocal = fileLocal.replace('./','');
    try {
      await this.client.get(remoteFile, localFile);
      console.log("Downloading sucesss!");
      decompress(fileLocal, 'dist', {
        map: file => {
            file.path = `unicorn-${file.path}`;
            return file;
        }
      }).then(async(files) =>  {
        console.log('done!');
      });
      n = 1;
    } catch (err) {
      console.error('Downloading failed:', err);
      n = 0;
    }
    return n;
  }

  async disconnect() {
    await this.client.end();
  }

}

async function insert1000Records(row, i) {

  let sql = "INSERT INTO tsm180_jpzipmstdemo (TYPE,ZIP,BASECD,SORTINGCODE,PREFCD,MUNICIPALITYCD,TOWNAREACD,CITYBLOCCD,AREAADDCHARGEFLG,SEASONALCHARGEFLG,ISLANDFLG,DELIVDISTANCE,DELIVERABLEFLG,IMPENDATETIME) VALUES ";
  let record1000 = [];
  //let i = 0;    
  let codeIndex = 0;
  console.log(reco);
  // for(let element of reco) {
  //   if(i >= (1000 + vitritieptheo)) { break;}
  //   if(i > vitritieptheo) {
  //     record1000.push(element);
  //   }
  //   i++;
  // }
  //console.log(record1000);
  //
  // let index = 0;
  // for(let element of record1000) {
  //   if(index > 0){
  //     sql += ',';
  //   }
  //   sql += `('`+ element.type + `','` + element.zip + `','` + element.basecd + `','` + element.sortingcode + `','` + element.prefcd + `','` + element.municipalitycd + `','` + element.townareacd + `','` + element.citybloccd + `','` + element.areaaddchargeflg + `','` + element.seasonalchargeflg + `','` + element.islandflg + `','` + element.delivdistance + `','` + element.deliverableflg + `','2022-09-27 09:13:48.843039')`;
  //   index++;
  //   codeIndex = element.index;
  // }
  // sql += ";";
  // console.log(sql);
  // if(codeCon === true) {
  //   con.query(sql, function (err, result) {
  //     if (err){
  //       console.log("eror sql no insert:" + codeIndex + "; " + reco.length);//throw err
  //       if(codeIndex == reco.length-1){
  //         console.log("hoan thanh insert");
  //       }else {
  //         insert1000Records(reco,codeIndex);
  //       }
  //     } 
  //     else{
  //       console.log("1000 record inserted");
  //       if(codeIndex == reco.length-1){
  //         console.log("hoan thanh insert" + codeIndex + "; " + reco.length);
  //       }else {
  //         insert1000Records(reco,codeIndex);
  //       }
  //     }
  //   });
  // }else {
  //   console.log("eror connect database !" );
  // }
}


// giai nen zip

(async () => {
 // const parsedURL = new URL(process.env.SFTPTOGO_URL);
  const host = '192.168.23.1';
  const port =  22;
  const username = 'hu_tu';
  const password = '123456a@';
  //const { host, username, password } = parsedURL;
  const urlWork = "/home/hu_tu/PVNAM"

  //* Open the connection
  // const client = new SFTPClient();
  // await client.connect({ host, port, username, password });

  // await client.listFiles(urlWork);


  //* List working directory files
  //await client.listFiles(".");

  //* Upload local file to remote file
 // await client.uploadFile("./local.txt", "./remote.txt");

  //* Download remote file to local file
 // await client.downloadFile("/home/hu_tu/PVNAM/JP (pvnam).zip", "./(pvnam).zip");

  //* Delete remote file
  //await client.deleteFile("./remote.txt");

  //* Close the connection
 // await client.disconnect();

})();

function sendEmail(sgMail,emailTo,linktaifilesql){
  const msg = {
    to: '', // Change to your recipient
    from: '', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: `<strong>noi dung</strong>
           <a href ='${linktaifilesql}'> Tải file tại đây </a>
    `,
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

function getValue(row) {
   let strFirst = `('`;
   let strEnd = `')`;
   let str = '';
   let strContent = '';
   for (let i = 0; i < row.length; i++) {
     if (i > 0) {
       strContent += `','`
     }
     strContent += row[i];
   }
   str += strFirst + strContent + strEnd;
   return str;
}

// tai file tu sever local
app.post('/downloadfilesql', async (req,res) => {
    let headercsv = req.body.headercsv;
    let tableName = req.body.tableName;
    let emailTo = req.body.emailTo;
    let addressfilecsv = req.body.addressfilecsv;
    let listFiles = req.body.listField;
    let listF = listFiles.split(',');
    const paths = path.join(__dirname, addressfilecsv)
    if (fs.existsSync(paths) == true) {
      let sql = `INSERT INTO ${tableName} (${listFiles}) VALUES`;
      let count = 1;
      let strsql300 = `INSERT INTO ${tableName} (${listFiles}) VALUES`;
      let strsqls = '';
      let strsqldu =  `INSERT INTO ${tableName} (${listFiles}) VALUES`;
      let i = 0;
      let lstRowErr = [];
      if (headercsv == 0) {
        await fs.createReadStream(addressfilecsv)
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (element) {
          if(listF.length == element.length) {
            let value = getValue(element); //`('`+ element[0] + `','` + element[1] + `','` + element[2] + `','` + element[3] + `','` + element[4] + `','` + element[5] + `','` + element[6] + `','` + element[7] + `','` + element[8] + `','` + element[9] + `','` + element[10] + `','` + element[11] + `','` + element[12] + `')`;
            if(count <= 300){
               if(count > 1){
                 strsql300 += ','
                 strsqldu += ','
               }
               strsql300 += value;
               strsqldu += value;
            }
            if(count == 300) {
              i++;
              strsqls += `${strsql300};\r`;
              strsql300 = `INSERT INTO ${tableName} (${listFiles}) VALUES`;
              count = 0;
              strsqldu = `INSERT INTO ${tableName} (${listFiles}) VALUES`;
            }
            count++;
          } else {
            lstRowErr.push(element);
          }
        })
        .on("end", async function () {
          console.log("finished");
          strsqls += `${strsqldu};`;
          // luu file sql
          // fs.appendFile('public/mynewfile1.sql', strsqls , function (err) {
          //   if (err) throw err;
          //   console.log('Saved!');
          // });
          sendEmail(sgMail,emailTo,"http://nampham.vn");
          res.status(200).send({code: 0, msg : "connect success !", sql: strsqls, rowError: lstRowErr});
        })
        .on("error", function (error) {
          console.log(error.message);
          res.status(200).send({code: 1004, msg : error.message});
        });
      } else {
        let dem = 1;
        await fs.createReadStream(addressfilecsv)
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (element) {
          if(listF.length == element.length) {
            let value = getValue(element); //`('`+ element[0] + `','` + element[1] + `','` + element[2] + `','` + element[3] + `','` + element[4] + `','` + element[5] + `','` + element[6] + `','` + element[7] + `','` + element[8] + `','` + element[9] + `','` + element[10] + `','` + element[11] + `','` + element[12] + `')`;
            
            if(count <= 300 && dem > 1){
               if(count > 1){
                 strsql300 += ','
                 strsqldu += ','
               }
               strsql300 += value;
               strsqldu += value;
               count++;
            }
            if(count == 300) {
              i++;
              strsqls += `${strsql300};\r`;
              strsql300 = `INSERT INTO ${tableName} (${listFiles}) VALUES`;
              count = 0;
              strsqldu = `INSERT INTO ${tableName} (${listFiles}) VALUES`;
            }
            dem++;
          } else {
            lstRowErr.push(element);
          }
        })
        .on("end", function () {
          console.log("finished");
          strsqls += `${strsqldu};`;
          res.status(200).send({code: 0, msg : "connect success !", sql: strsqls, rowError: lstRowErr});
        })
        .on("error", function (error) {
          console.log(error.message);
          res.status(200).send({code: 1004, msg : error.message});
        });
      }

    } else {
      res.status(200).send({code: 1004, msg : "flie csv khong ton tai"});
    }
})

app.post('/downloadfile', async (req,res) => {
  console.log(req.body);
  let accFstp = req.body.accFstp;
  let host = accFstp.ip;
  let port = accFstp.port;
  let username = accFstp.account;
  let password = accFstp.password;

  let addressfile = req.body.addressFile;
  let filename = req.body.fileName;

  const client = new SFTPClient();
  let iscon = await client.connect({ host, port, username, password });
   if (iscon == true) {
     let n = await client.downloadFile(addressfile, `./${filename}.zip`);//"/home/hu_tu/PVNAM/JP (pvnam).zip"
     let testFolder = './dist/unicorn-JP/'
     let lstFile = []
     fs.readdirSync(testFolder).forEach(file => {
       let linkfile = testFolder + file;
       lstFile.push(linkfile);
       console.log(linkfile);
     })
     console.log(n);
     if(n == 1){
        res.status(200).send({code: 0, msg: "download success", listfile: lstFile});
     }else {
        res.status(200).send({code: 0, msg: "download fail", listfile: []});
     }
     
   } else {
     res.status(200).send({code: 1003, msg: "connect server fail"});
   }
})

app.post('/loginfstp', async (req,res) => {
   console.log(req.body);
   let host = req.body.ip;
   let port = req.body.port;
   let username = req.body.account;
   let password = req.body.password;
   const client = new SFTPClient();
   let iscon = await client.connect({ host, port, username, password });
   if (iscon == true) {
      res.status(200).send({code: 0, msg : "connect success !"});
   } else {
      res.status(200).send({code: 1003, msg: "connect server fail"});
   }
})

app.post('/wellcome', (req,res) => {
   try {
    if(!req.files) {
      res.send({
          status: false,
          message: 'No file uploaded'
      });
    }else {
      console.log(req.files)
    }
   } catch (error) {
       console.log(error.message);
       res.status(500).send(error);
   }
})


app.post('/listdata', (req,res)=>{
    
    let listdata = req.body;
    // Lấy ngày giờ hiện tại
   const now = moment();
    //console.log(listdata.length);
    const formattedDate = now.format('YYYY/MM/DD HH:mm:ss.SSS');
    //console.log(formattedDate);
    let index = 0;
    let i = 0;
    // let sql = "INSERT INTO tsm180_jpzipmst (TYPE,ZIP,BASECD,SORTINGCODE,PREFCD,MUNICIPALITYCD,TOWNAREACD,CITYBLOCCD,AREAADDCHARGEFLG,SEASONALCHARGEFLG,ISLANDFLG,DELIVDISTANCE,DELIVERABLEFLG,IMPENDATETIME,IMPUSRCD) VALUES ";
    // for (let element of listdata) {
    //   if(element.type == "") {
    //     element.type = null;
    //   }
    //   if(element.zip == "") {
    //     element.zip = null;
    //   }
    //   if(element.basecd == "") {
    //     element.basecd = null;
    //   }
    //   if(element.sortingcode == "") {
    //     element.sortingcode = null;
    //   }
    //   if(element.prefcd == "") {
    //     element.prefcd = null;
    //   }
    //   if(element.municipalitycd == "") {
    //     element.municipalitycd = null;
    //   }
    //   if(element.townareacd == "") {
    //     element.townareacd = null;
    //   }
    //   if(element.citybloccd == "") {
    //     element.citybloccd = null;
    //   }
    //   if(element.areaaddchargeflg == "") {
    //     element.areaaddchargeflg = null;
    //   }
    //   if(element.seasonalchargeflg == "") {
    //     element.seasonalchargeflg = null;
    //   }
    //   if(element.islandflg == "") {
    //     element.islandflg = null;
    //   }
    //   // if(element.delivdistance == "") {
    //   //   element.delivdistance = 'NULL';
    //   // }
    //   if(element.deliverableflg == "") {
    //     element.deliverableflg = null;
    //   }
    //   if(i > 0){
    //     sql += ',';
    //   }
    //   sql += `('`+ element.type + `','` + element.zip + `','` + element.basecd + `','` + element.sortingcode + `','` + element.prefcd + `','` + element.municipalitycd + `','` + element.townareacd + `','` + element.citybloccd + `','` + element.areaaddchargeflg + `','` + element.seasonalchargeflg + `','` + element.islandflg + `','` + element.delivdistance + `','` + element.deliverableflg + `','`+formattedDate+`','SYSTEM')`;

    //   index = element.index;
    //   i++;
    // }
    // sql += ";";

    // new
    let sql = "INSERT INTO tsm180_jpzipmst (TYPE,ZIP,BASECD,SORTINGCODE,PREFCD,MUNICIPALITYCD,TOWNAREACD,CITYBLOCCD,AREAADDCHARGEFLG,SEASONALCHARGEFLG,ISLANDFLG,DELIVDISTANCE,DELIVERABLEFLG,IMPENDATETIME,IMPUSRCD) VALUES ";
    for (let element of listdata) {
      if(i > 0){
        sql += ',';
      }
      sql += `(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      index = element.index;
      i++;
    }
    const values = listdata.map(element => [
      element.type ? element.type : null,
      element.zip ? element.zip : null,
      element.basecd ? element.basecd : null,
      element.sortingcode ? element.sortingcode : null,
      element.prefcd ? element.prefcd : null,
      element.municipalitycd ? element.municipalitycd : null,
      element.townareacd ? element.townareacd : null,
      element.citybloccd ? element.citybloccd : null,
      element.areaaddchargeflg ? element.areaaddchargeflg : null,
      element.seasonalchargeflg ? element.seasonalchargeflg : null,
      element.islandflg ? element.islandflg : null,
      element.delivdistance ? element.delivdistance : null,
      element.deliverableflg ? element.deliverableflg : null,
      formattedDate,
      'SYSTEM'
    ]);
     const flatValues = values.flat(); 
    if (codeCon === true) {
      con.beginTransaction((error)=> {
        if (error) {
          console.error('Error starting transaction: ', error);
          return;
        }
        if(index < 300) {
          // Define SQL query to delete data from a table
          const deleteSql = 'DELETE FROM tsm180_jpzipmst';
          con.query(deleteSql,(error,result)=> {
            if (error) {
              console.error('Error deleting data: ', error);
              return con.rollback(() => {
                console.error('Transaction rolled back due to error!');
              });
            }
            console.log('Data deleted successfully!');
          })
        }
        con.query(sql, flatValues, function (err, result) {
          if (err){
            console.log("error sql no insert:" + err.sqlMessage);//throw err
            return con.rollback(() => {
              console.error('Transaction rolled back due to error!');
              res.status(200).send({"vitritieptheo": index, code:1001, sql: sql });
            });
          } 
          console.log('Data inserted successfully!');
          // Commit the transaction
          con.commit((error) => {
            if (error) {
              console.error('Error committing transaction: ', error);
              return con.rollback(() => {
                console.error('Transaction rolled back due to error!');
              });
            }
            console.log('Transaction committed successfully!');
            res.status(200).send({"vitritieptheo": index, code:0, sql: sql });
          });
        });
      })
      // 
    }else {
      res.status(200).send({"vitritieptheo": index,code:1002 });
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

var codeCon = false;

var con = mysql.createConnection({
    host: "34.84.33.242",//34.84.33.242
    port: "3306",
    user: "",
    password: "",
    database: "aer"
  });
//INSERT INTO `aer`.`tsm180_jpzipmst` (`TYPE`, `ZIP`, `BASECD`, `SORTINGCODE`, `PREFCD`, `MUNICIPALITYCD`, `TOWNAREACD`, `CITYBLOCCD`, `AREAADDCHARGEFLG`, `SEASONALCHARGEFLG`, `ISLANDFLG`, `DELIVDISTANCE`, `DELIVERABLEFLG`, `IMPENDATETIME`) 
//VALUES ('F1', '0101628', '552000', '010023', '05', '201', '031', '000', '0', '0', '0', '', '0', '2022-09-27 09:13:48.843039');
con.connect(function(err) {
    if (err) {
      codeCon = false;
      console.log("Not Connected! ." + codeCon);
    }else {
      codeCon = true;
      console.log("Connected! ." + codeCon);
    }
    
});
app.use(function (req, res, next) {
  // i had an error
  next(new Error('boom!'));
});

// error middleware for errors that occurred in middleware
// declared before this
app.use(function onerror(err, req, res, next) {
  // an error occurred!
});

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
//     con.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("1 record inserted");
//     });
//   });
