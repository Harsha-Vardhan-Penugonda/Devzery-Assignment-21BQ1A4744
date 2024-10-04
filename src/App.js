import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Typography, Button, TextField, MenuItem, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme();

export default function ApiChainingDashboard() {
  const [users, set_users] = useState([]);
  const [posts, set_posts] = useState([]);
  const [comments, set_comments] = useState([]);
  const [new_comment, set_new_comment] = useState('');
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState(null);
  const [selected_user, set_selected_user] = useState('');
  const [post_content, set_post_content] = useState({ title: '', body: '' });
  const [active_post_id, set_active_post_id] = useState(null);

  useEffect(() => {
    const fetch_users = async () => {
      set_loading(true);
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        set_users(response.data);
        set_error(null);
      } catch (err) {
        set_error('Failed to fetch users');
      } finally {
        set_loading(false);
      }
    };
    fetch_users();
  }, []);

  const create_post = async () => {
    if (!selected_user) return;
    set_loading(true);
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        title: post_content.title,
        body: post_content.body,
        userId: selected_user,
      });
      set_posts([...posts, response.data]);
      set_post_content({ title: '', body: '' });
      set_error(null);
    } catch (err) {
      set_error('Failed to create post');
    } finally {
      set_loading(false);
    }
  };

  const fetch_comments = async (postId) => {
    set_loading(true);
    set_active_post_id(postId);
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
      set_comments(response.data);
      set_error(null);
    } catch (err) {
      set_error('Failed to fetch comments');
    } finally {
      set_loading(false);
    }
  };

  const add_comment = (postId) => {
    if (new_comment.trim() === '') return;

    const comment = {
      id: comments.length + 1,
      name: "Anonymous",
      body: new_comment,
      postId: postId,
    };

    set_comments([...comments, comment]);
    set_new_comment('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" className="mt-10 mb-10 flex flex-col items-center">
        <Box className="text-center mb-4">
          <Typography variant="h2" gutterBottom className="text-gray-800">
            API Chaining Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            A dashboard to handle API chaining with users, posts, and comments.
          </Typography>
        </Box>

        {loading && <Typography variant="body1">Loading...</Typography>}

        <Box
          className="bg-white shadow-lg rounded-lg p-6 mb-4 w-full transform transition duration-300 hover:scale-105"
        >
          <Box className="mb-4">
            <Typography variant="h6" gutterBottom>Select a User</Typography>
            <TextField
              select
              fullWidth
              label="User"
              value={selected_user}
              onChange={(e) => set_selected_user(e.target.value)}
              helperText="Please select a user"
              className="mb-4 mt-3"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
              ))}
            </TextField>

            <Typography variant="h6" gutterBottom>Create a Post</Typography>
            <TextField
              fullWidth
              label="Title"
              value={post_content.title}
              onChange={(e) => set_post_content({ ...post_content, title: e.target.value })}
              className="mb-4"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Body"
              value={post_content.body}
              onChange={(e) => set_post_content({ ...post_content, body: e.target.value })}
              className="mb-4"
            />
            <Button variant="contained" color="primary" onClick={create_post}>Create Post</Button>

            {error && (
              <Alert severity="error" className="mt-2">
                {error}
              </Alert>
            )}
          </Box>
        </Box>

        <Box className="bg-white shadow-lg rounded-lg p-6 mb-4 w-full">
          <Typography variant="h6" gutterBottom>Posts</Typography>
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id}>
                <Typography variant="h6" className="font-semibold">{post.title}</Typography>
                <Typography variant="body1">{post.body}</Typography>
                <Button variant="outlined" onClick={() => fetch_comments(post.id)} className="mt-1">View Comments</Button>

                <Box className="mt-2">
                  <TextField
                    fullWidth
                    label="Add a comment"
                    value={new_comment}
                    onChange={(e) => set_new_comment(e.target.value)}
                    className="mb-1"
                  />
                  <Button variant="contained" color="secondary" onClick={() => add_comment(post.id)}>Add Comment</Button>
                </Box>
              </li>
            ))}
          </ul>
        </Box>

        {active_post_id !== null && comments.length > 0 && (
          <Box className="bg-white shadow-lg rounded-lg p-6 mb-4 w-full">
            <Typography variant="h6" gutterBottom>Comments</Typography>
            <ul className="space-y-2">
              {comments.map((comment) => (
                <li key={comment.id}>
                  <Typography variant="body1">
                    <strong>{comment.name}</strong>: {comment.body}
                  </Typography>
                </li>
              ))}
            </ul>
          </Box>
        )}

        <Box className="text-center mt-4">
          <Typography variant="body2" color="textSecondary">
            © 2024 API Chaining Dashboard. Created by Prabal Tripathi.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
