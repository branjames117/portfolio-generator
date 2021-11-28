const fs = require('fs');
const generatePage = require('./src/page-template');

const profileDataArgs = process.argv.slice(2, process.argv.length);

const [username, github] = profileDataArgs;

fs.writeFile('index.html', generatePage(username, github), (err) => {
  if (err) throw err;

  console.log('Portfolio complete! Check out index.html to see the output!');
});
