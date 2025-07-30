import React, { useState } from 'react';

const InputSection = ({ onGenerate, isLoading }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(description);
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };


  const examples = [
    "Responsive login form with remember me",
    "User profile card with avatar and edit button", 
    "Payment form with card input validation",
    "Search bar with autocomplete dropdown",
    "Settings panel with toggle switches"
  ];

  return (
    <section className="input-section">
      <h2>Describe Your UI</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="description-input">
            What would you like to build?
          </label>
          <textarea
            id="description-input"
            className="text-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Responsive login form with remember me checkbox and forgot password link"
            rows={5}
          />
          <div className="input-help">
            💡 Tip: Press Ctrl+Enter to generate quickly!
          </div>
        </div>

        <button 
          type="submit"
          className="generate-btn"
          disabled={isLoading || !description.trim()}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Analyzing...
            </>
          ) : (
            '🚀 Generate Components'
          )}
        </button>
      </form>


      <div className="examples-section">
        <h3>Need inspiration? Try these:</h3>
        <div className="examples-list">
          {examples.map((example, index) => (
            <button
              key={index}
              className="example-btn"
              onClick={() => setDescription(example)}
              type="button"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InputSection;