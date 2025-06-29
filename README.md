# LeetCode Recorder

A comprehensive web application for tracking your LeetCode progress, compiling code, and managing notes. Built with React, TypeScript, and modern web technologies.

## Features

### 📊 Progress Tracking
- **Dashboard**: Visual overview of your LeetCode progress with statistics
- **Problem Management**: Add, edit, and track problems with detailed metadata
- **Status Tracking**: Mark problems as Not Started, In Progress, Completed, or Failed
- **Progress Analytics**: View completion rates by difficulty and category
- **Recent Activity**: Track your latest problem-solving activities

### 💻 Code Compiler
- **Multi-language Support**: JavaScript, Python, Java, C++, and more
- **Monaco Editor**: Professional code editing experience with syntax highlighting
- **Code Execution**: Test your solutions with simulated execution
- **File Management**: Save and load code files
- **Performance Metrics**: Track execution time and memory usage

### 📝 Notes System
- **Rich Text Notes**: Create and organize notes for each problem
- **Tagging System**: Categorize notes with custom tags
- **Search Functionality**: Quickly find relevant notes
- **Auto-save**: Notes are automatically saved to localStorage

### 🎯 Problem Management
- **Detailed Problem View**: Comprehensive problem information and metadata
- **Solution Storage**: Save your solutions with syntax highlighting
- **Complexity Tracking**: Record time and space complexity
- **Attempt Tracking**: Monitor your problem-solving attempts
- **External Links**: Direct links to LeetCode problems

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Code Editor**: Monaco Editor (same as VS Code)
- **State Management**: React Context API
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/leetcode-recorder.git
cd leetcode-recorder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Usage

### Adding Problems
1. Navigate to the Problems page
2. Click "Add Problem" button
3. Fill in the problem details:
   - Title and category (required)
   - Difficulty level
   - LeetCode URL (optional)
   - Tags for categorization
   - Initial notes and solution

### Tracking Progress
1. Update problem status as you work on them
2. Record your solutions and notes
3. Track time and space complexity
4. Monitor your completion rate on the dashboard

### Using the Code Compiler
1. Go to the Code Compiler page
2. Select your preferred programming language
3. Write or paste your code
4. Click "Run" to execute your code
5. View output and performance metrics

### Managing Notes
1. Navigate to the Notes page
2. Create new notes with titles and content
3. Add tags for organization
4. Search through your notes
5. Edit and update existing notes

## Data Storage

The application uses localStorage to persist your data locally. This means:
- Your data is stored in your browser
- No account or internet connection required
- Data persists between sessions
- You can export/import data manually

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.tsx     # Navigation sidebar
│   └── AddProblemModal.tsx # Problem creation modal
├── contexts/           # React contexts
│   └── ProblemContext.tsx # Problem state management
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── ProblemList.tsx # Problem listing
│   ├── ProblemDetail.tsx # Individual problem view
│   ├── CodeCompiler.tsx # Code editor and compiler
│   └── Notes.tsx       # Notes management
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Backend integration for cloud storage
- [ ] User authentication and accounts
- [ ] Collaborative features
- [ ] Advanced analytics and insights
- [ ] Problem recommendations
- [ ] Study plans and schedules
- [ ] Export to PDF/CSV
- [ ] Dark mode support
- [ ] Mobile app version

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [LeetCode](https://leetcode.com/) for the problem platform
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editing experience
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Lucide](https://lucide.dev/) for the beautiful icons