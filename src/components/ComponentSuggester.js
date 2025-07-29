
class ComponentSuggester {
  constructor() {
    this.componentDatabase = {
      'input': {
        name: 'Input Field',
        description: 'Text input with validation and accessibility features',
        category: 'form'
      },
      'button': {
        name: 'Button', 
        description: 'Primary and secondary action buttons',
        category: 'action'
      },
      'checkbox': {
        name: 'Checkbox',
        description: 'Checkbox input for boolean selections', 
        category: 'form'
      },
      'label': {
        name: 'Label',
        description: 'Form labels with proper association',
        category: 'form'
      },
      'form': {
        name: 'Form Container',
        description: 'Semantic form wrapper with validation',
        category: 'layout'
      },
      'card': {
        name: 'Card',
        description: 'Content container with elevation',
        category: 'layout'
      },
      'link': {
        name: 'Link',
        description: 'Navigation and action links',
        category: 'navigation'
      },
      'heading': {
        name: 'Heading',
        description: 'Semantic headings for content hierarchy',
        category: 'typography'
      },
      'grid': {
        name: 'Grid',
        description: 'Responsive grid layout system',
        category: 'layout'
      },
      'modal': {
        name: 'Modal',
        description: 'Overlay dialog for important actions',
        category: 'overlay'
      }
    };

    this.keywords = {
      'input': ['input', 'field', 'text', 'email', 'password', 'username', 'textbox'],
      'button': ['button', 'submit', 'click', 'action', 'cta', 'press'],
      'checkbox': ['checkbox', 'remember', 'agree', 'terms', 'check', 'tick'],
      'label': ['label', 'form'],
      'form': ['form', 'login', 'signup', 'register', 'contact', 'submit'],
      'card': ['card', 'container', 'panel', 'box'],
      'link': ['link', 'forgot', 'navigate', 'href', 'anchor'],
      'heading': ['title', 'heading', 'header', 'h1', 'h2', 'h3'],
      'grid': ['responsive', 'layout', 'grid', 'columns', 'rows'],
      'modal': ['modal', 'popup', 'dialog', 'overlay', 'lightbox']
    };
  }

  suggest(description) {
    const lowerDesc = description.toLowerCase();
    const scores = {};

    for (const [componentKey, keywords] of Object.entries(this.keywords)) {
      let score = 0;
      
      keywords.forEach(keyword => {
        if (lowerDesc.includes(keyword)) {
          score += keyword.length;
        }
      });

      if (score > 0) {
        scores[componentKey] = score;
      }
    }

    const sortedComponents = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([key]) => key);

    return sortedComponents;
  }

  generateCode(components, description) {
    const isLoginForm = description.toLowerCase().includes('login');
    const hasRememberMe = description.toLowerCase().includes('remember');
    const hasForgotPassword = description.toLowerCase().includes('forgot');
    
    if (isLoginForm) {
      return this.generateLoginForm(hasRememberMe, hasForgotPassword);
    }
    
    return this.generateGenericForm(components);
  }

  generateLoginForm(hasRememberMe, hasForgotPassword) {
    return `import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Label, 
  Button, 
  Checkbox, 
  Link,
  Card 
} from '@visa/nova-react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',${hasRememberMe ? '\n    rememberMe: false,' : ''}
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Card className="max-w-md mx-auto p-6">
      <Form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
${hasRememberMe ? `
        <div className="flex items-center">
          <Checkbox
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <Label htmlFor="rememberMe" className="ml-2">
            Remember me
          </Label>
        </div>` : ''}

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full"
        >
          Sign In
        </Button>
${hasForgotPassword ? `
        <div className="text-center">
          <Link href="/forgot-password">
            Forgot your password?
          </Link>
        </div>` : ''}
      </Form>
    </Card>
  );
};

export default LoginForm;`;
  }

  generateGenericForm(components) {
    const componentImports = components
      .map(comp => this.componentDatabase[comp]?.name || comp)
      .join(', ');

    return `import React, { useState } from 'react';
import { 
  ${componentImports}
} from '@visa/nova-react';

const CustomForm = () => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-4">
      ${components.includes('input') ? `<div>
        <Label htmlFor="input-field">Input Field</Label>
        <Input
          id="input-field"
          name="inputField"
          onChange={handleChange}
          required
        />
      </div>` : ''}
      
      ${components.includes('button') ? `<Button type="submit" variant="primary">
        Submit
      </Button>` : ''}
    </Form>
  );
};

export default CustomForm;`;
  }

  getComponent(key) {
    return this.componentDatabase[key];
  }
}

export default ComponentSuggester;