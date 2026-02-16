# 🚀 CI/CD Setup Guide - Deploy from GitHub to Local Docker Desktop

## Overview

This guide will help you set up automatic deployment from GitHub to your local Docker Desktop using GitHub Actions and a self-hosted runner.

---

## 📋 What You'll Achieve

When setup is complete:
- ✅ Push code to GitHub → Automatically deploys to your local Docker Desktop
- ✅ No manual deployment steps needed
- ✅ Real-time deployment logs in GitHub Actions
- ✅ Automatic health checks
- ✅ Service status monitoring

---

## 🎯 Prerequisites

Before starting, ensure you have:
- [x] Windows 10/11
- [x] Docker Desktop installed and running
- [x] Git installed
- [x] Administrator access to your computer
- [x] Your code pushed to GitHub repository

---

## 📝 Step-by-Step Setup

### Step 1: Run the Setup Script

1. **Open PowerShell as Administrator**
   - Press `Windows Key`
   - Type "PowerShell"
   - Right-click "Windows PowerShell"
   - Select "Run as Administrator"

2. **Navigate to your project**
   ```powershell
   cd C:\Users\MINAYADAV\Desktop\voting-app-microservices
   ```

3. **Run the setup script**
   ```powershell
   .\setup-github-runner.bat
   ```

### Step 2: Get GitHub Token

When the script prompts you:

1. **Open your browser** and go to:
   ```
   https://github.com/YOUR_USERNAME/voting-app-microservices/settings/actions/runners/new
   ```

2. **Select "Windows"** as the operating system

3. **Copy the token** shown in the "Configure" section
   - It will look like: `AAAA...` (a long string)

4. **Paste it** into the PowerShell window when prompted

5. **Enter your repository URL** when prompted:
   ```
   https://github.com/YOUR_USERNAME/voting-app-microservices
   ```

### Step 3: Verify Runner is Running

After setup completes, verify the runner:

```powershell
cd C:\actions-runner
.\svc.cmd status
```

You should see: `service is running`

### Step 4: Commit and Push Workflow

1. **Add the workflow file**
   ```bash
   git add .github/workflows/deploy-to-local-docker.yml
   git add setup-github-runner.bat
   git add CI-CD-SETUP.md
   ```

2. **Commit**
   ```bash
   git commit -m "Add CI/CD pipeline for local deployment"
   ```

3. **Push to GitHub**
   ```bash
   git push origin main
   ```

### Step 5: Watch It Deploy!

1. Go to your GitHub repository
2. Click the **"Actions"** tab
3. You'll see the workflow running
4. Click on it to watch the deployment in real-time
5. Wait for all steps to complete (✅ green checkmarks)
6. Access your app at:
   - Voting: http://localhost:5000
   - Results: http://localhost:5001

---

## 🔄 How It Works

```
┌─────────────────────┐
│  You push to GitHub │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  GitHub Actions     │
│  Triggers Workflow  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Self-Hosted Runner │
│  (Your Computer)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Stops Old          │
│  Containers         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Builds New Images  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Starts New         │
│  Containers         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Health Checks      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  ✅ DEPLOYED!        │
│  localhost:5000     │
│  localhost:5001     │
└─────────────────────┘
```

---

## 🧪 Testing Your CI/CD Pipeline

### Test 1: Make a Simple Change

```bash
# Edit a file
echo "# Testing CI/CD" >> README.md

# Commit and push
git add README.md
git commit -m "Test automatic deployment"
git push origin main

# Go to GitHub Actions tab and watch it deploy!
```

### Test 2: Manual Trigger

1. Go to GitHub → Actions
2. Click "Deploy to Local Docker Desktop"
3. Click "Run workflow"
4. Select branch: main
5. Click "Run workflow" button
6. Watch it execute!

---

## 📊 Monitoring Deployments

### View