module.exports = {
	clearMocks: true,
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'clover'],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
	moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
	testMatch: ['**/__tests__/*.+(ts|tsx|js)', '**/*.spec.+(ts|tsx|js)'],
	transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
};
