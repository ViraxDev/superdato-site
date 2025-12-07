# SuperDato

Vintage watch restoration workshop - Modern showcase website with interactive before/after slider.

## Tech Stack

- **React 18** + Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## Features

- Interactive before/after slider (drag & touch support)
- Dynamic image loading from restorations folder
- Responsive "retro-pop" design
- Contact form with photo upload
- Smooth animations and micro-interactions

## Installation

```bash
npm install
npm run dev
```

## Image Structure

Restoration images are automatically detected from `src/assets/restorations/`.

To add a new restoration:

```
src/assets/restorations/
└── watch-name/
    ├── watch-name_before.jpg
    └── watch-name_after.jpg
```

Title and tag are automatically generated from the folder name.

## Build

```bash
npm run build
npm run preview
```

## License

MIT
