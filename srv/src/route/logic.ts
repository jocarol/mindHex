import { deepStrictEqual } from "assert";

export { }
const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const Scraper = require('images-scraper')

router.use(logger);

const google = new Scraper({
  puppeteer: {
    headless: true,
  },
});

const imageRequest = async (query: String) => {
  const results = await google.scrape(query, 10);
  return results
};

router.post('/', async (req: { body: any; }, res: { send: (arg0: any) => void; }) => {
  const { searchString } = req.body
  const searchResult = await imageRequest(searchString)
  res.send(searchResult)
})

module.exports = router;