# MMM-Comics
Based on andrecarluccis MMM-DailyDilbert module, this is a module for MagicMirror<sup>2</sup> that displays daily or random comic strips from famous cartoons.
You can choose to display a coloured and a b/w version of the comic strip (b/w does not always work that well, try it out). 
Additionally you can choose a daily time frame at which the current daily comic is being shown. For the rest of the day, or if the comic is archived, a random comic is picked.

<img src="dilbert.png"></img>

Currently integrated:
  * Dilbert (english and german)
  * xkcd
  * Peanuts
  * Garfield
  * Calvin+Hobbes
  * ruthe (german only)

Further ideas for integration are much appreciated!


## Dependencies
  * A [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror) installation
  * [cheerio](https://github.com/cheeriojs/cheerio) npm package

## Installation
  1. Clone this repo into your `modules` directory.
  2. `cd MMM-Comics && npm install`
  3. Create an entry in your `config.js` file to tell this module where to display on screen.

 **Example config:**
```
  {
    module: 'MMM-Comics',
    position: 'middle_center',
    config: {
      comics: ["dilbert", "xkcd", "garfield", "peanuts", "calvin+hobbes"],         
      updateInterval : 1000 * 60 * 30,
      coloredImage: false,
      maxWidth: 500,
      maxHeight: 500,
      timeForDaily: [6, 9],
    }
  },
```

## Config options
| **Option** | **default** | **Description** |
| --- | --- | --- |
| `comics` | ["dilbert", "xkcd", "garfield", "peanuts", "calvin+hobbes"] | Choose between the currently available comics: ["dilbert", "dilbert_de", "xkcd", "peanuts", "garfield", "nichtlustig", "calvin+hobbes", "ruthe"] |
| `updateInterval` | 1000 * 60 * 10 | Set to desired update interval (in ms) (default is 10 minutes). |
| `coloredImage` | false | Colored or black&white (inverted) image |
| `timeForDaily` | [6, 9] | Time frame to show the most recent (or daily) comic. The standard option would equate to 7 - 9 o'clock in the morning. Please use only 24h time formatting!! For any other time you will get a random comic if possible. (Dilbert_de does not provide random comics yet) |
| `maxWidth` | 500 | Maximum width of the comics |
| `maxWidth` | 500 | Maximum height of the comics |
| `debug` | false | Show debug messages |



## Options supported by different comics
| **comic** | **current daily** | **random (archived)** |
| --- | --- | --- |
| dilbert | x | x |
| xkcd | '* | x |
| peanuts | ** | x |
| garfield | x | x |
| calvin+hobbes | ** | x |
| dilbert_de | x | - |
| ruthe | - | x |

 '* xkcd only provides a new comic on Mondays, Wednesday and Fridays.
 '** these have a "daily" function but this is only an archived comic.


This module is based on andrecarluccis [MMM-DailyDilbert](https://github.com/andrecarlucci/MMM-DailyDilbert), which was inspired by [DailyXKCD](https://github.com/Blastitt/DailyXKCD).
Many thanks to both of them for their great modules!
