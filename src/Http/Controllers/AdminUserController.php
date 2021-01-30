<?php

namespace SheaXiang\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use SheaXiang\Admin\Http\Requests\StoreAdminUser;
use SheaXiang\Admin\Models\AdminUser;

class AdminUserController extends BaseController
{
    public function index(Request $request)
    {
    	$query = AdminUser::with('roles')
            ->orderByDesc('created_at')
            ->where('id', '<>', 1)
            ->where('id', '<>', auth('admin')->id());

    	if($name = $request->name) {
			$query->where('name', 'like', "%$name%");
		}

        if($status = $request->status) {
            $query->where('status', $status);
        }

		return succeed($request->pageSize ? $query->paginate((int)$request->pageSize) : $query->get());
    }

    public function store(StoreAdminUser $request)
    {
        DB::transaction(function () use ($request) {
            $data = $request->except('roles');

            $data['password'] = bcrypt($data['password']);

            $info = AdminUser::create($data);

            $info->roles()->sync($request->roles ? : []);
            $info->permissions()->sync($request->permissions ? : []);
        });

        return succeed('添加管理员成功');
    }

    public function show($id)
    {
		return succeed(AdminUser::with('roles', 'permissions')->findOrFail($id));
    }

    public function update(StoreAdminUser $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $data = $request->except('roles');

            if (isset($data['password']) && $data['password']) {
                $data['password'] = bcrypt($data['password']);
            }

            $info = AdminUser::findOrFail($id);

            $info->update($data);
            $info->roles()->sync($request->roles ? : []);
            $info->permissions()->sync($request->permissions ? : []);
        });

		return succeed('修改管理员成功');
    }

    public function destroy($id)
    {
        $info = AdminUser::findOrFail($id);

        if ($id == 1) {
          return failed("无法删除");
        }

        $info->delete();

		return succeed('删除管理员成功');
    }
}
