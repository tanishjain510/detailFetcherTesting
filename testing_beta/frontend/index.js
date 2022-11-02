import { initializeBlock } from "@airtable/blocks/ui";
import React, { useState, useEffect } from "react";
import { getPage } from "./api/Api.js";
import { getDataFromApi } from "./api/Api.js";
import { FieldType } from "@airtable/blocks/models";
import { useBase } from "@airtable/blocks/ui";
import { FcFullTrash } from "react-icons/fc";
import "./index.css";
// import fs from 'fs'
const HelloWorldApp = () => {
  const [field, setField] = useState([]);
  const [link, setLink] = useState();
  const [data, setData] = useState();
  const [check, setcheck] = useState();
  const [event, setEvent] = useState(false);
  const [xpath, setXpath] = useState();
  const [count, setcount] = React.useState([{ head: "", Xpath: "" }]);
  const [valid, setvalid] = React.useState([false]);
  const [store, setStore] = React.useState([]);
  const [filename, SetFileName] = useState([]);
  const [countTracker, setCountTracker] = useState(1);
  const [tableName, SetTableName] = useState([]);
  const [userTableName, SetUserTableName] = useState();
  const base = useBase();
  // console.log(base?._sdk?.base?._baseData?.tablesById);
  // console.log(
  //   base?._sdk?.base?._baseData?.tablesById[
  //     Object.keys(base?._sdk?.base?._baseData?.tablesById)[0]
  //   ].name
  // );
  const [tables, setTable] = useState();
  const tt =
    base?._sdk?.base?._baseData?.tablesById[
      Object.keys(base?._sdk?.base?._baseData?.tablesById)[0]
    ].name;
  // const table = base.getTableByName("config");
  // const records = useRecords(table.selectRecords());
  let countTemp = countTracker;

  function GetTableName() {
    let arrayToStoreTable = [];
    for (let i = 0; i < base.tables.length; i++) {
      if (
        base?._sdk?.base?._baseData?.tablesById[
          Object.keys(base?._sdk?.base?._baseData?.tablesById)[i]
        ].name === "configuration"
      ) {
      } else {
        const name =
          base?._sdk?.base?._baseData?.tablesById[
            Object.keys(base?._sdk?.base?._baseData?.tablesById)[i]
          ].name;
        arrayToStoreTable.push(name);
      }
    }
    SetTableName([...arrayToStoreTable]);
    return { arrayToStoreTable };
  }

  async function createNewTable() {
    console.log("createNewTable !!!!!");
    const name = "configuration";
    const fields = [
      // Name will be the primary field of the table.
      {
        name: "Domain",
        type: FieldType.URL,
        description: "This is the primary field",
      },
      {
        name: "data",
        type: FieldType.MULTILINE_TEXT,
        description: " SECONDARY Field",
      },
    ];
    if (base.hasPermissionToCreateTable(name, fields)) {
      await base.createTableAsync(name, fields);
    }
  }
  async function tableCreateChecker() {
    let flag = 0;
    for (let i = 0; i < base.tables.length; i++) {
      if (
        base?._sdk?.base?._baseData?.tablesById[
          Object.keys(base?._sdk?.base?._baseData?.tablesById)[i]
        ].name === "configuration"
      ) {
        flag = 1;
        break;
      }
    }
    if (flag === 0) {
      await createNewTable();
    }
    return true;
  }

  function GetHeading(table_name) {
    document.getElementById("list").classList.remove("hide");

    let arrayToAppend = [];
    for (let field of base.getTable(table_name).fields) {
      {
        const name = field.name;
        if (field.type === "singleLineText" || field.type === "multilineText")
          arrayToAppend.push(name);
      }
    }
    SetFileName([...arrayToAppend]);
    document.getElementById("find_table").classList.add("hide");
    return { arrayToAppend };
  }

  const fetchData = async () => {
    if (link) {
      const domain = extractHostname(link) + "/";
      console.log(domain);
      var url = link.split(domain);

      if (url[1].length > 1) {
        document.getElementById("link_error").classList.add("hide");
        const l = await getPage(link);
        setData(l);
        // console.log(l);
        await (document.getElementById("page").innerHTML = l.data.data);
        setEvent(true);
        document.getElementById("details_fetcher").classList.remove("hide");
        document.getElementById("landing_body").classList.add("hide");
        document.getElementById("formbold-main-wrapper").style.display =
          "flex;";
        document
          .getElementById("formbold-main-wrapper")
          .classList.remove("hide");
          // document.getElementById("back").classList.remove("hide");
      } else {
        document.getElementById("link_error").classList.remove("hide");
        document.getElementById("link_error").innerHTML =
          "***Enter Product Url***";
      }
    } else {
      document.getElementById("link_error").classList.remove("hide");
      document.getElementById("link_error").innerHTML = "***Link required***";
    }

  };

  const fetchDataFromTable = async () => {
    if (link) {
      const domain = extractHostname(link) + "/";
      console.log(domain);
      var url = link.split(domain);
      // console.log(url);
      // console.log(url[1]);
      // console.log(url[1].length);

      if (url[1].length > 1) {
        document.getElementById("link_error").classList.add("hide");
        const table = base.getTableByName("configuration");
        let queryResult = await table.selectRecordsAsync({
          fields: ["Domain", "data"],
        });
        var data = [];
        const domain = extractHostname(link);
        console.log(queryResult.records[0]);
        for (let record of queryResult.records) {
          if (domain === record.getCellValueAsString("Domain")) {
            console.log(
              `**${record.id}**${record.getCellValueAsString("data")}`
            );
            data = JSON.parse(record.getCellValueAsString("data"));
            const jsonTOSend = record.getCellValueAsString("data");
          }
        }
        try {
          const dataa = await getDataFromApi(link, JSON.parse(jsonTOSend));
          setStore(dataa.data.data);
          const table_row = [];
          let stringToSend = "{";
          for (let [key, value] of Object.entries(dataa.data.data)) {
            stringToSend =
              stringToSend +
              '"' +
              value.head +
              '"' +
              ":" +
              '"' +
              value.title +
              '"' +
              ",";
            table_row.push(value.head);
          }
          let UrlTemp = "";
          for (let field of base.getTable(userTableName).fields) {
            {
              const name = field.name;
              if (name === "URL") {
                UrlTemp = "," + '"URL"' + ":" + '"' + link + '"';
                break;
              }
            }
          }
          const editedText = stringToSend.slice(0, -1) + UrlTemp + "}";
          // const editedText = stringToSend.slice(0, -1) + "}";
          console.log("edited text = " + editedText);
          console.log(table_row);
          console.log(filename);
          console.log();
          const result = table_row.every((val) => filename.includes(val));
          if (result) {
            base.getTable(userTableName).createRecordsAsync([
              {
                fields: JSON.parse(editedText),
              },
            ]);
            document.getElementById("new_data").classList.remove("hide");
          } else {
            console.log("table mismatch");
            document.getElementById("link_error").classList.remove("hide");
            document.getElementById("link_error").innerHTML =
              "Wrong table to insert data";
          }
        } catch (error) {
          console.log(error);
          console.log("wrong value");
          document.getElementById("link_error").classList.remove("hide");
          document.getElementById("link_error").innerHTML =
            "***Website is Not configure Yet , First Configure it***";
        }
      } else {
        document.getElementById("link_error").classList.remove("hide");
        document.getElementById("link_error").innerHTML =
          "***Enter Product Url***";
      }
    } else {
      document.getElementById("link_error").classList.remove("hide");
      document.getElementById("link_error").innerHTML = "***Link required***";
    }
  };
  const lnk = document.getElementById("page");
  useEffect(() => {
    let tempCount = count;
    tempCount[count.length - 1].Xpath = xpath;
    setcount([...tempCount]);
  }, [xpath]);
  useEffect(() => {
    // GetHeading();
    GetTableName();
  }, []);
  useEffect(() => {
    if (userTableName) {
      GetHeading(userTableName);
    }
  }, [userTableName]);

  if (lnk) {
    lnk.addEventListener("click", function (e) {
      if (event) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        if (e.target.name) {
          e.preventDefault();
        }
        var text = getElementXPath(e.target);
        text = text.replace("//*[@id=page]", "/html/body");
          
        if (!text.includes("/html/body")) {
          text = text.replace("//*[@id=", '//*[@id="');
          text = text.replace(/]/, '"]');
        }

        // text = text.replace("id=", `id="`);
        // text = text.replace("]", `"]`);
        setXpath(text);
        // console.log(count.length-1);
      }
    });
  }
  function getElementXPath(element) {
    if (!element) return null;
    if (element.id) {
      return `//*[@id=${element.id}]`;
    } else if (element.tagName === "BODY") {
      return "/html/body";
    } else {
      try {
        const sameTagSiblings = Array.from(
          element.parentNode.childNodes
        ).filter((e) => e.nodeName === element.nodeName);
        const idx = sameTagSiblings.indexOf(element);
        return (
          getElementXPath(element.parentNode) +
          "/" +
          element.tagName.toLowerCase() +
          (sameTagSiblings.length > 1 ? `[${idx + 1}]` : "")
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
  function getElementXPathValue(path) {
    if (path !== undefined && path !== null) {
      // console.log(path);
      console.log(path);
      path = path.replace("/html/body", '//*[@id="page"]');
      console.log(path);
      return document.evaluate(
        path,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
    }
  }
  let addFormFields = () => {
    if (countTracker < filename.length) {
      // document.getElementById("add_input").disabled = true;
      setcount([...count, { head: "title", Xpath: "" }]);
      setCountTracker(countTemp + 1);
      // countTemp++;

      console.log(countTracker);
    } else {
      document.getElementById("add_input").classList.add("hide");
    }
  };
  let removeFormFields = (i) => {
    setCountTracker(countTemp - 1);
    document.getElementById("add_input").classList.remove("hide");

    console.log(countTracker);
    let newFormValues = [...count];
    newFormValues.splice(i, 1);
    setcount(newFormValues);
    let newFormVaild = [...valid];
    newFormVaild.splice(i, 1);
    setvalid(newFormVaild);

    // console.log(count);
    // console.log(count.length);
  };
  const SubmitData = async () => {
    var valueArr = count.map(function (item) {
      return item.head;
    });
    var isEmptyObject = valueArr.some(function (item, idx) {
      if (item.length === 0) {
        document.getElementById("error").classList.remove("hide");
        document.getElementById("error").innerHTML =
          "***Location is not defined***";

        return false;
      }
      return true;
    });

    if (isEmptyObject) {
      // console.log(tableCreateChecker());
      var valueArr = count.map(function (item) {
        return item.head;
      });
      var isDuplicate = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx;
      });
      // console.log("object");
      // console.log("a:-"+isDuplicate);
      if (!isDuplicate) {
        document.getElementById("error").classList.add("hide");
        setStore(count);
        let stringToSend = "{";
        for (let [key, value] of Object.entries(count)) {
          // console.log("xpath = ",getElementXPathValue(value.Xpath));
          // console.log("xpath = ",getElementXPathValue(value.Xpath).innerHTML);
          // console.log("xpath = ",getElementXPathValue(value.Xpath).text);
          // console.log("xpath = ",getElementXPathValue(value.Xpath).text);
          // console.log("xpath = ",getElementXPathValue(value.Xpath).value);
          var xpathInnerHtml = "";
          if(getElementXPathValue(value.Xpath)){
            console.log(getElementXPathValue(value.Xpath).textContent);
            xpathInnerHtml = getElementXPathValue(value.Xpath).textContent;
            xpathInnerHtml = xpathInnerHtml.trim();
          }
          stringToSend =
            stringToSend +
            '"' +
            value.head +
            '"' +
            ":" +
            '"' +
            xpathInnerHtml +
            '"' +
            ",";
        }
        let UrlTemp = "";
        for (let field of base.getTable(userTableName).fields) {
          {
            const name = field.name;
            if (name === "URL") {
              UrlTemp = "," + '"URL"' + ":" + '"' + link + '"';
              break;
            }
          }
        }
        const editedText = stringToSend.slice(0, -1) + UrlTemp + "}";
        console.log("edited text = in submit button  " + editedText);
        console.log("name of the table", userTableName);
        const tableNamee = userTableName;
        base.getTable(tableNamee).createRecordsAsync([
          {
            fields: JSON.parse(editedText),
          },
        ]);
        const flag = await tableCreateChecker();
        if (flag) {
          const baseTemp = base;
          const table = base.getTableByName("configuration");
          setStore(count);

          // console.log(count);
          // console.log("json", count);
          const obj = JSON.stringify(count);
          if (table) {
            let queryResult = await table.selectRecordsAsync({
              fields: ["Domain", "data"],
            });
            const check = 0;
            const domain = await extractHostname(link);
            console.log("domain" + domain);
            for (let record of queryResult.records) {
              console.log(record);
              console.log(record.getCellValueAsString("Domain"));
              console.log(link);

              if (domain === record.getCellValueAsString("Domain")) {
                console.log("jsonnn");
                let recordId = record._id;
                table.updateRecordAsync(recordId, {
                  data: obj,
                  Domain: domain,
                });
                check = 1;
                return;
                // }
              }
            }
            console.log("domain1" + domain);
            if (check === 0) {
              table.createRecordsAsync([
                {
                  fields: { Domain: domain, data: obj },
                },
              ]);
            }
          }
        }
      } else {
        document.getElementById("error").classList.remove("hide");

        document.getElementById("error").innerHTML =
          "***not repeated value allowed***";
      }
    }
  };
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

  function chatboxToogleHandler() {
    const formWrapper = document.getElementById("formbold-form-wrapper");
    const formActionButton = document.getElementById("formbold-action-btn");
    console.log(formWrapper);
    formWrapper.classList.toggle("active");
    formActionButton.classList.toggle("active");
  }

  // function back(){
  //   document.getElementById("details_fetcher").classList.add("hide");
  //   document.getElementById("page").classList.add("hide");
  //   document.getElementById("landing_body").classList.remove("hide");
  //   document.getElementById("formbold-main-wrapper").style.display ="none";
  // }
  return (
    <div className="main">
      <div id="find_table">
        <select
          onChange={(e) => {
            SetUserTableName(e.target.value);
            document.getElementById("landing_body").classList.remove("hide");
            document.getElementById("find_table").classList.add("hide");
          }}
        >
          <option>choose the table name</option>
          {tableName.map((user) => (
            <option value={user}>{user}</option>
          ))}
        </select>
      </div>
      {/* <div className="back hide" id="back">
        <button
          onClick={() => {
            back();
          }}
        >
          Back
        </button>
      </div> */}
      <p id="landing_body" className="hide">
        <div id="link_error" className="hide error"></div>
        <div className="form__group field" id="link_page">
          <input
            type="text"
            name="link"
            id="link"
            className=" form__field"
            onChange={(e) => {
              // console.log(e.target.value)
              setLink(e.target.value);
              // console.log(link)
            }}
          />
          <label htmlFor="link" className="form__label">
            Enter product link
          </label>
        </div>

        <button
          className="name c-white noselect m-20"
          onClick={() => {
            fetchData();
          }}
        >
          show website
        </button>
        <button
          className="name c-white noselect m-20"
          onClick={() => {
            fetchDataFromTable();
          }}
        >
          fetch details
        </button>
      </p>
      <div id="details_fetcher" className="flex hide">
        <div id="page"></div>

        <div className="formbold-main-wrapper hide" id="formbold-main-wrapper">
          <div className="w-full">
            <div className="formbold-form-wrapper" id="formbold-form-wrapper">
              <div className="formbold-form-header">
                <h3>Your selected data is :-</h3>
                <button
                  onClick={() => {
                    chatboxToogleHandler();
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="white">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.474874 0.474874C1.10804 -0.158291 2.1346 -0.158291 2.76777 0.474874L16.5251 14.2322C17.1583 14.8654 17.1583 15.892 16.5251 16.5251C15.892 17.1583 14.8654 17.1583 14.2322 16.5251L0.474874 2.76777C-0.158291 2.1346 -0.158291 1.10804 0.474874 0.474874Z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.474874 16.5251C-0.158291 15.892 -0.158291 14.8654 0.474874 14.2322L14.2322 0.474874C14.8654 -0.158292 15.892 -0.158291 16.5251 0.474874C17.1583 1.10804 17.1583 2.1346 16.5251 2.76777L2.76777 16.5251C2.1346 17.1583 1.10804 17.1583 0.474874 16.5251Z"
                    />
                  </svg>
                </button>
              </div>
              <div id="list" className="hide formbold-chatbox-form">
                <div id="error" className="error"></div>
                <div id="demo"></div>
                {count.map((element, index) => (
                  <div id="fetch" key={index}>
                    <select
                      name="user_table_input"
                      id="user_table_input"
                      value={count[index].head}
                      onChange={(e) => {
                        let tempCount = count;
                        tempCount[index].head = e.target.value;
                        setcount([...tempCount]);
                      }}
                      className="contact-form-area"
                    >
                      <option value="">choose the head</option>
                      {filename.map((user) => (
                        <option value={user}>{user}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="user_input"
                      id="user_input"
                      value={count[index].Xpath}
                      className="user_input hide formbold-form-input"
                      onChange={(e) => {
                        let tempCount = count;
                        tempCount[index].Xpath = e.target.value;
                        setcount([...tempCount]);
                      }}
                    />
                    <input
                      type="text"
                      className="user_input formbold-form-input"
                      id="user_input"
                      value={
                        count[index].Xpath
                          ? getElementXPathValue(count[index].Xpath).innerHTML.trim()
                          : ""
                      }
                    />
                    {index ? (
                      <button
                        type="button"
                        className="name noselect"
                        onClick={() => removeFormFields(index)}
                        style={{ border: "1px solid #C43434" }}
                      >
                        <FcFullTrash />
                      </button>
                    ) : null}
                  </div>
                ))}
                <div className="button-section">
                  <button
                    className="name noselect m-20 "
                    type="button"
                    id="add_input"
                    onClick={() => addFormFields()}
                  >
                    Add
                  </button>
                  <button
                    className="name  noselect m-20 "
                    type="submit"
                    onClick={() => {
                      SubmitData();
                      // console.log(count);
                      // console.log(count.length)
                    }}
                  >
                    Submit
                  </button>
                </div>
                {/* {store.map((element, index) => (
<table>
  <tr>
    <td>{index + 1}</td>
    <td>{store[index].head}</td>
    <td>{getElementXPathValue(store[index]?.Xpath)?.innerHTML}</td>
  </tr>
</table>
))} */}
              </div>
            </div>
            <div className="formbold-action-buttons">
              <button
                className="formbold-action-btn"
                id="formbold-action-btn"
                onClick={() => {
                  chatboxToogleHandler();
                }}
              >
                <span className="formbold-cross-icon">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.474874 0.474874C1.10804 -0.158291 2.1346 -0.158291 2.76777 0.474874L16.5251 14.2322C17.1583 14.8654 17.1583 15.892 16.5251 16.5251C15.892 17.1583 14.8654 17.1583 14.2322 16.5251L0.474874 2.76777C-0.158291 2.1346 -0.158291 1.10804 0.474874 0.474874Z"
                      fill="white"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.474874 16.5251C-0.158291 15.892 -0.158291 14.8654 0.474874 14.2322L14.2322 0.474874C14.8654 -0.158292 15.892 -0.158291 16.5251 0.474874C17.1583 1.10804 17.1583 2.1346 16.5251 2.76777L2.76777 16.5251C2.1346 17.1583 1.10804 17.1583 0.474874 16.5251Z"
                      fill="white"
                    />
                  </svg>
                </span>
                <span className="formbold-chat-icon">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.8333 14.0002V3.50016C19.8333 3.19074 19.7103 2.894 19.4915 2.6752C19.2728 2.45641 18.976 2.3335 18.6666 2.3335H3.49992C3.1905 2.3335 2.89375 2.45641 2.67496 2.6752C2.45617 2.894 2.33325 3.19074 2.33325 3.50016V19.8335L6.99992 15.1668H18.6666C18.976 15.1668 19.2728 15.0439 19.4915 14.8251C19.7103 14.6063 19.8333 14.3096 19.8333 14.0002ZM24.4999 7.00016H22.1666V17.5002H6.99992V19.8335C6.99992 20.1429 7.12284 20.4397 7.34163 20.6585C7.56042 20.8772 7.85717 21.0002 8.16659 21.0002H20.9999L25.6666 25.6668V8.16683C25.6666 7.85741 25.5437 7.56066 25.3249 7.34187C25.1061 7.12308 24.8093 7.00016 24.4999 7.00016Z"
                      fill="white"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id="new_data" className="hide">
        {store.map((element, index) => (
          <table>
            <tr>
              <td>{index + 1}</td>
              <td>{store[index]?.head}</td>
              <td>{store[index]?.title}</td>
            </tr>
          </table>
        ))}
      </div>
    </div>
  );
};
initializeBlock(() => <HelloWorldApp />);
