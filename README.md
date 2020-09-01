# mrchelsinki

[![Sponsored](https://img.shields.io/badge/chilicorn-sponsored-brightgreen.svg?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAMAAADjyg5GAAABqlBMVEUAAAAzmTM3pEn%2FSTGhVSY4ZD43STdOXk5lSGAyhz41iz8xkz2HUCWFFhTFFRUzZDvbIB00Zzoyfj9zlHY0ZzmMfY0ydT0zjj92l3qjeR3dNSkoZp4ykEAzjT8ylUBlgj0yiT0ymECkwKjWqAyjuqcghpUykD%2BUQCKoQyAHb%2BgylkAyl0EynkEzmkA0mUA3mj86oUg7oUo8n0k%2FS%2Bw%2Fo0xBnE5BpU9Br0ZKo1ZLmFZOjEhesGljuzllqW50tH14aS14qm17mX9%2Bx4GAgUCEx02JySqOvpSXvI%2BYvp2orqmpzeGrQh%2Bsr6yssa2ttK6v0bKxMBy01bm4zLu5yry7yb29x77BzMPCxsLEzMXFxsXGx8fI3PLJ08vKysrKy8rL2s3MzczOH8LR0dHW19bX19fZ2dna2trc3Nzd3d3d3t3f39%2FgtZTg4ODi4uLj4%2BPlGxLl5eXm5ubnRzPn5%2Bfo6Ojp6enqfmzq6urr6%2Bvt7e3t7u3uDwvugwbu7u7v6Obv8fDz8%2FP09PT2igP29vb4%2BPj6y376%2Bu%2F7%2Bfv9%2Ff39%2Fv3%2BkAH%2FAwf%2FtwD%2F9wCyh1KfAAAAKXRSTlMABQ4VGykqLjVCTVNgdXuHj5Kaq62vt77ExNPX2%2Bju8vX6%2Bvr7%2FP7%2B%2FiiUMfUAAADTSURBVAjXBcFRTsIwHAfgX%2FtvOyjdYDUsRkFjTIwkPvjiOTyX9%2FAIJt7BF570BopEdHOOstHS%2BX0s439RGwnfuB5gSFOZAgDqjQOBivtGkCc7j%2B2e8XNzefWSu%2BsZUD1QfoTq0y6mZsUSvIkRoGYnHu6Yc63pDCjiSNE2kYLdCUAWVmK4zsxzO%2BQQFxNs5b479NHXopkbWX9U3PAwWAVSY%2FpZf1udQ7rfUpQ1CzurDPpwo16Ff2cMWjuFHX9qCV0Y0Ok4Jvh63IABUNnktl%2B6sgP%2BARIxSrT%2FMhLlAAAAAElFTkSuQmCC)](http://spiceprogram.org/oss-sponsorship)

## Starting the backend

To start the API server with `ts-node-dev`:

```sh
npm run start:dev
```

The server port defaults to port 5000 if nothing else is specified in environment variable `SERVER_PORT`. This means, yo can access backend at `http://localhost:5000/api`

## Starting the client

Start the frontend with:

```sh
npm start
```

## The Google Cloud Platform functionality

Install `gcloud` CLI tool e.g. with brew:

```sh
brew cask install google-cloud-sdk
```

Then, authenticate:

```sh
gcloud init

# possibly also needed:
gcloud auth login
```

// TODO: Creating/transfering Google Cloud service keys

Create the input and output buckets.

- make them associated with this project (`-p`)
- enable uniform access controls (`-b on`)
- make the buckets publicly accessible (`gsutil iam ..`)

```sh
gsutil mb -b on -p mrchelsinki -l europe-north1 gs://mrc-helsinki-photos-input
gsutil mb -b on -p mrchelsinki -l europe-north1 gs://mrc-helsinki-photos-output
gsutil mb -b on -p mrchelsinki -l europe-north1 gs://mrc-helsinki-photos-thumb
gsutil iam ch allUsers:objectViewer gs://mrc-helsinki-photos-input
gsutil iam ch allUsers:objectViewer gs://mrc-helsinki-photos-output
gsutil iam ch allUsers:objectViewer gs://mrc-helsinki-photos-thumb
```

Add these bucket names to environment variables under names:

`INPUT_BUCKET_NAME`, `OUTPUT_BUCKET_NAME` and `THUMBNAIL_BUCKET_NAME`

You can deploy a new version of functions with `npm` script:

```sh
npm run deploy
```

### Developing GCP functions locally

To develop and run clound functions locally, you need imagemagick and graphicsmagick binaries installed on your dev machine:

```sh
brew install imagemagick
brew install graphicsmagick
```

## Environment variables

Fill in the environment variables found in .env.sample file in [client](./client/.env.sample), [server](./server/.env.sample), and [gcp directories](./gcp/.env.sample) and make sure they are readable by NodeJS. I personally prefer [direnv](https://direnv.net/) for easy environment variable management.

## TODO

On the roadmap:

- [x] uploading photos by unauthenticated users
- [x] creating a thumbnail on upload
- [x] spinner for uploading photos
- [ ] easy download of full-size photos
- [ ] caching loaded photos
- [ ] having photos be associated with a specified event
- [ ] adding photos to a specified event
- [ ] listing photos from a specified event
- [ ] associating an upload with a name or Instagram handle
- [ ] having an admin login to:
  - [ ] delete a photo
  - [ ] move a photo to another event
