<?php

namespace SheaXiang\Admin\Http\Controllers;

use Illuminate\Http\Request;
use SheaXiang\Admin\Http\Requests\StorePermissions;
use SheaXiang\Admin\Models\Permission;

class PermissionController extends BaseController
{
    public function index(Request $request)
    {
        $query = Permission::orderBy('created_at', 'desc');

        if ($name = $request->name) {
            $query->where('name', 'like', "%$name%");
        }

        if ($slug = $request->slug) {
            $query->where('slug', 'like', "%$slug%");
        }

		return succeed($request->pageSize ? $query->paginate((int)$request->pageSize) : $query->get());
    }

    public function store(StorePermissions $request)
    {
		Permission::create($request->all());

		return succeed('添加权限成功');
    }

    public function show($id)
    {
		return succeed(Permission::findOrFail($id));
    }

    public function update(StorePermissions $request, $id)
    {
		$info = Permission::findOrFail($id);

		$info->update($request->all());

		return succeed('修改权限成功');
    }

    public function destroy($id)
    {
		$info = Permission::findOrFail($id);

		$info->delete();

		return succeed('删除权限成功');
    }
}
