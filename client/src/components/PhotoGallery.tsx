import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.scss';
import { Link } from 'react-router-dom';

const baseUrl = process.env.API_URL || 'http://localhost:5000/api';

type PhotoGalleryProps = {
  thumbnailFilePrefix: string;
  fullSizeBucketname: string;
  thumbnailBucketname: string;
};

const parseUrlName = (_url: string, thumbnailPrefix: string) => {
  const fileNameParts = _url.split('/');

  return '/photo/'.concat(
    fileNameParts[fileNameParts.length - 1].replace(thumbnailPrefix, '')
  );
};

const renderImage = (url: string, thumbnailPrefix: string) => (
  <Link
    to={parseUrlName(url, thumbnailPrefix)}
    key={url}
    className="galleryItem"
  >
    <img key={url} className="photo" alt="User uploaded content" src={url} />
  </Link>
);

const PhotoGallery = (props: PhotoGalleryProps) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async (bucketName: string) => {
      const response = await axios(`${baseUrl}/storage/${bucketName}/list`);

      setData(response.data);
    };

    fetchData(props.thumbnailBucketname);
  }, [props.thumbnailBucketname]);

  return (
    <div>{data.map(url => renderImage(url, props.thumbnailFilePrefix))}</div>
  );
};

export default PhotoGallery;
