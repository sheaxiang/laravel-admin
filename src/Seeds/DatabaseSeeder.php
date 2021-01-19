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
                '_lft' => 1,
                '_rgt' => 4,
                'parent_id' => null,
                'name' => '系统设置',
                'icon' => 'SettingOutlined',
                'path' => '/setting',
                'created_at' => $date,
                'updated_at' => $date,
            ],[
                '_lft' => 2,
                '_rgt' => 3,
                'parent_id' => 1,
                'name' => '菜单设置',
                'icon' => 'MenuOutlined',
                'path' => 'menu',
                'created_at' => $date,
                'updated_at' => $date,
            ],
        ]);
    }
}
