<?php

namespace SheaXiang\Admin\Http\Controllers;

use Illuminate\Http\Request;
use SheaXiang\Admin\Models\Menu;
use SheaXiang\Admin\Repositories\MenuRepository;

class MenuController extends  BaseController
{
    public function index(Request $request, MenuRepository $menuRepository)
    {
        return succeed($menuRepository->index($request));
    }

    public function store(Request $request)
    {
        Menu::create($request->all());

        return succeed('添加菜单成功');
    }

    public function show($id)
    {
        return succeed(Menu::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $info = Menu::findOrFail($id);

        $info->update($request->all());

        return succeed('修改菜单成功');
    }

    public function destroy($id)
    {
        $info = Menu::findOrFail($id);

        if (Menu::where('parent_id', $id)->exists()) {
            return  failed('有下级,无法删除');
        }

        $info->delete();

        return succeed('删除菜单成功');
    }
}
