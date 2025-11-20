const mongoose = require('mongoose');
const Movie = require('../models/Movie');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const sampleMovies = [
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genre: ["Action", "Sci-Fi", "Thriller"],
    year: 2010,
    rating: 8.8,
    duration: 148,
    poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    director: "Christopher Nolan",
    cast: [
      { name: "Leonardo DiCaprio", character: "Dom Cobb" },
      { name: "Marion Cotillard", character: "Mal Cobb" },
      { name: "Tom Hardy", character: "Eames" }
    ],
    hint: "Dreams within dreams",
    quote: "What's the most resilient parasite? An idea.",
    featured: true
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: ["Action", "Crime", "Drama"],
    year: 2008,
    rating: 9.0,
    duration: 152,
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
    trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
    director: "Christopher Nolan",
    cast: [
      { name: "Christian Bale", character: "Bruce Wayne / Batman" },
      { name: "Heath Ledger", character: "Joker" },
      { name: "Aaron Eckhart", character: "Harvey Dent" }
    ],
    hint: "Why so serious?",
    quote: "Why so serious?",
    featured: true
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    year: 2014,
    rating: 8.6,
    duration: 169,
    poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg",
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
    director: "Christopher Nolan",
    cast: [
      { name: "Matthew McConaughey", character: "Cooper" },
      { name: "Anne Hathaway", character: "Brand" },
      { name: "Jessica Chastain", character: "Murph" }
    ],
    hint: "Time is relative",
    quote: "Do not go gentle into that good night.",
    featured: true
  },
  {
    title: "The Godfather",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    genre: ["Crime", "Drama"],
    year: 1972,
    rating: 9.2,
    duration: 175,
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    trailerUrl: "https://www.youtube.com/embed/UaVTIH8mujA",
    director: "Francis Ford Coppola",
    cast: [
      { name: "Marlon Brando", character: "Don Vito Corleone" },
      { name: "Al Pacino", character: "Michael Corleone" },
      { name: "James Caan", character: "Sonny Corleone" }
    ],
    hint: "Make him an offer",
    quote: "I'm gonna make him an offer he can't refuse.",
    featured: true
  },
  {
    title: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    genre: ["Crime", "Drama"],
    year: 1994,
    rating: 8.9,
    duration: 154,
    poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg",
    trailerUrl: "https://www.youtube.com/embed/s7EdQ4FqbhY",
    director: "Quentin Tarantino",
    cast: [
      { name: "John Travolta", character: "Vincent Vega" },
      { name: "Samuel L. Jackson", character: "Jules Winnfield" },
      { name: "Uma Thurman", character: "Mia Wallace" }
    ],
    hint: "Royale with cheese",
    quote: "Say 'what' again. Say 'what' again, I dare you, I double dare you motherfucker, say what one more Goddamn time!",
    featured: true
  },
  {
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    genre: ["Action", "Sci-Fi"],
    year: 1999,
    rating: 8.7,
    duration: 136,
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/7u3pxc0K1wx32IleAkLv78MKgrw.jpg",
    trailerUrl: "https://www.youtube.com/embed/vKQi3bBA1y8",
    director: "The Wachowskis",
    cast: [
      { name: "Keanu Reeves", character: "Neo" },
      { name: "Laurence Fishburne", character: "Morpheus" },
      { name: "Carrie-Anne Moss", character: "Trinity" }
    ],
    hint: "Red pill or blue pill",
    quote: "There is no spoon.",
    featured: true
  },
  {
    title: "Forrest Gump",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    genre: ["Drama", "Romance"],
    year: 1994,
    rating: 8.8,
    duration: 142,
    poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/7c9UVPPiTPltouxRVY6N9uugaVA.jpg",
    trailerUrl: "https://www.youtube.com/embed/bLvqoHBptjg",
    director: "Robert Zemeckis",
    cast: [
      { name: "Tom Hanks", character: "Forrest Gump" },
      { name: "Robin Wright", character: "Jenny Curran" },
      { name: "Gary Sinise", character: "Lieutenant Dan Taylor" }
    ],
    hint: "Life is like a box of chocolates",
    quote: "Life is like a box of chocolates. You never know what you're gonna get.",
    featured: true
  },
  {
    title: "Titanic",
    description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
    genre: ["Drama", "Romance"],
    year: 1997,
    rating: 7.9,
    duration: 194,
    poster: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/4m1Au3YkjqsxF8iwQy0fPYSxE0h.jpg",
    trailerUrl: "https://www.youtube.com/embed/kVrqfYjkVdQ",
    director: "James Cameron",
    cast: [
      { name: "Leonardo DiCaprio", character: "Jack Dawson" },
      { name: "Kate Winslet", character: "Rose DeWitt Bukater" },
      { name: "Billy Zane", character: "Caledon 'Cal' Hockley" }
    ],
    hint: "I'm flying",
    quote: "I'm the king of the world!",
    featured: true
  },
  {
    title: "Avengers: Endgame",
    description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
    genre: ["Action", "Adventure", "Drama"],
    year: 2019,
    rating: 8.4,
    duration: 181,
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    trailerUrl: "https://www.youtube.com/embed/TcMBFSGVi1c",
    director: "Anthony Russo, Joe Russo",
    cast: [
      { name: "Robert Downey Jr.", character: "Tony Stark / Iron Man" },
      { name: "Chris Evans", character: "Steve Rogers / Captain America" },
      { name: "Mark Ruffalo", character: "Bruce Banner / Hulk" }
    ],
    hint: "I am Iron Man",
    quote: "I am inevitable.",
    featured: true
  },
  {
    title: "Spider-Man: No Way Home",
    description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
    genre: ["Action", "Adventure", "Fantasy"],
    year: 2021,
    rating: 8.2,
    duration: 148,
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    trailerUrl: "https://www.youtube.com/embed/JfVOs4VSpmA",
    director: "Jon Watts",
    cast: [
      { name: "Tom Holland", character: "Peter Parker / Spider-Man" },
      { name: "Zendaya", character: "MJ" },
      { name: "Benedict Cumberbatch", character: "Doctor Strange" }
    ],
    hint: "With great power comes great responsibility",
    quote: "With great power comes great responsibility.",
    featured: true
  },

    {
    title: "Fight Club",
    description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something far more dangerous.",
    genre: ["Drama"],
    year: 1999,
    rating: 8.8,
    duration: 139,
    poster: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg",
    trailerUrl: "https://www.youtube.com/embed/qtRKdVHc-cE",
    director: "David Fincher",
    cast: [
      { name: "Brad Pitt", character: "Tyler Durden" },
      { name: "Edward Norton", character: "The Narrator" },
      { name: "Helena Bonham Carter", character: "Marla Singer" }
    ],
    hint: "The first rule...",
    quote: "The first rule of Fight Club is: You do not talk about Fight Club.",
    featured: false
},
{
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    genre: ["Drama"],
    year: 1994,
    rating: 9.3,
    duration: 142,
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
    trailerUrl: "https://www.youtube.com/embed/6hB3S9bIaco",
    director: "Frank Darabont",
    cast: [
      { name: "Tim Robbins", character: "Andy Dufresne" },
      { name: "Morgan Freeman", character: "Ellis 'Red' Redding" },
      { name: "Bob Gunton", character: "Warden Norton" }
    ],
    hint: "Hope is a dangerous thing",
    quote: "Get busy living, or get busy dying.",
    featured: false
},
{
    title: "The Lord of the Rings: The Return of the King",
    description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom.",
    genre: ["Adventure", "Fantasy"],
    year: 2003,
    rating: 8.9,
    duration: 201,
    poster: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/9DeGfFIqjph5CBFVQrD6wv9S7rR.jpg",
    trailerUrl: "https://www.youtube.com/embed/r5X-hFf6Bwo",
    director: "Peter Jackson",
    cast: [
      { name: "Elijah Wood", character: "Frodo Baggins" },
      { name: "Viggo Mortensen", character: "Aragorn" },
      { name: "Ian McKellen", character: "Gandalf" }
    ],
    hint: "One ring to rule them all",
    quote: "There can be no triumph without loss.",
    featured: false
},
{
    title: "The Social Network",
    description: "The story of the founders of the social networking website Facebook.",
    genre: ["Drama"],
    year: 2010,
    rating: 7.7,
    duration: 120,
    poster: "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/ok5p3py5Gq8NfBqb0eTgJYf2J6x.jpg",
    trailerUrl: "https://www.youtube.com/embed/lB95KLmpLR4",
    director: "David Fincher",
    cast: [
      { name: "Jesse Eisenberg", character: "Mark Zuckerberg" },
      { name: "Andrew Garfield", character: "Eduardo Saverin" },
      { name: "Justin Timberlake", character: "Sean Parker" }
    ],
    hint: "You don't get 500 million friends...",
    quote: "If you were the inventors of Facebook, you'd have invented Facebook.",
    featured: false
},
{
    title: "Joker",
    description: "A mentally troubled comedian embarks on a downward spiral that leads to the creation of the infamous DC villain.",
    genre: ["Crime", "Drama", "Thriller"],
    year: 2019,
    rating: 8.4,
    duration: 122,
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    trailerUrl: "https://www.youtube.com/embed/zAGVQLHvwOY",
    director: "Todd Phillips",
    cast: [
      { name: "Joaquin Phoenix", character: "Arthur Fleck" },
      { name: "Robert De Niro", character: "Murray Franklin" },
      { name: "Zazie Beetz", character: "Sophie Dumond" }
    ],
    hint: "Put on a happy face",
    quote: "Is it just me, or is it getting crazier out there?",
    featured: false
},
{
    title: "Gladiator",
    description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    genre: ["Action", "Drama"],
    year: 2000,
    rating: 8.5,
    duration: 155,
    poster: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/5vKjPZz1jMvJ8d6Y3ZKJaMmrHGX.jpg",
    trailerUrl: "https://www.youtube.com/embed/P5ieIbInFpg",
    director: "Ridley Scott",
    cast: [
      { name: "Russell Crowe", character: "Maximus" },
      { name: "Joaquin Phoenix", character: "Commodus" },
      { name: "Connie Nielsen", character: "Lucilla" }
    ],
    hint: "Strength and honor",
    quote: "Are you not entertained?",
    featured: false
},
{
    title: "The Wolf of Wall Street",
    description: "Based on the true story of Jordan Belfort, detailing his rise to a wealthy stockbroker living the high life and his fall involving crime, corruption, and the federal government.",
    genre: ["Biography", "Comedy", "Crime"],
    year: 2013,
    rating: 8.2,
    duration: 180,
    poster: "https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXhBqOdf1tlhN.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/6ahK2NHNqMTg4iFqGq1ZVAvAL9v.jpg",
    trailerUrl: "https://www.youtube.com/embed/iszwuX1AK6A",
    director: "Martin Scorsese",
    cast: [
      { name: "Leonardo DiCaprio", character: "Jordan Belfort" },
      { name: "Jonah Hill", character: "Donnie Azoff" },
      { name: "Margot Robbie", character: "Naomi Lapaglia" }
    ],
    hint: "Sell me this pen",
    quote: "Let me tell you something — there is no nobility in poverty.",
    featured: false
},
{
    title: "Avatar",
    description: "A paraplegic Marine dispatched to the moon Pandora becomes torn between following his orders and protecting the world he feels is his home.",
    genre: ["Action", "Adventure", "Fantasy"],
    year: 2009,
    rating: 7.9,
    duration: 162,
    poster: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/oqsagC6aUUscMEaGC1vVnJ0skw8.jpg",
    trailerUrl: "https://www.youtube.com/embed/5PSNL1qE6VY",
    director: "James Cameron",
    cast: [
      { name: "Sam Worthington", character: "Jake Sully" },
      { name: "Zoe Saldana", character: "Neytiri" },
      { name: "Sigourney Weaver", character: "Dr. Grace Augustine" }
    ],
    hint: "I see you",
    quote: "Everything is backward now.",
    featured: false
},
{
    title: "Whiplash",
    description: "A promising young drummer enrolls in a music conservatory where he is mentored by an instructor who will stop at nothing to realize a student's potential.",
    genre: ["Drama", "Music"],
    year: 2014,
    rating: 8.5,
    duration: 107,
    poster: "https://image.tmdb.org/t/p/w500/oPxnRhyAiS2MB8pqi6zbw0mMVvO.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/1vYZc7gcnEwlFazlWZ1d3yGwaOl.jpg",
    trailerUrl: "https://www.youtube.com/embed/7d_jQycdQGo",
    director: "Damien Chazelle",
    cast: [
      { name: "Miles Teller", character: "Andrew Neiman" },
      { name: "J.K. Simmons", character: "Terence Fletcher" },
      { name: "Paul Reiser", character: "Jim Neiman" }
    ],
    hint: "Not quite my tempo",
    quote: "There are no two words in the English language more harmful than 'good job'.",
    featured: false
},
{
    title: "Dune",
    description: "Paul Atreides leads nomadic tribes in a battle to control the desert planet Arrakis and its valuable resource, spice.",
    genre: ["Sci-Fi", "Adventure"],
    year: 2021,
    rating: 8.1,
    duration: 155,
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/eeijXm3553xvuFbkPFkDG6CLCbQ.jpg",
    trailerUrl: "https://www.youtube.com/embed/n9xhJrPXop4",
    director: "Denis Villeneuve",
    cast: [
      { name: "Timothée Chalamet", character: "Paul Atreides" },
      { name: "Zendaya", character: "Chani" },
      { name: "Rebecca Ferguson", character: "Lady Jessica" }
    ],
    hint: "Fear is the mind-killer",
    quote: "I must not fear. Fear is the mind-killer.",
    featured: false
}



];

async function seedMovies() {
  try {
    if (!MONGO_URI) {
      console.error("❌ ERROR: MONGO_URI is missing in .env file!");
      process.exit(1);
    }

    console.log("⏳ Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI, {
      dbName: "netflix-clone",   // ⭐ ensure movies go into correct DB
    });

    console.log("✅ Connected to MongoDB (netflix-clone)");

    console.log("🗑️ Clearing existing movies...");
    await Movie.deleteMany({});
    console.log("✅ Old movies removed");

    console.log("⬆️ Inserting sample movies...");
    await Movie.insertMany(sampleMovies);
    console.log(`✅ Inserted ${sampleMovies.length} movies`);

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedMovies();
