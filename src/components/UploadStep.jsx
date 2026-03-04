import { useState, useRef, useCallback } from 'react';

export default function UploadStep({ onFileLoaded }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const readFile = useCallback(
    (file) => {
      if (!file.name.endsWith('.docx')) {
        alert('Please upload a .docx file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => onFileLoaded(file.name, e.target.result);
      reader.readAsArrayBuffer(file);
    },
    [onFileLoaded],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) readFile(file);
    },
    [readFile],
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) readFile(file);
    },
    [readFile],
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`bg-white rounded-lg shadow p-10 text-center cursor-pointer border-2 border-dashed transition-colors ${
        dragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".docx"
        onChange={handleChange}
        className="hidden"
      />
      <svg
        className="mx-auto h-12 w-12 text-gray-400 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p className="text-gray-600 font-medium">
        Drop a <span className="font-semibold">.docx</span> template here
      </p>
      <p className="text-gray-400 text-sm mt-1">or click to browse</p>
    </div>
  );
}
