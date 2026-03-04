import { useState } from 'react';

function humanize(name) {
  return name
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FormStep({
  placeholders,
  values,
  setValues,
  onGenerated,
}) {
  const [errors, setErrors] = useState({});

  const handleChange = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    if (val.trim()) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    for (const key of placeholders) {
      if (!values[key]?.trim()) {
        newErrors[key] = 'This field is required';
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onGenerated();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Fill in the placeholders
      </h2>
      <div className="space-y-4">
        {placeholders.map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {humanize(key)}
            </label>
            <input
              type="text"
              value={values[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors[key] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={humanize(key)}
            />
            {errors[key] && (
              <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
            )}
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="mt-6 w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        Generate Document
      </button>
    </form>
  );
}
