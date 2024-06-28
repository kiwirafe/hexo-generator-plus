# hexo-generator-plus

一个为 [Hexo](https://hexo.io/) 生成索引、归档、分类和标签页面的包。它支持国际化（i18n）以及生成分类和标签的索引页面。

## 安装
```bash
$ npm uninstall hexo-generator-index hexo-generator-archive hexo-generator-category hexo-generator-tag
$ npm install hexo-generator-plus --save
```

## 使用方法
### 国际化（i18n）
如果您的网站仅包含一种语言，则无需执行其他操作。

**否则：**
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
2. 在 _config.yml 中将 `new_post_name` 设置为 `new_post_name: :lang/:title.md`

### 辅助函数
#### `get_posts()`
返回当前语言的所有文章。

#### `get_categories()`
返回包含至少一个当前语言文章的所有分类。

#### `get_tags()`
返回包含至少一个当前语言文章的所有标签。

注意：当前语言是指调用该函数的页面的语言。

## 选项
在根 _config.yml 文件中添加或修改以下部分：

``` yaml
generator_plus:
  languages: 
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
- **languages**: 语言
  - 默认: ''
- **generators**: 所需要的生成器
  - 默认: ["index", "archive", "category", "tag"]

### 对于所有生成器：
- **per_page**: 每页显示的文章数。
  - 默认: `10`
  - `0` 禁用分页
- **order_by**: 文章排序。
  - 默认: 日期降序

### 仅适用于 `category_generator` 和 `tag_generator`：
- **enable_index_page**: 是否生成索引页面。
  - 默认: false

## 注意
请访问 [hexo-theme-world](https://github.com/kiwirafe/hexo-theme-world) 来看如何将这个插件集成到网站中。

## 许可证
MIT