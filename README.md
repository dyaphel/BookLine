# BookLine
Lab. advanced programming - project

## 🛠️ Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dyaphel/BookLine.git
   Install dependencies:
2. **Install dependencies**:
     ```bash
    cd BookLine
    npm install
4. **Run the development server**:
   ```bash
   npm run dev

5. Open your browser and navigate to **http://localhost:5173** to view the project

# 🚀 Git Workflow Rules  

To ensure smooth collaboration, follow these rules when working on this repository.  

## 📌 Branching Strategy  
- **`main` branch** → Stable production-ready version (do not push here directly).  
- **`development` branch** → The main working branch for integrating new features (do not push directly here).  
- **`sub-development` branch** → Use this as an intermediate branch to handle merge conflicts before pushing to `development`.  

## 🛠 Working on a New Feature  
1. **Create a new branch** from `development`:  
   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/your-feature-name
   ```
2. Work on your feature, commit changes regularly.
3. Push your branch to the remote repository:
```bash
   git push origin feature/your-feature-name
```
## 🔄 Syncing Your Work
1. Before starting your session, **always fetch the latest changes**:
```bash
  git fetch origin
  git pull origin development
```
2. During development, periodically fetch updates to avoid conflicts:
```bash
  git fetch origin
  git pull origin development
```
## 🔀 Merging and Resolving Conflicts

1. When your feature is ready, merge it into sub-development:
```bash
  git checkout sub-development
  git pull origin sub-development
  git merge feature/your-feature-name
```
2. Resolve any merge conflicts in sub-development.
Push the updated sub-development branch:
  ```bash
  git push origin sub-development
  ```
3.Once sub-development is stable, merge it into development:
  ```bash
  git checkout development
  git pull origin development
  git merge sub-development
  git push origin development
  ```
## ⚠️ Important Notes
- Never push directly to main or development.
- Always fetch before starting and during your programming session.
- Use meaningful commit messages.
- Resolve conflicts in sub-development before pushing to development.
