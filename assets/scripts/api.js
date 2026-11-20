// api.js — chiamate a TheSportsDB

import { BASE_URL } from './config.js';
import { showSpinner, hideSpinner, showAlert, clearAlert } from './ui.js';

let searchController;

function dateReviver(key, value) {
  if (key === 'dateEvent' && value !== null) {
    return new Date(value);
  }
  return value;
}

export async function searchTeams(query) {
  if (searchController) {
    searchController.abort();
  }
  searchController = new AbortController();

  clearAlert();
  showSpinner();

  try {
    const response = await fetch(`${BASE_URL}searchteams.php?t=${query}`, { signal: searchController.signal });
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}`);
    }
    const data = await response.json();
    if (data.teams === null) {
      showAlert('Nessuna squadra trovata...');
      return [];
    }
    return data.teams;
  } catch (err) {
    if (err.name === 'AbortError') {
      return null;
    }
    console.error(err);
    showAlert('Errore nel caricamento dei dati, riprova più tardi ...');
    return [];
  } finally {
    hideSpinner();
  }
}

export async function fetchNextEvents(idTeam) {
  clearAlert();
  showSpinner();

  try {
    const response = await fetch(`${BASE_URL}eventsnext.php?id=${idTeam}`);
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}`);
    }
    const text = await response.text();
    const data = JSON.parse(text, dateReviver);
    if (data.events === null) {
      return [];
    }
    return data.events;
  } catch (err) {
    console.error(err);
    showAlert('Errore nel caricamento dei dati, riprova più tardi ...');
    return [];
  } finally {
    hideSpinner();
  }
}

export async function fetchLastEvents(idTeam) {
  clearAlert();
  showSpinner();

  try {
    const response = await fetch(`${BASE_URL}eventslast.php?id=${idTeam}`);
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}`);
    }
    const text = await response.text();
    const data = JSON.parse(text, dateReviver);
    if (data.results === null) {
      return [];
    }
    return data.results;
  } catch (err) {
    console.error(err);
    showAlert('Errore nel caricamento dei dati, riprova più tardi ...');
    return [];
  } finally {
    hideSpinner();
  }
}