const pagination = require('hexo-pagination');

function get_langs(hexo) {
    return hexo.config.generator_plus.language;
}

function get_default(hexo) {
    return get_langs(hexo)[0];
}

function get_url(hexo, lang, prefix) {
    if (lang == get_default(hexo) || lang == undefined)
        return prefix;
    else
        return lang + '/' + prefix;
}


module.exports = {
    index_generator: function (locals) {
        const config = this.config.generator_plus;
        const paginationDir = config.pagination_dir;
        const perPage = config.index_generator.per_page;
        const orderBy = config.index_generator.order_by;

        var hexo = this;
        var langs = get_langs(hexo);
        var pages = [];
        var posts = locals.posts.sort(orderBy);

        langs.forEach(function (lang) {
            var filtered = posts.filter(function (post) {
                post.lang = post.lang || get_default(hexo);
                return post.lang == lang;
            });

            pages = pages.concat(pagination(get_url(hexo, lang, ''), filtered, {
                perPage: perPage,
                layout: 'index',
                format: paginationDir + '/%d/',
                data: { lang: lang }
            }));
        });

        return pages;
    },


    archive_generator: function (locals) {
        const config = this.config.generator_plus;
        const perPage = config.archive_generator.per_page;
        const paginationDir = config.pagination_dir;
        const orderBy = config.archive_generator.order_by;

        var hexo = this;
        var langs = get_langs(hexo);
        var pages = [];
        var posts = locals.posts.sort(orderBy);

        function fmtNum(num) { return num.toString().padStart(2, '0')} ;
        function generate(path, posts, options = {}) {
            options['archive'] = true;
        
            pages = pages.concat(pagination(path, posts, {
            perPage: perPage,
            layout: ['archive', 'index'],
            format: paginationDir + '/%d/',
            data: options,
            }));
        }
        
        
        langs.forEach(function (lang) {
            var filtered = posts.filter(function (post) {
                post.lang = post.lang || get_default(hexo);
                return post.lang == lang;
            });
            
            var data = {'all' : []};
            // Organize posts by date
            filtered.forEach(function (post) {
                const date = post.date;
                const year = date.year();
                const month = date.month() + 1;
                const day = date.date();
                
                data['all'].push(post);
                if (!data.hasOwnProperty(year)) {
                    data[year] = {'all': []};
                }
                data[year]['all'].push(post);
            
                if (!data[year].hasOwnProperty(year)) {
                    data[year][month] = {'all' : []};
                }
                data[year][month]['all'].push(post);

                if (!data[year][month].hasOwnProperty(day)) {
                    data[year][month][day] = [];
                }

                data[year][month][day].push(post);
            });


            var url = get_url(hexo, lang, 'archives');
            generate(url, data['all'], { lang });

            // Yearly
            for (const [year, yearData] of Object.entries(data)) {
                if (year == 'all') continue
                generate(url + '/' + year, yearData['all'], { year, lang });

                if (!config.archive_generator.monthly) continue;
                // Monthly
                for (const [month, monthData] of Object.entries(data[year])) {
                    if (month == 'all') continue;
                    generate(url + fmtNum(month), monthData, {lang, year, month});

                    if (!config.archive_generator.daily) continue;
                    // Daily
                    for (const [day, dayData] of Object.entries(data[year][month])) {
                        generate(url + fmtNum(month) + '/' + fmtNum(day), dayData, {lang, year, month, day});
                    }
                }
            }
        });

        return pages;
    },


    category_generator: function (locals) {
        const config = this.config.generator_plus;
        const perPage = config.category_generator.per_page;
        const paginationDir = config.pagination_dir;
        const orderBy = config.category_generator.order_by;
        const enable_index_page = config.category_generator.enable_index_page;

        var hexo = this;
        var langs = get_langs(hexo);
        var categories = locals.categories.sort(orderBy);
        var pages = [];
        
        langs.forEach(function (lang) {
            var filtered_categories = categories.filter(function (category) {
                return category.posts.some(function (post) {
                    post.lang = post.lang || get_default(hexo);
                    return post.lang == lang;
                });
            })
            
            filtered_categories.forEach(function (category) {
                var filtered_posts = category.posts.filter(function (post) {
                    post.lang = post.lang || get_default(hexo);
                    return post.lang == lang;
                });

                pages = pages.concat(pagination(get_url(hexo, lang, category.path), filtered_posts, {
                    perPage: perPage,
                    layout: ['category', 'archive', 'index'],
                    format: paginationDir + '/%d/',
                    data: { lang, category: category.name }
                }));
            });

            if (enable_index_page) {
                pages = pages.concat(pagination(get_url(hexo, lang, 'categories'), filtered_categories, {
                    perPage: perPage,
                    layout: ['category-index', 'category', 'archive', 'index'],
                    format: paginationDir + '/%d/',
                    data: { lang }
                }));
            }
        });

        return pages;
    },


    tag_generator: function (locals) {
        const config = this.config.generator_plus;
        const perPage = config.tag_generator.per_page;
        const paginationDir = config.pagination_dir;
        const orderBy = config.tag_generator.order_by;
        const enable_index_page = config.tag_generator.enable_index_page;

        var hexo = this;
        var langs = get_langs(hexo);
        var tags = locals.tags.sort(orderBy);
        var pages = [];

        langs.forEach(function (lang) {
            var filtered_tags = tags.filter(function (tag) {
                return tag.posts.some(function (post) {
                    post.lang = post.lang || get_default(hexo);
                    return post.lang == lang;
                });
            })

            filtered_tags.forEach(function (tag) {
                var filtered_posts = tag.posts.filter(function (post) {
                    post.lang = post.lang || get_default(hexo);
                    return post.lang == lang;
                });

                pages = pages.concat(pagination(get_url(hexo, lang, tag.path), filtered_posts, {
                    perPage: perPage,
                    layout: ['tag', 'archive', 'index'],
                    format: paginationDir + '/%d/',
                    data: { lang, tag: tag.name }
                }));
            });

            if (enable_index_page) {
                pages = pages.concat(pagination(get_url(hexo, lang, 'tags'), filtered_tags, {
                    perPage: perPage,
                    layout: ['tag-index', 'tag', 'archive', 'index'],
                    format: paginationDir + '/%d/',
                    data: { lang }
                }));
            }
        });

        return pages;
    },
}