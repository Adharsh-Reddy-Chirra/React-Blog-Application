import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Typography, Button, TextField, Link } from '@mui/material';
import RecommendationModal from './RecommendationModal';


const sections = [
  { title: 'Academic Resources', url: '#' },
  { title: 'Career Services', url: '#' },
  { title: 'Campus', url: '#' },
  { title: 'Culture', url: '#' },
  { title: 'Local Community Resources', url: '#' },
  { title: 'Social', url: '#' },
  { title: 'Sports', url: '#' },
  { title: 'Health and Wellness', url: '#' },
  { title: 'Technology', url: '#' },
  { title: 'Travel', url: '#' },
  { title: 'Alumni', url: '#' },
];

const mainFeaturedPost = {
  title: 'Title of a longer featured blog post',
  description:
    "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  image: 'https://source.unsplash.com/random?wallpapers',
  imageText: 'main image description',
  linkText: 'Continue reading…',
};

const featuredPosts = [
  {
    title: 'Featured post',
    date: 'Nov 12',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random?wallpapers',
    imageLabel: 'Image Text',
  },
  {
    title: 'Post title',
    date: 'Nov 11',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random?wallpapers',
    imageLabel: 'Image Text',
  },
];

const sidebar = {
  title: 'About',
  description:
    'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
  archives: [
    { title: 'March 2020', url: '#' },
    { title: 'February 2020', url: '#' },
    { title: 'January 2020', url: '#' },
    { title: 'November 1999', url: '#' },
    { title: 'October 1999', url: '#' },
    { title: 'September 1999', url: '#' },
    { title: 'August 1999', url: '#' },
    { title: 'July 1999', url: '#' },
    { title: 'June 1999', url: '#' },
    { title: 'May 1999', url: '#' },
    { title: 'April 1999', url: '#' },
  ],
  social: [
    { name: 'GitHub', icon: GitHubIcon },
    { name: 'X', icon: XIcon },
    { name: 'Facebook', icon: FacebookIcon },
  ],
};

// Mock user data
const users = [
  { id: 1, username: 'user1', password: 'password1', type: 'Student', active: true },
  { id: 2, username: 'user2', password: 'password2', type: 'Faculty', active: true },
  { id: 3, username: 'user3', password: 'password3', type: 'Staff', active: true },
  { id: 4, username: 'user4', password: 'password4', type: 'Moderator', active: true },
  { id: 5, username: 'admin', password: 'admin', type: 'Administrator', active: true },
];

// Available topics for subscription
const availableTopics = [
  'Academic Resources',
  'Career Services',
  'Campus',
  'Culture',
  'Local Community Resources',
  'Social',
  'Sports',
  'Health and Wellness',
  'Technology',
  'Travel',
  'Alumni',
];

const defaultTheme = createTheme();

