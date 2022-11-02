import cheerio from "cheerio";
import http from "http";
import axios from "axios";
import fetch from "node-fetch";
// import { data } from "cheerio/lib/api/attributes";
const puppy = async (name) => {
  var dataTosend=""
  async  function setdata(data) {
    dataTosend = data;
    console.log("hello");
    console.log("data = ",data);
    return data;
  }
  const url = name;
  try 
  {
    console.log("response");
     return fetch(url)
  .then((response) => response.text())
  // .then(async (data) =>
 
  console.log("chnahcal");
    // console.log("hello");
    // return axios(url).then((response) => {
    //   console.log(url);
    //   const html_data = response.data;
    //   const $ = cheerio.load(html_data);
    //   const hello = cheerio.load(html_data).html();
    //   return hello;
    // });
  }
  catch (error) 
  {
    console.log("error",error);
    return e
  }
};
export default puppy;


































// import cheerio  from "cheerio";
// import axios  from "axios";

// const puppy = async(name) => {

//     // const browser = await puppeteer.launch();
//     // const page = await browser.newPage();
//     // // console.log("url_pup:-"+ name);
//     // await page.goto(name, { waitUntil: "domcontentloaded" });
//     // const data = await page.content();
//     // // console.log("a done")
//     // await browser.close();
//     // console.log("done")
//     // return data;
//     console.log("in puupy ");
//     const url = name;
//     console.log(name);
//     try {
//       return axios(url).then((response) => {
//         const html_data = response.data;
//           const $ = cheerio.load(html_data);
//           const hello = cheerio.load(html_data).html();
//           console.log("completed ");
//           return hello; 
//       });
//     } 
//     catch (error)
//      {
//       console.log(error);
//       return ""
//     }    
//   };

//   export default puppy;