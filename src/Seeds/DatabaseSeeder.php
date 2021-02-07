<?php
namespace SheaXiang\Admin\Seeds;

use Illuminate\Database\Seeder;
use SheaXiang\Admin\Models\AdminUser;
use SheaXiang\Admin\Models\Menu;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        AdminUser::truncate(); //截断表
        AdminUser::create([
            'name' => 'admin',
            'user_name' => 'administrator',
            'password' => bcrypt('123456'),
        ]);

        $date = date('Y-m-d H:i:s');
        Menu::truncate();
        Menu::insert([
            [
                '_lft' => 3,
                '_rgt' => 14,
                'parent_id' => null,
                'order' => 1,
                'name' => '权限管理',
                'icon' => 'AccountBookOutlined',
                'path' => '/auth',
                'created_at' => $date,
                'updated_at' => $date,
            ],[
                '_lft' => 4,
                '_rgt' => 5,
                'parent_id' => 1,
                'order' => 5,
                'icon' => null,
                'name' => '管理员管理',
                'path' => 'adminUser',
                'created_at' => $date,
                'updated_at' => $date,
            ],[
                '_lft' => 6,
                '_rgt' => 7,
                'parent_id' => 1,
                'order' => 2,
                'icon' => null,
                'name' => '权限管理',
                'path' => 'permission',
                'created_at' => $date,
                'updated_at' => $date,
            ],[
                '_lft' => 8,
                '_rgt' => 9,
                'parent_id' => 1,
                'order' => 3,
                'icon' => null,
                'name' => '角色管理',
                'path' => 'role',
                'created_at' => $date,
                'updated_at' => $date,
            ],[
                '_lft' => 10,
                '_rgt' => 11,
                'parent_id' => 1,
                'order' => 1,
                'icon' => null,
                'name' => '操作日志',
                'path' => 'log',
                'created_at' => $date,
                'updated_at' => $date,
            ],[
                '_lft' => 12,
                '_rgt' => 13,
                'parent_id' => 1,
                'order' => 1,
                'name' => '菜单设置',
                'icon' => null,
                'path' => 'menu',
                'created_at' => $date,
                'updated_at' => $date,
            ]
        ]);
    }
}
