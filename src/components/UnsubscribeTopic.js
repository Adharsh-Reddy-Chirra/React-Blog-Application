// UnsubscribeTopic.js
import React from 'react';
import { Button } from '@mui/material';

const UnsubscribeTopic = ({ topic, handleUnsubscribe }) => {
  return (
    <Button variant="outlined" color="secondary" onClick={() => handleUnsubscribe(topic)}>
      Unsubscribe from {topic}
    </Button>
  );
};

export default UnsubscribeTopic;
