<?php
namespace SheaXiang\Admin\Repositories;

use Illuminate\Http\Request;
use SheaXiang\Admin\Models\Menu;

class MenuRepository
{
    public function index()
    {
        $query = Menu::orderByDesc('order')->get();

        if ($isHide = request('is_hide')) {
            $query->where('is_hide', $isHide);
        }

        return $query->toTree();
    }
}
