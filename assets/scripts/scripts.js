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
  clearAlert();
  showSpinner();

  try {
    const response = await fetch(`${BASE_URL}searchteams.php?t=${query}`);
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
    console.error(err);
    showAlert('Errore nel caricamento dei dati, riprova più tardi ...');
    return []
  } finally {
    hideSpinner();
  }

}
// function for manage the return async function and build a new Team under the class

function toTeams(arrayRes) {
  const newTeamSearched = arrayRes.map((item) => new Team(item.id, item.strBadge, item.strTeam, item.strLeague, item.strCountry, item.strSport));
  
  return newTeamSearched
}


// function for build team card 

function buildCard(team) {
  resultsEmpty.textContent = '';
  const cardColDiv = document.createElement('div');
  cardColDiv.classList.add('col-12', 'col-md-6', 'col-lg-4');
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card', 'h-100', 'text-center', 'border-0', 'shadow-sm');
  const imgTeam = document.createElement('img');
  imgTeam.setAttribute('src', team.strBadge);
  imgTeam.setAttribute('alt', team.strTeam);
  imgTeam.classList.add('mx-auto', 'mt-3', 'img-fluid', 'w-25');
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
  const addPreferedBtn = document.createElement('button');
  addPreferedBtn.textContent = 'Aggiungi ai preferiti';
  addPreferedBtn.classList.add('btn', 'btn-warning', 'btn-sm', 'mt-3', 'w-100', 'text-dark', 'fw-bold');
  cardBodyDiv.appendChild(addPreferedBtn);
  cardDiv.appendChild(cardBodyDiv);
  cardColDiv.appendChild(cardDiv);
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
  const arrayMatchesResult = arrayMatches.map((item) => new Match(item.dateEvent,item.strEvent,item.intHomeScore,item.intAwayScore));
  
  return arrayMatchesResult
}

// function for build the match card 

function buildEventItem(match){
  const matchContainer = document.createElement('div');
  matchContainer.classList.add('border-bottom','py-2');
  const dateMatchPar = document.createElement('p');
  dateMatchPar.textContent = match.dateEvent;
  dateMatchPar.classList.add('small','text-muted','mb-1');
  matchContainer.appendChild(dateMatchPar);
  const resultContainer = document.createElement('div');
  resultContainer.classList.add('fw-bold');
  const resultPar = document.createElement('span');
  resultPar.textContent = match.strEvent;
  resultContainer.appendChild(resultPar);
  if(match.intHomeScore !== null){
    const newSpanBadge = document.createElement('span');
    newSpanBadge.classList.add('badge','bg-success','ms-2');
    newSpanBadge.textContent = `${match.intHomeScore} – ${match.intAwayScore}`
    resultContainer.appendChild(newSpanBadge);
  }
  
  matchContainer.appendChild(resultContainer);
  return matchContainer
}

const matches = toMatches(await fetchLastEvents(133604));
lastEvent.append(buildEventItem(matches[0]));
const nextMatches = toMatches(await fetchNextEvents(133604));
nextEvent.append(buildEventItem(nextMatches[0]));