import React, { useState } from 'react';
import Axios from 'axios';
import { LineScalePulseOut } from 'react-pure-loaders';

// TODO: extract this to a config
const baseUrl = process.env.API_URL || 'http://localhost:5000/api';

const Upload = () => {
  const [isLoading, setLoadingState] = useState(false);

  const uploadFiles = async (files: FileList | null) => {
    if (files === null) {
      return;
    }

    setLoadingState(true);

    const formData = new FormData();

    Array.from(files).forEach((file: File) => {
      return formData.append('file', file);
    });

    await Axios.post(`${baseUrl}/upload`, formData, {});

    setLoadingState(false);
  };

  return (
    <div>
      <h1>Upload a photo</h1>
      <form className="file-upload">
        {isLoading ? (
          <LineScalePulseOut loading={true} />
        ) : (
          <input
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              uploadFiles(e.target.files)
            }
          />
        )}
      </form>
    </div>
  );
};

export default Upload;
