import axios from "axios";
const URL = "http://localhost:5001"
// const URL = "http://65.0.203.56"




const getPage = async (url) =>{
    const d ={
        link : url
    }
    const data = await axios.post(URL +"/getdata",d);
    return data;
};

const getDataFromApi = async (url,json) =>{
    const d ={
        url : url,
        xpath:json
    }
    const data = await axios.post(URL +"/getUpdatedData",d);
    return data;
};

export {getPage,getDataFromApi};
