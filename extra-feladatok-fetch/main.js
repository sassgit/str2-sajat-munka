'use strict';

const tableTeam = document.querySelector("#content-properties table tbody tr");
const tablePlayers = document.querySelector("#content-players table tbody");
const teamName = 'Hungary';
const urlTeams = 'https://raw.githubusercontent.com/jokecamp/FootballData/master/UEFA_European_Championship/Euro%202016/players_json/teams.json';
const urlPlayers = `https://raw.githubusercontent.com/jokecamp/FootballData/master/UEFA_European_Championship/Euro%202016/players_json/${teamName.toLowerCase()}-players.json`;

fetchAndFillData();

async function fetchAndFillData() {
    try {
        let result = await Promise.all([
            fetch(urlTeams).then(response => response.json()),
            fetch(urlPlayers).then(response => response.json())
        ]);
        let team = result[0].sheets.Teams.find(a => a.Team == teamName);
        let players = result[1].sheets.Players;
        tableTeam.innerHTML = `<td>${team.Team}</td><td>${team.Coach}</td><td>${team['FIFA ranking']}</td><td>${team.Group}</td>`;
        tablePlayers.innerHTML = players.map((player, i) =>
            `<tr><td>${i+1}.</td><td>${player.name}</td><td>${player.position}</td><td>${player.club}</td></tr>`).join("");        
    } catch (error) {
        console.log("error", error);
    }
}
