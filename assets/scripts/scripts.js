import { searchTeamsInput, searchTeamsBtn, selectSport } from './dom.js';
import { showAlert } from './ui.js';
import { searchTeams } from './api.js';
import { toTeams } from './models.js';
import { renderResults, renderFavorites } from './render.js';









let debounceTimer;

let currentResults = [];


searchTeamsInput.addEventListener('input', () => {

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchTeamsBtn.click()

  }, 400)
})






// function for build team card 



//function for render results

//function for filter for category sport

function applySportFilter() {
  const sportChosen = selectSport.value;
  if (sportChosen === 'all') {

    renderResults(currentResults);
  } else {
    const sportArrayChosen = currentResults.filter((item) => item.strSport === sportChosen);
    renderResults(sportArrayChosen);
  }

}

// function for render favorites


// listener for searchBtn 

searchTeamsBtn.addEventListener('click', async (e) => {
  const query = searchTeamsInput.value.trim();
  if (!query) {
    showAlert('Scrivi il nome della tua squadra');
    currentResults = [];
    renderResults([]);
    return
  }

  const data = await searchTeams(query);
  if (data === null) {
    return
  }
  const teams = toTeams(data);
  currentResults = teams;
  applySportFilter();
})

// listener sulla select

selectSport.addEventListener('change', () => {
  applySportFilter()
})





// function for build the match card 


// function for modal


// function for show the events


// function for show team events 



renderFavorites();



