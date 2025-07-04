
import React from 'react';

interface Props {
  onFilesSelected: (files: FileList) => void;
}

const FileUpload: React.FC<Props> = ({ onFilesSelected }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(event.target.files);
    }
  };

  return (
    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition hover:border-gray-400">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="mt-4 text-sm text-gray-600">
          <label
            htmlFor="xml-upload"
            className="cursor-pointer font-medium text-indigo-600 transition hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Select JUnit XML files
          </label>
        </p>
        <input
          id="xml-upload"
          type="file"
          accept=".xml,application/xml"
          multiple
          onChange={handleFileChange}
          className="sr-only"
        />
        <p className="mt-1 text-xs text-gray-500">
          XML files up to 10MB
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
