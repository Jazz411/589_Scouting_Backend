/**
 * Dashboard Routes
 * Web interface for database management
 */

const express = require('express');
const path = require('path');
const { supabase } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandling');

const router = express.Router();

// Dashboard home page (served from static files)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Get dashboard overview statistics
router.get('/stats', asyncHandler(async (req, res) => {
    try {
        // Get teams count
        const { count: teamsCount } = await supabase
            .from('teams')
            .select('*', { count: 'exact', head: true });

        // Get matches count
        const { count: matchesCount } = await supabase
            .from('matches')
            .select('*', { count: 'exact', head: true });

        res.json({
            success: true,
            data: {
                totalTeams: teamsCount || 0,
                totalMatches: matchesCount || 0,
                totalSeasons: 1,
                activeSeasons: 1,
                totalRegionals: 1
            }
        });

    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.json({
            success: true,
            data: {
                totalTeams: 0,
                totalMatches: 0,
                totalSeasons: 1,
                activeSeasons: 1,
                totalRegionals: 1
            }
        });
    }
}));

// Get recent activity
router.get('/activity', asyncHandler(async (req, res) => {
    try {
        // Get recent matches
        const { data: recentMatches } = await supabase
            .from('matches')
            .select(`
                *,
                teams (
                    team_number,
                    team_name
                )
            `)
            .order('created_at', { ascending: false })
            .limit(5);

        // Get recent teams
        const { data: recentTeams } = await supabase
            .from('teams')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

        const activities = [];

        // Add recent matches
        if (recentMatches) {
            recentMatches.forEach(match => {
                activities.push({
                    type: 'match',
                    text: `Team ${match.teams?.team_number || 'Unknown'} completed Match ${match.match_number}`,
                    time: new Date(match.created_at).toLocaleString(),
                    icon: 'fa-trophy',
                    color: 'success'
                });
            });
        }

        // Add recent teams
        if (recentTeams) {
            recentTeams.forEach(team => {
                activities.push({
                    type: 'team',
                    text: `Team ${team.team_number} registered for ${team.regional}`,
                    time: new Date(team.created_at).toLocaleString(),
                    icon: 'fa-user-plus',
                    color: 'primary'
                });
            });
        }

        // Sort by creation time
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.json({
            success: true,
            data: activities.slice(0, 10)
        });

    } catch (error) {
        console.error('Error getting recent activity:', error);
        res.json({
            success: true,
            data: []
        });
    }
}));

module.exports = router;