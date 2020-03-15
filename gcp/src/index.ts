import { SubClass, ResizeOption, GravityDirection } from "gm";
import * as gcs from "@google-cloud/storage";
import * as path from "path";
const gm: SubClass = require("gm").subClass({ imageMagick: true });

type FileFinalizeEvent = {
  bucket: string;
  cacheControl: string;
  contentEncoding: string;
  contentType: string;
  crc32c: string;
  etag: string;
  generation: number;
  id: string;
  kind: string;
  md5Hash: string;
  mediaLink: string;
  metageneration: string;
  name: string;
  selfLink: string;
  size: number;
  storageClass: string;
  timeCreated: Date;
  timeStorageClassUpdated: Date;
  updated: Date;
};

const storageClient = new gcs.Storage();

const { OUTPUT_BUCKET_NAME = "mrc-helsinki-photos-output" } = process.env;

const resizeAndWriteImage = (filename: string, outputFilename: string) => {
  const resizeOption: ResizeOption = ">";
  const gravityOption: GravityDirection = "Center";

  return new Promise((resolve, reject) => {
    gm(filename)
      .autoOrient()
      .resize(800, 800, resizeOption)
      .gravity(gravityOption)
      .crop(800, 800)
      .quality(60)
      .write(outputFilename, err => {
        if (err) {
          reject(`Error in writing resized image: ${err.message}`);
        }

        resolve();
      });
  });
};

const fixOrientationAndWriteImage = (
  filename: string,
  outputFilename: string
) => {
  return new Promise((resolve, reject) => {
    gm(filename)
      .autoOrient()
      .write(outputFilename, err => {
        if (err) {
          reject(`Error in writing rotated image: ${err.message}`);
        }

        resolve();
      });
  });
};

// TODO: refactor this code duplication
exports.fixOrientation = async (event: FileFinalizeEvent) => {
  const object = event;
  const file = storageClient.bucket(object.bucket).file(object.name);

  const tempLocalPath = path.join("/tmp/", file.name);

  try {
    await file.download({ destination: tempLocalPath });
  } catch (err) {
    throw new Error(`File download failed: ${err}`);
  }

  await fixOrientationAndWriteImage(tempLocalPath, tempLocalPath);

  try {
    const uploadResult = await storageClient
      .bucket(OUTPUT_BUCKET_NAME)
      .upload(tempLocalPath, {
        gzip: true,
        metadata: { cacheControl: "public, max-age=31536000" }
      });

    console.debug({ uploadResult });
  } catch (err) {
    console.error(`Error uploading thumbnail: ${err.message}`);
  }
};

exports.generateThumbnail = async (event: FileFinalizeEvent) => {
  const object = event;
  const file = storageClient.bucket(object.bucket).file(object.name);

  if (file.name.startsWith("thumb_")) {
    return console.log(`The file ${file.name} seems to already be a thumbnail`);
  }

  const tempLocalPath = path.join("/tmp/", file.name);
  const thumbnailLocation = path.join("/tmp/", `thumb_${file.name}`);

  try {
    await file.download({ destination: tempLocalPath });
  } catch (err) {
    throw new Error(`File download failed: ${err}`);
  }

  await resizeAndWriteImage(tempLocalPath, thumbnailLocation);

  try {
    const uploadResult = await storageClient
      .bucket(OUTPUT_BUCKET_NAME)
      .upload(thumbnailLocation, {
        gzip: true,
        metadata: { cacheControl: "public, max-age=31536000" }
      });

    console.debug({ uploadResult });
  } catch (err) {
    console.error(`Error uploading thumbnail: ${err.message}`);
  }
};
