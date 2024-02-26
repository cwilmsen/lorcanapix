import { Command }  from "commander";
import figlet  from 'figlet';
import fs from 'fs';
import axios from 'axios';

const program = new Command();

console.log(figlet.textSync("LorcanaPix"));

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

const saveLorcanaImage = async (directory: string, card: Card) => {
  const imageUrl = card.Image;
  const imageFilename = `${card.Card_Num}_${card.Name.replace(/\s/g, '-')}.png`
  const response = await axios({
    method: 'get',
    url: imageUrl,
    responseType: 'stream'
  });
  console.log(`Saving ${imageUrl} to ${imageFilename}`)
  await fs.promises.writeFile(`${directory}/${imageFilename}`, response.data);
  await new Promise(r => setTimeout(r, 2000));
}

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

      console.log(cardsFromSet);
    } catch(e) {
      console.error('Error getting cards', e);
    }
  })

program.command('save-card-images')
  .description ('List cards')
  .requiredOption('-s, --set <number>', 'Filter by set number')
  .requiredOption('-l, --location <value>', 'Location to save cards', './lorcana-card-images')
  .action(async (str, options) => {
    try {
      const {data: cards} = await axios.get<Card[]>(`${LORCANA_BASE}/${CARDS_PATH}`);
      const opts = options.opts();
      console.log(opts);
      const set = opts.set ? Number(opts.set) : 1;
      const directory = opts.location ?? './lorcana-card-images'
      const cardsFromSet = cards.filter(card => card.Set_Num === set)
      console.log(`Found ${cardsFromSet.length} cards from set number ${set}`);

      if (!fs.existsSync(directory)) {
        console.log(`Making directory ${directory} to put files in`);
        fs.mkdirSync(directory);
      } else {
        console.log(`Using existing directory ${directory} to put files in`);
      }

      for (const card of cardsFromSet) {
        await saveLorcanaImage(directory, card);
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch(e) {
      console.error('Error getting cards', e);
    }
  })

program.parse(process.argv)
