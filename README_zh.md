# hexo-generator-plus

一个为 Hexo 生成索引、归档、分类和标签页面的包。

这个插件保留了原始 Hexo 生成器（index, archive, category 和 tag 生成器）的所有功能。此外，它还提供了两个额外的功能：
1. **i18n（国际化）：** 它会为每种语言生成单独的页面。
2. **分类和标签索引页面：** 它创建分类和标签的索引页面。

## 安装
```bash
$ npm uninstall hexo-generator-index hexo-generator-archive hexo-generator-category hexo-generator-tag
$ npm install hexo-generator-plus --save
```

## 使用方法
如果您的网站仅包含一种语言，则无需执行其他操作。

## 国际化（i18n）
请按照以下步骤进行国际化：
1. 为每种语言创建一个新文件夹，并将所有文章和页面放入相应的文件夹中。例如：
```plaintext
sources/
  en/
    post1.md
    post2.md
  zh/
    post3.md
    post4.md
```
2. 在 _config.yml 中添加以下内容：
```yaml
generator_plus:
  language: ['first language', 'second language']
```
3. 将 _config.yml 中的 `new_post_name` 变量更改为 `new_post_name: :lang/:title.md`
4. 将 _config.yml 中的 `permalink` 变量更改为 `permalink: :lang/{这里原来的内容}`

### 辅助函数
**`url_for_lang()`** 返回一个国际化URL。你应该只在调用分类和标签的情况下使用它，但不要在调用文章的时候使用它。

**`get_posts()`** 返回当前语言的所有文章。

**`get_categories()`** 返回包含至少一个当前语言文章的所有分类。

**`get_tags()`** 返回包含至少一个当前语言文章的所有标签。

注意：当前语言是指调用该函数的页面的语言。

## 设置
在根 _config.yml 文件中添加或修改以下部分：

``` yaml
generator_plus:
  language: 'default'
  pagination_dir: 'page'
  generators: ["index", "archive", "category", "tag"]

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

### 总体：
- **language**：站点中的语言
  - 默认值：原始配置中的language，如果未定义则为 `default`。
- **pagination_dir**：分页目录
  - 默认值：原始配置中的pagination_dir，如果未定义则为 `page`。
- **generator**：需要的生成器
  - 默认值：["index", "archive", "category", "tag"]

### 对于所有生成器：
- **per_page**: 每页显示的文章数。
  - 默认值: 原始配置中的per_page，如果未定义则为`10`
  - `0` 禁用分页
- **order_by**: 文章排序。
  - 默认值: 日期降序

### 仅适用于 `category_generator` 和 `tag_generator`：
- **enable_index_page**: 是否生成索引页面。
  - 默认: false

## 布局：
布局文件暂时不支持配置，但以下是本插件使用的布局文件顺序：
- **Index**：index.ejs
- **Archive**：archive.ejs, index.ejs
- **Category**：categories.ejs, index.ejs
- **Category (索引页)**：categories-index.ejs, categories.ejs, index.ejs
- **Tag**：tags.ejs, index.ejs
- **Tag (索引页)**：tags-index.ejs, tags.ejs, index.ejs

## 注意
请访问 [hexo-theme-world](https://github.com/kiwirafe/hexo-theme-world) 来看如何将这个插件集成到网站中。