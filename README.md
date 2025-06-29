# LeetCode Recorder

A comprehensive LeetCode progress tracking application with AI-powered code analysis, real-time compilation, and personalized practice recommendations.

## Features

- 🎯 **Progress Tracking**: Monitor your LeetCode progress with detailed statistics
- 💻 **Code Compiler**: Write, test, and debug solutions with Monaco Editor
- 🤖 **AI Assistant**: Get intelligent code analysis and personalized recommendations
- 📝 **Smart Notes**: Take detailed notes for each problem
- 📊 **Analytics Dashboard**: Visualize your progress with comprehensive charts
- 🔗 **LeetCode Integration**: Import problems directly from LeetCode URLs
- 🎨 **Modern UI**: Beautiful Apple-inspired interface design
- 🔐 **Authentication**: Secure user authentication with Supabase
- ☁️ **Cloud Database**: Real-time data sync with Supabase

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Code Editor**: Monaco Editor
- **Code Execution**: Judge0 API
- **AI Integration**: OpenAI GPT-4
- **UI Components**: Lucide React Icons
- **State Management**: React Context API

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leetcode-recorder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md)
   - Create a `.env` file with your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Supabase Setup

This app uses Supabase as the backend database. Please follow the detailed setup guide:

📖 **[Complete Supabase Setup Guide](./SUPABASE_SETUP.md)**

### Quick Setup Steps:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Run the SQL scripts from the setup guide to create tables
4. Configure authentication settings
5. Add environment variables to your `.env` file

## Features Overview

### 🎯 Progress Tracking
- Track problem completion status
- Monitor difficulty distribution
- View category-based progress
- Track attempts and completion dates

### 💻 Code Compiler
- Monaco Editor integration
- Support for multiple programming languages
- Real-time code execution via Judge0 API
- Syntax highlighting and autocomplete

### 🤖 AI Assistant
- Code quality analysis
- Performance optimization suggestions
- Personalized practice recommendations
- Daily practice plans
- Progress insights and analytics

### 📝 Smart Notes
- Problem-specific notes
- Tag-based organization
- Rich text editing
- Search and filter capabilities

### 🔗 LeetCode Integration
- Import problems from LeetCode URLs
- Automatic problem metadata extraction
- Direct links to original problems

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── lib/               # External service integrations
├── pages/             # Main application pages
├── types/             # TypeScript type definitions
└── main.tsx           # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (for AI Assistant)
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions:

1. Check the [Supabase Setup Guide](./SUPABASE_SETUP.md)
2. Review the troubleshooting section
3. Open an issue on GitHub

## Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced analytics and insights
- [ ] Mobile app version
- [ ] Integration with more coding platforms
- [ ] Custom problem creation
- [ ] Study group features

## 🚀 Features

- **📊 Dashboard**: Track your LeetCode progress with detailed statistics
- **📝 Problem Management**: Add, edit, and organize your LeetCode problems
- **💻 Code Compiler**: Execute code in 16+ programming languages using Judge0
- **📚 Notes**: Create and manage study notes for each problem
- **🤖 AI Assistant**: Get AI-powered insights and recommendations (coming soon)
- **👥 Multi-user**: Support for multiple users with role-based access
- **🔐 Authentication**: Secure user authentication with Supabase
- **📱 Responsive**: Works on desktop and mobile devices

## 🛠️ Code Compiler

The code compiler is powered by Judge0 and supports the following programming languages:

- JavaScript (Node.js 18.15.0)
- Python (3.8.1)
- Java (OpenJDK 13.0.1)
- C++ (GCC 9.2.0)
- C (GCC 9.2.0)
- C# (Mono 6.6.0.161)
- Go (1.13.5)
- Rust (1.40.0)
- TypeScript (3.7.4)
- PHP (7.4.1)
- Ruby (2.7.0)
- Swift (5.2.3)
- Kotlin (1.3.70)
- Scala (2.13.2)
- R (4.0.0)
- Dart (2.19.2)

### Setting up Judge0:

1. Sign up for a free account at [RapidAPI](https://rapidapi.com)
2. Subscribe to the [Judge0 CE API](https://rapidapi.com/judge0-official/api/judge0-ce)
3. Copy your RapidAPI key
4. Add `VITE_RAPIDAPI_KEY=your_rapidapi_key` to your `.env` file