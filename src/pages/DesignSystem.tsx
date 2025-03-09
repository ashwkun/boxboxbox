import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import Rating from '../components/ui/Rating';
import Tabs from '../components/ui/Tabs';

const DesignSystem: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(3.5);
  
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
      
      {/* Avatar Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Avatars</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Sizes</h3>
            <div className="flex items-center gap-4">
              <Avatar size="xs" name="John Doe" />
              <Avatar size="sm" name="John Doe" />
              <Avatar size="md" name="John Doe" />
              <Avatar size="lg" name="John Doe" />
              <Avatar size="xl" name="John Doe" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">With Images</h3>
            <div className="flex items-center gap-4">
              <Avatar 
                src="https://randomuser.me/api/portraits/women/44.jpg" 
                alt="Jane Doe" 
                size="md" 
              />
              <Avatar 
                src="https://randomuser.me/api/portraits/men/86.jpg" 
                alt="John Smith" 
                size="md" 
              />
              <Avatar 
                src="https://randomuser.me/api/portraits/women/63.jpg" 
                alt="Sarah Johnson" 
                size="md" 
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">With Status</h3>
            <div className="flex items-center gap-4">
              <Avatar name="Jane D" status="online" size="md" />
              <Avatar name="John S" status="offline" size="md" />
              <Avatar name="Sarah J" status="away" size="md" />
              <Avatar name="Mike T" status="busy" size="md" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Square Avatars</h3>
            <div className="flex items-center gap-4">
              <Avatar name="Jane D" square size="md" />
              <Avatar 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="John Smith" 
                square 
                size="md" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Modal Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Modals</h2>
        
        <div className="space-y-4">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Open Modal
          </Button>
          
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Modal Title"
            size="md"
            footer={
              <div className="flex justify-end space-x-2">
                <Button variant="tertiary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                  Confirm
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <p>This is a modal dialog that can be used for various purposes such as displaying important information, confirmations, or collecting user input.</p>
              
              <Input 
                label="Email" 
                placeholder="Enter your email" 
                fullWidth 
              />
            </div>
          </Modal>
          
          <div className="mt-4 bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              The Modal component creates a portal to render at the bottom of the document body. It supports different sizes, custom headers and footers, and can be closed by clicking outside or pressing ESC.
            </p>
          </div>
        </div>
      </section>
      
      {/* Rating Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Ratings</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Interactive Rating</h3>
            <div className="flex flex-col gap-2">
              <Rating 
                value={ratingValue} 
                onChange={setRatingValue} 
                showValue 
              />
              <p className="text-sm text-gray-600">
                Click on a star to change the rating. Current value: {ratingValue}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Sizes</h3>
            <div className="flex flex-col gap-3">
              <Rating value={3.5} readonly size="sm" showValue />
              <Rating value={4} readonly size="md" showValue />
              <Rating value={4.5} readonly size="lg" showValue />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Precision</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <span className="w-32">Full Stars:</span>
                <Rating value={3} readonly precision={1} />
              </div>
              <div className="flex items-center gap-4">
                <span className="w-32">Half Stars:</span>
                <Rating value={3.5} readonly precision={0.5} />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Custom Max</h3>
            <Rating value={8} max={10} readonly showValue />
          </div>
        </div>
      </section>
      
      {/* Tabs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Tabs</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Default Tabs</h3>
            <Tabs
              items={[
                {
                  id: 'tab1',
                  label: 'Movies',
                  content: (
                    <div className="bg-white p-4 rounded-md">
                      <h4 className="font-medium mb-2">Movies Content</h4>
                      <p>Content for the Movies tab goes here.</p>
                    </div>
                  ),
                },
                {
                  id: 'tab2',
                  label: 'TV Shows',
                  content: (
                    <div className="bg-white p-4 rounded-md">
                      <h4 className="font-medium mb-2">TV Shows Content</h4>
                      <p>Content for the TV Shows tab goes here.</p>
                    </div>
                  ),
                },
                {
                  id: 'tab3',
                  label: 'People',
                  content: (
                    <div className="bg-white p-4 rounded-md">
                      <h4 className="font-medium mb-2">People Content</h4>
                      <p>Content for the People tab goes here.</p>
                    </div>
                  ),
                },
              ]}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Pill Tabs</h3>
            <Tabs
              variant="pills"
              items={[
                {
                  id: 'pill1',
                  label: 'Info',
                  content: (
                    <div className="bg-white p-4 rounded-md">
                      <h4 className="font-medium mb-2">Movie Information</h4>
                      <p>Basic information about the movie goes here.</p>
                    </div>
                  ),
                },
                {
                  id: 'pill2',
                  label: 'Cast',
                  content: (
                    <div className="bg-white p-4 rounded-md">
                      <h4 className="font-medium mb-2">Cast & Crew</h4>
                      <p>List of actors and crew members goes here.</p>
                    </div>
                  ),
                },
                {
                  id: 'pill3',
                  label: 'Reviews',
                  content: (
                    <div className="bg-white p-4 rounded-md">
                      <h4 className="font-medium mb-2">User Reviews</h4>
                      <p>User reviews and ratings go here.</p>
                    </div>
                  ),
                },
              ]}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Underline Tabs</h3>
            <Tabs
              variant="underline"
              items={[
                {
                  id: 'under1',
                  label: 'Popular',
                  content: (
                    <div className="bg-white p-4 rounded-md">
                      <h4 className="font-medium mb-2">Popular Content</h4>
                      <p>Most popular movies and shows go here.</p>
                    </div>
                  ),
                },
                {
                  id: 'under2',
                  label: 'Top Rated',
                  content: (
                    <div className="bg-white p-4 rounded-md">
                      <h4 className="font-medium mb-2">Top Rated Content</h4>
                      <p>Highest rated movies and shows go here.</p>
                    </div>
                  ),
                },
                {
                  id: 'under3',
                  label: 'Upcoming',
                  content: (
                    <div className="bg-white p-4 rounded-md">
                      <h4 className="font-medium mb-2">Upcoming Releases</h4>
                      <p>Soon to be released movies and shows go here.</p>
                    </div>
                  ),
                },
                {
                  id: 'under4',
                  label: 'Disabled',
                  disabled: true,
                  content: <div>This content should not be accessible</div>,
                },
              ]}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Full Width Tabs</h3>
            <Tabs
              variant="enclosed"
              fullWidth
              items={[
                {
                  id: 'fw1',
                  label: 'Account',
                  content: (
                    <div className="bg-white p-4 rounded-md">
                      <h4 className="font-medium mb-2">Account Settings</h4>
                      <p>User account settings go here.</p>
                    </div>
                  ),
                },
                {
                  id: 'fw2',
                  label: 'Preferences',
                  content: (
                    <div className="bg-white p-4 rounded-md">
                      <h4 className="font-medium mb-2">User Preferences</h4>
                      <p>User preferences settings go here.</p>
                    </div>
                  ),
                },
                {
                  id: 'fw3',
                  label: 'Notifications',
                  content: (
                    <div className="bg-white p-4 rounded-md">
                      <h4 className="font-medium mb-2">Notification Settings</h4>
                      <p>User notification settings go here.</p>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignSystem; 