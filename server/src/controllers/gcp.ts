import * as Hapi from "hapi";
const { Storage } = require("@google-cloud/storage");

const gcpController = {
  listBuckets: async (_req: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const storage = new Storage();

    try {
      const results = await storage.getBuckets();
      const [buckets] = results;

      return h
        .response({
          buckets: buckets.map(b => b.name).join(", ")
        })
        .code(200);
    } catch (err) {
      console.error("ERROR:", err);

      return h.response(err.message).code(500);
    }
  },
  createBucket: async (req: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const bucketName = req.payload?.["name"];

    if (!bucketName) {
      return h.response("Bucket name is required").code(400);
    }

    try {
      const storage = new Storage();
      const [bucket] = await storage.createBucket(bucketName, {
        location: "europe-north1"
      });

      const message = `Bucket with name ${bucket?.name} created`;
      console.log(message);

      return h.response(message).code(201);
    } catch (err) {
      console.error("ERROR:", err);

      return h.response(err.message).code(500);
    }
  }
};

export { gcpController };
