import { Request, ResponseToolkit } from 'hapi';
import * as gcs from '@google-cloud/storage';

const gcpController = {
  listBucketContents: async (request: Request, h: ResponseToolkit) => {
    const storageClient = new gcs.Storage();
    const bucketName = request.params.bucket;

    try {
      const [files] = await storageClient.bucket(bucketName).getFiles();

      return h
        .response(
          files.map(
            file =>
              `https://${file.storage.apiEndpoint}/${file.bucket.name}/${file.metadata.name}`
          )
        )
        .code(200);
    } catch (err) {
      return h.response(err.message).code(500);
    }
  },
  listBuckets: async (_req: Request, h: ResponseToolkit) => {
    const storageClient = new gcs.Storage();

    try {
      const results = await storageClient.getBuckets();
      const [buckets] = results;

      return h
        .response({
          buckets: buckets.map(b => b.name).join(', '),
        })
        .code(200);
    } catch (err) {
      console.error('ERROR:', err);

      return h.response(err.message).code(500);
    }
  },
  createBucket: async (request: Request, h: ResponseToolkit) => {
    const data: any = request.payload;
    const bucketName = data['name'];

    if (!bucketName) {
      return h.response('Bucket name is required').code(400);
    }

    try {
      const storageClient = new gcs.Storage();
      const [bucket] = await storageClient.createBucket(bucketName, {
        location: 'europe-north1',
      });

      const message = `Bucket with name ${bucket?.name} created`;

      await bucket.makePublic({ includeFiles: true });

      return h.response(message).code(201);
    } catch (err) {
      console.error('ERROR:', err.message);

      return h.response(err.message).code(500);
    }
  },
};

export { gcpController };
