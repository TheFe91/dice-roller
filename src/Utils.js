import fs from 'fs';
import { MessageAttachment } from 'discord.js';
import mergeImg from 'merge-img';

const getDateTime = (withDate, withTime, timeWithSeconds = false) => {
  const date = new Date();
  let toReturn = '';
  if (withDate) {
    toReturn += `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} `;
  }
  if (withTime) {
    toReturn += `${date.getHours()}:${date.getMinutes()}${timeWithSeconds ? `:${date.getSeconds()}` : ''}`;
  }

  return toReturn;
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const log = (message) => console.log(`${getDateTime(true, true)} - ${message}`);

const printActions = (channel) => {
  channel.send(
    `
To roll a dice type:
\`!roll <formula>\` - Rolls a dice with the given formula
The formula is a string representing how much and what type of dice(s) you want to roll.

The available dice formats are:
\`d2\` - Basically a coin flip, giving \`head\` or \`tail\` as a result. \`head\` is \`1\`, \`tail\` is \`0\`
\`d4\` - A \`4-faces\` dice: results go \`from 1 to 4\`
\`d6\` - A \`6-faces\` dice: results go \`from 1 to 6\`
\`d8\` - A \`8-faces\` dice: results go \`from 1 to 8\`
\`d10\` - A \`10-faces\` dice: results go \`from 1 to 10\`
\`d12\` - A \`12-faces\` dice: results go \`from 1 to 12\`
\`d20\` - A \`20-faces\` dice: results go \`from 1 to 20\`

The string is obtained by writing a series of \`<number of dices><type of dice>\` separated by a \`+\` sign.
So for example if I want to roll \`3 dices of 4 faces and 2 dices of 8 faces\`, my formula will be: \`3d4+2d8\`.
 
There's no limitation on the number of dices you can roll.
You can add also one or more \`extra values\` that will be sum on the resulting roll: to do this just add a plain integer number:
\`3d4+2d8+5\` will result in a number between 10 and 33 (because the minimum with 3d4 is 3, the minimum with 2d8 is 2, so \`3+2+5=10\`, the maximum is \`12+16+5=33\`).
Once again there's no limitation on the number of extra values you can put: for example \`3d4+5+8d10+2+1d20+3\` is a valid formula.

The bot will only check if the syntax of the formula is correct. However, the wrong type of dices are simply ignored, so for example:
\`3d4+4d8+15k\` gives error
\`3d4+4d8+15d3\` gives a result between \`7 and 44\`, because \`d3\` is not a valid dice, so it is ignored 
    `,
  );
};

const unlinkTmpImg = (channel) => fs.unlink('./tmp.png', ((err) => {
  if (err !== null) {
    console.error(err);
    channel.send('An error occurred. Please report to the devs');
  }
}));

const rollDice = (channel, formula) => {
  if (!(formula.match(/^[0-9+d]*$/))) {
    channel.send('Your formula is invalid! Please insert only numbers (0-9) separated by +');
    return;
  }

  const parts = formula.split('+');
  const allowedDices = ['2', '4', '6', '8', '10', '12', '20'];
  const rolls = parts.filter((part) => part.includes('d') && allowedDices.includes(part.split('d')[1]));
  const extras = parts.filter((part) => !part.includes('d')).reduce((acc, el) => acc + parseInt(el, 10), 0);
  let total = 0;
  const attachments = [];
  rolls.forEach((throwing) => {
    const nod = throwing.split('d')[0]; // nod: number of dice
    const tod = throwing.split('d')[1]; // tod: type of dice
    for (let i = 0; i < nod; i += 1) {
      const singleRes = getRandomInt(1, tod);
      attachments.push(`./src/assets/d${tod}/${singleRes}.png`);
      total += singleRes;
    }
  });

  const grandTotal = total + extras;
  mergeImg(attachments).then((img) => img.write('./tmp.png', () => {
    channel.send('Here are your dices:');
    channel.send('', new MessageAttachment('./tmp.png'));
    if (extras > 0) {
      channel.send(`Your extra is ${extras}, so your total is ${grandTotal}`).then(() => unlinkTmpImg(channel));
    } else {
      channel.send(`Your total is ${grandTotal}`).then(() => unlinkTmpImg(channel));
    }
  }));
};

const dispatchBotCommand = (channel, content) => {
  const parts = content.split(' ');
  const command = parts[0];
  switch (command) {
    case '!help':
      printActions(channel);
      break;
    case '!roll':
      rollDice(channel, parts[1]);
      break;
    default:
      break;
  }
};

const incomingMessageCallback = (message) => {
  if (message.author.bot) {
    return;
  }

  const { channel } = message;
  const content = message.content.toLowerCase().trim();

  dispatchBotCommand(channel, content);
};

export {
  incomingMessageCallback,
  log,
};
