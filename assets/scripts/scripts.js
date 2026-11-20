const searchTeamsInput = document.querySelector('#search-teams');
const searchTeamsBtn = document.querySelector('#search-btn');
const spinner = document.querySelector('#spinner');
const alertContainer = document.querySelector('#alert');
const favoritesEmpty = document.querySelector('#favorites-empty');
const favoritesList = document.querySelector('#favorites-list');
const resultsEmpty = document.querySelector('#results-empty');
const resultsList = document.querySelector('#results-list');
const eventsSection = document.querySelector('#events-section');
const eventsTeamName = document.querySelector('#events-team-name');
const nextEvent = document.querySelector('#next-event');
const lastEvent = document.querySelector('#last-event');





class Team {
  constructor(_idTeam, _strBadge, _strTeam, _strLeague, _strCountry, _strSport) {
    this.strBadge = _strBadge;
    this.idTeam = _idTeam;
    this.strTeam = _strTeam;
    this.strLeague = _strLeague;
    this.strCountry = _strCountry;
    this.strSport = _strSport;

  }
}

class Match {
  constructor(_dateEvent, _strEvent, _intHomeScore, _intAwayScore) {
    this.dateEvent = _dateEvent;
    this.strEvent = _strEvent;
    this.intHomeScore = _intHomeScore;
    this.intAwayScore = _intAwayScore;
  }
}
const FAVORITES_KEY = 'favorites-sportsHub';
let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

// debounce 
let debounceTimer;
let searchController;


searchTeamsInput.addEventListener('input', () => {

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchTeamsBtn.click()

  }, 400)
})


const API_KEY = '123';
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/`;


// function for Spinner management

function showSpinner() {
  spinner.classList.remove('d-none');
}

function hideSpinner() {
  spinner.classList.add('d-none');
}

// function for alert management

function showAlert(message) {
  clearAlert();
  const alertDiv = document.createElement('div');
  alertDiv.classList.add('alert', 'alert-danger');
  alertDiv.setAttribute('role', 'alert');
  alertDiv.textContent = message;
  alertContainer.appendChild(alertDiv);
}


function clearAlert() {
  alertContainer.textContent = '';
}

// function for upload teams

async function searchTeams(query) {
  if (searchController) {
    searchController.abort();
  }

  searchController = new AbortController();

  clearAlert();
  showSpinner();

  try {
    const response = await fetch(`${BASE_URL}searchteams.php?t=${query}`,{signal : searchController.signal});
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}`);
    }
    const data = await response.json();
    if (data.teams === null) {
      showAlert('Nessuna squadra trovata...');
      return []
    } else {

      return data.teams
    }

  }

  catch (err) {
    if(err.name === 'AbortError'){
      return null
    }
    console.error(err);
    showAlert('Errore nel caricamento dei dati, riprova più tardi ...');
    return []
  } finally {
    hideSpinner();
  }

}
// function for manage the return async function and build a new Team under the class

function toTeams(arrayRes) {
  const newTeamSearched = arrayRes.map((item) => new Team(item.idTeam, item.strBadge, item.strTeam, item.strLeague, item.strCountry, item.strSport));

  return newTeamSearched
}


// function for build team card 

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
  favoriteBtn.classList.add('btn', 'btn-sm', 'mt-3', 'w-100', 'fw-bold')
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

  return cardColDiv
}

//function for render results

function renderResults(teams) {
  resultsList.textContent = '';
  if (teams.length === 0) {
    resultsEmpty.classList.remove('d-none');
    return
  }
  resultsEmpty.classList.add('d-none');

  teams.forEach(team => {
    resultsList.append(buildCard(team));

  });
}

// function for render favorites

function renderFavorites() {
  favoritesList.textContent = '';
  if (favorites.length === 0) {
    favoritesEmpty.classList.remove('d-none');
    return
  }
  favoritesEmpty.classList.add('d-none');

  favorites.forEach(favorite => {
    favoritesList.append(buildCard(favorite, true))
  })
}

// listener for searchBtn 

searchTeamsBtn.addEventListener('click', async (e) => {
  const query = searchTeamsInput.value.trim();
  if (!query) {
    showAlert('Scrivi il nome della tua squadra');
    renderResults([]);
    return
  }

  const data = await searchTeams(query);
  const teams = toTeams(data);
  renderResults(teams);
})

// fetch function for next events

async function fetchNextEvents(idTeam) {
  clearAlert();
  showSpinner();

  try {
    const response = await fetch(`${BASE_URL}eventsnext.php?id=${idTeam}`);
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}`);
    }
    const data = await response.json();
    if (data.events === null) {
      return []
    } else {

      return data.events
    }

  }

  catch (err) {
    console.error(err);
    showAlert('Errore nel caricamento dei dati, riprova più tardi ...');
    return []
  } finally {
    hideSpinner();
  }

}

// fetch function for last event

async function fetchLastEvents(idTeam) {
  clearAlert();
  showSpinner();

  try {
    const response = await fetch(`${BASE_URL}eventslast.php?id=${idTeam}`);
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}`);
    }
    const data = await response.json();
    if (data.results === null) {
      return []
    } else {

      return data.results
    }

  }

  catch (err) {
    console.error(err);
    showAlert('Errore nel caricamento dei dati, riprova più tardi ...');
    return []
  } finally {
    hideSpinner();
  }

}

//function for manage the results of the events fetch

function toMatches(arrayMatches) {
  const arrayMatchesResult = arrayMatches.map((item) => new Match(item.dateEvent, item.strEvent, item.intHomeScore, item.intAwayScore));

  return arrayMatchesResult
}

// function for build the match card 

function buildEventItem(match) {
  const matchContainer = document.createElement('div');
  matchContainer.classList.add('border-bottom', 'py-2');
  const dateMatchPar = document.createElement('p');
  dateMatchPar.textContent = match.dateEvent;
  dateMatchPar.classList.add('small', 'text-muted', 'mb-1');
  matchContainer.appendChild(dateMatchPar);
  const resultContainer = document.createElement('div');
  resultContainer.classList.add('fw-bold');
  const resultPar = document.createElement('span');
  resultPar.textContent = match.strEvent;
  resultContainer.appendChild(resultPar);
  if (match.intHomeScore !== null) {
    const newSpanBadge = document.createElement('span');
    newSpanBadge.classList.add('badge', 'bg-success', 'ms-2');
    newSpanBadge.textContent = `${match.intHomeScore} – ${match.intAwayScore}`
    resultContainer.appendChild(newSpanBadge);
  }

  matchContainer.appendChild(resultContainer);
  return matchContainer
}

// function for show the events

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

// function for show team events 

async function showTeamsEvents(team) {
  eventsTeamName.textContent = team.strTeam;
  eventsSection.classList.remove('d-none');
  const [apiNext, apiLast] = await Promise.all([
    fetchNextEvents(team.idTeam),
    fetchLastEvents(team.idTeam),
  ])



  const nextMatches = toMatches(apiNext);
  const lastMatches = toMatches(apiLast);

  renderEvents(nextEvent, nextMatches, 'Nessun evento in programma');
  renderEvents(lastEvent, lastMatches, 'Nessun risultato disponibile');
}

// function for saving

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// function for add favorites

function addFavorites(team) {
  if (favorites.some(f => f.idTeam === team.idTeam)) {
    return
  } else {
    favorites.push(team)
  }

  saveFavorites();

}

// function for remove favorites

function removeFavorites(idTeam) {
  favorites = favorites.filter(f => f.idTeam !== idTeam);
  saveFavorites();
}


