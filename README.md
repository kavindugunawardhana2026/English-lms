# Kavindu's English LMS

A specialized Learning Management System for teaching English to Grades 6-11, built as a full-stack application.

## 📁 Project Structure

```
kavindu-english-lms/
├── backend/              # Node.js/Express API
│   ├── src/              # Source code
│   ├── package.json      # Dependencies and scripts
│   ├── server.js         # Entry point
│   ├── .env              # Environment variables
│   └── config/           # Configuration files
└── frontend/             # React/Vite SPA
    ├── src/              # Source code
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── App.jsx       # Main app component
    │   ├── main.jsx      # Entry point
    │   └── index.css     # Styles
    ├── public/           # Static assets
    ├── package.json      # Dependencies and scripts
    ├── vite.config.js    # Vite configuration
    ├── tailwind.config.js # Tailwind CSS configuration
    └── postcss.config.js # PostCSS configuration
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **Environment**: dotenv for configuration
- **File Uploads**: Multer
- **YouTube Integration**: youtube-node package

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Routing**: React Router DOM v6
- **State Management**: React Context (planned)
- **HTTP Client**: Axios
- **Data Visualization**: Chart.js + react-chartjs-2
- **Particle Effects**: @tsparticles/react

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas cluster)
- npm or yarn

### Backend Setup
```bash
# Navigate to backend directory
cd kavindu-english-lms/backend

# Install dependencies
npm install

# Start development server
npm run dev

# Server will run on http://localhost:5000
```

### Frontend Setup
```bash
# Navigate to frontend directory  
cd kavindu-english-lms/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# App will be available at http://localhost:5173
```

### Environment Variables (.env)
Create a `.env` file in the backend directory with:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kavindu_english_lms
JWT_SECRET=your_super_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d
```

## 🎯 Features Implemented

### ✅ Backend
- Project structure with Express.js
- MongoDB connection setup
- Environment configuration
- Basic server with health check endpoint

### ✅ Frontend
- React 18 with Vite build system
- Tailwind CSS v4 styling
- Responsive design
- Framer Motion animations
- Routing with React Router DOM
- Component-based architecture
- Pages implemented:
  - Home (landing page)
  - Login & Register forms
  - Student Dashboard
- Layout components:
  - Navbar with branding
  - Footer with links
- Protected route handling

## 📋 TODO - Next Features to Implement

### Backend
- [ ] User model (student/teacher roles with grade levels)
- [ ] Authentication API endpoints (register, login, logout, refresh)
- [ ] Password hashing with bcrypt
- [ ] JWT token generation and validation middleware
- [ ] Grade, Unit, Lesson models
- [ ] Exercise model (polymorphic for quizzes/puzzles/games)
- [ ] ExerciseAttempt model for tracking
- [ ] Tutorial/YouTube link model
- [ ] ExamMarks model
- [ ] API routes for all entities

### Frontend
- [ ] Auth context for state management
- [ ] Connect login/register forms to backend API
- [ ] Create exercise player components:
  - Multiple choice quiz
  - Word search game
  - Crossword puzzle
  - Fill-in-the-blank exercises
  - Matching games
  - Grammar identification games
- [ ] Exercise builder interface (for teacher/admin)
- [ ] Student profile with statistics
- [ ] Progress tracking charts (line, bar, radar, pie)
- [ ] YouTube embed component for tutorials
- [ ] Grade/unit/lesson navigation system
- [ ] Attempt history viewer
- [ ] Achievement/badge system

## 🎨 Design System

### Color Palette
- **Primary**: Blues (trust, education)
- **Secondary**: Greens (growth, success)
- **Accents**: Purples, Oranges (creativity, energy)

### Typography
- Base: Inter or system-ui sans-serif
- Headings: Bold, clear hierarchy
- Body: Readable, comfortable line height

### Components
- Card-based layout with subtle shadows
- Smooth hover transitions and animations
- Responsive breakpoints for mobile/tablet/desktop
- Accessible color contrast and focus states

## 💡 Future Enhancements

- [ ] Dark/light mode toggle
- [ ] Speech recognition for pronunciation practice
- [ ] Video conferencing integration for live classes
- [ ] Parent/teacher communication portal
- [ ] Mobile app (React Native)
- [ ] Offline functionality with service workers
- [ ] Gamification (points, levels, leaderboards)
- [ ] Export progress reports (PDF/CSV)
- [ ] Multilingual support (Sinhala/Tamil interfaces)

## 👨‍🏫 Target Users

- **Primary**: English teachers (like Kavindu) creating personalized learning experiences
- **Secondary**: Students in Grades 6-11 learning English through interactive content
- **Tertiary**: Parents monitoring student progress

## 📄 License

MIT License - feel free to use, modify, and distribute for educational purposes.

---

*Built with 💻 by Kavindu Kalhara (AI Undergraduate, University of Moratuwa) with AI assistant support*