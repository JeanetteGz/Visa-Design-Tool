import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import ComponentSuggester from './ComponentSuggester';

const OutputSection = ({ suggestions, generatedCode, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const suggester = new ComponentSuggester();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy code. Please select and copy manually.');
    }
  };

  if (!isLoading && suggestions.length === 0) {
    return (
      <section className="output-section">
        <h2 className="text-xl font-semibold mb-4">🔧 Suggested Components</h2>
        <div className="empty-state text-center p-6 border rounded bg-gray-50">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-gray-600">Enter a description to see component suggestions and generated code</p>
        </div>
      </section>
    );
  }

  return (
    <section className="output-section space-y-8">
      <h2 className="text-xl font-semibold">🔧 Suggested Components</h2>

      {isLoading ? (
        <div className="loading-state flex items-center space-x-3">
          <div className="loading-spinner w-5 h-5 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <p className="text-gray-700">Analyzing your description...</p>
        </div>
      ) : (
        <>
          <div className="suggestions-list space-y-4">
            <h3 className="text-lg font-semibold">Recommended Components:</h3>
            {suggestions.map((componentKey, index) => {
              const component = suggester.getComponent(componentKey);
              if (!component) return null;

              return (
                <div key={index} className="component-item border rounded p-4 bg-white shadow-sm">
                  <a
                    href={component.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-base font-medium"
                    title={`View ${component.name} documentation`}
                  >
                    🔗 {component.name}
                  </a>
                  <div className="text-sm text-gray-600">{component.description}</div>
                  <div className="text-xs text-gray-400 uppercase">{component.category}</div>
                </div>
              );
            })}
          </div>

          {generatedCode && (
            <div className="code-section bg-gray-50 border rounded shadow-sm p-4">
              <div className="code-header flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Generated React Code:</h3>
                <button
                  className="copy-btn flex items-center gap-2 text-sm px-3 py-1 border rounded hover:bg-gray-100 transition"
                  onClick={copyToClipboard}
                  aria-label="Copy generated code to clipboard"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy Code
                    </>
                  )}
                </button>
              </div>

              <div className="code-content overflow-auto text-sm font-mono bg-white p-3 rounded border">
                <pre>
                  <code>
                    {generatedCode
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/&/g, '&amp;')}
                  </code>
                </pre>
              </div>

              <p aria-live="polite" className="sr-only">
                {copied ? 'Code copied to clipboard' : ''}
              </p>
            </div>
          )}

          <div className="usage-instructions text-sm space-y-2 border-t pt-4">
            <h3 className="text-md font-semibold">How to Use This Code:</h3>
            <ol className="list-decimal list-inside text-gray-700">
              <li>Install Visa Nova React: <code className="bg-gray-100 px-1">npm install @visa/nova-react</code></li>
              <li>Copy the generated code above</li>
              <li>Create a new component file in your project</li>
              <li>Paste the code and customize as needed</li>
              <li>Import and use in your application</li>
            </ol>
          </div>
        </>
      )}
    </section>
  );
};

export default OutputSection;
