module.exports = {
  //preset: 'ts-jest',
  //testEnvironment: 'node',
  moduleFileExtensions: ["ts","js"],
  transform: { "^.+\\.ts?$": "ts-jest" },
  testRegex: "src/.*\\.(spec|test)?\\.(ts|js)$",
  moduleNameMapper: {
    "api": "<rootDir>/src/api"
  }
};