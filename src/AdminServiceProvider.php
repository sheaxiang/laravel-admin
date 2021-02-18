<?php

namespace SheaXiang\Admin;

use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\ServiceProvider;
use SheaXiang\Admin\Commands\InstallCommand;
use SheaXiang\Admin\Exceptions\Handler;
use SheaXiang\Admin\Http\Middleware\LogOperation;
use SheaXiang\Admin\Http\Middleware\Permission;

class AdminServiceProvider extends ServiceProvider
{
    /**
     * The application's route middleware.
     *
     * @var array
     */
    protected $routeMiddleware = [
        'admin.permission' => Permission::class,
        'admin.log'        => LogOperation::class,
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'admin' => [
            'admin.permission',
            'admin.log',
        ],
    ];

    public function boot(Filesystem $filesystem)
    {
        // 加载路由
        $this->loadRoutesFrom(__DIR__.'/routes.php');

        // 发布文件
        $this->pushFiles($filesystem);

        //接管错误处理
        $this->app->singleton(
            ExceptionHandler::class,
                    Handler::class
        );

    }

    protected function loadAdminAuthConfig()
    {
        config(Arr::dot(config('admin.auth', []), 'auth.'));
    }

    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/admin.php',
            'admin'
        );

        $this->commands([
            InstallCommand::class
        ]);

        $this->loadAdminAuthConfig();

        $this->registerRouteMiddleware();
    }

    public function pushFiles($filesystem)
    {
        //发布config
        $this->publishes([
            __DIR__.'/../config/admin.php' => config_path('admin.php'),
        ], 'laravel-admin-config');

        //发布数据库文件
        $this->publishes([
            __DIR__.'/../database/migrations/create_admin_tables.php.stub' => $this->getMigrationFileName($filesystem),
        ], 'laravel-admin-migrations');

        //发布前端代码源码文件
        $this->publishes([
            __DIR__.'/../resources/admin' => base_path('admin'),
        ], 'laravel-admin-resources');

        // 更新扩展包时需要更新的
        $this->addPublishGroup('laravel-admin-resources-force', [
            __DIR__.'/../resources/admin/config/routes.ts' => base_path('admin/config/routes.ts'),
            __DIR__.'/../resources/admin/dist' => base_path('admin/dist'),
            __DIR__.'/../resources/admin/public' => base_path('admin/public'),
            __DIR__.'/../resources/admin/src' => base_path('admin/src'),
            __DIR__.'/../resources/admin/dist' => public_path('admin'),
        ]);

        //发布前端打包好的代码到admin目录
        $this->publishes([
            __DIR__.'/../resources/admin/dist' => public_path('admin'),
        ], 'laravel-admin-resources-dist');

    }

    protected function getMigrationFileName(Filesystem $filesystem): string
    {
        $timestamp = date('Y_m_d_His');

        return Collection::make($this->app->databasePath().DIRECTORY_SEPARATOR.'migrations'.DIRECTORY_SEPARATOR)
            ->flatMap(function ($path) use ($filesystem) {
                return $filesystem->glob($path.'*_create_admin_tables.php');
            })->push($this->app->databasePath()."/migrations/{$timestamp}_create_admin_tables.php")
            ->first();
    }

    protected function registerRouteMiddleware()
    {
        // register route middleware.
        foreach ($this->routeMiddleware as $key => $middleware) {
            app('router')->aliasMiddleware($key, $middleware);
        }

        // register middleware group.
        foreach ($this->middlewareGroups as $key => $middleware) {
            app('router')->middlewareGroup($key, $middleware);
        }
    }
}
