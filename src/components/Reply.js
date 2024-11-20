
// Reply.js
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

const Reply = ({ onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim() !== '') {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <div>
      <TextField
        multiline
        rows={2}
        variant="outlined"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your reply here..."
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Reply
      </Button>
    </div>
  );
};

export default Reply;

