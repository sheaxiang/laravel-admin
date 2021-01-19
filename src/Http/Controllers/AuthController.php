<?php

namespace SheaXiang\Admin\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use SheaXiang\Admin\Http\Requests\AuthLogin;
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

        if (!$token = auth('admin')->fromUser($admin)) {
            return failed('登录失败，用户名或密码错误！');
        }

        return respondWithToken($token, 'admin');
    }

    public function update(StoreUpdateAdminUserMy $request)
    {
        $info = auth('admin')->user();

        if ($name = $request->name) {
            $info->name = $name;
        }

        if ($password = $request->password) {
            $info->password = bcrypt($password);
        }

        $info->save();

        return dingoSucceed('操作成功');
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
            ['menus' => $menuRepository->index()]
        ));

        return succeed(array_merge(
            ['permissions' => $info->getPermissionsViaRoles()],
            ['menus' => Menu::whereNotNull('path')->orderBy('order', 'desc')->get()->toTree()],
            $info->toArray()));
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
        return $this->respondWithToken(auth('admin')->refresh());
    }
}
