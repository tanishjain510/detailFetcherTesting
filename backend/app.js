import express from "express";
import puppy from "./getData.js";
import getUpdatedData from "./gettingdata.js";
import { setConfigTable, getUrlFromTable } from "./getUrlfromTable.js";
import cors from 'cors'
var app = express();
app.use(cors())
app.use(express.json());

app.post("/croneUpdatedata", async (req, res) => {
  // console.log("app:-");
  const timeDelay = () => {
    setTimeout(() => {
      getUrlFromTable();
    }, 2000);
  }
  timeDelay();
  setConfigTable();
  res.send("crone run succesfully");
});
app.post("/getdata", async (req, res) => {

  try {
    const url = req.body.link;
    const data = await puppy(url);
    console.log("supari ");
    res.send({
      data: data
    });
  } catch (error) {
    res.send({
      data: error,
    });
  }
});
app.post("/getUpdatedData", async (req, res) => {
  try {
    const url = req.body.url
    const xpath = req.body.xpath;
    // console.log(url,xpath)
    //  console.log("url"+url);
    //  console.log("xapth"+xpath);
    const data = await getUpdatedData(url, xpath);
    res.send({
      data: data,
    });
  } catch (error) {
    res.send({
      data: error,
    });
  }
});


// app.get("/croneUpdatedata", async (req, res) => {
//   // console.log("app:-");
//   const timeDelay = () => {
//     setTimeout(() => {
//       getUrlFromTable();
//     }, 4000);
//   }
//   timeDelay();
//   setConfigTable();
//   res.send("crone run succesfully");
// });
// app.post("/getdata", async (req, res) => {
//   const url = req.body.link;
//   console.log(url);
//   const data = await puppy(url);
//   res.send({
//     data: data 
//   });
// });
// // app.post("/getUpdatedData", async (req, res) => {
// //   const url = req.body.link
// //   const xpath = req.body.xpath;
// //   //  console.log("url"+url);
// //    console.log("xapth"+xpath);
// //   const data = await getUpdatedData(url,xpath);
// //  res.send({
// //     data: "data",
// //   });
// // });
// app.post("/getUpdatedData", async (req, res) => {
//   try {
//    const url = req.body.url
//    const xpath = req.body.xpath;
//    const data = await getUpdatedData(url,xpath);
//      res.send({
//        data: data,
//      });
//   } catch (error) {
//    res.send({
//      data: error,
//    });
//   }
//  }); 
app.listen(5001);



