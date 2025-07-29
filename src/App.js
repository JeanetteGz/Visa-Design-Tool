import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import ComponentSuggester from './components/ComponentSuggester';
import './styles/App.css';

function App() {
  const [suggestions, setSuggestions] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggester = new ComponentSuggester();

  const handleGenerateSuggestions = async (description) => {
    if (!description.trim()) {
      alert('Please enter a description first!');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newSuggestions = suggester.suggest(description);
      const code = suggester.generateCode(newSuggestions, description);
      
      setSuggestions(newSuggestions);
      setGeneratedCode(code);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <Header />
        
        <main className="main-content">
          <InputSection 
            onGenerate={handleGenerateSuggestions}
            isLoading={isLoading}
          />
          
          <OutputSection 
            suggestions={suggestions}
            generatedCode={generatedCode}
            isLoading={isLoading}
          />
        </main>
      </div>
    </div>
  );
}

export default App;