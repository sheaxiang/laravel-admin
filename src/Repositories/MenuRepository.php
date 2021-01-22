<?php
namespace SheaXiang\Admin\Repositories;

use SheaXiang\Admin\Models\Menu;

class MenuRepository
{
    public function index()
    {
        $query = Menu::orderByDesc('order');

        if ($isHide = request('is_hide')) {
            $query->where('is_hide', $isHide);
        }

        if ($name = request('name')) {
            $query->where('name', 'like', "%$name%");
        }

        if ($path = request('path')) {
            $query->where('path', 'like', "%$path%");
        }

        return $query->get()->toTree();
    }
}
