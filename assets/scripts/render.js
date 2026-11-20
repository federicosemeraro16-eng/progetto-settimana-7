// render.js — tutto ciò che disegna nella pagina

import {
  resultsEmpty, resultsList,
  favoritesEmpty, favoritesList,
  eventsSection, eventsTeamName, nextEvent, lastEvent,
  eventModalTitle, eventModalBody, eventModal
} from './dom.js';
import { favorites, addFavorites, removeFavorites } from './storage.js';
import { fetchNextEvents, fetchLastEvents } from './api.js';
import { toMatches } from './models.js';

// ---------- CARD SQUADRA ----------

function buildCard(team, isFavorite) {
  const cardColDiv = document.createElement('div');
  cardColDiv.classList.add('col-12', 'col-md-6', 'col-lg-4');

  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card', 'h-100', 'text-center', 'border-0', 'team-card');

  const imgTeam = document.createElement('img');
  imgTeam.setAttribute('src', team.strBadge);
  imgTeam.setAttribute('alt', team.strTeam);
  imgTeam.classList.add('mx-auto', 'mt-3', 'img-fluid', 'team-logo');
  cardDiv.appendChild(imgTeam);

  const cardBodyDiv = document.createElement('div');
  cardBodyDiv.classList.add('card-body');

  const teamTitle = document.createElement('h5');
  teamTitle.classList.add('card-title', 'fw-bold', 'fs-6');
  teamTitle.textContent = team.strTeam;
  cardBodyDiv.appendChild(teamTitle);

  const teamLeague = document.createElement('p');
  teamLeague.classList.add('text-muted', 'small', 'mb-0');
  teamLeague.textContent = team.strLeague;
  cardBodyDiv.appendChild(teamLeague);

  const countryTeam = document.createElement('p');
  countryTeam.classList.add('text-muted', 'small', 'mb-0');
  countryTeam.textContent = team.strCountry;
  cardBodyDiv.appendChild(countryTeam);

  const favoriteBtn = document.createElement('button');
  favoriteBtn.classList.add('btn', 'btn-sm', 'mt-3', 'w-100', 'fw-bold');
  if (isFavorite) {
    favoriteBtn.textContent = '🗑 Rimuovi';
    favoriteBtn.classList.add('btn-danger');
  } else {
    favoriteBtn.textContent = '★ Aggiungi ai preferiti';
    favoriteBtn.classList.add('btn-warning', 'text-dark');
  }
  cardBodyDiv.appendChild(favoriteBtn);

  cardDiv.appendChild(cardBodyDiv);
  cardColDiv.appendChild(cardDiv);

  cardDiv.addEventListener('click', () => showTeamsEvents(team));
  favoriteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavorites(team.idTeam);
    } else {
      addFavorites(team);
    }
    renderFavorites();
  });

  return cardColDiv;
}

export function renderResults(teams) {
  resultsList.textContent = '';
  if (teams.length === 0) {
    resultsEmpty.classList.remove('d-none');
    return;
  }
  resultsEmpty.classList.add('d-none');
  teams.forEach(team => {
    resultsList.append(buildCard(team));
  });
}

export function renderFavorites() {
  favoritesList.textContent = '';
  if (favorites.length === 0) {
    favoritesEmpty.classList.remove('d-none');
    return;
  }
  favoritesEmpty.classList.add('d-none');
  favorites.forEach(favorite => {
    favoritesList.append(buildCard(favorite, true));
  });
}

// ---------- EVENTI ----------

