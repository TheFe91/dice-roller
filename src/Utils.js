/* eslint-disable max-len */

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
To roll a dice, type:
\`!roll <formula>\` to roll a set of 1 or more dices (excluded the percentual dice)
\`!roll% <type>\` to roll a percentual dice

To flip one or more coins type:
\`!flipcoin <number of coins>\`

The formula is a string representing how much and what type of dice(s) you want to roll.

The available dice formats are:
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

The bot will check if the syntax of the formula is correct, giving an error if it isn't. Examples of errors are:
\`3d4+4d8+15k\`  <== Invalid string (15k)
\`3d4+4d8+15d3\` <== Invalid dice type (d3)

To roll a percentual dice, use, as <type>, "rounded" to get a dozen integer \`from 00 to 90\`, "unrounded" to get an integer \`from 1 to 99\`
    `,
  );
};

const unlinkTmpImg = (channel) => fs.unlink('./tmp.png', ((err) => {
  if (err !== null) {
    console.error(err);
    channel.send('An error occurred. Please report to the devs');
  }
}));

const flipCoins = (channel, noc) => {
  if (Number.isNaN(Number(noc))) {
    channel.send('The number of coin is invalid!');
    return;
  }

  const attachments = [...Array(Number(noc))].reduce((acc) => {
    const singleRes = getRandomInt(0, 1);
    return [...acc, `./src/assets/d2/${singleRes}.png`];
  }, []);

  mergeImg(attachments).then((img) => img.write('./tmp.png', () => {
    channel.send(
      Number(noc) > 1 ? 'Here are your coins:' : 'Here is your coin:',
      new MessageAttachment('./tmp.png'),
    ).then(() => unlinkTmpImg(channel));
  }));
};

const rollDices = (channel, formula) => {
  if (!(formula.match(/^[0-9+d%]*$/))) {
    channel.send('Your formula is invalid! Please insert only numbers (0-9) separated by +');
    return;
  }

  const parts = formula.split('+');
  const allowedDices = ['4', '6', '8', '10', '12', '20'];
  const rolls = parts.filter((part) => part.includes('d'));
  const notAllowed = rolls.filter((part) => !allowedDices.includes(part.split('d')[1]));
  if (notAllowed.length > 0) {
    channel.send('Your formula is invalid! Please insert only valid dice types (4-6-8-10-12-20)');
    return;
  }

  const extras = parts.filter((part) => !part.includes('d')).reduce((acc, el) => acc + Number(el), 0);

  const { attachments, total } = rolls.reduce((acc, el) => {
    const nod = el.split('d')[0]; // nod: number of dice
    const tod = el.split('d')[1]; // tod: type of dice

    return [...Array(Number(nod))].reduce(({ total: t, attachments: a }) => {
      const singleRes = getRandomInt(1, tod);
      return { total: t + singleRes, attachments: [...a, `./src/assets/d${tod}/${singleRes}.png`] };
    }, acc);
  }, { attachments: [], total: 0 });

  const grandTotal = total + extras;
  mergeImg(attachments).then((img) => img.write('./tmp.png', () => {
    channel.send('Here are your dices:');
    channel.send('', new MessageAttachment('./tmp.png')).then(() => {
      if (extras > 0) {
        channel.send(
          `Your **extra** is ${extras}, so your **total** is **${grandTotal}**`,
        ).then(() => unlinkTmpImg(channel));
      } else {
        channel.send(`Your **total** is **${grandTotal}**`).then(() => unlinkTmpImg(channel));
      }
    });
  }));
};

const rollPerc = (channel, type) => {
  if (type !== 'rounded' && type !== 'unrounded') {
    channel.send('The type is invalid! Please enter "rounded" or "unrounded"');
    return;
  }

  if (type === 'rounded') {
    const result = getRandomInt(0, 9) * 10;
    channel.send(
      `Your result is ${result}%`,
      new MessageAttachment(`./src/assets/d%/${result}.png`),
    );
  } else {
    const units = getRandomInt(0, 9);
    const dozens = getRandomInt(0, 9) * 10;
    const total = dozens + units;
    const images = [`./src/assets/d%/${dozens}.png`, `./src/assets/d10/${units}.png`];
    mergeImg(images).then((img) => img.write('./tmp.png', () => {
      channel.send(
        `Your result is ${total}%`,
        new MessageAttachment('./tmp.png'),
      ).then(() => unlinkTmpImg(channel));
    }));
  }
};

const dispatchBotCommand = (channel, content) => {
  const parts = content.split(' ');
  const command = parts[0];
  switch (command) {
    case '!help':
      printActions(channel);
      break;
    case '!flipcoins':
      flipCoins(channel, parts[1]);
      break;
    case '!roll':
      rollDices(channel, parts[1]);
      break;
    case '!roll%':
      rollPerc(channel, parts[1]);
      break;
    default:
      channel.send(`I'm sorry, but "**${command}**" is an ***undefined*** command. Please, try again`);
      break;
  }
};

const removeMentions = (message) => {
  const { mentions: { users } } = message;
  const mentions = Array.from(users.keys());

  let content = message.content.toLowerCase().trim();

  mentions.forEach((mention) => {
    content = content.replace(`<@!${mention}>`, '');
  });

  return content.trim();
};

const incomingMessageCallback = (message) => {
  const { channel } = message;
  const cleanedContent = removeMentions(message);

  dispatchBotCommand(channel, cleanedContent);
};

export {
  incomingMessageCallback,
  log,
};
