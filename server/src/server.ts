import * as Hapi from 'hapi';
import * as fs from 'fs';
import * as uuid from 'uuid';
const path = require('path');

const PORT = process.env.SERVER_PORT || 5000;
const server = new Hapi.Server({ port: PORT });
const basePath = '/api';

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
  dest: path.join(__dirname, '/../tmp/'),
  fileFilter: imageFilter,
};

const uploader = (file: any, options: FileUploaderOption) => {
  if (!file) throw new Error('no file(s)');

  if (options.fileFilter && !options.fileFilter(file.hapi.filename)) {
    throw new Error('type not allowed');
  }

  const originalname = file.hapi.filename;
  const filename = uuid.v1();
  const path = `${options.dest}${filename}`;
  const fileStream = fs.createWriteStream(path);

  return new Promise<FileDetails>((resolve, reject) => {
    file.on('error', function(err) {
      reject(err);
    });

    file.pipe(fileStream);

    file.on('end', err => {
      if (err) {
        throw new Error();
      }

      const fileDetails: FileDetails = {
        fieldname: file.hapi.name,
        originalname,
        filename,
        mimetype: file.hapi.headers['content-type'],
        destination: `${options.dest}`,
        path,
        size: fs.statSync(path).size,
      };

      resolve(fileDetails);
    });
  });
};

const init = async () => {
  console.info(`Server running at port ${PORT}`);

  server.route({
    path: basePath,
    method: 'GET',
    handler: (_request, _h) => ({ message: 'Hello from hapi' }),
  });

  server.route({
    path: `${basePath}/upload`,
    method: 'POST',
    options: {
      payload: {
        allow: 'multipart/form-data',
        maxBytes: 1048576 * 10,
        output: 'stream',
        timeout: 1000 * 20,
        parse: true,
      },
    },
    handler: async (request, h) => {
      const data = request.payload;
      const file = data['file'];
      const fileDetails = await uploader(file, fileOptions);

      return h.response(fileDetails).code(200);
    },
  });

  await server.start();
};

init();
