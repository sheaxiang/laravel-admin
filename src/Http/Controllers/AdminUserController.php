<?php

namespace SheaXiang\Admin\Http\Controllers;

use Illuminate\Http\Request;
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

		return succeed($request->page_size ? $query->paginate((int)$request->page_size) : $query->get());
    }

    public function store(StoreAdminUser $request)
    {
      $data = $request->except('roles');

      $data['password'] = bcrypt($data['password']);

      $info = AdminUser::create($data);

      $info->syncRoles($request->roles ? : []);

      return succeed('添加管理员成功');
    }

    public function show($id)
    {
		return succeed(AdminUser::with('roles')->findOrFail($id));
    }

    public function update(StoreAdminUser $request, $id)
    {
		$data = $request->except('roles');

		if (!$data['password']) {
			unset($data['password']);
		} else {
			$data['password'] = bcrypt($data['password']);
		}

		$admin_user = AdminUser::findOrFail($id);

		$admin_user->update($data);
		$admin_user->syncRoles($request->roles ? : []);

		return succeed('修改管理员成功');
    }

    public function destroy($id)
    {
        $info = AdminUser::findOrFail($id);

        if ($id == 1) {
          return failed("无法删除");
        }

		$info->roles()->detach();

		$info->delete();

		return succeed('删除管理员成功');
    }
}
