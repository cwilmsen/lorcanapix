import { Command }  from "commander";
import figlet  from 'figlet';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const program = new Command();

console.log(figlet.textSync("Dir Manager"));

const LORCANA_BASE = 'https://api.lorcana-api.com'
const SETS_PATH = 'sets/fetch'

program
  .version("1.0.0")
  .description("Lorcana image getter")
  .option("-l, --ls  [value]", "List directory contents")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .option("--list-sets", "Show available sets")

program.command('list')
  .description('Show available sets')
  .action(async (str, options) => {
    try {
      const response = await axios.get(`${LORCANA_BASE}/${SETS_PATH}`);
      console.log(response.data);
    } catch (e) {
      console.error('There was an error', e);
    }
  })

const options = program.opts();
// async function main() {
//   await program.parseAsync(process.argv);
// }

program.parse(process.argv)