export default function Blog() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState(users);
  const [userPosts, setUserPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [currentUserLoginId, setCurrentUserLoginId] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [weather, setWeather] = useState('');

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const fetchUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setUserLocation(`${data.city}, ${data.region}, ${data.country}`);
      // Pass latitude and longitude to fetchWeather function
      fetchWeather(data.latitude, data.longitude);
    } catch (error) {
      console.error('Error fetching user location:', error);
    }
  };

  const fetchWeather = async (latitude, longitude) => {
    try {
      const apiKey = 'API_KEY';
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      console.log('Weather API response:', data);
      const weatherDescription = data.weather[0].description;
      const temperature = data.main.temp - 273.15; // Convert temperature from Kelvin to Celsius
      setWeather(`${weatherDescription} (${temperature.toFixed(2)}°C)`);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather('Weather data unavailable');
    }
  };
  
  
  
  

  const handleLogin = () => {
    const user = users.find(user => user.username === username && user.password === password);
    if (user && user.active) {
      setLoggedInUser(user);
      setUsername('');
      setPassword('');
      setError('');
      setCurrentUserLoginId(user.username); // Set the current user's login ID
    } else if(user && !user.active) {
      setError('Your account has been disabled, Please contact the administrator.');
    } else {
      setError('Permission Denied: Contact Administrator');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentUserLoginId(''); // Reset the current user's login ID
  };

  const toggleUserStatus = (userId) => {
    const user = activeUsers.find(user => user.id === userId);
    if (user && loggedInUser && loggedInUser.id === userId && user.type === 'Administrator') {
      setError("Permission Denied: You can't disable your own account.");
      return;
    }

    const updatedUsers = activeUsers.map(user => {
      if (user.id === userId && user.type !== 'Administrator') {
        return { ...user, active: !user.active };
      }
      return user;
    });
    setActiveUsers(updatedUsers);
    if (loggedInUser && loggedInUser.id === userId && !updatedUsers.find(user => user.id === loggedInUser.id)) {
      handleLogout(); // Logout the current user if their account is disabled
    }
  };

  const handlePostCreation = () => {
    if (newPostContent.trim() !== '') {
      setUserPosts([...userPosts, { id: Math.random(), content: newPostContent, replies: [] }]);
      setNewPostContent('');
    }
  };

  const handleReply = (postId, replyContent) => {
    const updatedPosts = userPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, replyContent]
        };
      }
      return post;
    });
    setUserPosts(updatedPosts);
  };

  const handleDeletePost = (postId) => {
    const updatedPosts = userPosts.filter(post => post.id !== postId);
    setUserPosts(updatedPosts);
  };

  const handleTopicSelect = (topic) => {
    if (!selectedTopics.includes(topic)) {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSubscribe = () => {
    // Perform subscription action
    // For demonstration, simply set success state to true
    setSubscriptionSuccess(true);
    setSelectedTopics([]); // Clear selected topics after subscription
  };

  const handleUnsubscribe = () => {
    // Perform unsubscription action
    // For demonstration, simply clear selected topics
    setSelectedTopics([]);
    setSubscriptionSuccess(false); // Reset subscription success state
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Blog" sections={sections} />
        {loggedInUser ? (
          <main>
            <Typography variant="h6" align="right" gutterBottom>
              Current User: {currentUserLoginId}
            </Typography>
            {/* Display user location and weather */}
            <Typography variant="h6" align="left" gutterBottom>
              Location: {userLocation}
            </Typography>
            <Typography variant="h6" align="left" gutterBottom>
              Weather: {weather}
            </Typography>
            <MainFeaturedPost post={mainFeaturedPost} />
            <Grid container spacing={4}>
              {featuredPosts.map((post) => (
                <FeaturedPost key={post.title} post={post} />
              ))}
            </Grid>
            <Grid container spacing={5} sx={{ mt: 3 }}>
              {/* RecommendationModal component */}
          <RecommendationModal />
              <Main title="From the firehose" posts={[]} />
              <Sidebar
                title={sidebar.title}
                description={sidebar.description}
                archives={sidebar.archives}
                social={sidebar.social}
              />
            </Grid>
            <Grid container spacing={5} sx={{ mt: 3 }}>
              {/* User management section */}
              <div>
                {activeUsers.map(user => (
                  <div key={user.id}>
                    <Typography>{user.username} ({user.type})</Typography>
                    {(loggedInUser.type === 'Administrator') && (
                      <Button
                        variant="contained"
                        color={user.active ? 'secondary' : 'primary'}
                        onClick={() => toggleUserStatus(user.id)}
                        disabled={user.type === 'Administrator'}
                      >
                        {user.active ? 'Disable' : 'Enable'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {/* Post creation section */}
              {(loggedInUser.type === 'Administrator' || loggedInUser.type === 'Moderator' || loggedInUser.type === 'Student' || loggedInUser.type === 'Staff' || loggedInUser.type === 'Faculty') && (
                <div>
                  <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Write your post here..."
                  />
                  <Button variant="contained" color="primary" onClick={handlePostCreation}>
                    Create Post
                  </Button>
                </div>
              )}
              {/* User posts section */}
              {userPosts.map((post, index) => (
                <div key={index}>
                  <Typography variant="body1">{post.content}</Typography>
                  <div>
                    {post.replies && post.replies.map((reply, index) => (
                      <Typography key={index} variant="body2">{reply}</Typography>
                    ))}
                  </div>
                  {(loggedInUser.type === 'Administrator' || loggedInUser.type === 'Moderator' || loggedInUser.type === 'Student' || loggedInUser.type === 'Staff' || loggedInUser.type === 'Faculty') && (
                    <TextField
                      multiline
                      rows={2}
                      variant="outlined"
                      placeholder="Write your reply here..."
                    />
                  )}
                  {(loggedInUser.type === 'Administrator' || loggedInUser.type === 'Moderator' || loggedInUser.type === 'Student' || loggedInUser.type === 'Staff' || loggedInUser.type === 'Faculty') && (
                    <Button variant="contained" color="primary" onClick={() => handleReply(post.id, 'Sample Reply')}>
                      Reply
                    </Button>
                  )}
                  {(loggedInUser.type === 'Administrator' || loggedInUser.type === 'Moderator') && (
                    <Button variant="contained" color="secondary" onClick={() => handleDeletePost(post.id)}>
                      Delete
                    </Button>
                  )}
                </div>
              ))}
              {/* Topic subscription section */}
              <div>
                <Typography variant="h6" gutterBottom>
                  Select Topics to Subscribe
                </Typography>
                <Grid container spacing={2}>
                  {availableTopics.map((topic) => (
                    <Grid item key={topic}>
                      <Button
                        variant={selectedTopics.includes(topic) ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => handleTopicSelect(topic)}
                      >
                        {topic}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
                <Button variant="contained" color="primary" onClick={handleSubscribe}>
                  Subscribe
                </Button>
                {subscriptionSuccess && (
                  <Typography color="success" sx={{ mt: 2 }}>
                    Subscribed successfully to {selectedTopics.join(', ')}.
                  </Typography>
                )}
                {selectedTopics.length > 0 && (
                  <Button variant="contained" color="secondary" onClick={handleUnsubscribe}>
                    Unsubscribe
                  </Button>
                )}
              </div>
            </Grid>
            <Button onClick={handleLogout}>Logout</Button>
          </main>
        ) : (
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Login to access the blog
              </Typography>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                              label="Password"
                              type="password"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <Typography color="error">{error}</Typography>}
                            <Button variant="contained" color="primary" onClick={handleLogin}>
                              Login
                            </Button>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                              <Link href="#" color="secondary">
                                Forgot password?
                              </Link>
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </Container>
                    <Footer
                      title="Footer"
                      description="Something here to give the footer a purpose!"
                    />
                  </ThemeProvider>
                );
              }
              

