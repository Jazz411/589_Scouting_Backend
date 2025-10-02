/**
 * 589 FRC Scouting Dashboard JavaScript
 * Handles all frontend interactions with the backend API
 */

// Configuration
const API_BASE = window.location.origin;
const API_KEY = 'dev-key-123';

// Global state
let currentSeason = null;
let currentRegional = null;
let teams = [];
let regionals = [];

// Utility Functions
function showToast(type, message) {
    const toastElement = document.getElementById(type + 'Toast');
    const messageElement = document.getElementById(type + 'Message');
    messageElement.textContent = message;

    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

function showLoading(elementId) {
    document.getElementById(elementId).innerHTML = `
        <div class="loading">
            <div class="spinner-border spinner-border-custom" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
}

async function makeRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        }
    };

    const mergedOptions = { ...defaultOptions, ...options };
    if (mergedOptions.body && typeof mergedOptions.body === 'object') {
        mergedOptions.body = JSON.stringify(mergedOptions.body);
    }

    try {
        const response = await fetch(API_BASE + url, mergedOptions);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Expected JSON response, got ${contentType}. Response: ${text.substring(0, 100)}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

// Initialization Functions
async function initDashboard() {
    try {
        // Check API connection
        const health = await makeRequest('/health');
        document.getElementById('connectionStatus').innerHTML =
            '<i class="fas fa-check-circle text-success me-1"></i>Connected';
        document.getElementById('connectionStatus').className = 'badge bg-success';

        // Load system info
        const apiInfo = await makeRequest('/api/info');
        document.getElementById('apiVersion').textContent = apiInfo.version;
        document.getElementById('dbStatus').innerHTML = '<i class="fas fa-check-circle text-success me-1"></i>Connected';
        document.getElementById('lastUpdated').textContent = new Date().toLocaleString();

        // Load overview statistics
        await loadOverviewStats();

        // Load initial data
        await loadSeasons();

    } catch (error) {
        console.error('Dashboard initialization failed:', error);
        document.getElementById('connectionStatus').innerHTML =
            '<i class="fas fa-times-circle text-danger me-1"></i>Error';
        document.getElementById('connectionStatus').className = 'badge bg-danger';
        showToast('error', 'Failed to connect to API: ' + error.message);
    }
}

async function loadOverviewStats() {
    try {
        // Load dashboard statistics
        const statsData = await makeRequest('/api/dashboard/stats');
        const stats = statsData.data;

        document.getElementById('totalTeams').textContent = stats.totalTeams;
        document.getElementById('totalMatches').textContent = stats.totalMatches;
        document.getElementById('activeSeasons').textContent = stats.activeSeasons;
        document.getElementById('totalRegionals').textContent = stats.totalRegionals;

    } catch (error) {
        console.error('Failed to load overview stats:', error);
        // Fallback to individual API calls
        try {
            const teamsData = await makeRequest('/api/teams');
            document.getElementById('totalTeams').textContent = teamsData.data.length;
        } catch (e) {
            document.getElementById('totalTeams').textContent = '0';
        }
    }
}

// Season Management
async function loadSeasons() {
    showLoading('seasonsContent');

    try {
        const response = await makeRequest('/api/seasons');
        const seasons = response.data;

        let html = '';

        if (seasons.length === 0) {
            html = `
                <div class="text-center text-muted py-4">
                    <i class="fas fa-calendar-times fa-3x mb-3"></i>
                    <p>No seasons found. Create your first season to get started!</p>
                    <button class="btn btn-primary-custom btn-custom" onclick="createSample2025Season()">
                        <i class="fas fa-plus me-2"></i>Create 2025 Season
                    </button>
                </div>
            `;
        } else {
            seasons.forEach(season => {
                const isActive = season.is_active;
                html += `
                    <div class="card regional-card mb-3">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title mb-1">
                                        ${season.season_name}
                                        ${isActive ? '<span class="season-badge ms-2">Active</span>' : ''}
                                    </h5>
                                    <p class="card-text text-muted mb-2">
                                        <i class="fas fa-gamepad me-1"></i>${season.game_name || 'Unknown Game'}
                                    </p>
                                    <small class="text-muted">
                                        <i class="fas fa-calendar me-1"></i>
                                        ${season.start_date ? new Date(season.start_date).toLocaleDateString() : 'No start date'}
                                    </small>
                                </div>
                                <div class="text-end">
                                    ${!isActive ? `
                                        <button class="btn btn-outline-success btn-sm me-2" onclick="activateSeason(${season.season_year})">
                                            <i class="fas fa-play me-1"></i>Activate
                                        </button>
                                    ` : ''}
                                    <button class="btn btn-outline-primary btn-sm" onclick="loadSeasonDetails(${season.id})">
                                        <i class="fas fa-eye me-1"></i>Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        document.getElementById('seasonsContent').innerHTML = html;

    } catch (error) {
        console.error('Failed to load seasons:', error);
        document.getElementById('seasonsContent').innerHTML = `
            <div class="alert alert-danger alert-custom">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Failed to load seasons: ${error.message}
            </div>
        `;
    }
}

