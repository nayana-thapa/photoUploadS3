import * as React from "react";
import ReactMde from "react-mde";
import ReactDOM from "react-dom";
import * as Showdown from "showdown";
import AWS from 'aws-sdk';
import Promise, {resolve, reject} from 'bluebird';

import "./styles.css";
import "react-mde/lib/styles/css/react-mde-all.css";



AWS.config.update({
  accessKeyId: "XXXXX",
  secretAccessKey: "XXXXXXXX",
  region: "XXXXX",
});
/*
 *  putObject
 * @author Sathish pandian P
 * @since Wed 16 Nov 2016 02:12 AM
 */
 async function putObject(objData) {
  return new Promise(function (resolve, reject) {
    let s3Client = new AWS.S3();
    // if (flgCompanyWise)
    //   objData.Key = objSaved.company + "/" + objSaved._id + objData.Key;
    // else objData.Key = objSaved._id + objData.Key;
     s3Client.putObject(objData, function (err, result) {
      if (err) {
        console.log('err', err);
        return reject("Undefined");
      } else {
        return resolve({ fileName: objData.Key });
      }
    });
  });
};





function loadSuggestions(text) {
  return new Promise((accept, reject) => {
    setTimeout(() => {
      const suggestions = [].filter((i) =>
        i.preview.toLowerCase().includes(text.toLowerCase())
      );
      accept(suggestions);
    }, 250);
  });
}

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

export default function App() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  const [selectedTab, setSelectedTab] = React.useState("write");

  

  const save = async function* (data) {
    // Promise that waits for "time" milliseconds
    console.log('data=', data)
    let dataObj = new Object();
      dataObj.Bucket ="abc";
      dataObj.Body = data;
      dataObj.Key = `REACT/${Math.floor(Math.random() * 10001)}`;
      dataObj.ContentType = 'image/jpeg';
      dataObj.ContentDisposition= `inline; filename=${dataObj.Key}`
      dataObj.ACL = 'public-read';



    //   'ContentType' =>'image/jpeg', //<-- this is what you need!
    // 'ContentDisposition' => 'inline; filename=filename.jpg', //<-- and this !
    // 'ACL'          => 'public-read'//<-- this makes i
      let URL; 
      await putObject(dataObj) 
      .then((res)=> {
        console.log('res', res)
        URL = `https://${dataObj.Bucket}.s3.ap-south-1.amazonaws.com/${res.fileName}`
      })
      console.log('URL=>', URL)
    // const wait = function (time) {
    //   return new Promise((a, r) => {
    //     setTimeout(() => a(), time);
    //   });
    // };

    // Upload "data" to your server
    // Use XMLHttpRequest.send to send a FormData object containing
    // "data"
    // Check this question: https://stackoverflow.com/questions/18055422/how-to-receive-php-image-data-over-copy-n-paste-javascript-with-xmlhttprequest

    // await wait(2000);
    // yields the URL that should be inserted in the markdown
    yield URL;
    // await wait(2000);

    // returns true meaning that the save was successful
    return true;
  };

  return (
    <div className="container">
      <ReactMde
        value={value}
        onChange={setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
        loadSuggestions={loadSuggestions}
        childProps={{
          writeButton: {
            tabIndex: -1,
          },
        }}
        paste={{
          saveImage: save,
        }} 
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
