<?php

namespace SheaXiang\Admin\Http\Middleware;

use Illuminate\Http\Request;

class Permission
{
    public function handle(Request $request, \Closure $next)
    {
        if (auth('admin')->id() == 1) {
            return $next($request);
        }

        if ($this->shouldPassThrough($request)) {
            return $next($request);
        }

        if (!auth('admin')->user()->allPermissions()->first(function ($permission) use ($request) {
            return $permission->shouldPassThrough($request);
        })) {
            return failed('Permission denied!',403, 403);
        }

        return $next($request);
    }

    protected function shouldPassThrough($request)
    {
        $excepts = array_merge(config('admin.auth.excepts', []), [
            '/user',
            '/login',
        ]);

        return collect($excepts)
            ->map(function ($path) {
                return  trim('/api/admin', '/').$path;
            })
            ->contains(function ($except) use ($request) {
                if ($except !== '/') {
                    $except = trim($except, '/');
                }

                return $request->is($except);
            });
    }
}
