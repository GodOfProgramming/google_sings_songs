const translate = require('google-translate-api-x');
const fs = require('fs');

const file = process.argv[2];
const times = process.argv[3] || 10;

async function main(file, times) {
  if (!!file) {
    let song = fs.readFileSync(`raw/${file}`, { encoding: 'utf8', flag: 'r' });

    if (!!song) {
      const langs = Object.keys(translate.languages).filter((k) => isNaN(Number(k)) && k !== 'auto' && k !== 'isSupported' && k !== 'getCode');

      let last = 'en';

      for (let i = 0; i < times; ++i) {
        const next = langs[Math.floor(Math.random() * langs.length)];

        console.log(`converting ${translate.languages[last]} to ${translate.languages[next]}`);
        const res = await translate(song, { from: last, to: next });

        song = res.text;
        last = next;
      }

      console.log(`converting ${translate.languages[last]} to English`);
      const res = await translate(song, { from: last, to: 'en' });

      fs.writeFileSync(`conv/${file}`, res.text, { encoding: 'utf8', flag: 'w+' });
    } else {
      console.log("file was empty");
    }
  } else {
    console.log("no file given");
  }
}

main(file, times);
