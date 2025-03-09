import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import Rating from '../components/ui/Rating';
import Tabs from '../components/ui/Tabs';
import MoodRating from '../components/ui/MoodRating';

const DesignSystem: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(3.5);
  
  return (
    <div className="container-page pb-20">
      {/* Fun, Entertainment-Focused Header */}
      <div className="relative overflow-hidden mb-12 rounded-xl shadow-lg">
        {/* Background with animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 background-animate"></div>
        
        {/* Content */}
        <div className="relative p-10 md:p-12 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white font-display">
                tv.io Design System
              </h1>
              <p className="text-white text-lg md:text-xl opacity-90 font-light">
                Making entertainment come alive with emotions & style ✨
              </p>
            </div>
            
            <div className="mt-6 md:mt-0 flex gap-2">
              {["😍", "😊", "😐", "😕", "😫"].map((emoji, i) => (
                <span 
                  key={i} 
                  className="text-3xl animate-bounce" 
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Emotion-Based Rating Section (Featured) */}
      <section className="mb-16 bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl shadow-sm">
        <div className="text-center mb-8">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Featured Component</span>
          <h2 className="text-3xl font-bold mt-2 mb-3">Emotion Ratings</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our rating system is built on emotions rather than stars, creating a more intuitive and engaging way for users to share how they feel about content.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card hoverable className="p-4">
            <Card.Body>
              <Card.Title>Basic Mood Rating</Card.Title>
              <div className="flex justify-center py-6">
                <MoodRating showLabels showDescription />
              </div>
            </Card.Body>
          </Card>
          
          <Card hoverable className="p-4">
            <Card.Body>
              <Card.Title>With "Would Rewatch" Option</Card.Title>
              <div className="flex justify-center py-6">
                <MoodRating showLabels withRewatch />
              </div>
            </Card.Body>
          </Card>
          
          <Card hoverable className="col-span-1 md:col-span-2 p-4">
            <Card.Body>
              <Card.Title>Size Variations</Card.Title>
              <div className="flex flex-col items-center gap-8 py-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-12">Small:</span>
                  <MoodRating size="sm" />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-12">Medium:</span>
                  <MoodRating size="md" />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-12">Large:</span>
                  <MoodRating size="lg" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </section>
      
      {/* Colors Section */}
      <section className="mb-12 bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Color Palette</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <div className="h-24 rounded-t-xl bg-gradient-to-r from-primary to-primary-light"></div>
            <div className="h-12 bg-primary-light"></div>
            <div className="h-12 bg-primary-lightest rounded-b-xl"></div>
            <p className="mt-2 text-sm font-medium text-center">Primary</p>
          </div>
          
          <div className="flex flex-col">
            <div className="h-24 rounded-t-xl bg-gradient-to-r from-secondary to-secondary-light"></div>
            <div className="h-12 bg-secondary-light"></div>
            <div className="h-12 bg-secondary-lightest rounded-b-xl"></div>
            <p className="mt-2 text-sm font-medium text-center">Secondary</p>
          </div>
          
          <div className="flex flex-col">
            <div className="h-24 rounded-t-xl bg-gradient-to-r from-accent to-accent-light"></div>
            <div className="h-12 bg-accent-light rounded-b-xl"></div>
            <p className="mt-2 text-sm font-medium text-center">Accent</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <div className="h-20 bg-success rounded-xl shadow-md"></div>
              <p className="mt-1 text-xs font-medium text-center">Success</p>
            </div>
            <div className="flex flex-col">
              <div className="h-20 bg-error rounded-xl shadow-md"></div>
              <p className="mt-1 text-xs font-medium text-center">Error</p>
            </div>
            <div className="flex flex-col">
              <div className="h-20 bg-warning rounded-xl shadow-md"></div>
              <p className="mt-1 text-xs font-medium text-center">Warning</p>
            </div>
            <div className="flex flex-col">
              <div className="h-20 bg-info rounded-xl shadow-md"></div>
              <p className="mt-1 text-xs font-medium text-center">Info</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Typography Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Typography</h2>
        
        <Card className="p-6">
          <div className="grid gap-6">
            <div className="p-4 border-b border-gray-100">
              <h1 className="font-display text-4xl">Movie Title (Display Font)</h1>
              <p className="text-sm text-gray-500 mt-1">Font: Montserrat, Size: var(--font-size-4xl)</p>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-2xl">Section Header</h2>
              <p className="text-sm text-gray-500 mt-1">Font: Montserrat, Size: var(--font-size-2xl)</p>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              <p className="text-lg">Plot Summary</p>
              <p className="text-sm text-gray-500 mt-1">Font: Inter, Size: var(--font-size-lg)</p>
            </div>
            
            <div className="p-4">
              <p>Regular review text discussing the movie in detail, covering aspects like the cinematography, acting performances, and overall direction. The font size is comfortable for extended reading.</p>
              <p className="text-sm text-gray-500 mt-1">Font: Inter, Size: var(--font-size-base)</p>
            </div>
          </div>
        </Card>
      </section>
      
      {/* Components Tabs */}
      <Tabs
        variant="pills"
        className="mb-8"
        items={[
          {
            id: 'buttons',
            label: (
              <div className="flex items-center gap-2">
                <span>🎮</span>
                <span>Buttons</span>
              </div>
            ),
            content: (
              <section className="mb-8 bg-white p-6 rounded-xl shadow-sm">
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">Watch Now</Button>
                    <Button variant="secondary">Add to List</Button>
                    <Button variant="tertiary">More Info</Button>
                    <Button variant="accent">Top Pick</Button>
                    <Button variant="ghost">Skip</Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary" size="sm">Small</Button>
                    <Button variant="primary">Medium</Button>
                    <Button variant="primary" size="lg">Large</Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary" isLoading>Loading</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                    <Button 
                      variant="primary" 
                      leftIcon={<span>▶️</span>}
                    >
                      Play Trailer
                    </Button>
                    <Button 
                      variant="secondary" 
                      rightIcon={<span>➕</span>}
                    >
                      Watchlist
                    </Button>
                  </div>
                </div>
              </section>
            ),
          },
          {
            id: 'cards',
            label: (
              <div className="flex items-center gap-2">
                <span>🎬</span>
                <span>Cards</span>
              </div>
            ),
            content: (
              <section className="mb-8 bg-white p-6 rounded-xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card hoverable>
                    <Card.Image 
                      src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60"
                      alt="Movie scene"
                      aspectRatio="video"
                    />
                    <Card.Body>
                      <Card.Title>Movie Card</Card.Title>
                      <p>A classic movie card with image and info.</p>
                    </Card.Body>
                  </Card>
                  
                  <Card bordered elevated={false}>
                    <Card.Body>
                      <Card.Title>Review Card</Card.Title>
                      <p>"This movie was absolutely fantastic..."</p>
                      <div className="mt-3 flex items-center">
                        <Avatar 
                          src="https://randomuser.me/api/portraits/women/44.jpg" 
                          size="sm"
                          alt="Reviewer" 
                        />
                        <span className="ml-2 text-sm font-medium">Jane Smith</span>
                      </div>
                    </Card.Body>
                  </Card>
                  
                  <Card>
                    <Card.Body>
                      <Card.Title>Upcoming Release</Card.Title>
                      <p>Release date: Dec 15, 2023</p>
                      <div className="flex gap-1 mt-2">
                        <Badge variant="warning">Coming Soon</Badge>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <Button variant="secondary" size="sm" fullWidth>Notify Me</Button>
                    </Card.Footer>
                  </Card>
                </div>
              </section>
            ),
          },
          {
            id: 'inputs',
            label: (
              <div className="flex items-center gap-2">
                <span>🔍</span>
                <span>Inputs</span>
              </div>
            ),
            content: (
              <section className="mb-8 bg-white p-6 rounded-xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Search Movies & TV Shows" 
                    placeholder="Try 'action' or 'comedy'..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    leftIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    }
                  />
                  
                  <Input 
                    label="Filter by Year" 
                    placeholder="e.g. 2023"
                    type="number"
                    helperText="Enter a year to filter movies"
                  />
                  
                  <Input 
                    label="Email for Notifications" 
                    placeholder="your@email.com"
                    type="email"
                    error="Please enter a valid email"
                  />
                  
                  <Input
                    label="Write a Review"
                    placeholder="Share your thoughts..."
                    variant="filled"
                    multiline
                    rows={3}
                  />
                </div>
              </section>
            ),
          },
          {
            id: 'avatars',
            label: (
              <div className="flex items-center gap-2">
                <span>👤</span>
                <span>Avatars</span>
              </div>
            ),
            content: (
              <section className="mb-8 bg-white p-6 rounded-xl shadow-sm">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Cast & Crew</h3>
                    <div className="flex items-center gap-6">
                      <Avatar 
                        src="https://randomuser.me/api/portraits/women/44.jpg" 
                        alt="Director" 
                        size="lg" 
                      />
                      <Avatar 
                        src="https://randomuser.me/api/portraits/men/86.jpg" 
                        alt="Lead Actor" 
                        size="lg" 
                      />
                      <Avatar 
                        src="https://randomuser.me/api/portraits/women/63.jpg" 
                        alt="Lead Actress" 
                        size="lg" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">User Statuses</h3>
                    <div className="flex items-center gap-4">
                      <Avatar name="Jane D" status="online" />
                      <Avatar name="John S" status="offline" />
                      <Avatar name="Mike T" status="busy" />
                    </div>
                  </div>
                </div>
              </section>
            ),
          },
          {
            id: 'badges',
            label: (
              <div className="flex items-center gap-2">
                <span>🏷️</span>
                <span>Badges</span>
              </div>
            ),
            content: (
              <section className="mb-8 bg-white p-6 rounded-xl shadow-sm">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Content Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="primary">Action</Badge>
                      <Badge variant="primary">Comedy</Badge>
                      <Badge variant="primary">Drama</Badge>
                      <Badge variant="primary">Horror</Badge>
                      <Badge variant="primary">Sci-Fi</Badge>
                      <Badge variant="primary">Romance</Badge>
                      <Badge variant="primary">Thriller</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Content Ratings</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="info" rounded>G</Badge>
                      <Badge variant="info" rounded>PG</Badge>
                      <Badge variant="warning" rounded>PG-13</Badge>
                      <Badge variant="error" rounded>R</Badge>
                      <Badge variant="error" rounded>NC-17</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Watch Status</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="success">Now Playing</Badge>
                      <Badge variant="warning">Coming Soon</Badge>
                      <Badge variant="secondary">Just Added</Badge>
                      <Badge variant="info">Trending</Badge>
                      <Badge variant="error">Leaving Soon</Badge>
                    </div>
                  </div>
                </div>
              </section>
            ),
          },
          {
            id: 'modal',
            label: (
              <div className="flex items-center gap-2">
                <span>📺</span>
                <span>Modal</span>
              </div>
            ),
            content: (
              <section className="mb-8 bg-white p-6 rounded-xl shadow-sm">
                <div className="space-y-4">
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Watch Trailer
                  </Button>
                  
                  <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Interstellar - Official Trailer"
                    size="lg"
                    centered
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-black">
                      <iframe 
                        width="560" 
                        height="315" 
                        src="https://www.youtube.com/embed/zSWdZVtXT7E" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="font-medium">Interstellar (2014)</h3>
                        <p className="text-sm text-gray-600">Director: Christopher Nolan</p>
                      </div>
                      
                      <MoodRating size="sm" />
                    </div>
                  </Modal>
                </div>
              </section>
            ),
          },
        ]}
      />

      {/* Call To Action */}
      <div className="text-center bg-gradient-to-r from-primary to-secondary text-white p-10 rounded-xl shadow-lg mt-16">
        <h2 className="text-3xl font-bold mb-3">Ready to Explore?</h2>
        <p className="text-lg opacity-90 mb-6 max-w-xl mx-auto">
          Discover the latest movies and TV shows using our emotion-focused interface.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="ghost" size="lg" className="bg-white/20 hover:bg-white/30 text-white">
            Browse Movies
          </Button>
          <Button variant="ghost" size="lg" className="bg-white/20 hover:bg-white/30 text-white">
            Explore TV Shows
          </Button>
        </div>
      </div>
      
      {/* Add global styles for animations */}
      <style>
        {`
        .background-animate {
          background-size: 400%;
          -webkit-animation: AnimateBackground 8s ease infinite;
          -moz-animation: AnimateBackground 8s ease infinite;
          animation: AnimateBackground 8s ease infinite;
        }

        @keyframes AnimateBackground {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        `}
      </style>
    </div>
  );
};

export default DesignSystem; 