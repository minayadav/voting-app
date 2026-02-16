# GitHub Actions Workflows

This directory contains CI/CD workflows for automatic deployment.

## Available Workflows

### 1. Deploy to Local Docker Desktop
**File:** `deploy-to-local-docker.yml`

**Triggers:**
- Automatic: When you push to `main` branch
- Manual: Via Actions tab → "Run workflow" button

**What it does:**
1. Checks out your code
2. Stops existing Docker containers
3. Builds fresh Docker images
4. Starts new containers
5. Performs health checks
6. Shows deployment status

**Requirements:**
- Self-hosted runner installed (run `setup-github-runner.bat`)
- Docker Desktop running on your local machine

## Quick Commands

### Check Workflow Status
```bash
# View in browser
https://github.com/YOUR_USERNAME/voting-app-microservices/actions
```

### Trigger Manual Deployment
1. Go to Actions tab
2. Select "Deploy to Local Docker Desktop"
3. Click "Run workflow"
4. Select branch: main
5. Click green "Run workflow" button

### View Deployment Logs
- GitHub: Actions tab → Click on any workflow run
- Local: `docker-compose logs -f`

## Workflow Steps Explained

```yaml
📥 Checkout code          # Downloads your latest code
🐳 Verify Docker          # Checks Docker is running
🛑 Stop containers        # Stops old version
🧹 Clean up              # Removes unused images
🏗️ Build images          # Builds new Docker images
🚀 Start containers       # Starts new version
⏳ Wait                   # Gives services time to start
🏥 Health checks          # Verifies apps are working
📊 Show status            # Displays container info
🎉 Complete              # Deployment done!
```

## Customization

### Change Health Check Timeout
Edit line 53 in `deploy-to-local-docker.yml`:
```yaml
Start-Sleep -Seconds 30  # Change to 60 for slower machines
```

### Add Notification
Add this step at the end:
```yaml
- name: Send notification
  run: |
    # Your notification code here
    # Email, Slack, Discord, etc.
```

### Skip Health Checks
Comment out the health check steps (lines 56-93)

## Troubleshooting

### Workflow not triggering?
- Check if runner is online: Settings → Actions → Runners
- Green dot = online, Red dot = offline

### Restart runner:
```powershell
cd C:\actions-runner
.\svc.cmd restart
```

### View runner logs:
```powershell
cd C:\actions-runner\_diag
Get-Content Runner_*.log -Tail 50
```

## More Information

- [CI-CD-SETUP.md](../../CI-CD-SETUP.md) - Full setup guide
- [QUICK-START-CICD.md](../../QUICK-START-CICD.md) - Quick start guide
- [GitHub Actions Docs](https://docs.github.com/en/actions)