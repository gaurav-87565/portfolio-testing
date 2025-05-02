const express = require('express');
const Blog = require('../models/blogModel'); // Import the blog model

const router = express.Router();

// Create a new blog post
router.post('/create', async (req, res) => {
  const { title, content, author } = req.body;

  try {
    const newBlog = new Blog({
      title,
      content,
      author,
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog post created successfully', blog: newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 }); // Get blogs in descending order of date
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get a single blog post by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch the blog post' });
  }
});

// Update a blog post by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.author = author || blog.author;

    await blog.save();
    res.status(200).json({ message: 'Blog post updated successfully', blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// Delete a blog post by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    await blog.remove();
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

module.exports = router;
