# BookLine
Lab. advanced programming - project

## 🔗 Useful Links  

- [Miro Board](https://miro.com/app/board/uXjVILAemLI=/) - Mockup  
- [Notion Documentation](https://www.notion.so/BookLine-Lab-AP-1b89f4cb74a8809ebd68c4b351b7ff7f) - Project notes and documentation.  

## 🛠️ Setup and Installation whit docker 🐋

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dyaphel/BookLine.git
   Install dependencies:
2. **Build and start the Docker container**:
   ```bash
     docker-compose up --build
   
3. Open your browser and navigate to **http://localhost:5173** to view the frontend
   to **http://127.0.0.1:8000** for Django
   to **http://localhost:5050/** for Pgadmin
   
4. **Stop the Docker container**:
    ```bash
   docker-compose down -v
    ```
# 🚀 Git Workflow Rules  

To ensure smooth collaboration, follow these rules when working on this repository.  

## 📌 Branching Strategy  
- **`main` branch** → Stable production-ready version (do not push here directly).
- **`sub-development` branch** → Use this as an intermediate branch to handle merge conflicts before pushing to `development`.  

## 🛠 Working on a New Feature  
1. **Create a new branch** from `sub-development`:  
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
## ⚠️ Important Notes
- Never push directly to main or development.
- Always fetch before starting and during your programming session.
- Always fetch the branch in which you want to do the merge.
- Use meaningful commit messages.
- Resolve conflicts in sub-development before pushing to development.
- Do not add backend changes into frontend branches
