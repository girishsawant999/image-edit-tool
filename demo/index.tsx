import ImageEditor from 'dist';
import React, { useState } from 'react';
import 'react-app-polyfill/ie11';
import ReactDOM from 'react-dom';
import 'react-image-crop/dist/ReactCrop.css';
import './style.scss';

const defaultURL =
  'https://uploads.codesandbox.io/uploads/user/5a0b4678-2331-4e82-977d-05bf3bb781e1/r9EQ-example.jpg';
const HelperComponent = (): JSX.Element => {
  const [url, setUrl] = useState(defaultURL);

  return (
    <>
      <div className="image-editor">
        <div>
          <ImageEditor
            src={defaultURL}
            onSave={(url): void => setUrl(url)}
            saveButtonText="Preview"
          />
        </div>
        <div className="preview">
          <img src={url} alt="Preview" />
          <h2>Preview Image</h2>
        </div>
      </div>
    </>
  );
};

ReactDOM.render(<HelperComponent />, document.getElementById('root'));
