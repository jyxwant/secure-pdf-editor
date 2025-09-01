# 🔒 Secure PDF Editor | Rédacteur PDF sécurisé

[English](../README.md) • [中文](README.zh-CN.md)

Éditeur de caviardage PDF axé sur la confidentialité. Tout est traité localement dans votre navigateur — aucun fichier n’est téléversé, aucune donnée ne quitte votre appareil.

---

## ✨ Fonctionnalités

- Traitement 100% local, sans requêtes réseau
- Sélection visuelle des zones sensibles (glisser pour dessiner)
- Deux méthodes de caviardage :
  - Rendu Canvas : pages converties en images (le plus sûr, irréversible)
  - Pixellisation : mosaïque des zones marquées en conservant la mise en page
- Aperçu en temps réel, annuler/rétablir, couleurs de marquage
- Internationalisation : Anglais (par défaut), Chinois simplifié, Français

---

## 🚀 Démarrage rapide

Pré-requis : Node.js 18+ et npm/yarn/pnpm

```bash
git clone https://github.com/jyxwant/secure-pdf-editor.git
cd secure-pdf-editor
npm install
npm run dev
# Ouvrir http://localhost:5173
```

Production :
```bash
npm run build
npm run preview
```

---

## 🛠 Utilisation

1. Importer un PDF (50 Mo max ; fichiers protégés par mot de passe non pris en charge)
2. Tracer les zones sensibles
3. Prévisualiser l’effet
4. Choisir la méthode (Canvas ou Pixellisation)
5. Télécharger le PDF sécurisé

Raccourcis :

| Raccourci | Action |
|-----------|--------|
| `←` `→` | Page précédente/suivante |
| `+` `-` | Zoom avant/arrière |
| `0` | Réinitialiser le zoom |
| `F` | Ajuster à la largeur |
| `Espace` | Basculer le mode pan |
| `Delete` | Supprimer la sélection |
| `Ctrl+Z` `Ctrl+Y` | Annuler / Rétablir |
| `Esc` | Annuler l’action |

---

## 🏗 Stack

React 18, TypeScript, Vite 6, Tailwind CSS, PDF.js, pdf-lib, i18next

---

## 🔒 Sécurité

- Aucun envoi réseau ; traitement en mémoire uniquement
- Nettoyage des métadonnées à l’export
- Canvas : rendu raster irréversible
- Pixellisation : masque visuel en conservant la mise en page

---

## 💬 Retours

- Issues : https://github.com/jyxwant/secure-pdf-editor/issues
- Dépôt : https://github.com/jyxwant/secure-pdf-editor

---

## 📚 Traductions du README

- Anglais (par défaut) : ../README.md
- Chinois simplifié : README.zh-CN.md

Licence : MIT
