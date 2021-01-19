<?php

use Illuminate\Routing\Router;

Route::group([
    'prefix'        => 'api',
    'namespace'     => 'SheaXiang\\Admin\\Http\\Controllers',
], function (Router $router) {
    $router->prefix('admin')->group(function ($api) {
        $api->post('/login', 'AuthController@login');

        $api->group(['middleware' => ['auth:admin']], function ($authApi) {
            $authApi->get('/user', 'AuthController@user');
            $authApi->get('/logout', 'AuthController@logout');

            $authApi->resource('menu', 'MenuController');
        });
    });
});
