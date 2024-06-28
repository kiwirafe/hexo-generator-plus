const pagination = require('hexo-pagination');


function get_langs(hexo) {
    if (!hexo.config.generator_plus.languages) {
        var languages = hexo.config.language;
        if (!Array.isArray(languages)) {
            languages = [languages];
        }
        hexo.config.generator_plus.languages = languages;
    }
    return hexo.config.generator_plus.languages;
}


function get_url(hexo, lang, prefix, suffix) {
    var default_lang = get_langs(hexo)[0];
    if (lang == default_lang)
        return prefix + '/' + suffix;
    else
        return lang + '/' + prefix + '/' + suffix;
}


function index_generator(locals) {
    const config = this.config.generator_plus;
    const perPage = config.index_generator.per_page || 10;
    const paginationDir = config.pagination_dir || 'page';
    const orderBy = config.index_generator.order_by || '-date';

    var langs = get_langs(this);
    var pages = [];
    var posts = locals.posts.sort(orderBy);

    langs.forEach(function (lang) {
        filtered = posts.filter(function (post) {
            return post.lang == lang;
        });

        filtered.concat(pagination(get_url(this, lang, '', ''), filtered, {
            perPage: perPage,
            layout: 'index',
            format: paginationDir + '/%d/',
            data: { lang: lang }
        }));
    });

    return pages;
};


function archive_generator(locals) {
    const config = this.config.generator_plus;
    const perPage = config.archive_generator.per_page || 10;
    const paginationDir = config.pagination_dir || 'page';
    const orderBy = config.archive_generator.order_by || '-date';

    var langs = get_langs(this);
    var pages = [];
    var posts = locals.posts.sort(orderBy);

    function fmtNum(num) { return num.toString().padStart(2, '0')} ;
    function generate(path, posts, options = {}) {
        options['archive'] = true;
    
        pages.concat(pagination(path, posts, {
          perPage: perPage,
          layout: ['archive', 'index'],
          format: paginationDir + '/%d/',
          data: options,
        }));
    }

    langs.forEach(function (lang) {
        var data = {};
        filtered = posts.filter(function (post) {
            return post.lang == lang;
        });

        // Organize posts by date
        filtered.forEach(function (post) {
            const date = post.date;
            const year = date.year();
            const month = date.month() + 1;
            const day = date.date();


            data['all'].push(post);
            if (!data.hasOwnProperty(year)) {
                data[year] = {};
            }
            data[year]['all'].push(post);
        
            if (!data[year].hasOwnProperty(year)) {
                data[year][month] = {};
            }
            data[year][month]['all'].push(post);

            if (!data[year][month].hasOwnProperty(day)) {
                data[year][month][day] = [];
            }

            data[year][month][day].push(post);
        });


        var url = lang + '/archives/';
        generate(url, data['all'], { lang });
        // Yearly
        for (const [year, yearData] of Object.entries(data)) {
            if (year == 'all') continue
            generate(url + year, yearData['all'], { year, lang });

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
};


function category_generator(locals) {
    const config = this.config.generator_plus;
    const perPage = config.category_generator.per_page || 10;
    const paginationDir = config.pagination_dir || 'page';
    const orderBy = config.category_generator.order_by || '-date';
    const enable_index_page = config.category_generator.enable_index_page || false;

    var langs = get_langs(this);
    var categories = locals.categories.sort(orderBy);
    var pages = [];

    langs.forEach(function (lang) {
        filtered = categories.filter(function (category) {
            return category.posts.some(post => post.lang == lang);
        })


        filtered.forEach(function (category) {
            if (!category.length) return;

            pages.concat(pagination(get_url(this, lang, 'categories', category), filtered, {
                perPage: perPage,
                layout: ['categories-index', 'categories', 'index'],
                format: paginationDir + '/%d/',
                data: { lang, category: category.name }
            }));
        });

        if (enable_index_page) {
            pages.concat(pagination(get_url(this, lang, 'categories', ''), filtered, {
                perPage: perPage,
                layout: ['categories-index', 'categories', 'index'],
                format: paginationDir + '/%d/',
                data: { lang }
            }));
        }
    });

    return pages;
};


function tag_generator(locals) {
    const config = this.config.generator_plus;
    const perPage = config.tag_generator.per_page || 10;
    const paginationDir = config.pagination_dir || 'page';
    const orderBy = config.tag_generator.order_by || '-date';
    const enable_index_page = config.tag_generator.enable_index_page || false;

    var langs = get_langs(this);
    var tags = locals.tags.sort(orderBy);
    var pages = [];


    langs.forEach(function (lang) {
        filtered = tags.filter(function (tag) {
            return tag.posts.some(post => post.lang == lang);
        })

        filtered.forEach(function (tag) {
            if (!tag.length) return;

            pages.concat(pagination(get_url(this, lang, 'tags', tag), filtered, {
                perPage: perPage,
                layout: ['tags-index', 'tags', 'index'],
                format: paginationDir + '/%d/',
                data: { lang, tag: tag.name }
            }));
        });

        if (enable_index_page) {
            pages.concat(pagination(get_url(this, lang, 'tags', ''), filtered, {
                perPage: perPage,
                layout: ['tags-index', 'tags', 'index'],
                format: paginationDir + '/%d/',
                data: { lang }
            }));
        }
    });

    return pages;
};