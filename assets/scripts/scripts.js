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



class Team{
  constructor(_idTeam,_strBadge,_strTeam,_strLeague,_strCountry,_strSport){
    this.strBadge = _strBadge; 
    this.idTeam = _idTeam;
    this.strTeam = _strTeam;
    this.strLeague = _strLeague;
    this.strCountry = _strCountry;
    this.strSport = _strSport;

  }
}

class Match{
  constructor(_dateEvent,_strEvent,_intHomeScore,_intAwayScore){
    this.dateEvent = _dateEvent;
    this.strEvent = _strEvent;
    this.intHomeScore = _intHomeScore;
    this.intAwayScore = _intAwayScore;
  }
}

const API_KEY = '123';
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/`;


// function for Spinner management

function showSpinner(){
  spinner.classList.remove('d-none');
}

function hideSpinner(){
  spinner.classList.add('d-none');
}

// function for alert management

function showAlert(message){
clearAlert();
  const alertDiv = document.createElement('div');
  alertDiv.classList.add('alert','alert-danger');
  alertDiv.setAttribute('role','alert');
  alertDiv.textContent = message;
  alertContainer.appendChild(alertDiv);
}


function clearAlert(){
  alertContainer.textContent ='';
}

showAlert('test');
showAlert('test 2')