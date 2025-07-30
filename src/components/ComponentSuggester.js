class ComponentSuggester {
  constructor() {
    this.componentDatabase = {
      input: { name: 'Input', description: 'Input field', category: 'form' },
      button: { name: 'Button', description: 'Buttons', category: 'action' },
      checkbox: { name: 'Checkbox', description: 'Checkbox input', category: 'form' },
      label: { name: 'Label', description: 'Form labels', category: 'form' },
      form: { name: 'Form', description: 'Form wrapper', category: 'layout' },
      card: { name: 'Card', description: 'Card container', category: 'layout' },
      link: { name: 'Link', description: 'Hyperlinks', category: 'navigation' },
      heading: { name: 'Heading', description: 'Page headings', category: 'typography' },
      grid: { name: 'Grid', description: 'Grid layout', category: 'layout' },
      modal: { name: 'Modal', description: 'Overlay dialog', category: 'overlay' },
      helperText: { name: 'HelperText', description: 'Form helper text', category: 'form' },
      toggle: { name: 'Toggle', description: 'On/off switches', category: 'form' }
    };

    this.keywords = {
      input: ['input', 'field', 'text', 'email', 'password', 'username', 'search', 'credit', 'card', 'cvv', 'expiration'],
      button: ['button', 'submit', 'click', 'action', 'cta', 'press', 'edit'],
      checkbox: ['checkbox', 'remember', 'agree', 'terms', 'check'],
      label: ['label', 'form', 'field label'],
      form: ['form', 'login', 'signup', 'register', 'contact', 'submit', 'payment'],
      card: ['card', 'profile', 'user', 'panel'],
      link: ['link', 'forgot', 'navigate', 'anchor'],
      heading: ['heading', 'title', 'header'],
      grid: ['grid', 'columns', 'rows'],
      modal: ['modal', 'popup', 'dialog'],
      toggle: ['toggle', 'switch', 'on/off', 'setting', 'preferences'],
      helperText: ['helper', 'error', 'validation']
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
      if (score > 0) scores[componentKey] = score;
    }

    const sortedComponents = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([key]) => key);

    return sortedComponents;
  }

  generateCode(components, description) {
    const desc = description.toLowerCase();

    if (desc.includes('login')) return this.generateLoginForm(desc.includes('remember'), desc.includes('forgot'));
    if (desc.includes('payment')) return this.generatePaymentForm();
    if (desc.includes('profile') && desc.includes('avatar')) return this.generateProfileCard();
    if (desc.includes('search') && desc.includes('autocomplete')) return this.generateSearchBar();
    if (desc.includes('settings') || desc.includes('toggle')) return this.generateSettingsPanel();

    return this.generateGenericForm(components);
  }

  generateLoginForm(hasRememberMe, hasForgotPassword) {
    return `import React, { useState } from 'react';
import { Form, Input, Label, Button, Checkbox, Link, Card } from '@visa/nova-react';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: ''${hasRememberMe ? ', rememberMe: false' : ''} });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Card className="max-w-md p-6">
      <Form onSubmit={handleSubmit} className="space-y-4">
        <div><Label htmlFor="email">Email</Label><Input id="email" name="email" onChange={handleChange} required /></div>
        <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" onChange={handleChange} required /></div>
        ${hasRememberMe ? `<div className="flex items-center"><Checkbox id="rememberMe" name="rememberMe" onChange={handleChange} /><Label htmlFor="rememberMe" className="ml-2">Remember me</Label></div>` : ''}
        <Button type="submit" variant="primary" className="w-full">Login</Button>
        ${hasForgotPassword ? `<Link href="/forgot-password" className="block text-center">Forgot your password?</Link>` : ''}
      </Form>
    </Card>
  );
};

export default LoginForm;`;
  }

  generateProfileCard() {
    return `import React from 'react';
import { Card, Button } from '@visa/nova-react';

const UserProfileCard = () => {
  return (
    <Card className="max-w-sm p-6 flex flex-col items-center text-center space-y-4">
      <img src="https://via.placeholder.com/100" alt="Avatar" className="w-24 h-24 rounded-full" />
      <h2 className="text-xl font-semibold">Jane Doe</h2>
      <p className="text-gray-500">Frontend Developer</p>
      <Button variant="secondary">Edit Profile</Button>
    </Card>
  );
};

export default UserProfileCard;`;
  }

  generatePaymentForm() {
    return `import React, { useState } from 'react';
import { Form, Input, Label, Button, Card, HelperText } from '@visa/nova-react';

const PaymentForm = () => {
  const [formData, setFormData] = useState({ name: '', cardNumber: '', expirationDate: '', cvv: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!/^\\d{16}$/.test(formData.cardNumber)) newErrors.cardNumber = 'Must be 16 digits';
    if (!/^\\d{2}\\/\\d{2}$/.test(formData.expirationDate)) newErrors.expirationDate = 'Format MM/YY';
    if (!/^\\d{3,4}$/.test(formData.cvv)) newErrors.cvv = '3 or 4 digits';
    if (!formData.name) newErrors.name = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) console.log(formData);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Card className="max-w-md p-6 space-y-4">
      <Form onSubmit={handleSubmit}>
        <div><Label htmlFor="name">Name</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required />{errors.name && <HelperText status="error">{errors.name}</HelperText>}</div>
        <div><Label htmlFor="cardNumber">Card Number</Label><Input id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleChange} maxLength={16} required />{errors.cardNumber && <HelperText status="error">{errors.cardNumber}</HelperText>}</div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label htmlFor="expirationDate">Expiration</Label><Input id="expirationDate" name="expirationDate" value={formData.expirationDate} onChange={handleChange} required />{errors.expirationDate && <HelperText status="error">{errors.expirationDate}</HelperText>}</div>
          <div><Label htmlFor="cvv">CVV</Label><Input id="cvv" name="cvv" value={formData.cvv} onChange={handleChange} required />{errors.cvv && <HelperText status="error">{errors.cvv}</HelperText>}</div>
        </div>
        <Button type="submit">Submit Payment</Button>
      </Form>
    </Card>
  );
};

export default PaymentForm;`;
  }

  generateSearchBar() {
    return `import React, { useState } from 'react';
import { Input, Card } from '@visa/nova-react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(['Apple', 'Banana', 'Cherry']);

  return (
    <Card className="max-w-md p-4">
      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <ul className="mt-2 border rounded shadow">
          {suggestions.filter(item => item.toLowerCase().includes(query.toLowerCase())).map((item, i) => (
            <li key={i} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{item}</li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default SearchBar;`;
  }

  generateSettingsPanel() {
    return `import React, { useState } from 'react';
import { Toggle, Card } from '@visa/nova-react';

const SettingsPanel = () => {
  const [settings, setSettings] = useState({ darkMode: true, notifications: false });

  const handleToggle = (key) => () => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <Card className="max-w-md p-6 space-y-4">
      <div className="flex justify-between items-center">
        <span>Dark Mode</span>
        <Toggle checked={settings.darkMode} onChange={handleToggle('darkMode')} />
      </div>
      <div className="flex justify-between items-center">
        <span>Notifications</span>
        <Toggle checked={settings.notifications} onChange={handleToggle('notifications')} />
      </div>
    </Card>
  );
};

export default SettingsPanel;`;
  }

  generateGenericForm(components) {
    const imports = components.map(c => this.componentDatabase[c]?.name).filter(Boolean).join(', ');
    return `import React, { useState } from 'react';
import { ${imports} } from '@visa/nova-react';

const CustomForm = () => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-4">
      ${components.includes('label') && components.includes('input') ? `
      <div>
        <Label htmlFor="inputField">Input Field</Label>
        <Input id="inputField" name="inputField" onChange={handleChange} required />
      </div>` : ''}
      ${components.includes('button') ? `<Button type="submit">Submit</Button>` : ''}
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
