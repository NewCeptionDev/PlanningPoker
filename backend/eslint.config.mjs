import config from '@newceptiondev/eslint-config'
import prettier from 'eslint-config-prettier'
import stylistic from '@stylistic/eslint-plugin-ts'

export default [
  ...config,
  prettier,
  {
    plugins: {
      '@stylistic/ts': stylistic,
    },
    rules: {
      'new-cap': [
        'error',
        {
          capIsNewExceptions: [
            'Injectable',
            'Module',
            'Controller',
            'Get',
            'Body',
            'Post',
            'Param',
            'WebSocketServer',
            'WebSocketGateway',
            'SubscribeMessage',
            'MessageBody',
            'Inject',
            'ConnectedSocket',
          ],
        },
      ],
      'arrow-parens': ['error', 'always'],
      '@stylistic/ts/comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          enums: 'always-multiline',
          functions: 'only-multiline',
        },
      ],
    },
  },
  {
    ignores: ['**/dist/*'],
  },
]
