module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    files: ['benchmarks/**/*.js'],
    frameworks: ['benchmark'],
    reporters: ['benchmark'],
    autoWatch: true,
    singleRun: false,
    browserNoActivityTimeout: 60000
  });
};

