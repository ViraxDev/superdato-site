// Scan automatique des images dans src/assets/restorations/
// Structure attendue : {nom-dossier}/{nom}_before.{ext} et {nom}_after.{ext}

const imageModules = import.meta.glob('../assets/restorations/**/*_before.*', { eager: true });
const afterModules = import.meta.glob('../assets/restorations/**/*_after.*', { eager: true });

// Fonction pour formater le nom du dossier en titre lisible
function formatTitle(folderName) {
  return folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Fonction pour générer un tag à partir du nom
function generateTag(folderName) {
  const words = folderName.split('-');
  return '#' + words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

// Construction automatique de la liste des restaurations
const restorations = [];

Object.entries(imageModules).forEach(([path, module]) => {
  // Extraire le nom du dossier depuis le path
  // Ex: ../assets/restorations/omega-seamaster/omega-seamaster_before.jpg
  const parts = path.split('/');
  const folderName = parts[parts.length - 2];

  // Trouver l'image "after" correspondante
  const afterPath = Object.keys(afterModules).find(p => p.includes(`/${folderName}/`));

  if (afterPath) {
    restorations.push({
      id: folderName,
      title: formatTitle(folderName),
      tag: generateTag(folderName),
      before: module.default,
      after: afterModules[afterPath].default,
    });
  }
});

// Trier par nom de dossier
restorations.sort((a, b) => a.id.localeCompare(b.id));

export default restorations;
