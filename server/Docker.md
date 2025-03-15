#### Running MongoDB Using Docker and Connecting with Node.js 🚀

Using Docker and run your Node.js app with npm run dev, follow these steps:

### 🛠 Step 1: Create a docker-compose.yml File

Create a `docker-compose.yml` file in your project root to run **MongoDB**.

### 📝 Step 2: Update Your .env File

Modify .env file to store **MongoDB & Frontend URLs**:

#### For Secure connection (Production)

```
MONGO_URI="mongodb://your_mongo_username:your_mongo_password@localhost:27017/"
```

✅ More secure but requires authentication

#### For Secure connection (Development - local)

```
MONGO_URI="mongodb://localhost:27017/"
```

✅ No authentication needed → Simpler to set up!

#### 💡 Which One Should You Use?

- **For production →** Use authentication **(Option 1)**.
- **For local development →** No password **(Option 2)** is fine.

**🔹 If you don’t set a password**, anyone with access to your Redis/MongoDB instance can modify the database.

### ⚡ Step 3: Start Docker Containers

Run the following command to start Redis & MongoDB:

```sh
docker-compose up -d
```

This will:

- Pull the **MongoDB** images.
- Start the services in the background (`-d` flag).
  To check running containers:

```sh
docker ps
```

### 🟣 Step 4: Run Your Node.js App

npm run dev, make sure package.json contains:

```json
"scripts": {
"dev": "nodemon index.js"
}
```

Now, start your app:

```sh
npm run dev
```

You should see:

```
✅ Redis Connected
✅ MongoDB Connected
```

### 🛑 Stop Containers (If Needed)

To stop all services:

```sh
docker-compose down
```

To restart:

```sh
docker-compose up -d
```

✅ Summary

1. **Set up** `docker-compose.yml` for MongoDB.
2. **Update .env** with `FRONTEND_URL` and `MONGO_URI`.
3. **Start services** with `docker-compose up -d`.
4. **Run your app** with `npm run dev`.

# 🚀

# Verify if Docker run successfully

Since you're using Docker, you don’t need to install Redis CLI locally. You can run it inside the Redis container.

### 1️⃣ If You're Using a Custom Container Name

If your Redis container name is different, first **find its name**:

```sh
docker ps
```

# 🚀

# Docker Issue (if Found)

### 1️⃣ Ensure Docker Desktop is Installed

Check if Docker Desktop is installed by running:

```sh
docker -v
```

If you see a version number, Docker is installed. If not, **download and install** it:
🔗 Download Docker Desktop

### 2️⃣ Start Docker Desktop

Open **Docker Desktop** and **wait until it's fully running**.
Run the following command to check if Docker is working:

```sh
docker ps
```

If it returns an empty list (but no errors), Docker is running.

### 3️⃣ Enable Docker WSL Integration (For Windows Users)

If you're on **Windows**, Docker might not be running correctly due to WSL settings.

Open Docker Desktop **Settings → General**
Enable "**Use the WSL 2 based engine**"
Restart Docker
Then, run:

```sh
wsl --update
wsl --set-version Ubuntu-22.04 2
```

### 4️⃣ Restart Docker and Try Again

Once Docker is running, restart your command prompt and try:

```sh
docker-compose up -d
```

### 5️⃣ Verify Running Containers

Check if Redis and MongoDB containers are running:

```sh
docker ps
```

If everything is fine, you should see your containers listed.

### 💡 Final Thoughts

If you still face issues, try **running Docker as administrator**.
If `docker-compose` still doesn't work, use `docker compose` (without a hyphen):

`sh
docker compose up -d
`

# 🚀😊
