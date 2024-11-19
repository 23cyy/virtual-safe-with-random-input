const keys = document.querySelectorAll(".key");
const display = document.getElementById("display");
let lastKey = null;
let displayContent = ""; // Contenu actuel de l'écran
let randomKeyCount = 0; // Nombre de touches aléatoires tapées
let allowOnlyClear = false; // Si vrai, seule "CLEAR" est autorisée
let allowOnlyClearOrLock = false; // Si vrai, seules "CLEAR" ou "LOCK" sont autorisées

// Fonction pour mettre à jour l'affichage
function updateDisplay(content) {
  display.textContent = content.padEnd(4, "****"); // Remplir avec des étoiles si nécessaire
}

// Fonction pour gérer l'animation aléatoire
function randomKeyAnimation() {
  // Vérifier si seule "CLEAR" est autorisée
  if (allowOnlyClear) {
    const clearKey = document.querySelector(".key.clear");
    activateKey(clearKey);
    return;
  }

  // Vérifier si seules "CLEAR" ou "LOCK" sont autorisées
  if (allowOnlyClearOrLock) {
    const possibleKeys = [
      document.querySelector(".key.clear"),
      document.querySelector(".key.lock"),
    ];
    const nextKey =
      possibleKeys[Math.floor(Math.random() * possibleKeys.length)];
    activateKey(nextKey);
    return;
  }

  // Limiter les touches aléatoires à 4
  if (randomKeyCount >= 4) {
    allowOnlyClearOrLock = true; // Passer en mode "CLEAR" ou "LOCK" uniquement
    randomKeyAnimation(); // Replanifier pour exécuter cette règle
    return;
  }

  const randomIndex = Math.floor(Math.random() * keys.length);
  const randomKey = keys[randomIndex];

  // S'assurer qu'on ne sélectionne pas une touche fonction après 4 touches
  if (
    randomKey.classList.contains("clear") ||
    randomKey.classList.contains("lock")
  ) {
    randomKeyAnimation();
    return;
  }

  activateKey(randomKey);
}

// Fonction pour activer une touche
function activateKey(key) {
  if (lastKey) {
    lastKey.classList.remove("active");
  }

  key.classList.add("active");
  lastKey = key;

  const value = key.textContent;

  // Gérer l'action en fonction de la touche sélectionnée
  if (value === "C") {
    displayContent = ""; // Effacer tout
    updateDisplay(displayContent);
    randomKeyCount = 0; // Réinitialiser le compteur
    allowOnlyClear = false;
    allowOnlyClearOrLock = false; // Réinitialiser les règles
  } else if (value === "L") {
    if (displayContent === "1234") {
      // Code correct
      display.textContent = "LOCKED";
      display.style.color = "#4caf50"; // Couleur verte pour succès
    } else {
      // Code incorrect
      display.textContent = "LOCKED";
      display.style.color = "#f44336"; // Couleur rouge pour erreur
    }

    // Passer en mode "CLEAR" uniquement après un LOCK
    allowOnlyClear = true;

    // Réinitialisation après 2 secondes
    setTimeout(() => {
      displayContent = "";
      updateDisplay(displayContent);
      display.style.color = "#2196f3"; // Retour à la couleur bleue par défaut
    }, 2000);
  } else {
    // Ajouter une touche au contenu, sauf si "LOCKED" est affiché
    if (displayContent.length < 4 && display.textContent !== "LOCKED") {
      displayContent += value;
      updateDisplay(displayContent);
      randomKeyCount++; // Incrémenter le compteur de touches aléatoires
    }
  }

  // Replanification de l'animation
  const delay = Math.random() * 1000 + 500;
  setTimeout(randomKeyAnimation, delay);
}

// Lancer l'animation au démarrage
randomKeyAnimation();
