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

type Set = {
  Set_Num: number;
  Release_Date: string;
  Cards: number;
  Name: string;
  Set_ID: string;
}

type Card = {
  Artist: string;
  Set_Name: string;
  Set_Num: number;
  Color: 'Amber'|'something';
  Image: string;
  Cost: number;
  Inkable: boolean;
  Name: string;
  Type: 'Action'|'something';
  Rarity: 'Uncommon'|'something';
  Flavor_Text: string;
  Card_Num: number;
  Body_Text: string;
  Set_ID: 'INK' | 'SOMETHING';
}

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
      const response = await axios.get<Set[]>(`${LORCANA_BASE}/${SETS_PATH}`);
      console.log(response.data);
    } catch (e) {
      console.error('There was an error', e);
    }
  })

program.command('list-cards')
  .description ('List cards')
  .requiredOption('-s, --set <number>', 'Filter by set number')
  .action(async (str, options) => {
    try {
      const {data: cards} = await axios.get<Card[]>(`${LORCANA_BASE}/${CARDS_PATH}`);
      const opts = options.opts();
      const set = opts.set ? Number(opts.set) : 1;
      const cardsFromSet = cards.filter(card => card.Set_Num === set)
      console.log(`Found ${cardsFromSet.length} cards from set number ${set}`);

    } catch(e) {
      console.error('Error getting cards', e);
    }
  })

program.parse(process.argv)
