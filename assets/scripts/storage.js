import { FAVORITES_KEY } from './config.js';

export let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function addFavorites(team) {
  if (favorites.some(f => f.idTeam === team.idTeam)) {
    return;
  }
  favorites.push(team);
  saveFavorites();
}

export function removeFavorites(idTeam) {
  favorites = favorites.filter(f => f.idTeam !== idTeam);
  saveFavorites();
}