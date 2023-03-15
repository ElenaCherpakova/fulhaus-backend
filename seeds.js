const Acronym = require('./models/acronym');

const seedAcronyms = [
  {
    acronym: '2B',
    definition: 'To be',
  },
  {
    acronym: '2EZ',
    definition: 'Too easy',
  },
  {
    acronym: '2G2BT',
    definition: 'Too good to be true',
  },
];

Acronym.insertMany(seedAcronyms)
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

