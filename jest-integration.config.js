/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: "node",
	rootDir: "tests",
	transform: {
		"^.+.tsx?$": ["ts-jest", {}],
	},
	moduleNameMapper: {
		"^@app/(.*)$": "<rootDir>/../src/$1",
	},
};
