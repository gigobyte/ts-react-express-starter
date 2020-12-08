module.exports = api => {
  api.cache(true)

  return {
    presets: [
      [
        '@babel/env',
        {
          useBuiltIns: 'entry',
          corejs: '3.0.0'
        }
      ],
      '@babel/typescript',
      ['@babel/react', { runtime: 'automatic' }]
    ],
    plugins: ['@babel/transform-runtime']
  }
}
