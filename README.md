# 🦊 Minna no Nihongo Quiz

Application de bureau **Electron + React + TypeScript** dédiée à l’apprentissage du japonais à partir du manuel **Minna no Nihongo**.

Le projet combine :

- vocabulaire,
- kanji,
- quiz interactifs,

---

## ✨ Fonctionnalités principales

### 📘 Vocabulaire

- Affichage des mots par leçon
- Furigana + traduction
- Filtrage par leçon

### 🈶 Kanji

- Liste dédiée aux entrées contenant des kanji
- Affichage clair (kanji / furigana / traduction)

### 🎮 Quiz Kanji

- Questions aléatoires
- Choix multiples
- Synthèse vocale japonaise (ja-JP)
- Score en temps réel

### 🪟 Interface Desktop

- TopBar personnalisée
- Boutons fenêtre : réduire / maximiser / fermer
- Design responsive

---

## 🧱 Stack technique

- **Electron** (application desktop)
- **React** (UI)
- **TypeScript** (typage strict)
- **SQLite** (base de données locale)
- **IPC Electron** (communication main ↔ renderer)
- **Lottie** (animations)

---

## 🗂 Structure du projet

```
├── main/                 # Processus principal Electron
│   ├── main.ts
│   └── preload.ts
│
├── renderer/             # Frontend React
│   ├── components/
│   ├── hooks/
│   ├── assets/
│   └── App.tsx
│
├── database/
│   └── kanjiQuizz.db
│
├── resources/
│   └── icon.png
│
└── README.md
```

---

## 🗃 Base de données

### Table `Vocabulaire`

```sql
CREATE TABLE Vocabulaire (
  Traduction TEXT,
  furigana TEXT,
  japonais TEXT,
  kanji TEXT,
  leçon TEXT
);
```

---

## 🔌 API Electron (IPC)

Exemples :

- `getData()` → récupération du vocabulaire
- `windowControls.minimize()`
- `windowControls.maximize()`
- `windowControls.close()`

---

## 🚀 Lancer le projet

```bash
npm install
npm run dev
```
