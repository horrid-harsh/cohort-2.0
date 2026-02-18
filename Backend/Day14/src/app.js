const cookieParser = require('cookie-parser');
const express = require('express');
const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes');
const userRouter = require('./routes/user.routes');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Auth routes
app.use('/api/auth', authRouter);

// Post routes
app.use('/api/posts', postRouter);

// User routes
app.use('/api/users', userRouter);

module.exports = app;