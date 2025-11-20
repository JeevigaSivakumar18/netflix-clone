// Sample data for the mini-games. Uses placeholder images from picsum.photos.
const guessMovies = [
  { id: 'm1', title: 'Inception', image: 'https://picsum.photos/id/1011/600/900' },
  { id: 'm2', title: 'The Matrix', image: 'https://picsum.photos/id/1003/600/900' },
  { id: 'm3', title: 'Interstellar', image: 'https://picsum.photos/id/1025/600/900' },
  { id: 'm4', title: 'Gladiator', image: 'https://picsum.photos/id/1018/600/900' },
  { id: 'm5', title: 'Titanic', image: 'https://picsum.photos/id/1016/600/900' }
];

const triviaQuestions = [
  {
    id: 't1',
    question: 'Which director made the film "Pulp Fiction"?',
    options: ['Quentin Tarantino', 'Martin Scorsese', 'Steven Spielberg', 'Christopher Nolan'],
    answer: 'Quentin Tarantino'
  },
  {
    id: 't2',
    question: 'Which movie introduced the character Tony Stark?',
    options: ['Iron Man', 'The Avengers', 'Captain America', 'Thor'],
    answer: 'Iron Man'
  },
  {
    id: 't3',
    question: 'Which film features the quote "May the Force be with you"?',
    options: ['Star Wars', 'Star Trek', 'The Matrix', 'Blade Runner'],
    answer: 'Star Wars'
  }
];

const quoteQuestions = [
  {
    id: 'q1',
    quote: 'I\'ll be back.',
    options: ['The Terminator', 'Die Hard', 'RoboCop', 'Predator'],
    answer: 'The Terminator'
  },
  {
    id: 'q2',
    quote: 'Here\'s looking at you, kid.',
    options: ['Casablanca', 'Gone with the Wind', 'The Maltese Falcon', 'Citizen Kane'],
    answer: 'Casablanca'
  },
  {
    id: 'q3',
    quote: 'You can\'t handle the truth!',
    options: ['A Few Good Men', 'Top Gun', 'The Firm', 'Rain Man'],
    answer: 'A Few Good Men'
  }
];

export { guessMovies, triviaQuestions, quoteQuestions };
