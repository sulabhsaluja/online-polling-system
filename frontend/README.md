# Polling App Frontend

A React-based frontend for the Polling Application that provides user-friendly interfaces for both voters and administrators.

## Features

### For Users (Voters)
- User registration and login
- View active polls
- Vote on polls with real-time feedback
- View poll results after voting
- Responsive design for mobile and desktop

### For Admins
- Admin registration and login
- Create new polls with multiple options
- Manage existing polls (view, edit, deactivate, delete)
- View detailed poll results and analytics
- Dashboard with statistics and quick actions

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- The Spring Boot backend should be running on `http://localhost:8080`

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The frontend is configured to connect to the backend at `http://localhost:8080`. If your backend is running on a different port, you can:

1. Update the `proxy` field in `package.json`
2. Or set the `REACT_APP_API_URL` environment variable:
```bash
export REACT_APP_API_URL=http://localhost:YOUR_PORT/api
```

## Running the Application

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`

The app will automatically reload when you make changes to the code.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.js    # Main navigation bar
│   ├── UserLogin.js     # User login form
│   ├── UserRegister.js  # User registration form
│   ├── AdminLogin.js    # Admin login form
│   └── AdminRegister.js # Admin registration form
├── pages/              # Main page components
│   ├── Home.js         # Landing page
│   ├── UserDashboard.js # User dashboard
│   ├── AdminDashboard.js # Admin dashboard
│   ├── CreatePoll.js   # Poll creation form
│   └── PollVoting.js   # Poll voting interface
├── services/           # API service layer
│   ├── api.js          # Axios configuration
│   ├── userService.js  # User-related API calls
│   └── adminService.js # Admin-related API calls
├── context/            # React context providers
│   └── AuthContext.js  # Authentication state management
├── utils/              # Utility functions
└── App.js              # Main app component with routing
```

## Key Features

### Authentication
- Role-based authentication (User vs Admin)
- Persistent login state using localStorage
- Protected routes based on user roles
- Automatic logout on token expiration

### User Interface
- Clean, modern design using Bootstrap 5
- Responsive layout that works on mobile and desktop
- Interactive voting interface with real-time feedback
- Progress bars for poll results
- Loading states and error handling

### Admin Features
- Poll creation with dynamic options (2-10 options)
- Poll management dashboard
- Real-time poll results with analytics
- Poll status management (active/inactive)

## API Integration

The frontend integrates with the Spring Boot backend through RESTful APIs:

- **User Endpoints**: Registration, voting, viewing polls
- **Admin Endpoints**: Poll creation, management, results
- **Authentication**: Token-based authentication (ready for implementation)

## Styling

- Uses Bootstrap 5 for responsive design
- Custom CSS for enhanced user experience
- Bootstrap Icons for consistent iconography
- Smooth transitions and hover effects
- Mobile-first responsive design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

1. The app uses React Router for client-side routing
2. State management is handled through React Context
3. API calls are centralized in service files
4. All forms include validation and error handling
5. The app is set up with ESLint for code quality

## Troubleshooting

### Common Issues

1. **Backend Connection Issues**
   - Ensure the Spring Boot backend is running on port 8080
   - Check CORS configuration in the backend
   - Verify API endpoints are accessible

2. **Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

3. **Routing Issues**
   - Ensure React Router is properly configured
   - Check protected route logic

## Future Enhancements

- Real-time updates using WebSocket
- Email notifications for poll updates
- Poll scheduling and expiration
- Advanced analytics and reporting
- Social sharing features
- Multi-language support

## Contributing

1. Follow the existing code style and structure
2. Add appropriate error handling
3. Include responsive design considerations
4. Test on multiple browsers
5. Update documentation as needed

## License

This project is part of the Polling Application system.
