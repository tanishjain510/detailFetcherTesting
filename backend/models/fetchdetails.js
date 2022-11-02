import mongoose from 'mongoose'; 
const fetchDetailSchema = new mongoose.Schema({

    url:  {
        type: String,
        unique:true
    },
    data : [
        {
        key: "",
        value: ""
        },
        {
        key: "",
        value: ""
        },
        {
        key: "",
        value: ""
        },
        {
        key: "",
        value: ""
        }
        // ...
    ]



    })

    const fetchDetail = mongoose.model("fecth",fetchDetailSchema)

export default fetchDetail;