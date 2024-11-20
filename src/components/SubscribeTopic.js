// SubscribeTopic.js
import React from 'react';
import { Button } from '@mui/material';

const SubscribeTopic = ({ topic, handleSubscribe }) => {
  return (
    <Button variant="outlined" color="primary" onClick={() => handleSubscribe(topic)}>
      Subscribe to {topic}
    </Button>
  );
};

export default SubscribeTopic;
