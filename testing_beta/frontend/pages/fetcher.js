import React,{useState,useEffect} from 'react';
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
function App() {

 const [count,setcount]=useState([{social: "",Link : ""}])
  
let addFormFields = () => {
  setcount([...count, {social: "",Link : ""}])
}
let removeFormFields = (i) => {
  let newFormValues = [...count];
  newFormValues.splice(i, 1);
  setcount(newFormValues);
}
const [value, setValue] = useState("") ;
    return (
        <>
          {count.map((element, index) => (
            <div className="form-inline" key={index} style={{display:"flex"}}>
               <InputGroup className="mb-3" id="App" key={index}>
            <Form.Control
            placeholder="key"
            className="Link"
            onChange={e => this.save(index, e)}
          />
          <Form.Control
            placeholder="value"
            className="Link"
            onChange={e => this.save(index, e)}
          />
        </InputGroup>
              {
                index ? 
                  <button type="button"  className="button remove" onClick={() => removeFormFields(index)}>Remove</button> 
                : null
              }
            </div>
          ))}
          <div className="button-section">
              <button className="button add" type="button" onClick={() => addFormFields()}>Add</button>
              <button className="button submit" type="submit" onClick={()=>{
                console.log(count)
              }}>Submit</button>
          </div>
      </>
    )
}
export default App;







