<?php

namespace SheaXiang\Admin\Http\Controllers;

use Illuminate\Http\Request;
use SheaXiang\Admin\Models\OperationLog;

class LogOperationController extends BaseController
{
    public function index(Request $request)
    {
        $query = OperationLog::with('user')->orderBy('created_at', 'desc');

        if ($path = $request->path) {
            $query->where('path', 'like', "%$path%");
        }

        if ($method = $request->request_method) {
            $query->where('method', $method);
        }

        if ($user_id = $request->user_id) {
            $query->where('user_id', $user_id);
        }

        if ($ip = $request->ip) {
            $query->where('ip', 'like', "%$ip%");
        }

		return succeed($request->pageSize ? $query->paginate((int)$request->pageSize) : $query->get());
    }
}
