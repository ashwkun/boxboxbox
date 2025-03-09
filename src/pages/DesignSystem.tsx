import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const DesignSystem: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  
  return (
    <div className="container-page">
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Design System</h1>
        <p className="opacity-90">A showcase of our components and visual styles</p>
      </div>
      
      {/* Colors Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Colors</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <div className="h-20 bg-primary rounded-t-lg"></div>
            <div className="h-12 bg-primary-light"></div>
            <div className="h-12 bg-primary-lightest rounded-b-lg"></div>
            <p className="mt-2 text-sm font-medium">Primary</p>
          </div>
          
          <div className="flex flex-col">
            <div className="h-20 bg-secondary rounded-t-lg"></div>
            <div className="h-12 bg-secondary-light"></div>
            <div className="h-12 bg-secondary-lightest rounded-b-lg"></div>
            <p className="mt-2 text-sm font-medium">Secondary</p>
          </div>
          
          <div className="flex flex-col">
            <div className="h-20 bg-accent rounded-t-lg"></div>
            <div className="h-12 bg-accent-light rounded-b-lg"></div>
            <p className="mt-2 text-sm font-medium">Accent</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <div className="h-16 bg-success rounded-lg"></div>
              <p className="mt-1 text-xs font-medium">Success</p>
            </div>
            <div className="flex flex-col">
              <div className="h-16 bg-error rounded-lg"></div>
              <p className="mt-1 text-xs font-medium">Error</p>
            </div>
            <div className="flex flex-col">
              <div className="h-16 bg-warning rounded-lg"></div>
              <p className="mt-1 text-xs font-medium">Warning</p>
            </div>
            <div className="flex flex-col">
              <div className="h-16 bg-info rounded-lg"></div>
              <p className="mt-1 text-xs font-medium">Info</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-9 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className={`h-12 bg-gray-${(i + 1) * 100} rounded-lg`}></div>
              <p className="mt-1 text-xs font-medium">Gray {(i + 1) * 100}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Typography Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Typography</h2>
        
        <div className="grid gap-4">
          <div>
            <h1 className="font-display">Heading 1 (Display Font)</h1>
            <p className="text-sm text-gray-500 mt-1">Font: Montserrat, Size: var(--font-size-4xl)</p>
          </div>
          
          <div>
            <h2>Heading 2</h2>
            <p className="text-sm text-gray-500 mt-1">Font: Montserrat, Size: var(--font-size-3xl)</p>
          </div>
          
          <div>
            <h3>Heading 3</h3>
            <p className="text-sm text-gray-500 mt-1">Font: Montserrat, Size: var(--font-size-2xl)</p>
          </div>
          
          <div>
            <h4>Heading 4</h4>
            <p className="text-sm text-gray-500 mt-1">Font: Montserrat, Size: var(--font-size-xl)</p>
          </div>
          
          <div>
            <p className="text-lg">Large Paragraph Text</p>
            <p className="text-sm text-gray-500 mt-1">Font: Inter, Size: var(--font-size-lg)</p>
          </div>
          
          <div>
            <p>Regular Paragraph Text</p>
            <p className="text-sm text-gray-500 mt-1">Font: Inter, Size: var(--font-size-base)</p>
          </div>
          
          <div>
            <p className="text-sm">Small Text</p>
            <p className="text-sm text-gray-500 mt-1">Font: Inter, Size: var(--font-size-sm)</p>
          </div>
          
          <div>
            <p className="text-xs">Extra Small Text</p>
            <p className="text-sm text-gray-500 mt-1">Font: Inter, Size: var(--font-size-xs)</p>
          </div>
        </div>
      </section>
      
      {/* Button Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
        
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="tertiary">Tertiary Button</Button>
            <Button variant="accent">Accent Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="sm">Small Button</Button>
            <Button variant="primary">Medium Button</Button>
            <Button variant="primary" size="lg">Large Button</Button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" isLoading>Loading Button</Button>
            <Button variant="primary" disabled>Disabled Button</Button>
            <Button 
              variant="primary" 
              leftIcon={<span className="text-lg">👍</span>}
            >
              With Left Icon
            </Button>
            <Button 
              variant="primary" 
              rightIcon={<span className="text-lg">→</span>}
            >
              With Right Icon
            </Button>
          </div>
        </div>
      </section>
      
      {/* Card Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Cards</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <Card.Body>
              <Card.Title>Basic Card</Card.Title>
              <p>This is a simple card with just a title and content.</p>
            </Card.Body>
          </Card>
          
          <Card hoverable>
            <Card.Body>
              <Card.Title>Hoverable Card</Card.Title>
              <p>This card has a hover effect. Try hovering over it!</p>
            </Card.Body>
          </Card>
          
          <Card bordered elevated={false}>
            <Card.Body>
              <Card.Title>Bordered Card</Card.Title>
              <p>This card has a border but no elevation (shadow).</p>
            </Card.Body>
          </Card>
          
          <Card className="col-span-full md:col-span-1">
            <Card.Image 
              src="https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=60"
              alt="Cinematic scene"
              aspectRatio="video"
            />
            <Card.Body>
              <Card.Title>Card with Image</Card.Title>
              <p>This card includes an image at the top.</p>
            </Card.Body>
          </Card>
          
          <Card className="col-span-full md:col-span-2">
            <Card.Body>
              <Card.Title>Card with Footer</Card.Title>
              <p>This card has a body and a footer section.</p>
            </Card.Body>
            <Card.Footer>
              <div className="flex justify-between">
                <Button variant="tertiary" size="sm">Cancel</Button>
                <Button variant="primary" size="sm">Submit</Button>
              </div>
            </Card.Footer>
          </Card>
        </div>
      </section>
      
      {/* Form Inputs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Form Inputs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Default Input" 
            placeholder="Enter your name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          
          <Input 
            label="Input with Helper Text" 
            placeholder="Enter your email"
            helperText="We'll never share your email with anyone else."
          />
          
          <Input 
            label="Input with Error" 
            placeholder="Enter password"
            type="password"
            error="Password must be at least 8 characters"
          />
          
          <Input 
            label="Input with Icon" 
            placeholder="Search..."
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            }
          />
          
          <Input
            label="Filled Variant Input"
            placeholder="Enter text here"
            variant="filled"
          />
          
          <Input
            label="Required Input"
            placeholder="This field is required"
            required
          />
          
          <Input
            label="Disabled Input"
            placeholder="You cannot edit this"
            value="Disabled content"
            disabled
          />
          
          <Input
            label="Full Width Input"
            placeholder="This input takes full width"
            fullWidth
          />
        </div>
      </section>
      
      {/* Badges Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Badges</h2>
        
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Badge variant="primary" size="sm">Small</Badge>
            <Badge variant="primary">Medium</Badge>
            <Badge variant="primary" size="lg">Large</Badge>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Badge variant="primary" rounded>Rounded Primary</Badge>
            <Badge variant="secondary" rounded>Rounded Secondary</Badge>
            <Badge variant="accent" rounded>Rounded Accent</Badge>
          </div>
          
          <div>
            <p className="text-lg mb-2">Badges in context:</p>
            <div className="flex items-center gap-3">
              <span>Feature status:</span>
              <Badge variant="success">Live</Badge>
              <Badge variant="warning">Beta</Badge>
              <Badge variant="error">Deprecated</Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignSystem; 