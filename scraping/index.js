/* eslint-disable comma-dangle */
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable semi */
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import fs from 'node:fs';
import path from 'node:path';
const URLS = {
    leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/',
};

async function scrape(url) {
    const res = await fetch(url);
    const html = await res.text();
    return cheerio.load(html);
}

async function getLeaderBoard() {
    const $ = await scrape(URLS.leaderboard);
    const $rows = $('table tbody tr');
    const cleanText = (text) =>
        text
            .replace(/\t|\n|\s:/g, '')
            .replace(/.*:/g, ' ')
            .trim();

    const LEADERBOARD_SELECTOR = {
        team: { selector: '.fs-table-text_3', typeOf: 'string' },
        victories: { selector: '.fs-table-text_4', typeOf: 'number' },
        loses: { selector: '.fs-table-text_5', typeOf: 'number' },
        goalsScored: { selector: '.fs-table-text_6', typeOf: 'number' },
        goalsConceded: { selector: '.fs-table-text_7', typeOf: 'number' },
        cardsYellow: { selector: '.fs-table-text_8', typeOf: 'number' },
        cardsRed: { selector: '.fs-table-text_9', typeOf: 'number' },
    };

    const leaderBoard = [];
    $rows.each((indes, el) => {
        const leaderBoardSelectorEntries = Object.entries(
            LEADERBOARD_SELECTOR
        ).map(([key, { selector, typeOf }]) => {
            const findElement = $(el).find(selector).text();
            const valueCleanText = cleanText(findElement);
            const value =
                typeOf === 'number' ? Number(valueCleanText) : valueCleanText;
            return [key, value];
        });
        leaderBoard.push(Object.fromEntries(leaderBoardSelectorEntries));
    });
    return leaderBoard;
}
const leaderboardresult = await getLeaderBoard();
// Desde que ubicacion se esta ejecutando el script process.cwd()
const filePath = path.join(process.cwd(), './db/leaderboard.json');

await fs.writeFile(
    filePath,
    JSON.stringify(leaderboardresult, null, 2),
    'utf-8',
    (result) => {
        console.log(result);
    }
);
// const leaderboard = [
//     {
//         team: 'Team1',
//         wins: 0,
//         loses: 0,
//         goalsScored: 0,
//         goalsConceded: 0,
//         cardsYellow: 0,
//         cardsRed: 0,
//     },
// ];
