import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Make sure to import your CSS file

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
      name: 'Anonymous',
      body: new_comment,
      postId: postId,
    };

    set_comments([...comments, comment]);
    set_new_comment('');
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/logo.jpg')" }}>
      <div className="container mx-auto mt-10 mb-10 flex flex-col items-center bg-white bg-opacity-80 rounded-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">API Chaining Dashboard</h1>
          <p className="text-gray-600">A dashboard to handle API chaining with users, posts, and comments.</p>
        </div>

        {loading && <p className="text-lg text-gray-500">Loading...</p>}

        <div className="shadow-lg rounded-lg p-6 mb-4 w-full max-w-lg transform transition duration-300 hover:scale-105">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Select a User</h2>
            <select
              value={selected_user}
              onChange={(e) => set_selected_user(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded mt-2"
            >
              <option value="" disabled>Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>

            <h2 className="text-lg font-semibold mt-6 mb-2">Create a Post</h2>
            <input
              type="text"
              placeholder="Title"
              value={post_content.title}
              onChange={(e) => set_post_content({ ...post_content, title: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded mt-2"
            />
            <textarea
              placeholder="Body"
              value={post_content.body}
              onChange={(e) => set_post_content({ ...post_content, body: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded mt-2"
              rows="4"
            ></textarea>

            <button
              onClick={create_post}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Post
            </button>

            {error && (
              <div className="bg-red-100 text-red-700 p-2 mt-2 rounded">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="shadow-lg rounded-lg p-6 mb-4 w-full max-w-lg">
          <h2 className="text-lg font-semibold mb-4">Posts</h2>
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id}>
                <h3 className="font-semibold">{post.title}</h3>
                <p>{post.body}</p>
                <button
                  onClick={() => fetch_comments(post.id)}
                  className="mt-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  View Comments
                </button>

                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={new_comment}
                    onChange={(e) => set_new_comment(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded mt-2"
                  />
                  <button
                    onClick={() => add_comment(post.id)}
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add Comment
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {active_post_id !== null && comments.length > 0 && (
          <div className="shadow-lg rounded-lg p-6 mb-4 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Comments</h2>
            <ul className="space-y-2">
              {comments.map((comment) => (
                <li key={comment.id}>
                  <p><strong>{comment.name}</strong>: {comment.body}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center mt-4">
          <p className="text-gray-600">© 2024 Designed by Harsha Vardhan Penugonda for DevZery Assignment</p>
        </div>
      </div>
    </div>
  );
}
