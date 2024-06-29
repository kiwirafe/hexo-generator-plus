function get_langs(hexo) {
    return hexo.config.generator_plus.language;
}

function get_default(hexo) {
    return get_langs(hexo)[0];
}

module.exports = {
    get_posts: function () {
        const config = this.config.generator_plus;
        const orderBy = config.index_generator.order_by;

        var posts = this.site.posts.sort(orderBy);
        return posts.filter(function (post) {
            return post.lang == lang;
        });
    },

    get_categories: function () {
        const config = this.config.generator_plus;
        const orderBy = config.category_generator.order_by;

        var lang = this.page.lang;
        var categories = this.site.categories.sort(orderBy);

        return categories.filter(function (category) {
            return category.posts.some(function (post) {
                post.lang = post.lang || get_default(hexo);
                return post.lang == lang;
            });
        })
    },


    get_tags: function () {
        const config = this.config.generator_plus;
        const orderBy = config.tag_generator.order_by;

        var lang = this.page.lang;
        var tags = this.site.tags.sort(orderBy);

        return tags.filter(function (tag) {
            return tag.posts.some(function (post) {
                post.lang = post.lang || get_default(hexo);
                return post.lang == lang;
            });
        })
    },
}