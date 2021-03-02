# laravel admin

## Installation

```
composer require sheaxiang/laravel-admin
```

```
php artisan vendor:publish --provider="SheaXiang\Admin\AdminServiceProvider"
```

```
php artisan admin:install
```
## UPDATE

``` 
php artisan vendor:publish --tag=laravel-admin-resources-force --force

这里会覆盖目录 admin/config/routes.ts, admin/public, admin/src,所以二次开发需要新增,不要更改

yarn build
```
