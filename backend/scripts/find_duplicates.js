const mongoose = require('mongoose');
require('dotenv').config();

const Movie = require('../models/Movie');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI is not set in .env');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'netflix-clone' });
    console.log('Connected to MongoDB');

    console.log('\n1) Searching for duplicate imdbId values...');
    const dupByImdb = await Movie.aggregate([
      { $group: { _id: '$imdbId', count: { $sum: 1 }, ids: { $push: '$_id' } } },
      { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
      { $project: { imdbId: '$_id', count: 1, ids: 1, _id: 0 } }
    ]).allowDiskUse(true);

    if (dupByImdb.length === 0) {
      console.log('  No duplicates found by imdbId.');
    } else {
      console.log('  Duplicates by imdbId found:');
      dupByImdb.forEach(d => {
        console.log(`  imdbId=${d.imdbId} count=${d.count}`);
        console.log('    ids:', d.ids.join(', '));
      });
    }

    console.log('\n2) Searching for duplicate Title + Year pairs...');
    const dupByTitleYear = await Movie.aggregate([
      { $group: { _id: { title: '$title', year: '$year' }, count: { $sum: 1 }, ids: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } },
      { $project: { title: '$_id.title', year: '$_id.year', count: 1, ids: 1, _id: 0 } }
    ]).allowDiskUse(true);

    if (dupByTitleYear.length === 0) {
      console.log('  No duplicates found by title+year.');
    } else {
      console.log('  Duplicates by title+year found:');
      dupByTitleYear.forEach(d => {
        console.log(`  "${d.title}" (${d.year}) count=${d.count}`);
        console.log('    ids:', d.ids.join(', '));
      });
    }

    console.log('\n3) Check if specific problematic _id exists (example from error):');
    const exampleId = '691b2ae03e44dd257b0a968e';
    const found = await Movie.findOne({ _id: mongoose.Types.ObjectId(exampleId) }).lean();
    if (found) {
      console.log(`  Found document with _id=${exampleId}: title="${found.title}" year=${found.year}`);
    } else {
      console.log(`  No document found with _id=${exampleId}.`);
    }

    console.log('\n4) Quick report and safe-delete suggestions:');
    if (dupByImdb.length > 0) {
      console.log('  To remove duplicates by imdbId keep the preferred _id and remove the rest.');
      console.log('  Example mongo shell command (replace <keepId> and <removeId>):');
      console.log("    db.movies.deleteOne({_id: ObjectId('<removeId>')})");
    }

    if (dupByTitleYear.length > 0) {
      console.log('  To remove duplicates by title+year keep the best document (e.g. latest createdAt) and delete others.');
    }

    console.log('\nIf you want, this script can also generate the exact delete commands to remove duplicates while keeping the first entry.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error checking duplicates:', err);
    process.exit(1);
  }
}

run();
