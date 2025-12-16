const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Project = require('./models/Project');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Allow JSON bodies
app.use(express.json());

// Serve uploaded files as static content
app.use('/uploads', express.static('uploads'));

// Enable CORS (adjust origin in .env as needed)
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin, credentials: true }));

// Basic health route
app.get('/', (req, res) => res.send('CollabCampus API Running'));

// REST routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/invites', require('./routes/invites'));
app.use('/api/resumes', require('./routes/resumes'));

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: corsOrigin,
		methods: ['GET', 'POST', 'PATCH'],
		credentials: true,
	},
});

// Optional authentication for Socket.io via Bearer token
io.use((socket, next) => {
	try {
		const authHeader = socket.handshake.auth?.token || socket.handshake.headers['authorization'] || socket.handshake.headers['x-auth-token'] || socket.handshake.query?.token;
		if (!authHeader) return next();

		const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
			? authHeader.split(' ')[1]
			: authHeader;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
			socket.user = decoded.user; // { id: ... }
		return next();
	} catch (err) {
		// If token invalid, block connection
		return next(new Error('Unauthorized'));
	}
});

// Helper: validate objectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

io.on('connection', (socket) => {
	console.log('[socket] connected', { sid: socket.id, uid: socket.user?.id });
	// Join a project room
	socket.on('joinProject', async (projectId, cb) => {
		try {
			if (!socket.user) return cb && cb({ ok: false, msg: 'Unauthorized' });
			if (!isValidId(projectId)) return cb && cb({ ok: false, msg: 'Invalid project ID' });

			const project = await Project.findOne({ _id: projectId, members: socket.user.id });
			if (!project) return cb && cb({ ok: false, msg: 'Project not found' });

			socket.join(`project:${projectId}`);
			console.log('[socket] joinProject', { sid: socket.id, uid: socket.user.id, projectId });
			cb && cb({ ok: true });
		} catch (err) {
			console.error('joinProject error:', err.message);
			cb && cb({ ok: false, msg: 'Server error' });
		}
	});

		// Internal handler to save + broadcast populated chat message
		const saveAndBroadcastMessage = async (payload, cb) => {
		try {
			if (!socket.user) return cb && cb({ ok: false, msg: 'Unauthorized' });
			const { projectId, content } = payload || {};
			if (!isValidId(projectId)) return cb && cb({ ok: false, msg: 'Invalid project ID' });
			if (!content || !content.trim()) return cb && cb({ ok: false, msg: 'Message is required' });

			const project = await Project.findOne({ _id: projectId, members: socket.user.id });
			if (!project) return cb && cb({ ok: false, msg: 'Project not found' });

			project.chatMessages.push({ sender: socket.user.id, content: content.trim() });
			await project.save();

			const message = project.chatMessages[project.chatMessages.length - 1];
				console.log('[socket] chat:send', { sid: socket.id, uid: socket.user.id, projectId, mid: message._id });

				// Populate sender (username, email) for broadcast payload
				const sender = await User.findById(socket.user.id).select('username email');
				const populatedMessage = {
					_id: message._id,
					content: message.content,
					sender: sender ? { _id: sender._id, username: sender.username, email: sender.email } : { _id: socket.user.id },
					projectId,
					createdAt: message.createdAt,
				};

				// Emit to all users in the project room
				io.to(`project:${projectId}`).emit('chat:new', populatedMessage);
				// Also emit a compatibility event name if the client expects it
				io.to(`project:${projectId}`).emit('receive_message', populatedMessage);

			cb && cb({ ok: true });
		} catch (err) {
			console.error('chat:send error:', err.message);
			cb && cb({ ok: false, msg: 'Server error' });
		}
		};

		// Receive and broadcast a chat message (namespaced event)
		socket.on('chat:send', saveAndBroadcastMessage);
		// Compatibility: alternative event name used by some clients
		socket.on('send_message', saveAndBroadcastMessage);

	socket.on('disconnect', (reason) => {
		console.log('[socket] disconnected', { sid: socket.id, reason });
	});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server + Socket.io listening on port ${PORT}`));

// Lightweight health endpoint to check DB connection state
app.get('/api/health', (req, res) => {
	const state = mongoose.connection.readyState; // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
	const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
	res.json({ status: 'ok', db: states[state] || String(state) });
});