const { testMatch } = require("./jest.unit.config");

module.exports = {
    testMatch: ['**/src/integration/**/*.test.js'],
    testEnviromentent: 'node',
    maxWorkers: 1
}