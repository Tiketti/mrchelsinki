import { SubClass, ResizeOption } from "gm";
import * as gcs from "@google-cloud/storage";
import * as path from "path";
const gm: SubClass = require("gm").subClass({ imageMagick: true });

const storageClient = new gcs.Storage();

const { OUTPUT_BUCKET_NAME = "mrc-helsinki-photos-output" } = process.env;

const resizeAndWriteImage = (filename: string, outputFilename: string) => {
  const resizeOption: ResizeOption = ">";

  return new Promise((resolve, reject) => {
    gm(filename)
      .resize(1024, 1024, resizeOption)
      .write(outputFilename, err => {
        if (err) {
          reject(`Error in writing resized image: ${err.message}`);
        }

        resolve();
      });
  });
};

exports.generateThumbnail = async (event: any) => {
  const object = event;
  const file = storageClient.bucket(object.bucket).file(object.name);

  if (file.name.startsWith("thumb_")) {
    return console.log(`The file ${file.name} seems to already be a thumbnail`);
  }

  const tempLocalPath = path.join("/tmp/", file.name);
  const tempThumbnailLocalPath = path.join("/tmp/", "thumb_", file.name);

  try {
    await file.download({ destination: tempLocalPath });

    await resizeAndWriteImage(tempLocalPath, tempThumbnailLocalPath);

    try {
      const uploadResult = await storageClient
        .bucket(OUTPUT_BUCKET_NAME)
        .upload(tempThumbnailLocalPath, {
          gzip: true,
          metadata: { cacheControl: "public, max-age=31536000" }
        });

      console.debug({ uploadResult });
    } catch (err) {
      console.error(`Error uploading thumbnail: ${err.message}`);
    }
  } catch (err) {
    throw new Error(`File download failed: ${err}`);
  } finally {
  }
};
