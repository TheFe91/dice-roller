# Dice Roller
A Discord bot to roll dices and display results with fancy dice images

### Usage
Using the bot is very simple.<br>
First add the bot to your Discord server by clicking [here](https://discord.com/oauth2/authorize?client_id=792697648150872064&scope=bot) .<br>

* To roll a dice, type:
  * `!roll <formula>` to roll a set of 1 or more dices (excluded the percentual dice)
  * `!roll% <type>` to roll a percentual dice

* To flip one or more coins type:
  * `!flipcoin <number of coins>`
    
If at any time you need this manual, simply type `!help`

### Calculating the formula
The formula is a string representing how much and what type of dice(s) you want to roll.<br>
<br>
The available dice formats are:
* `d4` - A `4-faces` dice: results go `from 1 to 4`
* `d6` - A `6-faces` dice: results go `from 1 to 6`
* `d8` - A `8-faces` dice: results go `from 1 to 8`
* `d10` - A `10-faces` dice: results go `from 1 to 10`
* `d12` - A `12-faces` dice: results go `from 1 to 12`
* `d20` - A `20-faces` dice: results go `from 1 to 20`
<br>
<br>
The string is obtained by writing a series of `<number of dices><type of dice>` separated by a `+` sign.<br>
So for example if I want to roll `3 dices of 4 faces and 2 dices of 8 faces`, my formula will be: `3d4+2d8`.<br>
<br>
There's no limitation on the number of dices you can roll.<br>
You can add also one or more `extra values` that will be sum on the resulting roll: to do this just add a plain integer number:<br>
`3d4+2d8+5` will result in a number between 10 and 33 (because the minimum with 3d4 is 3, the minimum with 2d8 is 2, so `3+2+5=10`, the maximum is `12+16+5=33`).<br>
Once again there's no limitation on the number of extra values you can put: for example `3d4+5+8d10+2+1d20+3` is a valid formula.<br>

### Errors
The bot will check if the syntax of the formula is correct, giving an error if it isn't. Examples of errors are:
* `3d4+4d8+15k`  <== Invalid string (15k)
* `3d4+4d8+15d3` <== Invalid dice type (d3)

### Percentual dices
To roll a percentual dice, use, as `<type>`, "rounded" to get a dozen integer `from 00 to 90`, "unrounded" to get an integer `from 1 to 99`

### Contributing
Issues are welcome, PRs even more! Feel free to contribute to the project if you want to, and don't forget to add your name under the collaborators under here!

## Credits
Alessandro Defendenti (Rollercoders Team): idea and coding<br>
Tommaso Misani: dices graphics<br>

[here]: https://discord.com/oauth2/authorize?client_id=792697648150872064&scope=bot
