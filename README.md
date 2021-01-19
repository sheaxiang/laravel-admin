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

auth.php

```
guards

'admin' => [
    'driver' => 'jwt',
    'provider' => 'admin',
],

providers

'admin' => [
    'driver' => 'eloquent',
    'model' => SheaXiang\Admin\Models\AdminUser::class,
],
```
