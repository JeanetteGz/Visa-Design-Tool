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
        <h2>🔧 Suggested Components</h2>
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <p>Enter a description to see component suggestions and generated code</p>
        </div>
      </section>
    );
  }

  return (
    <section className="output-section">
      <h2>🔧 Suggested Components</h2>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Analyzing your description...</p>
        </div>
      ) : (
        <>

          <div className="suggestions-list">
            <h3>Recommended Components:</h3>
            {suggestions.map((componentKey, index) => {
              const component = suggester.getComponent(componentKey);
              if (!component) return null;

              return (
                <div key={index} className="component-item">
                  <div className="component-name">{component.name}</div>
                  <div className="component-description">{component.description}</div>
                  <div className="component-category">{component.category}</div>
                </div>
              );
            })}
          </div>

          {generatedCode && (
            <div className="code-section">
              <div className="code-header">
                <h3>Generated React Code:</h3>
                <button 
                  className="copy-btn"
                  onClick={copyToClipboard}
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check size={16} />
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
              
              <div className="code-content">
                <pre>
                  <code>{generatedCode}</code>
                </pre>
              </div>
            </div>
          )}


          <div className="usage-instructions">
            <h3>How to Use This Code:</h3>
            <ol>
              <li>Install Visa Nova React: <code>npm install @visa/nova-react</code></li>
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