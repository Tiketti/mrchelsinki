import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

const baseUrl = process.env.API_URL || 'http://localhost:5000/api';

type PhotoGalleryProps = {
  bucketName: string;
};

const renderImage = (url: string) => (
  <img key={url} className="photo" alt="User uploaded content" src={url} />
);

const PhotoGallery = (props: PhotoGalleryProps) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async (bucketName: string) => {
      const response = await axios(`${baseUrl}/storage/${bucketName}/list`);

      setData(response.data);
    };

    fetchData(props.bucketName);
  }, [props.bucketName]);

  return (
    <>
      <h1>Bucket name: {props.bucketName}</h1>
      {data.map(url => renderImage(url))}
    </>
  );
};

export default PhotoGallery;
