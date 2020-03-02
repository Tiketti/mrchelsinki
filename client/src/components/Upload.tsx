import React from 'react';
import Axios from 'axios';

// TODO: extract this to a config
const baseUrl = process.env.API_URL || 'http://localhost:5000/api';

const uploadFiles = async (files: FileList | null) => {
  if (files === null) {
    return;
  }

  const formData = new FormData();
  Array.from(files).forEach((file: File) => {
    return formData.append('file', file);
  });

  await Axios.post(`${baseUrl}/upload`, formData, {});
};

const Upload = () => {
  return (
    <div>
      <h1>Upload photos!</h1>
      <form className="file-upload">
        <input
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            uploadFiles(e.target.files)
          }
        />
      </form>
    </div>
  );
};

export default Upload;
