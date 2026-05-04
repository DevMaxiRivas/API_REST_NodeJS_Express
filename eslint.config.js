import js from '@eslint/js'

export default [
    js.configs.recommended, // Uses ESLint's recommended rules [20]
    {
        rules: {
            'parserOptions': {
                'ecmaVersion': 2022
            }
        }
    }
]
