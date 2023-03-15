const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const app = express();
const PORT = 3000;

// Connect to MongoDB using mongoose
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/acronymApp');
    console.log('Connected to database');
  } catch (err) {
    console.log('Error connecting to database', err);
  }
};
connectDB();

app.engine('ejs', ejsMate);

const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

// import Acronym schema from models
const Acronym = require('./models/acronym');

// create a helper function to check if there is acronymId is present in db
const checkAcronymId = (req, res, next) => {
  const { acronymID } = req.params;
  if (!acronymID) return res.status(400).send('Acronym ID is required');
  next();
};
app.get('/acronyms', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i');
    const acronyms = await Acronym.find({
      $or: [{ acronym: regex }, { definition: regex }],
    });

    // paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const pageResults = acronyms.slice(startIndex, endIndex);

    // response headers indicate if there are more results
    const hasMoreResults = acronyms.length > endIndex;
    res.setHeader('hasMoreResults', hasMoreResults);

    res.render('acronyms/index', {
      acronyms: pageResults,
      limit,
      search,
      page,
      hasMoreResults,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error getting acronyms');
  }
});

app.get('/acronyms/new', (req, res) => {
  res.render('acronyms/new');
});

app.post('/acronyms', async (req, res) => {
  try {
    const { acronym, definition } = req.body;
    if (!acronym || !definition) {
      return res.status(400).send('Acronym and definition are required');
    }
    const newAcronym = new Acronym({ acronym, definition });
    await newAcronym.save();
    res.redirect(`/acronyms/${newAcronym._id}`);
  } catch (err) {
    console.log(err);
  }
});

app.get('/acronyms/:acronymID', checkAcronymId, async (req, res) => {
  try {
    const { acronymID } = req.params;
    const acronym = await Acronym.findById(acronymID);
    res.render('acronyms/show', { acronym });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error getting acronym');
  }
});
app.get('/acronyms/:acronymID/:edit', checkAcronymId, async (req, res) => {
  try {
    const { acronymID } = req.params;
    const acronym = await Acronym.findById(acronymID);
    res.render('acronyms/edit', { acronym });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error getting acronym');
  }
});

app.patch('/acronyms/:acronymID', checkAcronymId, async (req, res) => {
  try {
    const { acronymID } = req.params;
    const { acronym, definition } = req.body;
    if (!acronym || !definition) {
      return res.status(400).send('Acronym and definition are required');
    }
    const updatedAcronym = await Acronym.findByIdAndUpdate(
      acronymID,
      { acronym, definition },
      { runValidators: true, new: true },
    );
    res.redirect(`/acronyms/${updatedAcronym._id}`);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error updating acronym');
  }
});

app.delete('/acronyms/:acronymID', checkAcronymId, async (req, res) => {
  try {
    const { acronymID } = req.params;
    await Acronym.findByIdAndDelete(acronymID);
    res.redirect('/acronyms');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting acronym');
  }
});

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});
