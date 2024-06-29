# hexo-generator-plus

#### [中文文档](README_zh.md)

A package that generates index, archive, categories and tags pages for [Hexo](https://hexo.io/). It supports i18n and index pages for categories and tags.

## Installation
```bash
$ npm uninstall hexo-generator-index hexo-generator-archive hexo-generator-category hexo-generator-tag
$ npm install hexo-generator-plus --save
```

## Usage
If your site contains only one language, there's no additional actions required. This package will generate files as normal.

### i18n
Please follow these steps for internationalization
1. Create a new folder for each language, and put all posts and pages in the corresponding folder. For example:
```plaintext
sources/
  en/
    post1.md
    post2.md
  zh/
    post3.md
    post4.md
```
2. Add the following to _config.yml:
```yml
generator_plus:
  language: ['first language', 'second language']
```
3. Change `new_post_name` variable in _config.yml to `new_post_name: :lang/:title.md`
4. (Optional, but recommended) Change `permalink` variable in _config.yml `permalink: :lang/{what was here before}`

## Helpers
**`get_posts()`** returns all posts written in current language.

**`get_categories()`** returns all categories that contain at least a post in current language.

**`get_tags()`** returns all tags that contain at least one post in current language.

Note: The current language refers to the language of the page from which the function is called

## Options
Add or modify the following section to your root _config.yml file

``` yaml
generator_plus:
  language: 'default'
  pagination_dir: 'page'
  generator: ["index", "archive", "category", "tag"]

  index_generator:
    per_page: 10
    order_by: -date

  archive_generator:
    per_page: 10
    order_by: -date

  category_generator:
    per_page: 10
    order_by: -date
    enable_index_page: false

  tag_generator:
    per_page: 10
    order_by: -date
    enable_index_page: false
```

#### Overall Options: 
- **language**: Languages in site
  - default: language in original config, if not defined then `default`.
- **pagination_dir**: Pagination dir
  - default: pagination_dir in original config, if not defined then `page`.
- **generator**: Generators wanted
  - default: ["index", "archive", "category", "tag"]

#### For all generators:
- **per_page**: Posts displayed per page.
  - default: per_page in original config, then `10`.
  - `0` disables pagination
- **order_by**: Posts order.
  - default: date descending

#### For `category_generator` and `tag_generator` only:
- **enable_index_page**: Whether to generate the index page.
  - default: false

## Layout:
Layout files are not configurable, but here are the orders of layout files used:
- **Index**: index.ejs
- **Archive**: archive.ejs, index.ejs
- **Category**: categories.ejs, index.ejs
- **Category (index page)**: categories-index.ejs, 'categories.ejs, index.ejs
- **Tag**: tags, index.ejs
- **Tag (index page)**: tags-index, tags.ejs, index.ejs

## Note
For how to incooperate this plugin into a site, please visit [hexo-theme-world](https://github.com/kiwirafe/hexo-theme-world).
