# Quizalize codebase

### How to run the project

To run the project you'll need the following tools
- Node v0.10 or more
- [Webpack](https://webpack.github.io/)
- [Flow](http://www.flowtype.org) (`npm install flow-bin -g`)
- [Gulp](http://gulpjs.com/)
- [Nodemon](http://nodemon.io/)


Recommended IDE / Editor
- Atom with Atom Linter and ESLint

Additionally, you'll need a set of ENV variables to be able to use the project.

### Running the project

1. Start node server by calling `nodemon app`
2. Start FE server by calling `node webpack.server.js`
3. Open a browser and point it to `http://localhost:3001`

### Code style
Although not strictly, we try to follow [AirBnb javascript Style Guide](https://github.com/airbnb/javascript).
Also using flow for type safety is highly encouraged. Once a commit is made our CI will run flow and throw error in the case it detects some issues. 
