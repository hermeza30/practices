import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import { readFile, writeFile } from './utils.js'
const URLS = {
  leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/'
}

const TEAMS = await readFile('teams.json', 'DB_URL')
const PRESIDENTS = await readFile('presidents.json', 'DB_URL')

async function scrape(url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

async function getLeaderBoard() {
  const $ = await scrape(URLS.leaderboard)
  const $rows = $('table tbody tr')

  const LEADERBOARD_SELECTOR = {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },
    victories: { selector: '.fs-table-text_4', typeOf: 'number' },
    loses: { selector: '.fs-table-text_5', typeOf: 'number' },
    goalsScored: { selector: '.fs-table-text_6', typeOf: 'number' },
    goalsConceded: { selector: '.fs-table-text_7', typeOf: 'number' },
    cardsYellow: { selector: '.fs-table-text_8', typeOf: 'number' },
    cardsRed: { selector: '.fs-table-text_9', typeOf: 'number' }
  }
  function getTeamFrom({ name }) {
    const { presidentId, ...resOfTeam } = TEAMS.find((t) => t.name === name)
    const president = PRESIDENTS.find((p) => p.id === presidentId)
    return { ...resOfTeam, president }
  }

  const cleanText = (text) =>
    text
      .replace(/\t|\n|\s:/g, '')
      .replace(/.*:/g, ' ')
      .trim()

  const leaderBoard = []
  $rows.each((index, el) => {
    const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTOR).map(
      ([key, { selector, typeOf }]) => {
        const findElement = $(el).find(selector).text()
        const valueCleanText = cleanText(findElement)
        const value =
          typeOf === 'number' ? Number(valueCleanText) : valueCleanText
        return [key, value]
      }
    )
    const { team: teamName, ...leaderboardForTeam } = Object.fromEntries(
      leaderBoardSelectorEntries
    )
    const team = getTeamFrom({ name: teamName })
    leaderBoard.push({ ...leaderboardForTeam, team })
  })
  return leaderBoard
}
const leaderboardresult = await getLeaderBoard()

await writeFile('leaderboard.json', leaderboardresult, 'DB_URL')
