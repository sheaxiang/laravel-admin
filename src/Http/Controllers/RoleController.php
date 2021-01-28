<?php

namespace SheaXiang\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use SheaXiang\Admin\Http\Requests\StoreRole;
use SheaXiang\Admin\Models\Role;

class RoleController extends BaseController
{
    public function index(Request $request)
    {
    	$query = Role::with('permissions')->orderBy('created_at', 'desc');

    	if($name = $request->name) {
			$query->where('name', 'like', "%$name%");
		}

    	if($slug = $request->slug) {
			$query->where('slug', 'like', "%$slug%");
		}

		return succeed($request->pageSize ? $query->paginate((int)$request->pageSize) : $query->get());
    }

    public function store(StoreRole $request)
    {
        DB::transaction(function () use ($request) {
            $info = Role::create($request->except('permissions'));

            $info->permissions()->sync($request->permissions ? : []);
        });

		return succeed('添加角色成功');
    }

    public function show($id)
    {
		return succeed(Role::with('permissions')->findOrFail($id));
    }

    public function update(StoreRole $request, $id)
    {
		$info = Role::findOrFail($id);

		$info->update($request->except('permissions'));
		$info->permissions()->sync($request->permissions ? : []);

		return succeed('修改角色成功');
    }

    public function destroy($id)
    {
		$info = Role::findOrFail($id);

		$info->permissions()->detach();
		$info->administrators()->detach();
		$info->delete();

		return succeed('删除角色成功');
    }
}
