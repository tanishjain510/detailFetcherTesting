import Airtable from "airtable";
import getUpdatedData from "./gettingdata.js";
var urlAndData = [];

function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }
  //find & remove port number
  hostname = hostname.split(":")[0];
  //find & remove "?"
  hostname = hostname.split("?")[0];
  return hostname;
}
const getConfigTable = async (domainName) => {
  var base = new Airtable({ apiKey: "key7TosLDxc4hoh5j" }).base(
    "appbLzWdpNCj4unYq"
  );
  // console.log("HERE");
  const base1 = base("configuration");
  // console.log("here");
  const select = base1.select({
    maxRecords: 100,
    view: "Grid view",
  });
 select.eachPage(
    function page(records, fetchNextPage) {
      // console.log("hi");
      var i =0;
      records.forEach(function (record) {
        urlAndData.push({url : "",data : ""});
        urlAndData[i].url  =record.get('Domain');
        urlAndData[i].data = record.get('data');
         i++;

      });
      fetchNextPage();
    },
    function done(err) {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
//   getUrlFromTable();
};
async function setConfigTable ()
{   getConfigTable();

}

const getUrlFromTable = async () => {
    console.log("called");
  var base = new Airtable({ apiKey: "key7TosLDxc4hoh5j" }).base(
    "appbLzWdpNCj4unYq"
  );
  base("Table 1")
    .select({
      maxRecords: 200,
      view: "Grid view",
    })
    .eachPage(
      async function page(records, fetchNextPage)  {
        // console.log("final ");
        for (var i = 0; i < records.length; i++) {
            // console.log(records[i].id);
          if (records[i].get("URL") != undefined) {

            const domain = extractHostname(records[i].get("URL")) ;
            var  xpath ="";
            for( let temp of urlAndData )
            {
                if (domain === temp.url)
                {
                  try {
                      xpath = JSON.parse(temp.data) 
                        const data =  await getUpdatedData(records[i].get("URL"),xpath);
                        let stringToSend = "{";
                        for (let [key, value] of Object.entries(data)) {
                            stringToSend =stringToSend +'"' +value.head +'"' +":" +'"' +value.title +'"' +",";
                        }
                        const editedText = stringToSend.slice(0, -1)  + "}";
                        base('Table 1').update([
                            {
                              "id": records[i].id ,
                              "fields" : JSON.parse(editedText)
                            }
                        ])
                        console.log("updated records");
                    } catch (error) {
                       console.log("wrong url");
                       console.log(error);
                    }
                    return ;
                }       
            }
          }
        }
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  //    await  getConfigTable(extractHostname(recordTemp[0].get("URL")));
};
export { setConfigTable,getUrlFromTable};
