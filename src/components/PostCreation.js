// PostCreation.js
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

const PostCreation = ({ onSubmit }) => {
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
        rows={4}
        variant="outlined"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post here..."
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Create Post
      </Button>
    </div>
  );
};

export default PostCreation;