function buildEventItem(match) {
  const matchContainer = document.createElement('div');
  matchContainer.classList.add('border-bottom', 'py-2', 'px-2', 'event-item');

  const dateMatchPar = document.createElement('p');
  dateMatchPar.textContent = match.dateEvent
    ? match.dateEvent.toLocaleDateString('it-IT')
    : 'Data da definire';
  dateMatchPar.classList.add('small', 'text-muted', 'mb-1');
  matchContainer.appendChild(dateMatchPar);

  const resultContainer = document.createElement('div');
  resultContainer.classList.add('fw-bold');

  const resultPar = document.createElement('span');
  resultPar.textContent = match.strEvent;
  resultContainer.appendChild(resultPar);

  if (match.intHomeScore !== null) {
    const badge = document.createElement('span');
    badge.classList.add('badge', 'bg-success', 'ms-2');
    badge.textContent = `${match.intHomeScore} – ${match.intAwayScore}`;
    resultContainer.appendChild(badge);
  }

  matchContainer.appendChild(resultContainer);
  matchContainer.addEventListener('click', () => openEventModal(match));
  return matchContainer;
}

function openEventModal(match) {
  eventModalTitle.textContent = match.strEvent;
  eventModalBody.textContent = '';

  const modalDiv = document.createElement('div');
  modalDiv.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'gap-3', 'mb-3');

  const homeBadgeTeam = document.createElement('img');
  homeBadgeTeam.setAttribute('src', match.strHomeTeamBadge);
  homeBadgeTeam.setAttribute('alt', 'badge squadra di casa');
  homeBadgeTeam.setAttribute('width', '60');
  modalDiv.appendChild(homeBadgeTeam);

  const resultSpan = document.createElement('span');
  resultSpan.textContent = match.intHomeScore !== null
    ? `${match.intHomeScore} – ${match.intAwayScore}`
    : 'vs';
  modalDiv.appendChild(resultSpan);

  const awayBadgeTeam = document.createElement('img');
  awayBadgeTeam.setAttribute('src', match.strAwayTeamBadge);
  awayBadgeTeam.setAttribute('alt', 'badge squadra ospite');
  awayBadgeTeam.setAttribute('width', '60');
  modalDiv.appendChild(awayBadgeTeam);

  eventModalBody.appendChild(modalDiv);

  const leaguePar = document.createElement('p');
  leaguePar.textContent = `Campionato: ${match.strLeague}`;
  eventModalBody.appendChild(leaguePar);

  const matchRound = document.createElement('p');
  matchRound.textContent = `Giornata: ${match.intRound}`;
  eventModalBody.appendChild(matchRound);

  const dateText = match.dateEvent ? match.dateEvent.toLocaleDateString('it-IT') : 'Non disponibile';
  const timeText = match.strTime ? match.strTime.slice(0, 5) : 'Da definire';
  const matchDay = document.createElement('p');
  matchDay.textContent = `Data: ${dateText}, ore: ${timeText}`;
  eventModalBody.appendChild(matchDay);

  const stadium = document.createElement('p');
  stadium.textContent = `Stadio: ${match.strVenue || 'Non disponibile'}`;
  eventModalBody.appendChild(stadium);

  eventModal.show();
}

function renderEvents(container, matches, emptyMessage) {
  container.textContent = '';
  if (matches.length === 0) {
    const emptyPar = document.createElement('p');
    emptyPar.classList.add('fst-italic', 'text-muted');
    emptyPar.textContent = emptyMessage;
    container.append(emptyPar);
    return;
  }
  matches.forEach(match => {
    container.append(buildEventItem(match));
  });
}

async function showTeamsEvents(team) {
  eventsTeamName.textContent = team.strTeam;
  eventsSection.classList.remove('d-none');

  const [apiNext, apiLast] = await Promise.all([
    fetchNextEvents(team.idTeam),
    fetchLastEvents(team.idTeam)
  ]);

  const nextMatches = toMatches(apiNext);
  const lastMatches = toMatches(apiLast);
  nextMatches.sort((a, b) => a.dateEvent - b.dateEvent);
  lastMatches.sort((a, b) => b.dateEvent - a.dateEvent);

  renderEvents(nextEvent, nextMatches, 'Nessun evento in programma');
  renderEvents(lastEvent, lastMatches, 'Nessun risultato disponibile');
}