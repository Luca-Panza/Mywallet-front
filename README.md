# <p align = "center"> MyWallet </p>

<p align="center">
   <img width=176px; src="./src/assets/wallet.png"/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-Luca_Panza-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/Luca-Panza/projeto14-mywallet-front?color=4dae71&style=flat-square" />
</p>

## :clipboard: Description

MyWallet is a dynamic front-end application for personal finance management. It provides an intuitive interface for users to monitor and manage their financial transactions.

Deployment on Vercel: <a href="https://projeto14-mywallet-front-gray.vercel.app" target="_blank">MyWallet</a>

---

## :computer: Technologies and Concepts

- JavaScript
- React
- HTML & CSS
- Animate.css
- SweetAlert2
- Responsive Design
- Axios
- User Authentication

---

## 🏁 Running the application

Make sure you have the latest stable version of [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/) running locally.

First, clone this repository on your machine:

```
git clone https://github.com/Luca-Panza/projeto14-mywallet-front
```

Setting Up the .env File:

1. Locate .env.example: Find the .env.example file in your project directory.

2. Create .env File: Make a new file in the same directory and name it .env.

3. Configure API URLs: Open the .env.example file, where you will see the API URLs:

   - For local connection: VITE_API_URL=http://localhost:5000

   - For external connection: VITE_API_URL=http://mywallet-api-njln.onrender.com

4. Select and Set URL: Choose either the local or external URL and replace it in your .env file.

Then, navigate to the project folder and install the dependencies with the following command:

```
npm install
```

Once the process is finished, just start the server.

```
npm start
```

Or to test on a development server.

```
npm run dev
```
