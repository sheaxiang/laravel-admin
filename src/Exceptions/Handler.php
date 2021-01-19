<?php

namespace SheaXiang\Admin\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        if ($message = $exception->getMessage()) {
            // 用户认证的异常，我们需要返回 401 的 http code 和错误信息
            if ($exception instanceof UnauthorizedHttpException || $exception instanceof AuthenticationException) {
                return failed($exception->getMessage(), 401, 401);
            }

            // 参数验证错误的异常，我们需要返回 400 的 http code 和一句错误信息   && request()->wantsJson()
            if ($exception instanceof ValidationException) {
                return failed(Arr::first(Arr::collapse($exception->errors())));
            }

            //这里将所有错误异常都以json返回
            return config('app.debug') ? failed($message.'-line:'.$exception->getLine()) : failed('Server Error');
        }

        return parent::render($request, $exception);
    }
}
