require('dotenv').config();
const express = require('express');
const path = require('path');
const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const stats = require('./src/stats-tracker');
const Blog = require('./src/controllers/blogController');  // Import Blog controller

const app = express();

// Initialize Discord bot
const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
  partials: [Partials.Channel],
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));

// Track site visits
app.use((req, res, next) => {
  stats.visitCount++;
  next();
});

// Helper function to format uptime
function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60) % 60;
  const hours = Math.floor(seconds / 3600) % 24;
  const days = Math.floor(seconds / 86400) % 30;
  const months = Math.floor(seconds / 2592000); // 30 days approx

  const parts = [];
  if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hr${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes !== 1 ? 's' : ''}`);
  if (seconds % 60 > 0 || parts.length === 0) parts.push(`${seconds % 60} sec`);

  return parts.join(' ');
}

// Admin authentication middleware
function isAdmin(req, res, next) {
  const password = req.headers['admin-password'];  // You could also use a more secure method
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
}

// API: Contact form handler
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const user = await bot.users.fetch(process.env.OWNER_ID);
    const embed = new EmbedBuilder()
      .setTitle('📩 New Contact Message')
      .addFields(
        { name: 'Name', value: name, inline: true },
        { name: 'Email', value: email, inline: true },
        { name: 'Message', value: message }
      )
      .setColor(0x00b0f4)
      .setTimestamp();

    await user.send({ embeds: [embed] });
    res.status(200).json({ success: true, message: '✅ Message sent successfully!' });
  } catch (error) {
    console.error('Failed to send contact message:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// API: Website stats
app.get('/api/stats', (req, res) => {
  stats.pingCount++;
  const uptime = formatUptime(Date.now() - stats.startTime);
  res.json({
    uptime,
    visits: stats.visitCount,
    pings: stats.pingCount
  });
});

// Blog routes
app.post('/api/blog', isAdmin, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }
    
    const newBlog = await Blog.createBlog(title, content);
    res.status(201).json({ success: true, blog: newBlog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create blog post.' });
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.getAllBlogs();
    res.status(200).json({ blogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blog posts.' });
  }
});

app.get('/api/blog/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.getBlogById(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }
    res.status(200).json({ blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blog post.' });
  }
});

app.put('/api/blog/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const updatedBlog = await Blog.updateBlog(id, title, content);
    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }
    res.status(200).json({ success: true, blog: updatedBlog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update blog post.' });
  }
});

app.delete('/api/blog/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBlog = await Blog.deleteBlog(id);
    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }
    res.status(200).json({ success: true, message: 'Blog post deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete blog post.' });
  }
});

// Page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'about.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'projects.html'));
});

app.get('/blogs', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'blogs.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'contact.html'));
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send('404 - Page not found');
});

// Start web server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Website running on http://localhost:${PORT}`);
});

// Discord Bot: Ready & Commands
bot.once('ready', async () => {
  try {
    await bot.application.commands.set([
      {
        name: 'stats',
        description: 'Get website stats',
      }
    ]);
    console.log('✅ Slash commands registered');
  } catch (err) {
    console.error('❌ Failed to register slash commands:', err);
  }
});

// Discord Bot: Command Handler
bot.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  if (commandName === 'stats') {
    const uptime = formatUptime(Date.now() - stats.startTime);
    const embed = new EmbedBuilder()
      .setTitle('📊 Website Stats')
      .addFields(
        { name: 'Uptime', value: uptime },
        { name: 'Visits', value: `${stats.visitCount}` },
        { name: 'Pings', value: `${stats.pingCount}` }
      )
      .setColor(0x00b0f4)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
});

// Start bot
bot.login(process.env.DISCORD_BOT_TOKEN);
