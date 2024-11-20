import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function FeaturedPost(props) {
  const { post } = props;
  const [reply, setReply] = React.useState('');

  const handleReplyChange = (event) => {
    setReply(event.target.value);
  };

  const handleReply = () => {
    // Logic to handle the reply
    console.log('Reply:', reply);
    // Clear the reply field after posting
    setReply('');
  };

  return (
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            {post.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {post.date}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {post.description}
          </Typography>
          {/* Form to reply to the post */}
          <TextField
            fullWidth
            label="Reply"
            multiline
            rows={4}
            value={reply}
            onChange={handleReplyChange}
          />
          <Button variant="contained" color="primary" onClick={handleReply}>
            Reply
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
}

FeaturedPost.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default FeaturedPost;