async function createSample2025Season() {
    try {
        const seasonData = {
            season_year: 2025,
            season_name: '2025 Crescendo',
            game_name: 'Crescendo',
            start_date: '2025-01-06'
        };

        await makeRequest('/api/seasons', {
            method: 'POST',
            body: seasonData
        });

        showToast('success', '2025 Season created successfully!');
        await loadSeasons();

    } catch (error) {
        showToast('error', 'Failed to create season: ' + error.message);
    }
}

async function activateSeason(year) {
    try {
        await makeRequest(`/api/seasons/${year}/activate`, { method: 'PUT' });
        showToast('success', `Season ${year} activated successfully!`);
        await loadSeasons();
    } catch (error) {
        showToast('error', 'Failed to activate season: ' + error.message);
    }
}

// Teams Management
async function loadTeams() {
    showLoading('teamsContent');

    try {
        const response = await makeRequest('/api/teams');
        teams = response.data;

        // Update team dropdown for match form
        updateTeamDropdown();

        if (teams.length === 0) {
            document.getElementById('teamsContent').innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="fas fa-users fa-3x mb-3"></i>
                    <p>No teams found. Add your first team using the Data Entry tab!</p>
                </div>
            `;
            return;
        }

        let html = `
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Team Number</th>
                        <th>Team Name</th>
                        <th>Regional</th>
                        <th>Registered</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        teams.forEach(team => {
            html += `
                <tr class="match-row">
                    <td><strong>${team.team_number}</strong></td>
                    <td>${team.team_name || 'Team ' + team.team_number}</td>
                    <td><span class="badge bg-primary">${team.regional}</span></td>
                    <td><small class="text-muted">${new Date(team.created_at).toLocaleDateString()}</small></td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" onclick="viewTeamDetails(${team.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        document.getElementById('teamsContent').innerHTML = html;

    } catch (error) {
        console.error('Failed to load teams:', error);
        document.getElementById('teamsContent').innerHTML = `
            <div class="alert alert-danger alert-custom">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Failed to load teams: ${error.message}
            </div>
        `;
    }
}

function updateTeamDropdown() {
    const dropdown = document.getElementById('matchTeamId');
    dropdown.innerHTML = '<option value="">Select Team...</option>';

    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = `${team.team_number} - ${team.team_name || 'Team ' + team.team_number}`;
        dropdown.appendChild(option);
    });
}

// Matches Management
async function loadMatches() {
    showLoading('matchesContent');

    try {
        const response = await makeRequest('/api/matches');
        const matches = response.data;

        if (matches.length === 0) {
            document.getElementById('matchesContent').innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="fas fa-trophy fa-3x mb-3"></i>
                    <p>No matches found. Add your first match using the Data Entry tab!</p>
                </div>
            `;
            return;
        }

        let html = `
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Match #</th>
                        <th>Team</th>
                        <th>Regional</th>
                        <th>Starting Position</th>
                        <th>Auto Score</th>
                        <th>Teleop Score</th>
                        <th>Endgame</th>
                        <th>Driver Rating</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
        `;

        matches.forEach(match => {
            const autoScore = (match.auto_m1 || 0) + (match.auto_m2 || 0) + (match.auto_m3 || 0) +
                            (match.auto_m4 || 0) + (match.auto_m5 || 0) + (match.auto_s1 || 0) +
                            (match.auto_s2 || 0) + (match.auto_s3 || 0) + (match.auto_r || 0);
            const teleopScore = (match.teleop_amp_scored || 0) + (match.teleop_speaker_scored || 0);

            html += `
                <tr class="match-row">
                    <td><strong>${match.match_number}</strong></td>
                    <td>${match.team_number}</td>
                    <td><span class="badge bg-primary">${match.regional}</span></td>
                    <td><span class="badge bg-secondary">${match.starting_position || 'N/A'}</span></td>
                    <td>${autoScore}</td>
                    <td>${teleopScore}</td>
                    <td><span class="badge bg-info">${match.endgame_climb || 'None'}</span></td>
                    <td>
                        ${match.driver_rating ?
                            `<span class="badge bg-${match.driver_rating >= 4 ? 'success' : match.driver_rating >= 3 ? 'warning' : 'danger'}">${match.driver_rating}/5</span>`
                            : 'N/A'}
                    </td>
                    <td><small class="text-muted">${new Date(match.created_at).toLocaleDateString()}</small></td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        document.getElementById('matchesContent').innerHTML = html;

        // Update overview stats
        document.getElementById('totalMatches').textContent = matches.length;

    } catch (error) {
        console.error('Failed to load matches:', error);
        document.getElementById('matchesContent').innerHTML = `
            <div class="alert alert-danger alert-custom">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Failed to load matches: ${error.message}
            </div>
        `;
    }
}

// Statistics Management
async function calculateAllStats() {
    const regionalSelect = document.getElementById('statsRegionalSelect');
    const regionalId = regionalSelect.value;

    if (!regionalId) {
        showToast('error', 'Please select a regional first');
        return;
    }

    try {
        showToast('success', 'Calculating statistics... This may take a moment.');

        const response = await makeRequest(`/api/statistics/calculate-all/${regionalId}`, {
            method: 'POST'
        });

        showToast('success', response.message);
        await loadRankings();

    } catch (error) {
        showToast('error', 'Failed to calculate statistics: ' + error.message);
    }
}

async function loadRankings() {
    const regionalSelect = document.getElementById('statsRegionalSelect');
    const regionalId = regionalSelect.value;

    if (!regionalId) {
        document.getElementById('rankingsContent').innerHTML = `
            <div class="text-center text-muted">
                <i class="fas fa-info-circle me-2"></i>
                Select a regional to view rankings
            </div>
        `;
        return;
    }

    showLoading('rankingsContent');

    try {
        const response = await makeRequest(`/api/statistics/regional/${regionalId}/rankings`);
        const rankings = response.data;

        if (rankings.length === 0) {
            document.getElementById('rankingsContent').innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="fas fa-medal fa-3x mb-3"></i>
                    <p>No rankings available. Calculate statistics first!</p>
                </div>
            `;
            return;
        }

        let html = `
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Team</th>
                        <th>Overall Score</th>
                        <th>Auto Score</th>
                        <th>Teleop Score</th>
                        <th>Endgame Score</th>
                        <th>Matches</th>
                    </tr>
                </thead>
                <tbody>
        `;

        rankings.forEach((team, index) => {
            const rankBadge = index < 3 ? ['bg-warning', 'bg-secondary', 'bg-warning'][index] : 'bg-primary';
            const rankIcon = index < 3 ? ['fa-trophy', 'fa-medal', 'fa-medal'][index] : 'fa-hashtag';

            html += `
                <tr class="match-row">
                    <td>
                        <span class="badge ${rankBadge}">
                            <i class="fas ${rankIcon} me-1"></i>${index + 1}
                        </span>
                    </td>
                    <td>
                        <strong>${team.teams.team_number}</strong>
                        <br><small class="text-muted">${team.teams.team_name}</small>
                    </td>
                    <td><strong>${team.overall_score.toFixed(1)}</strong></td>
                    <td>${team.auto_score.toFixed(1)}</td>
                    <td>${team.teleop_score.toFixed(1)}</td>
                    <td>${team.endgame_score.toFixed(1)}</td>
                    <td><span class="badge bg-info">${team.matches_played}</span></td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        document.getElementById('rankingsContent').innerHTML = html;

    } catch (error) {
        console.error('Failed to load rankings:', error);
        document.getElementById('rankingsContent').innerHTML = `
            <div class="alert alert-danger alert-custom">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Failed to load rankings: ${error.message}
            </div>
        `;
    }
}

// Form Handlers
document.getElementById('addTeamForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        team_number: parseInt(document.getElementById('teamNumber').value),
        team_name: document.getElementById('teamName').value,
        regional: document.getElementById('teamRegional').value
    };

    try {
        await makeRequest('/api/teams', {
            method: 'POST',
            body: formData
        });

        showToast('success', `Team ${formData.team_number} added successfully!`);
        document.getElementById('addTeamForm').reset();
        await loadTeams();

    } catch (error) {
        showToast('error', 'Failed to add team: ' + error.message);
    }
});

document.getElementById('addMatchForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        team_id: parseInt(document.getElementById('matchTeamId').value),
        match_number: parseInt(document.getElementById('matchNumber').value),
        regional: 'Orange County', // Default for now
        starting_position: document.getElementById('startingPosition').value,
        scouter_name: 'Dashboard User'
    };

    try {
        await makeRequest('/api/matches', {
            method: 'POST',
            body: formData
        });

        showToast('success', `Match ${formData.match_number} added successfully!`);
        document.getElementById('addMatchForm').reset();
        await loadMatches();

    } catch (error) {
        showToast('error', 'Failed to add match: ' + error.message);
    }
});

// Tab Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard
    initDashboard();

    // Tab change handlers
    document.querySelectorAll('[data-bs-toggle="pill"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', async (event) => {
            const target = event.target.getAttribute('data-bs-target');

            switch (target) {
                case '#teams':
                    await loadTeams();
                    break;
                case '#matches':
                    await loadMatches();
                    break;
                case '#seasons':
                    await loadSeasons();
                    break;
            }
        });
    });

    // Auto-refresh every 30 seconds for overview
    setInterval(async () => {
        if (document.querySelector('#overview-tab').classList.contains('active')) {
            await loadOverviewStats();
        }
    }, 30000);
});

// Recent Activity
async function loadRecentActivity() {
    try {
        const response = await makeRequest('/api/dashboard/activity');
        const activities = response.data;

        if (activities.length === 0) {
            document.getElementById('recentActivity').innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="fas fa-history fa-2x mb-3"></i>
                    <p>No recent activity found.</p>
                    <small>Start by adding teams and matches!</small>
                </div>
            `;
            return;
        }

        let html = '';
        activities.forEach(activity => {
            const timeAgo = getTimeAgo(new Date(activity.time));
            html += `
                <div class="d-flex align-items-center mb-3">
                    <div class="flex-shrink-0">
                        <div class="rounded-circle bg-${activity.color} bg-opacity-10 p-2">
                            <i class="fas ${activity.icon} text-${activity.color}"></i>
                        </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                        <p class="mb-1">${activity.text}</p>
                        <small class="text-muted">${timeAgo}</small>
                    </div>
                </div>
            `;
        });

        document.getElementById('recentActivity').innerHTML = html;

    } catch (error) {
        console.error('Failed to load recent activity:', error);
        document.getElementById('recentActivity').innerHTML = `
            <div class="alert alert-warning alert-custom">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Unable to load recent activity
            </div>
        `;
    }
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

// Load recent activity after initialization
setTimeout(loadRecentActivity, 2000);

// Add event listeners for TBA buttons after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the page to fully load
    setTimeout(function() {
        // Add event listener for Lookup Team Info button
        const lookupButton = document.getElementById('lookupTBAButton');
        if (lookupButton) {
            lookupButton.addEventListener('click', function(e) {
                e.preventDefault();
                lookupTBATeam();
            });
        }

        // Add event listener for Load TBA Events button
        const loadEventsButton = document.getElementById('loadTBAEventsButton');
        if (loadEventsButton) {
            loadEventsButton.addEventListener('click', function(e) {
                e.preventDefault();
                loadTBAEvents();
            });
        }

        // Add event listener for Preview Event Teams button
        const previewButton = document.querySelector('button[onclick="previewEventTeams()"]');
        if (previewButton) {
            previewButton.addEventListener('click', function(e) {
                e.preventDefault();
                previewEventTeams();
            });
        }

        // Add event listener for Import Event Teams button
        const importButton = document.querySelector('button[onclick="importEventTeams()"]');
        if (importButton) {
            importButton.addEventListener('click', function(e) {
                e.preventDefault();
                importEventTeams();
            });
        }

        console.log('TBA event listeners added successfully');
    }, 1000);
});

// ============================================================================
// THE BLUE ALLIANCE INTEGRATION FUNCTIONS
// ============================================================================

let currentTBATeamData = null;
let currentTBAEvents = [];
let selectedEventTeams = [];

// Lookup individual team from TBA
async function lookupTBATeam() {
    const teamNumber = document.getElementById('tbaTeamNumber').value;
    if (!teamNumber) {
        showToast('error', 'Please enter a team number');
        return;
    }

    // Find the button using ID
    const button = document.getElementById('lookupTBAButton');

    if (!button) {
        console.error('Could not find lookup button');
        return;
    }

    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Looking up...';
    button.disabled = true;

    try {
        const response = await makeRequest(`/api/tba/team/${teamNumber}`);
        currentTBATeamData = response.data;

        displayTBATeamInfo(currentTBATeamData.team, currentTBATeamData.events2025);
        document.getElementById('saveTBATeam').disabled = false;
        showToast('success', `Team ${teamNumber} information loaded`);

    } catch (error) {
        console.error('Failed to lookup TBA team:', error);
        showToast('error', 'Failed to lookup team: ' + error.message);
        document.getElementById('tbaTeamInfo').style.display = 'none';
        document.getElementById('saveTBATeam').disabled = true;
    } finally {
        if (button) {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }
}

function displayTBATeamInfo(team, events2025) {
    const infoDiv = document.getElementById('tbaTeamDetails');

    let eventsHtml = '';
    if (events2025 && events2025.length > 0) {
        eventsHtml = `
            <p><strong>2025 Events:</strong></p>
            <ul class="list-unstyled">
                ${events2025.map(event => `
                    <li><small><i class="fas fa-calendar me-1"></i>${event.name} (${event.start_date})</small></li>
                `).join('')}
            </ul>
        `;
    } else {
        eventsHtml = '<p><small class="text-muted">No 2025 events found</small></p>';
    }

    infoDiv.innerHTML = `
        <div class="card border-primary">
            <div class="card-body">
                <h6 class="card-title">Team ${team.team_number}</h6>
                <p class="card-text">
                    <strong>Name:</strong> ${team.name || 'N/A'}<br>
                    <strong>Nickname:</strong> ${team.nickname || 'N/A'}<br>
                    <strong>Location:</strong> ${team.city}, ${team.state_prov}, ${team.country}<br>
                    <strong>Rookie Year:</strong> ${team.rookie_year || 'N/A'}<br>
                    ${team.website ? `<strong>Website:</strong> <a href="${team.website}" target="_blank">${team.website}</a><br>` : ''}
                </p>
                ${eventsHtml}
            </div>
        </div>
    `;

    document.getElementById('tbaTeamInfo').style.display = 'block';
}

// Save TBA team to database
document.getElementById('tbaTeamForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!currentTBATeamData) {
        showToast('error', 'Please lookup team information first');
        return;
    }

    const teamNumber = document.getElementById('tbaTeamNumber').value;
    const regional = document.getElementById('tbaRegional').value;

    const button = document.getElementById('saveTBATeam');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';
    button.disabled = true;

    try {
        const response = await makeRequest(`/api/tba/team/${teamNumber}/save`, {
            method: 'POST',
            body: { regional }
        });

        showToast('success', response.message);

        // Reset form
        document.getElementById('tbaTeamForm').reset();
        document.getElementById('tbaTeamInfo').style.display = 'none';
        currentTBATeamData = null;

        // Refresh teams list if currently viewing
        if (document.getElementById('teams-tab').classList.contains('active')) {
            loadTeams();
        }

    } catch (error) {
        console.error('Failed to save TBA team:', error);
        showToast('error', 'Failed to save team: ' + error.message);
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
});

// Load TBA 2025 events
async function loadTBAEvents() {
    const button = document.getElementById('loadTBAEventsButton');

    if (!button) {
        console.error('Could not find events button');
        return;
    }

    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
    button.disabled = true;

    try {
        const response = await makeRequest('/api/tba/events/2025');
        currentTBAEvents = response.data;

        const select = document.getElementById('tbaEventSelect');
        select.innerHTML = '<option value="">Select Event...</option>';

        currentTBAEvents.forEach(event => {
            const option = document.createElement('option');
            option.value = event.key;
            option.textContent = `${event.name} (${event.start_date})`;
            select.appendChild(option);
        });

        showToast('success', `Loaded ${currentTBAEvents.length} events for 2025`);

        // Enable preview button when event is selected
        select.addEventListener('change', function() {
            const previewBtn = document.getElementById('previewEventBtn');
            previewBtn.disabled = !this.value;
            document.getElementById('importEventBtn').disabled = true;
            document.getElementById('eventTeamsPreview').style.display = 'none';
        });

    } catch (error) {
        console.error('Failed to load TBA events:', error);
        showToast('error', 'Failed to load events: ' + error.message);
    } finally {
        if (button) {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }
}

// Preview teams from selected event
async function previewEventTeams() {
    const eventKey = document.getElementById('tbaEventSelect').value;
    if (!eventKey) {
        showToast('error', 'Please select an event');
        return;
    }

    const button = document.getElementById('previewEventBtn');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
    button.disabled = true;

    try {
        const response = await makeRequest(`/api/tba/event/${eventKey}/teams`);
        selectedEventTeams = response.data;

        displayEventTeams(selectedEventTeams);
        document.getElementById('importEventBtn').disabled = false;
        showToast('success', `Found ${selectedEventTeams.length} teams in event`);

    } catch (error) {
        console.error('Failed to preview event teams:', error);
        showToast('error', 'Failed to load event teams: ' + error.message);
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

function displayEventTeams(teams) {
    const listDiv = document.getElementById('eventTeamsList');

    const html = `
        <table class="table table-sm">
            <thead>
                <tr>
                    <th>Team #</th>
                    <th>Name</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
                ${teams.map(team => `
                    <tr>
                        <td><strong>${team.team_number}</strong></td>
                        <td>${team.nickname || team.name || 'N/A'}</td>
                        <td><small>${team.city}, ${team.state_prov}</small></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    listDiv.innerHTML = html;
    document.getElementById('eventTeamsPreview').style.display = 'block';
}

// Import all teams from selected event
async function importEventTeams() {
    const eventKey = document.getElementById('tbaEventSelect').value;
    const regional = document.getElementById('eventRegional').value;

    if (!eventKey || !regional) {
        showToast('error', 'Please select an event and enter regional name');
        return;
    }

    const button = document.getElementById('importEventBtn');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Importing...';
    button.disabled = true;

    try {
        const response = await makeRequest(`/api/tba/event/${eventKey}/import-teams`, {
            method: 'POST',
            body: { regional }
        });

        showToast('success', response.message);

        // Reset form
        document.getElementById('tbaEventSelect').value = '';
        document.getElementById('eventRegional').value = '';
        document.getElementById('eventTeamsPreview').style.display = 'none';
        document.getElementById('previewEventBtn').disabled = true;
        button.disabled = true;

        // Refresh teams list if currently viewing
        if (document.getElementById('teams-tab').classList.contains('active')) {
            loadTeams();
        }

    } catch (error) {
        console.error('Failed to import event teams:', error);
        showToast('error', 'Failed to import teams: ' + error.message);
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}