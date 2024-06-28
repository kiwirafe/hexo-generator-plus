function get_langs(hexo) {
    if (!hexo.config.plus.languages) {
        var languages = hexo.config.language;
        if (!Array.isArray(languages)) {
            languages = [languages];
        }
        hexo.config.plus.languages = languages;
    }
    return hexo.config.plus.languages;
}


function get_url(hexo, lang, suffix) {
    var default_lang = get_langs(hexo)[0];
    if (lang == default_lang)
        return suffix;
    else
        return lang + '/' + suffix;
}

function get_posts(locals) {
    const config = this.config.generator_plus;
    const orderBy = config.index_generator.order_by || '-date';

    var posts = locals.posts.sort(orderBy);
    return posts.filter(function (post) {
        return post.lang == lang;
    });
}

function get_categories(locals) {
    const config = this.config.generator_plus;
    const perPage = config.category_generator.per_page || 10;
    const paginationDir = config.pagination_dir || 'page';
    const orderBy = config.category_generator.order_by || '-date';

    var lang = this.page.lang;
    var categories = locals.categories.sort(orderBy);

    var filtered = [];
    var i = 0;
    categories.forEach(function (category) {
        var add = category.posts.some(post => post.lang == lang);
        if (add) {
            if (Math.floor(i / perPage) == 0) {
                category.href = get_url(this, lang, '/#' + category.name);
            } else {
                category.href = get_url(this, lang, `/${paginationDir}/${Math.floor(i / perPage) + 1}/#${category.name}`);
            }
            filtered.push(category);
        }

        i += 1;
    });
};


function get_tags(locals) {
    const config = this.config.generator_plus;
    const perPage = config.tag_generator.per_page || 10;
    const paginationDir = config.pagination_dir || 'page';
    const orderBy = config.tag_generator.order_by || '-date';

    var lang = this.page.lang;
    var tags = locals.tags.sort(orderBy);

    var filtered = [];
    var i = 0;
    tags.forEach(function (tag) {
        var add = tag.posts.some(post => post.lang == lang);
        if (add) {
            if (Math.floor(i / perPage) == 0) {
                tag.href = get_url(this, lang, '/#' + tag.name);
            } else {
                tag.href = get_url(this, lang, `/${paginationDir}/${Math.floor(i / perPage) + 1}/#${tag.name}`);
            }
            filtered.push(tag);
        }

        i += 1;
    });
};