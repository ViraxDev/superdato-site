# SuperDato

Atelier de restauration de montres vintage - Site vitrine moderne avec slider avant/après interactif.

## Stack technique

- **React 18** + Vite
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Lucide React** pour les icônes

## Fonctionnalités

- Slider avant/après interactif (drag & touch)
- Chargement dynamique des images de restauration
- Design "rétro-pop" responsive
- Formulaire de contact avec upload photo
- Animations fluides et micro-interactions

## Installation

```bash
npm install
npm run dev
```

## Structure des images

Les images de restauration sont automatiquement détectées depuis `src/assets/restorations/`.

Pour ajouter une nouvelle restauration :

```
src/assets/restorations/
└── nom-de-la-montre/
    ├── nom-de-la-montre_before.jpg
    └── nom-de-la-montre_after.jpg
```

Le titre et le tag sont générés automatiquement depuis le nom du dossier.

## Build

```bash
npm run build
npm run preview
```

## License

MIT
