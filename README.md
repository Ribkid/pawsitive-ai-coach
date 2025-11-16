# PawsitiveAI Coach 🐕

An AI-powered dog training application that helps pet owners create personalized training plans and track their dog's progress.

![PawsitiveAI Coach](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

## 🌟 Features

- **AI-Powered Chat**: Chat with an intelligent trainer to discuss your dog's needs
- **Personalized Training Plans**: AI generates custom training plans based on your dog's profile
- **Progress Tracking**: Monitor your dog's training sessions and milestones
- **Guest Mode**: Try the app without signing up - data is saved locally
- **User Accounts**: Full account system with persistent data storage
- **Breed-Specific Guidance**: Tailored advice based on your dog's breed and characteristics

## 🚀 Live Demo

- **Production URL**: [https://1ye7m6gbsb1w.space.minimax.io](https://1ye7m6gbsb1w.space.minimax.io)
- **Test Account**: `jyggbxdx@minimax.com` / `hq6biVwaIq`

## 📋 Prerequisites

Before running this project, make sure you have:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (preferred) or npm
- [Supabase account](https://supabase.com/)
- [OpenRouter account](https://openrouter.ai/) (for AI chat functionality)

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Ribkid/pawsitive-ai-coach.git
cd pawsitive-ai-coach
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Database Setup

The application requires several Supabase tables. You can set them up using the included SQL scripts:

1. Create a new Supabase project
2. Run the SQL commands in `setup_database.sql` in your Supabase SQL Editor
3. Deploy the edge functions in the `supabase/functions/` directory

### 5. Deploy Edge Functions

Navigate to each function directory and deploy:

```bash
# For ai-chat function
cd supabase/functions/ai-chat
supabase functions deploy ai-chat

# For generate-training-plan function
cd ../generate-training-plan
supabase functions deploy generate-training-plan
```

### 6. Run the development server

```bash
pnpm dev
# or
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **AI Integration**: OpenRouter API (GPT-4, Claude-3)
- **State Management**: React Context API
- **Package Manager**: pnpm

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── ChatContext.tsx # Chat functionality
│   └── GuestModeContext.tsx # Guest user data
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── pages/              # Route components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── LandingPage.tsx # Landing page with auth
│   ├── Chat.tsx        # AI chat interface
│   └── TrainingPlans.tsx # Training plan management
└── types/              # TypeScript type definitions
```

## 🔧 Key Features Implementation

### AI Chat System
- Real-time chat with AI trainer using OpenRouter API
- Automatic dog information extraction from conversations
- Training plan generation based on chat context
- Guest mode support with localStorage persistence

### Database Schema
The application uses the following Supabase tables:
- `user_profiles` - User account information
- `dogs` - Dog profiles and characteristics
- `training_plans` - Generated training plans
- `training_sessions` - Individual training sessions
- `training_exercises` - Exercise definitions and progress

### Authentication
- Guest mode: Full functionality without account creation
- User accounts: Persistent data with Supabase Auth
- Automatic guest-to-user conversion

## 🚀 Deployment

### Build for Production

```bash
pnpm build
# or
npm run build
```

### Deploy to Vercel, Netlify, or similar

The built files in the `dist/` directory can be deployed to any static hosting service.

## 🧪 Testing

### Test Accounts
- Email: `jyggbxdx@minimax.com`
- Password: `hq6biVwaIq`

### Test Scenarios
1. **Guest Mode**: Try the app without signing up
2. **Account Creation**: Create a new account and log in
3. **Chat with AI**: Start a conversation about your dog
4. **Training Plans**: Generate and view training plans
5. **Dashboard**: Check your dog's profile and progress

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your environment variables are correctly set
3. Ensure all Supabase tables are created
4. Check that edge functions are properly deployed

## 🎯 Roadmap

- [ ] Mobile app versions (iOS/Android)
- [ ] Video call integration with trainers
- [ ] Community features and forums
- [ ] Advanced analytics and reporting
- [ ] Integration with wearable devices
- [ ] Multi-language support

---

**Built with ❤️ for dog lovers everywhere** 🐕💙