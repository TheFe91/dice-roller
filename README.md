# Dice Roller
A Discord bot to roll dices and display results with fancy dice images

### Usage
Using the bot is very simple.<br>
First add the bot to your Discord server by clicking [here](https://discord.com/oauth2/authorize?client_id=792697648150872064&scope=bot) .<br>
Then just type `!roll <formula>`, where "formula" is the formula representing your dices.<br>
If at any time you need this manual, simply type `!help`

### Calculating the formula
The formula is a string representing how much and what type of dice(s) you want to roll.<br>
<br>
The available dice formats are:
* `d2` - Basically a coin flip, giving `head` or `tail` as a result. `head` is `1`, `tail` is `0`
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
The bot will only check if the syntax of the formula is correct. However, the wrong type of dices are simply ignored, so for example:<br>
* `3d4+4d8+15k` gives error
* `3d4+4d8+15d3` gives a result between `7 and 44`, because `d3` is not a valid dice, so it is ignored

### Contributing
Issues are welcome, PRs even more! Feel free to contribute to the project if you want to, and don't forget to add your name under the collaborators under here!

## Credits
Alessandro Defendenti (Rollercoders Team): idea and coding
Tommaso Misani: dices graphics

[here]: https://discord.com/oauth2/authorize?client_id=792697648150872064&scope=bot