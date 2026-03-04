import { useCallback, useEffect, useRef } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

function generateBlob(arrayBuffer, values) {
  const zip = new PizZip(arrayBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: '{{', end: '}}' },
  });
  doc.setData(values);
  doc.render();
  const out = doc.getZip().generate({
    type: 'blob',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  return out;
}

function triggerDownload(blob, fileName) {
  const outputName = fileName.replace(/\.docx$/i, '_filled.docx');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = outputName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function DownloadStep({
  arrayBuffer,
  values,
  fileName,
  onFillAnother,
  onNewTemplate,
}) {
  const blobRef = useRef(null);

  useEffect(() => {
    const blob = generateBlob(arrayBuffer, values);
    blobRef.current = blob;
    triggerDownload(blob, fileName);
  }, [arrayBuffer, values, fileName]);

  const handleDownloadAgain = useCallback(() => {
    if (blobRef.current) {
      triggerDownload(blobRef.current, fileName);
    }
  }, [fileName]);

  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <svg
        className="mx-auto h-12 w-12 text-green-500 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      <h2 className="text-lg font-semibold text-gray-700 mb-1">
        Document Generated!
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Template: {fileName}
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={handleDownloadAgain}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Download Again
        </button>
        <button
          onClick={onFillAnother}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Fill Another
        </button>
      </div>
      <button
        onClick={onNewTemplate}
        className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline"
      >
        Upload a different template
      </button>
    </div>
  );
}
