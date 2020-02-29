import * as Hapi from 'hapi';
import { gcpController } from './controllers/gcp';
import { uploadController } from './controllers/upload';

const PORT = process.env.SERVER_PORT || 5000;
const server = new Hapi.Server({
  port: PORT,
  routes: {
    cors: {
      origin: ['*'],
    },
  },
});
const basePath = '/api';

const init = async () => {
  console.info(`Server running at port ${PORT}`);

  server.route({
    path: basePath,
    method: 'GET',
    handler: (_request, _h) => ({ message: 'Hello from hapi' }),
  });

  server.route({
    path: `${basePath}/storage/list`,
    method: 'GET',
    handler: gcpController.listBuckets,
  });

  server.route({
    path: `${basePath}/storage/create`,
    method: 'POST',
    handler: gcpController.createBucket,
  });

  server.route({
    path: `${basePath}/storage/{bucket}/list`,
    method: 'GET',
    handler: gcpController.listBucketContents,
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
    handler: uploadController.upload,
  });

  await server.start();
};

init();
