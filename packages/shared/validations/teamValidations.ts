import type { Player, RosterSettings } from '../types';

export function canAddPlayerToTeam(rosterSettings: RosterSettings, currentRoster: Player[], playerToAdd: Player): boolean {
    const positionCount = currentRoster.reduce((acc, player) => {
        acc[player.position] = (acc[player.position] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Check if adding the player exceeds the roster limits
    switch (playerToAdd.position) {
        case 'QB':
            if ((positionCount['QB'] || 0) >= rosterSettings.numQB) return false;
            break;
        case 'RB':
            if ((positionCount['RB'] || 0) >= rosterSettings.numRB) return false;
            break;
        case 'WR':
            if ((positionCount['WR'] || 0) >= rosterSettings.numWR) return false;
            break;
        case 'TE':
            if ((positionCount['TE'] || 0) >= rosterSettings.numTE) return false;
            break;
        case 'FLEX':
            if ((positionCount['FLEX'] || 0) >= rosterSettings.numFLEX) return false;
            break;
        case 'DEF':
            if ((positionCount['DEF'] || 0) >= rosterSettings.numDEF) return false;
            break;
        case 'K':
            if ((positionCount['K'] || 0) >= rosterSettings.numK) return false;
            break;
        default:
            // If the position is not recognized, we can't add the player
            return false;
    }

    // Check if adding the player exceeds the total roster size
    if (currentRoster.length >= rosterSettings.benchSlots + rosterSettings.numQB + rosterSettings.numRB + rosterSettings.numWR + rosterSettings.numTE + rosterSettings.numFLEX + rosterSettings.numDEF + rosterSettings.numK) {
        return false;
    }

    return true;
}