<?php

namespace SheaXiang\Admin\Commands;

use Illuminate\Console\Command;
use SheaXiang\Admin\Seeds\DatabaseSeeder;
use SheaXiang\Admin\Models\AdminUser;

class InstallCommand extends Command
{
    protected $signature = 'admin:install';

    protected $description = 'install admin';

    public function handle()
    {
        /**
         * jwt包 相关
         */
        $this->call('jwt:secret');
        $this->call('vendor:publish', ['--provider' => "Tymon\JWTAuth\Providers\LaravelServiceProvider"]);

        /**
         * permission 相关
         */
        $this->call('vendor:publish', ['--provider' => "Spatie\Permission\PermissionServiceProvider"]);

        //初始化数据库
        $this->initDatabase();

        $this->info('install success');
    }

    public function initDatabase()
    {
        $this->call('migrate');

        if (AdminUser::count() == 0) {
            $this->call('db:seed', ['--class' => DatabaseSeeder::class]);
        }
    }
}
