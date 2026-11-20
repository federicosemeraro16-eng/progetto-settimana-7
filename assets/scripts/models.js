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
  constructor(_dateEvent, _strEvent, _intHomeScore, _intAwayScore, _strLeague, _intRound, _strTime, _strVenue, _strHomeTeamBadge, _strAwayTeamBadge) {
    this.dateEvent = _dateEvent;
    this.strEvent = _strEvent;
    this.intHomeScore = _intHomeScore;
    this.intAwayScore = _intAwayScore;
    this.strLeague = _strLeague;
    this.intRound = _intRound;
    this.strTime = _strTime;
    this.strVenue = _strVenue;
    this.strHomeTeamBadge = _strHomeTeamBadge;
    this.strAwayTeamBadge = _strAwayTeamBadge;
  }
}

export function toTeams(arrayRes) {
  const newTeamSearched = arrayRes.map((item) => new Team(item.idTeam, item.strBadge, item.strTeam, item.strLeague, item.strCountry, item.strSport));

  return newTeamSearched
}

export function toMatches(arrayMatches) {
  const arrayMatchesResult = arrayMatches.map((item) => new Match(item.dateEvent, item.strEvent, item.intHomeScore, item.intAwayScore, item.strLeague, item.intRound, item.strTime, item.strVenue, item.strHomeTeamBadge, item.strAwayTeamBadge));

  return arrayMatchesResult
}
