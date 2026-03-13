# Admin Client for Blog API

A comprehensive admin dashboard for managing blog content. Built with React and Vite, this admin client provides full CRUD operations for posts, comments, users, and account management.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Related Projects](#related-projects)
- [Author](#author)

## Features

- 📝 **Post Management** - Create, edit, and delete blog posts
- 💬 **Comment Management** - Moderate and manage blog comments
- 👥 **User Management** - View and manage user accounts
- 🔐 **Authentication** - Secure sign-in functionality
- 👤 **Account Settings** - Manage admin account information
- 🎨 **Responsive UI** - Mobile-friendly admin interface
- ⚡ **Fast Development** - Powered by Vite for instant HMR
- 🧪 **Testing Ready** - Configured with Vitest and React Testing Library

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router DOM 7
- **UI Icons**: Lucide React
- **Testing**: Vitest, React Testing Library
- **Code Quality**: ESLint
- **Node Version**: 16+ (recommended)

## Getting Started

### Prerequisites

- Node.js (v16.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ChoforJr/admin-client-blog-api.git
cd admin-client-blog-api
```

2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Available Scripts

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Start the development server with hot module replacement |
| `npm run build`   | Build the project for production                         |
| `npm run preview` | Preview the production build locally                     |
| `npm test`        | Run tests with Vitest                                    |
| `npm run lint`    | Run ESLint to check code quality                         |

## Project Structure

```
src/
├── App Components/          # Main app layout and logic
├── HomePage Components/     # Dashboard homepage
├── Posts Components/        # Posts list view
├── Post Components/         # Individual post details
├── Create Post Components/  # Post creation form
├── Edit Post Components/    # Post edit form
├── Account Components/      # Admin account settings
├── SignIn Components/       # Authentication page
├── Users Components/        # User management
├── ItemContext.jsx          # Global state context
├── routes.jsx               # Route definitions
├── main.jsx                 # Application entry point
└── ErrorPage.jsx            # Error boundary component

tests/
└── setup.js                 # Test configuration

public/                      # Static assets
```

## Related Projects

This is part of a three-part Blog API ecosystem:

- 📱 **[Blog API Backend](https://github.com/ChoforJr/blog-api)** - RESTful API server
- 👥 **[User Client](https://github.com/ChoforJr/user-client-blog-api)** - Public user-facing blog interface

## Author

**FORSAKANG CHOFOR JUNIOR**

- [GitHub](https://github.com/ChoforJr)
- [LinkedIn](https://www.linkedin.com/in/choforforsakang/)
