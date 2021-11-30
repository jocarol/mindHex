export { }

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const Scraper = require('images-scraper')
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const request = require('request');

router.use(logger);

const google = new Scraper({
  puppeteer: {
    headless: true,
    tbs: {  // every possible tbs search option, some examples and more info: http://jwebnet.net/advancedgooglesearch.html
      itp: 'photo',
      // ic: '',// options: color, gray, trans
    },
    safe: false   // enable/disable safe search
  },
});

// Create a fonction that takes 'imgUrls' array and download them to a temporary folder
// Then return the path of the folder
const img2Temp = (imgUrls: String[]) => {
  return new Promise((resolve, reject) => {
    const tempFolder = './temp/';
    
    // filter out imgUrls that are not images
    const imgUrlsFiltered = imgUrls.filter((url: String) => {
      return url.includes('.jpg') || url.includes('.png') || url.includes('.jpeg');
    });

    // console.log(imgUrlsFiltered);

    mkdirp(tempFolder, (err: any) => {
      if (err) {
        reject(err);
      } else {
        // Download images to temp folder
        imgUrlsFiltered.forEach(imgUrl => {
          const fileName = path.basename(imgUrl);
          const filePath = path.join(tempFolder, fileName);
          const file = fs.createWriteStream(filePath);

          console.log('filename :' + fileName)

          // console.log(`filename: ${fileName} | filepath: ${filePath}`);
          request(imgUrl).pipe(file);
        });
        // Return temp folder path
        resolve(tempFolder);
      }
    });
  });
}

// What does reequest.pipe do?


const imageRequest = async (query: String) => {
  const results = await google.scrape(query, 10);
  // From 'results', filter only the 'url' property
  const urls = results.map((result: { url: any; }) => result.url);
  console.log(img2Temp(urls));
};

// const getAverageHex = (imgUrls: String[]) => {
//   // returns the average hex color of images in 'imgUrls' array
//   const hexValues = imgUrls.map(url => {
//     const image = colorThief.getColor(url)
//     return image
//   });

  // console.log(hexValues);

//   const averageHex = hexValues.reduce((acc, cur) => {
//     const [r, g, b] = cur;
//     return [acc[0] + r, acc[1] + g, acc[2] + b];
//   }, [0, 0, 0])
//     .map((val: number) => val / hexValues.length)
//     .map((val: number) => Math.round(val).toString(16))
//     .map((val: string | any[]) => val.length === 1 ? '0' + val : val)
//     .join('');
//   return averageHex;

// }

router.post('/', async (req: { body: any; }, res: { send: (arg0: any) => void; }) => {
  const { searchString } = req.body
  const searchResult = await imageRequest(searchString)
  res.send(searchResult)
})

module.exports = router;