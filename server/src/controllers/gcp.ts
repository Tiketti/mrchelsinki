import * as Hapi from 'hapi';
const { Storage } = require('@google-cloud/storage');

const gcpController = {
  listBucketContents: async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    const storage = new Storage();
    const bucketName = request.params.bucket;

    try {
      const [files] = await storage.bucket(bucketName).getFiles();

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
  listBuckets: async (_req: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const storage = new Storage();

    try {
      const results = await storage.getBuckets();
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
  createBucket: async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const bucketName = req.payload?.['name'];

    if (!bucketName) {
      return h.response('Bucket name is required').code(400);
    }

    try {
      const storage = new Storage();
      const [bucket] = await storage.createBucket(bucketName, {
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
