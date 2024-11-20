import React, { useState } from 'react';
import { Typography, Button, Grid } from '@mui/material';

const TopicSubscription = ({ availableTopics }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const handleTopicSelect = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSubscribe = () => {
    // Perform subscription action
    // For demonstration, simply set success state to true
    setSubscriptionSuccess(true);
    setSelectedTopics([]); // Clear selected topics after subscription
  };

  return (
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
    </div>
  );
};

export default TopicSubscription;
