import React from "react";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: "AKIA5QR6FYXLAK4B4DA6",
  secretAccessKey: "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",
  region: "ap-south-1"
});
const s3 = new AWS.S3();

async function uploadFile(file) {
  let temp = file.name.split(".");
  let fileExtension = temp[temp.length - 1];
  let fileName = file.name.replace(/[^a-zA-Z0-9]/g, "_");
  fileName = fileName + "." + fileExtension;
  console.log(fileName);

  let url =
    "https://leafcraftstudios-ecommerce.s3.ap-south-1.amazonaws.com/temporary/" +
    fileName;

  const params = {
    Bucket: "leafcraftstudios-ecommerce",
    Key: "temporary/" + fileName,
    ACL: "public-read",
    ContentType: file.type,
    Body: file
  };

  console.log(file);

  return new Promise((resolve, reject) => {
    s3.putObject(params)
      .on("httpUploadProgress", (evt) => {
        // that's how you can keep track of your upload progress
        console.log(Math.round((evt.loaded / evt.total) * 100));
      })
      .on("complete", (data) => {
        console.log(data);
        resolve(url);
      })
      .send((err) => {
        if (err) {
          console.log(err);
          reject(err);
        }
      });
  });
}

async function UploadFiles(files) {
  let fileURLs = [];

  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < files.length; ++i) {
      let fileURL = await uploadFile(files[i]).catch((err) => reject(err));
      fileURLs.push(fileURL);
    }
    resolve(fileURLs);
  });
}

export default UploadFiles;
