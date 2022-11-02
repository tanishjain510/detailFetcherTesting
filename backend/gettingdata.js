import xpath from "xpath";
import {DOMParser} from 'xmldom';
import puppy from "./getData.js";

const getUpdatedData = async(url,xpath1)=> {

    // console.log("url in gettig datta ",url);
    // console.log("xpath  in gettig datta ",xpath1);
    // xpath1 = JSON.parse(xpath1 )
    console.log(xpath1);
    const html = await puppy(url);
    var dom = new DOMParser();
    var doc = dom.parseFromString(html)
    let keys = Object.values(xpath1);
    console.log("keys.length",keys.length);
    // console.log("keys",keys);
    // console.log("doc :-"+doc)
    var data = []


    for( var i=0;i<keys.length;i++)
    {
        try {
            const xpathTemp =keys[i].Xpath; 
        // console.log(xpathTemp)
         data.push({head : "",title : ""})
        var title = xpath.select(xpathTemp, doc).toString();
        // console.log(title)

        // // var title = xpath.select(xpathTemp, doc).toString()
        // // console.log(title)
        if(title)
        {
            var ar = title.split('>')
            console.log(title)
            console.log(ar)
            ar = ar[1]
            ar = ar?.split('<')
            title = ar[0]
        }
        data[i].head = keys[i].head;
        data[i].title = title;
        } catch (e) {
            return 
        }
    }

return data;
}
export default getUpdatedData;

// import xpath from "xpath";
// import {DOMParser} from 'xmldom';
// import puppy from "./getData.js";

// const getUpdatedData = async(url,xpath1)=> {

//     // console.log("url in gettig datta ",url);
//     // console.log("xpath  in gettig datta ",xpath1);
//     const html = await puppy(url);
//     var dom = new DOMParser();
//     var doc = dom.parseFromString(html)
//     // console.log("doc ," ,doc );
//     let keys = Object.values(xpath1);
//     console.log("keys.length",keys.length);
//     var data = []
//     var json = "{";
//     for( var i=0;i<keys.length;i++)
//     {
//         const xpathTemp =keys[i].Xpath;    
//          data.push({head : "",title : ""})
//         var title = xpath.select(xpathTemp, doc).toString();
//         // console.log(xpath.select(xpathTemp, doc));
//         console.log("heiii");
//         console.log("title",title);
//         if(title)
//         {
//         var ar = title.split('>')
//         ar = ar[1]
//         ar = ar.split('<')
//         title = ar[0]
//         }
//         data[i].head = keys[i].head;
//         data[i].title = title;
//         console.log("data = "+title);
//     }
//     const editedText = json.slice(0, -1) + "}";
// return data;
// }
// export default getUpdatedData;