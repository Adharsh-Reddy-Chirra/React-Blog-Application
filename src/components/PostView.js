import React from 'react';
import { Typography } from '@material-ui/core';

const PostView = ({ post }) => {
  return (
    <div>
      <Typography variant="h6">{post.title}</Typography>
      <Typography variant="body1">{post.content}</Typography>
    </div>
  );
};

export default PostView;
