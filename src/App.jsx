import { useState, useCallback } from 'react';
import PizZip from 'pizzip';
import UploadStep from './components/UploadStep';
import FormStep from './components/FormStep';
import DownloadStep from './components/DownloadStep';

function extractPlaceholders(arrayBuffer) {
  const zip = new PizZip(arrayBuffer);
  const filesToScan = [
    'word/document.xml',
    ...Object.keys(zip.files).filter(
      (name) =>
        /^word\/(header|footer)\d*\.xml$/.test(name),
    ),
  ];

  const allMatches = [];
  for (const fileName of filesToScan) {
    if (zip.files[fileName]) {
      const xml = zip.files[fileName].asText();
      const matches = [...xml.matchAll(/\{\{\s*(\w+)\s*\}\}/g)];
      allMatches.push(...matches.map((m) => m[1]));
    }
  }

  return [...new Set(allMatches)];
}

export default function App() {
  const [step, setStep] = useState('idle'); // idle | form | done | error
  const [fileName, setFileName] = useState('');
  const [arrayBuffer, setArrayBuffer] = useState(null);
  const [placeholders, setPlaceholders] = useState([]);
  const [values, setValues] = useState({});
  const [error, setError] = useState('');

  const handleFileLoaded = useCallback((name, buffer) => {
    try {
      const found = extractPlaceholders(buffer);
      if (found.length === 0) {
        setError('No {{ placeholders }} found in the document.');
        setStep('error');
        return;
      }
      setFileName(name);
      setArrayBuffer(buffer);
      setPlaceholders(found);
      setValues(Object.fromEntries(found.map((p) => [p, ''])));
      setError('');
      setStep('form');
    } catch (err) {
      setError(`Failed to parse document: ${err.message}`);
      setStep('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setStep('idle');
    setFileName('');
    setArrayBuffer(null);
    setPlaceholders([]);
    setValues({});
    setError('');
  }, []);

  const handleFillAnother = useCallback(() => {
    setValues((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, ''])),
    );
    setStep('form');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Docx Template Filler
        </h1>

        {step === 'idle' && <UploadStep onFileLoaded={handleFileLoaded} />}

        {step === 'form' && (
          <FormStep
            placeholders={placeholders}
            values={values}
            setValues={setValues}
            arrayBuffer={arrayBuffer}
            fileName={fileName}
            onGenerated={() => setStep('done')}
          />
        )}

        {step === 'done' && (
          <DownloadStep
            arrayBuffer={arrayBuffer}
            values={values}
            fileName={fileName}
            onFillAnother={handleFillAnother}
            onNewTemplate={handleReset}
          />
        )}

        {step === 'error' && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
