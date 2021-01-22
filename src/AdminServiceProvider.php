<?php

namespace SheaXiang\Admin;

use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Collection;
use Illuminate\Support\ServiceProvider;
use SheaXiang\Admin\Commands\InstallCommand;
use SheaXiang\Admin\Exceptions\Handler;

class AdminServiceProvider extends ServiceProvider
{
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

        //todo 这样写没用设置auth config
        /*$authGuards = array_merge(config('auth.guards'), [
            'admin' => [
                'driver' => 'jwt',
                'provider' => 'admin',
            ],
        ]);
        config(['guards' => $authGuards]);

        $authProviders = array_merge(config('auth.providers'), [
            'admin' => [
                'driver' => 'eloquent',
                'model' => AdminUser::class,
            ],
        ]);
        config(['providers' => $authProviders]);*/

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
            __DIR__.'/../resources/admin' => base_path('backend'),
        ], 'laravel-admin-resources');

        // 更新扩展包时需要更新的
        $this->addPublishGroup('laravel-admin-resources-force', [
            __DIR__.'/../resources/admin/config/routes.ts' => base_path('backend/config/routes.ts'),
            __DIR__.'/../resources/admin/dist' => base_path('backend/dist'),
            __DIR__.'/../resources/admin/public' => base_path('backend/public'),
            __DIR__.'/../resources/admin/src' => base_path('backend/src'),
            __DIR__.'/../resources/admin/dist' => public_path('backend'),
        ]);

        //发布前端打包好的代码到backend目录
        $this->publishes([
            __DIR__.'/../resources/admin/dist' => public_path('backend'),
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
}
