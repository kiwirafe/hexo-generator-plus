'use strict';

hexo.config.generator_plus = Object.assign({
    generator: ["index", "archive", "category", "tag"],
    pagination_dir: hexo.config.pagination_dir || "pages",
}, hexo.config.generator_plus);

const config = hexo.config.generator_plus;
config.language = config.language || [].concat(hexo.config.language || 'default');
// This ensures the result is always an array. 

//Helpers
var helpers = require('./lib/helpers');
hexo.extend.helper.register('get_posts', helpers.get_posts);
hexo.extend.helper.register('get_categories', helpers.get_categories);
hexo.extend.helper.register('get_tags', helpers.get_tags);

//Generators
config.index_generator = Object.assign({
    per_page: hexo.config.per_page || 10,
    order_by: '-date'
}, hexo.config.index_generator);

config.archive_generator = Object.assign({
    per_page: hexo.config.per_page || 10,
    order_by: '-date',
    yearly: true,
    monthly: true,
    daily: false
}, hexo.config.archive_generator);

config.category_generator = Object.assign({
    per_page: hexo.config.per_page || 10,
    order_by: '-date',
    enable_index_page: false
}, hexo.config.category_generator);

config.tag_generator = Object.assign({
    per_page: hexo.config.per_page || 10,
    order_by: '-date',
    enable_index_page: false
}, hexo.config.tag_generator);

var generator = require('./lib/generators');
var gconfig = config.generator;

if (gconfig) {
    if (!Array.isArray(gconfig)) {
        gconfig = [gconfig];
    }
    config.generator = gconfig;

    gconfig.forEach(function(item) {
        hexo.extend.generator.register(`${item}_generator`, generator[`${item}_generator`]);
    });
}