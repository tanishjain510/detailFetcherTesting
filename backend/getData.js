import cheerio from "cheerio";
import http from "http";
import axios from "axios";
import fetch from "node-fetch";
import createBrowserless from 'browserless';
import getHTML from 'html-get'
const puppy = async (name) => {
  var dataTosend = ""
  // async  function setdata(data) {
  //   dataTosend = data;
  //   console.log("hello");
  //   console.log("data = ",data);
  //   return data;
  // }
  // const url = name;
  // try 
  // {
  //   console.log("response");
  //    return fetch(url)
  // .then((response) => response.text())
  //   // .then(async (data) =>
  //   // console.log("hello");
  //   // return axios(url).then((response) => {
  //   //   console.log(url);
  //   //   const html_data = response.data;
  //   //   const $ = cheerio.load(html_data);
  //   //   const hello = cheerio.load(html_data).html();
  //   //   return hello;
  //   // });
  // }
  // catch (error) 
  // {
  //   console.log("error",error);
  //   return e
  // }

  const browserlessFactory = createBrowserless()
  process.on('exit', () => {
    console.log('closing resources!' + "tan = ")
    browserlessFactory.close()
    // console.log("datatosend", dataTosend);
    return;
    // return dataTosend;
  })
  const getContent = async url => {
    const browserContext = browserlessFactory.createContext()
    const getBrowserless = () => browserContext
    const result = await getHTML(url, { getBrowserless })
    await getBrowserless((browser) => browser.destroyContext())
    console.log("new changeds ");
    return result

  }
  await getContent(name)
    .then(content => {
      // console.log(content.html)
      browserlessFactory.close()
      dataTosend = content.html;
      // process.exit();
      // return dataTosend;
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
  console.log("ended");
  return dataTosend;
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