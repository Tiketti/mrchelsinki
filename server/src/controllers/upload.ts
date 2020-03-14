const { Storage } = require('@google-cloud/storage');
import { Request, ResponseToolkit } from 'hapi';
import * as fs from 'fs';
import * as path from 'path';

const bucketName = process.env.UPLOAD_BUCKET_NAME || 'mrc-helsinki-photos';

interface FileUploaderOption {
  dest: string;
  fileFilter?(fileName: string): boolean;
}

interface FileDetails {
  fieldname: string;
  originalname: string;
  filename: string;
  mimetype: string;
  destination: string;
  path: string;
  size: number;
}

const imageFilter = function(fileName: string) {
  if (!fileName.match(/\.(jpg|jpeg|png|gif)$/)) {
    return false;
  }

  return true;
};

const fileOptions: FileUploaderOption = {
  dest: path.join(__dirname, '/../../tmp/'),
  fileFilter: imageFilter,
};

const uploadFileToStorage = async (fileName: string) => {
  const storage = new Storage();

  const uploadResult = await storage.bucket(bucketName).upload(fileName, {
    gzip: true,
    metadata: { cacheControl: 'public, max-age=31536000' },
  });

  console.log('uploadResult: ', uploadResult);

  return uploadResult;
};

const uploader = (file: any, options: FileUploaderOption) => {
  if (!file) {
    throw new Error('no file(s)');
  }

  if (options.fileFilter && !options.fileFilter(file.hapi.filename)) {
    throw new Error('type not allowed');
  }

  const path = `${options.dest}${file.hapi.filename}`;
  const fileStream = fs.createWriteStream(path);

  return new Promise<FileDetails>((resolve, reject) => {
    file.on('error', (err: Error) => {
      reject(err);
    });

    file.pipe(fileStream);

    file.on('end', (err: Error) => {
      if (err) {
        throw new Error();
      }

      const fileDetails: FileDetails = {
        fieldname: file.hapi.name,
        originalname: file.hapi.filename,
        filename: file.hapi.filename,
        mimetype: file.hapi.headers['content-type'],
        destination: `${options.dest}`,
        path,
        size: fs.statSync(path).size,
      };

      resolve(fileDetails);
    });
  });
};

const uploadController = {
  upload: async (request: Request, h: ResponseToolkit) => {
    const data: any = request.payload;
    const file = data['file'];
    const fileDetails = await uploader(file, fileOptions);

    try {
      await uploadFileToStorage(fileDetails.path);
    } catch (err) {
      console.error('Error uploading to Google storage:', { err });
    }

    return h.response(fileDetails).code(200);
  },
};

export { uploadController };
