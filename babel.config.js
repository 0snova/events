module.exports = (api) => {
  const isTest = api.env('test');

  if (isTest) {
    console.log(`babel is using "test" enviroment`);
  }

  return {
    presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  };
};
