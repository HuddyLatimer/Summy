# Summy - Text Summarization Web App

A modern web application for text summarization using AI, built with HTML, JavaScript, and Firebase.

## Features

- Text summarization using AI
- Google and Email/Password authentication
- User profile management
- Credit system for summaries
- Copy and download summary results
- Responsive design

## Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/Summy.git
cd Summy
```

2. Configure Firebase
- Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
- Enable Authentication (Google and Email/Password)
- Update Firebase configuration in your code
- Add your deployment domain to authorized domains

3. Local Development
- Use a local server (e.g., Live Server VS Code extension)
- Access the app at `http://127.0.0.1:5500` or your configured port

## Deployment

The app is configured to deploy automatically to GitHub Pages using GitHub Actions.

1. Enable GitHub Pages:
   - Go to your repository Settings
   - Navigate to Pages section
   - Set source to "GitHub Actions"

2. Push to main branch:
   - The GitHub Action will automatically build and deploy
   - Check the Actions tab for deployment status
   - Your site will be available at `https://yourusername.github.io/Summy`

3. Update Firebase Configuration:
   - Add your GitHub Pages domain to Firebase authorized domains
   - Update any environment-specific configurations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 