const postcssConfig = {
  // NOTE: Order is important
  plugins: {
    '@tailwindcss/postcss': {},
    '@csstools/postcss-global-data': {
      files: ['./lib/styles/css/root.css'],
    },
    'postcss-preset-env': {
      stage: 3,
      features: {
        'custom-properties': false,
        'custom-media-queries': true,
        'nesting-rules': true,
      },
    },
  },
}

export default postcssConfig
