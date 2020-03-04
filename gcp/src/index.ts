const gm = require("gm").subClass({ imageMagick: true });
const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const vision = require("@google-cloud/vision");

const { Storage: gcpStorage } = require("@google-cloud/storage");
const storage = new gcpStorage();
const client = new vision.ImageAnnotatorClient();

const { INPUT_BUCKET_NAME, OUTPUT_BUCKET_NAME } = process.env;

exports.generateThumbnail = async (event: any) => {
  // placeholder
};
