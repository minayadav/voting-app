# ⚡ Quick Start: GitHub CI/CD to Local Docker Desktop

## 🎯 What You Need to Do Right Now

Follow these 3 simple steps to enable automatic deployment:

---

## Step 1: Run the Setup Script (5 minutes)

### A. Open PowerShell as Administrator

1. Press `Windows Key`
2. Type "PowerShell"
3. **Right-click** on "Windows PowerShell"
4. Click **"Run as Administrator"**

### B. Navigate to Your Project

```powershell
cd C:\Users\MINAYADAV\Desktop\voting-app-microservices
```

### C. Run Setup Script

```powershell
.\setup-github-runner.bat
```

---

## Step 2: Get GitHub Token (2 minutes)

### When the script pauses:

1. **Keep the PowerShell window open**

2. **Open your browser** and go to this URL:
   ```
   https://github.com/YOUR_USERNAME/voting-app-microservices/settings/actions/runners/new
   ```
   *(Replace YOUR_USERNAME with your actual GitHub username)*

3. **On the GitHub page:**
   - Select **"Windows"** (if not already selected)
   - Scroll down to **"Configure"** section
   - You'll see a command that includes a TOKEN
   - The TOKEN looks like: `ABCDEFG...` (a long string of letters/numbers)
   - **Copy just the TOKEN part**

4. **Go back to PowerShell window**
   - Paste the token when prompted
   - Press Enter

5. **Enter your repository URL** when asked:
   ```
   https://github.com/YOUR_USERNAME/voting-app-microservices
   ```
   *(Replace YOUR_USERNAME with your actual GitHub username)*

6. **Wait** for the setup to complete
   - You should see: "✅ Setup Complete!"

---

## Step 3: Push to GitHub (1 minute)

### In VS Code terminal or PowerShell:

```bash
# Add all the new files
git add .github/workflows/deploy-to-local-docker.yml
git add setup-github-runner.bat
git add CI-CD-SETUP.md
git add QUICK-START-CICD.md

# Commit
git commit -m "Add CI/CD pipeline for automatic local deployment"

# Push to GitHub
git push origin main
```

---

## ✅ That's It! Watch the Magic Happen

### Immediately after pushing:

1. **Open your browser**
2. **Go to your GitHub repository**
3. **Click the "Actions" tab**
4. **You'll see the workflow running!**

### Watch it:
- ✅ Checkout code
- ✅ Verify Docker
- ✅ Stop old containers
- ✅ Build new images
- ✅ Start containers
- ✅ Health checks
- ✅ Deployment complete!

### Access your app:
- **Voting:** http://localhost:5000
- **Results:** http://localhost:5001

---

## 🎉 From Now On

**Every time you push to GitHub:**
1. GitHub Actions automatically triggers
2. Runs on your local computer
3. Deploys to your Docker Desktop
4. You get a notification when done!

**No manual deployment needed ever again!** 🚀

---

## 🔍 Troubleshooting

### If setup script fails:

**Make sure:**
- ✅ PowerShell is running **as Administrator**
- ✅ Docker Desktop is **running**
- ✅ You copied the **correct token** from GitHub
- ✅ You entered the **full repository URL**

### If runner doesn't start:

```powershell
cd C:\actions-runner
.\svc.cmd status

# If not running:
.\svc.cmd start
```

### If workflow doesn't trigger:

1. Check GitHub → Settings → Actions → Runners
2. You should see "local-docker-desktop" with green dot
3. If red, restart the runner service

---

## 📞 Need Help?

### Check runner status:
```powershell
cd C:\actions-runner
.\svc.cmd status
```

### View runner logs:
```powershell
cd C:\actions-runner\_diag
notepad Runner_*.log
```

### Verify Docker:
```powershell
docker ps
docker-compose ps
```

---

## 🎯 Next Steps After Setup

1. **Test it:** Make a small change and push to GitHub
2. **Watch it:** Go to Actions tab and watch deployment
3. **Use it:** Every push now auto-deploys!
4. **Learn more:** Read `CI-CD-SETUP.md` for advanced features

---

**You're all set! Happy coding! 🎉**