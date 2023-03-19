module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
        browser: true,
        jasmine: true
    },
    parserOptions: {
        ecmaVersion: 11,
        requireConfigFile: false
    },
    parser: '@babel/eslint-parser',
    plugins: ['react', 'prettier', 'jasmine'],
    extends: [
        'eslint:recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
        'plugin:jest/recommended',
        'plugin:jasmine/recommended'
    ],
    rules: {
        'react/prop-types': 'off',
        'prettier/prettier': 'warn'
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    overrides: [
        {
            files: ['*.test.js'],
            env: {
                jasmine: true
            },
            plugins: ['jest']
        }
    ]
};
