# CollabCampus Frontend

<div align="center">
  <h3>🎓 The All-In-One Hub for Student Projects 🚀</h3>
  <p>A modern, professional collaboration platform built with React, Vite, and Material-UI</p>
</div>

## ✨ Features

- **📊 Dashboard**: Real-time project overview with analytics and insights
- **📁 Project Management**: Full-featured kanban boards, Gantt charts, and task tracking
- **👥 Team Collaboration**: Real-time chat, team management, and invitations
- **📅 Calendar & Scheduling**: Event management and daily challenges
- **📄 Resume Vault**: Track job applications with status management
- **🎨 Modern UI**: Professional design with customizable themes
- **🔐 Authentication**: Secure login and registration system
- **📈 Analytics**: Comprehensive project and team performance metrics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool & dev server
- **Material-UI (MUI) 7** - Component library
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **Chart.js & React-Chartjs-2** - Data visualization
- **Socket.io-client** - Real-time communication
- **React-Google-Charts** - Advanced charting
- **@hello-pangea/dnd** - Drag and drop functionality

## 📂 Project Structure

```
src/
├── api/           # API client configuration
├── assets/        # Static assets
├── components/    # Reusable UI components
├── pages/         # Page components
├── App.jsx        # Main app component
├── main.jsx       # App entry point
├── theme.js       # MUI theme configuration
└── styles.css     # Global styles
```

## 🎨 Customization

### Theme Configuration

Edit `src/theme.js` to customize:
- Primary color palette
- Dark/light mode
- Typography settings
- Component styles

### API Configuration

Set your backend API URL in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📱 Key Pages

- **Dashboard** (`/dashboard`) - Main overview with widgets
- **Projects** (`/projects`) - Project list and management
- **Project Details** (`/projects/:id`) - Individual project view with kanban board
- **Tasks** (`/tasks`) - Task management
- **Calendar** (`/calendar`) - Events and scheduling
- **Team** (`/team`) - Team member management
- **Resume Vault** (`/resumes`) - Job application tracking
- **Analytics** (`/analytics`) - Performance metrics
- **Settings** (`/settings`) - User preferences

## 🔧 Development

### Code Style

- ESLint configured for React best practices
- Use functional components with hooks
- Material-UI for all UI components
- Maintain consistent file structure

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support and questions, please open an issue on the repository.

---

<div align="center">
  <p>Built with ❤️ for students by students</p>
</div>
