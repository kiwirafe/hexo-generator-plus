'use strict';

if (!hexo.config.i18n) {
    hexo.log.info('generator_plus not config in _config.yml, use default config!\n \
        Please visit https://github.com/kiwirafe/hexo-generator-plus for more information');
    hexo.config.generator_plus = {
        generator: ["index", "archive", "category", "tag"]
    }
}

hexo.extend.generator.register('get_posts', require('./lib/helper'));
hexo.extend.generator.register('get_categories', require('./lib/helper'));
hexo.extend.generator.register('get_tags', require('./lib/helper'));

var generator = hexo.config.generator_plus.generator;
if (generator) {
    if (!Array.isArray(generator)) {
        generator = [generator];
    }
    hexo.config.i18n.generator = generator;
    generator.forEach(function(item) {
        hexo.extend.generator.register(`${item}_generator`, require(`./lib/${item}generator`));
    });
}