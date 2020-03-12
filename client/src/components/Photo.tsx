import React from 'react';
import { useParams } from 'react-router-dom';

const formatPhotoUrl = (url: string) => {
  // TODO: fix bucket name
  return `https://storage.cloud.google.com/mrc-helsinki-photos-input/${url}`;
};

const Photo = () => {
  const { url } = useParams();

  return (
    <>
      {url ? (
        <div>
          <img
            className="photo"
            alt="User uploaded content"
            src={formatPhotoUrl(url)}
          />
          <div>{url}</div>
        </div>
      ) : (
        <span>No url found </span>
      )}
    </>
  );
};

export default Photo;