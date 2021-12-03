const inquirer = require('inquirer');
const generatePage = require('./src/page-template');
const { writeFile, copyFile } = require('./utils/generate-site.js');

// using inquirer package, get basic user data
const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your name? (Required)',
      validate: (nameInput) => {
        if (nameInput) {
          return true;
        } else {
          console.log('Please enter your name!');
          return false;
        }
      },
    },
    {
      type: 'input',
      name: 'github',
      message: 'What is your GitHub username? (Required)',
      validate: (githubInput) => {
        if (githubInput) {
          return true;
        } else {
          console.log('Please enter your GitHub username!');
          return false;
        }
      },
    },
    {
      type: 'confirm',
      name: 'confirmAbout',
      message:
        'Would you like to enter some information about yourself for an "About" section?',
      default: true,
    },
    {
      type: 'input',
      name: 'about',
      message: 'Enter some information about yourself:',
      when: ({ confirmAbout }) => {
        if (confirmAbout) {
          return true;
        } else {
          return false;
        }
      },
    },
  ]);
};

// for each project, gather data on that project
const promptProject = (portfolioData) => {
  // If there are no projects array property, create one
  if (!portfolioData.projects) {
    portfolioData.projects = [];
  }
  console.log(`
=================
Add a New Project
=================
`);
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your project?',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Provide a description of the project (Required)',
        validate: (projectDescription) => {
          if (projectDescription) {
            return true;
          } else {
            console.log('Enter a project description!');
            return false;
          }
        },
      },
      {
        type: 'checkbox',
        name: 'languages',
        message: 'What did you build this project with? (Check all that apply)',
        choices: [
          'JavaScript',
          'HTML',
          'CSS',
          'ES6',
          'jQuery',
          'Bootstrap',
          'Node',
        ],
      },
      {
        type: 'input',
        name: 'link',
        message: 'Enter the GitHub link to your project. (Required)',
        validate: (projectLink) => {
          if (projectLink) {
            return true;
          } else {
            console.log('Enter the URL to your repository!');
            return false;
          }
        },
      },
      {
        type: 'confirm',
        name: 'feature',
        message: 'Would you like to feature this project?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'confirmAddProject',
        message: 'Would you like to enter another project?',
        default: false,
      },
    ])
    .then((projectData) => {
      portfolioData.projects.push(projectData);
      if (projectData.confirmAddProject) {
        return promptProject(portfolioData);
      } else {
        return portfolioData;
      }
    });
};

// promise chain
// first, get basic user data with promptUser()
promptUser()
  // then get projects from promptProject() until user decides to stop
  .then(promptProject)
  // then send that data to the generatePage() function
  .then((portfolioData) => {
    return generatePage(portfolioData);
  })
  // then send the generated HTML to the writeFile() function
  .then((pageHTML) => {
    return writeFile(pageHTML);
  })
  // then copy the stylesheet from /dist
  .then((writeFileResponse) => {
    console.log(writeFileResponse);
    return copyFile();
  })
  // then call it a day
  .then((copyFileResponse) => {
    console.log(copyFileResponse);
  })
  .catch((err) => {
    console.error(err);
  });
