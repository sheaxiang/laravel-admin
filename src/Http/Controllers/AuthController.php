<?php

namespace SheaXiang\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use SheaXiang\Admin\Http\Requests\AuthLogin;
use SheaXiang\Admin\Http\Requests\UpdateAdminUserMy;
use SheaXiang\Admin\Http\Requests\UpdateAdminUserMyPassword;
use SheaXiang\Admin\Models\AdminUser;
use SheaXiang\Admin\Repositories\MenuRepository;

class AuthController extends  BaseController
{
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(AuthLogin $request)
    {
        $name = $request->name;
        $password = $request->password;

        //检查用户名和密码是否正确
        $admin = AdminUser::where('name', $name)->first();

        if (!$admin || (!Hash::check($password,$admin->password))) {
            return failed('用户名或者密码错误');
        }

        if ($admin->status == 1) {
            return failed('此账户被禁用');
        }

        if (!$token = auth('admin')->fromUser($admin)) {
            return failed('登录失败，用户名或密码错误！');
        }

        return respondWithToken($token, 'admin');
    }

    public function update(UpdateAdminUserMy $request)
    {
        $info = auth('admin')->user();

        $info->update($request->all());

        return succeed('操作成功');
    }

    public function updatePassword(UpdateAdminUserMyPassword $request)
    {
        $info = auth('admin')->user();

        if (!Hash::check($request->old_password,$info->password)) {
            return failed('原密码错误');
        }

        $info->password = bcrypt($request->password);
        $info->save();

        return succeed('修改密码成功');
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(MenuRepository $menuRepository)
    {
        $info = auth('admin')->user();

        return succeed(array_merge(
            $info->toArray(),
            ['menus' => $menuRepository->index()],
            ['permissions' => $info->allPermissions()]
        ));
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('admin')->logout();

        return succeed('退出成功');
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return respondWithToken(auth('admin')->refresh());
    }
}
