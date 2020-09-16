module.exports = {
	env: {
		node: true,
		browser: true,
		jest: true,
	},
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
	],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	rules: {
		'@typescript-eslint/ban-types': [
			'error',
			{
				types: {
					Function: false,
					Object: false,
				},
			},
		],
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{ vars: 'all', args: 'after-used', ignoreRestSiblings: true },
		],
		'import/no-extraneous-dependencies': ['error'],
		'no-empty': ['error', { allowEmptyCatch: true }],
	},
};
