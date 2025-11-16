# PawsitiveAI Coach - GitHub Setup Guide

## Quick GitHub Setup Commands

Follow these steps to add your PawsitiveAI Coach project to GitHub:

### 1. Initialize Git Repository

```bash
# Navigate to your project directory
cd pawsitive-ai-coach

# Initialize git repository
git init

# Add all files to git
git add .

# Create your first commit
git commit -m "Initial commit: PawsitiveAI Coach - AI-powered dog training app

Features:
- AI chat with personalized training plans
- React + TypeScript frontend
- Supabase backend with edge functions
- Guest mode support
- User authentication and profiles
- Dog training progress tracking

Tech Stack:
- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Backend: Supabase (Database, Auth, Edge Functions)
- AI: OpenRouter API (GPT-4, Claude-3)
- Deployment: Production ready"
```

### 2. Create GitHub Repository

**Option A: Using GitHub CLI (Recommended)**

```bash
# Install GitHub CLI if not already installed
# Visit: https://cli.github.com/

# Authenticate with GitHub
gh auth login

# Create repository
gh repo create pawsitive-ai-coach --public --source=. --remote=origin --push

# Or create with description
gh repo create pawsitive-ai-coach \
  --public \
  --description="AI-powered dog training application with personalized plans and progress tracking" \
  --source=. \
  --remote=origin \
  --push
```

**Option B: Using GitHub Web Interface**

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name: `pawsitive-ai-coach`
5. Description: `AI-powered dog training application with personalized plans and progress tracking`
6. Make it Public or Private as desired
7. Do NOT initialize with README (we already have one)
8. Click "Create repository"
9. Copy the repository URL (e.g., `https://github.com/yourusername/pawsitive-ai-coach.git`)

### 3. Push to GitHub

**If you created repository via web interface:**

```bash
# Add remote origin (replace with your actual repository URL)
git remote add origin https://github.com/yourusername/pawsitive-ai-coach.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

### 4. Set Up Repository Settings

**Enable GitHub Pages (if desired):**
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Source: Deploy from a branch
5. Branch: main
6. Folder: / (root)

**Add repository topics:**
- react
- typescript
- ai
- dog-training
- supabase
- tailwindcss
- vite
- openrouter

**Create release:**
1. Go to "Releases" section
2. Click "Create a new release"
3. Tag version: v1.0.0
4. Release title: PawsitiveAI Coach v1.0.0
5. Description: Initial release with AI chat and training plans

## Complete One-Command Setup

**If you have GitHub CLI installed, run this entire script:**

```bash
#!/bin/bash

echo "🚀 Setting up PawsitiveAI Coach for GitHub..."

# Initialize git
git init
git add .
git commit -m "Initial commit: PawsitiveAI Coach - AI-powered dog training app

Features:
- AI chat with personalized training plans
- React + TypeScript frontend  
- Supabase backend with edge functions
- Guest mode support
- User authentication and profiles
- Dog training progress tracking

Tech Stack:
- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Backend: Supabase (Database, Auth, Edge Functions)
- AI: OpenRouter API (GPT-4, Claude-3)
- Deployment: Production ready"

# Create GitHub repository
gh repo create pawsitive-ai-coach \
  --public \
  --description="AI-powered dog training application with personalized plans and progress tracking" \
  --source=. \
  --remote=origin \
  --push

echo "✅ Repository created and pushed successfully!"
echo "📝 Your repository is now available at:"
echo "   https://github.com/$(gh api user --jq .login)/pawsitive-ai-coach"
```

## Verification

After pushing, verify everything is working:

```bash
# Check repository status
git status

# Check remote
git remote -v

# Verify push
git log --oneline -5
```

## Next Steps

1. **Clone and Test**: Clone your repository to verify everything works
2. **Set up branches**: Create `develop` branch for ongoing development
3. **Add collaborators**: Invite team members if working in a team
4. **Set up CI/CD**: Consider GitHub Actions for automated testing and deployment
5. **Create issues**: Start planning future features and improvements

## Troubleshooting

**Permission denied:**
```bash
# Set up SSH keys or use personal access token
gh auth setup-git
```

**Repository already exists:**
```bash
# Remove existing remote and re-add
git remote remove origin
git remote add origin https://github.com/yourusername/pawsitive-ai-coach.git
```

**Large files rejected:**
```bash
# Remove large files and retry
git reset HEAD~
git add .
git commit -m "Remove large files"
git push -f origin main
```

---

**🎉 Your PawsitiveAI Coach project is now on GitHub!**