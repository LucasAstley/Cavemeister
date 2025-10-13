# Cavemeister
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js](https://img.shields.io/badge/Node.js-v22.20.0-green)
![Express](https://img.shields.io/badge/Express-v5.1.0-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML5-orange)
![CSS3](https://img.shields.io/badge/CSS3-blue)
![tailwindcss](https://img.shields.io/badge/tailwindcss-v3.4.17-blue)
![dotenv](https://img.shields.io/badge/dotenv-v17.2.3-green)
![loglevel](https://img.shields.io/badge/loglevel-v1.9.2-blue)
## 📋 Description

Application web de gestion de cave développée en JavaScript avec Node.js et Express

## 🚀 Installation

```bash
# Cloner le dépôt
git clone https://github.com/LucasAstley/Cavemeister.git

# Accéder au répertoire
cd Cavemeister

# Installer les dépendances
npm install

# Configurer les variables d'environnement en suivant le modèle du fichier .env.example
cp .env.example .env

# (Optionnel) Ouvrir le fichier .env pour le modifier si nécessaire
nano .env

# Lancer l'application
node server.js
```

Accédez à l'application via votre navigateur à l'adresse : `http://localhost:3000` (port par défaut)

## 📁 Structure du projet

```
├── data/
│   └── db.json
├── public/
│   ├── index.html
│   └── js/
│       └── app.js
├── src/
│   ├── routes/
│   │   └── routes.js
│   └── services/
│       └── db.js
├── server.js
├── package.json
└── README.md
```

## 👥 Collaborateurs

Ce projet a été développé par trois collaborateurs :

<a href="https://github.com/Enoxboo"><img src="https://avatars.githubusercontent.com/u/186810959" alt="Enoxboo" width="69" height="69"/></a>
<a href="https://github.com/AlexandreRiv"><img src="https://avatars.githubusercontent.com/u/118808382" alt="AlexandreRiv" width="69" height="69"/></a>
<a href="https://github.com/LucasAstley"><img src="https://avatars.githubusercontent.com/u/75446972" alt="Lucas Astley" width="69" height="69"/></a>

## 📄 Licence

Ce projet est sous licence MIT.

```
MIT License

Copyright (c) 2025 Cavemeister

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
