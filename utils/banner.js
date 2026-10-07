const { banner: yuriBanner, setTitle: yuriTitle } = require('yuurisan');

function showBanner(projectName) {
  yuriTitle(projectName);
  yuriBanner(projectName);
}

module.exports = {
  showBanner
};
