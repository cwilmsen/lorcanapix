import { Command }  from "commander";
import figlet  from 'figlet';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const program = new Command();

console.log(figlet.textSync("Dir Manager"));

const LORCANA_BASE = 'https://api.lorcana-api.com';
const SETS_PATH = 'sets/fetch';
const CARDS_PATH = 'cards/fetch';

program
  .version("1.0.0")
  .description("Lorcana image getter")
  .option("-l, --ls  [value]", "List directory contents")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .option("--list-sets", "Show available sets")

program.command('list-sets')
  .description('Show available sets')
  .action(async (str, options) => {
    try {
      const response = await axios.get(`${LORCANA_BASE}/${SETS_PATH}`);
      console.log(response.data);
    } catch (e) {
      console.error('There was an error', e);
    }
  })

program.command('list-cards')
  .description ('List cards')
  .option('-s, --set [value]', 'Filter by set number')
  .action(async (str, options) => {
    try {
      const {data: cards} = await axios.get(`${LORCANA_BASE}/${CARDS_PATH}`);
      console.log(cards[0]);
    } catch(e) {
      console.error('Error getting cards', e);
    }
  })

program.parse(process.argv)
