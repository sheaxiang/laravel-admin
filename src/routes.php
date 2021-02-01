<?php

use Illuminate\Routing\Router;

Route::group([
    'prefix'        => 'api',
    'namespace'     => 'SheaXiang\\Admin\\Http\\Controllers',
], function (Router $router) {
    $router->group(['prefix' => 'admin'], function ($api) {
        $api->post('/login', 'AuthController@login');

        $api->group(['middleware' => ['auth:admin', 'admin']], function ($authApi) {
            $authApi->get('/user', 'AuthController@user');
            $authApi->put('/user', 'AuthController@update');
            $authApi->put('/updatePassword', 'AuthController@updatePassword');
            $authApi->get('/logout', 'AuthController@logout');
            $authApi->resource('menu', 'MenuController');

            $authApi->group(['prefix' => 'upload'], function ($query) {
                $query->post('/image/{type}', 'UploadController@image');
                $query->post('/editorImage/{type}', 'UploadController@editorImage');
                $query->post('/sliceEditor', 'UploadController@sliceEditor');
            });

            $authApi->resource('admin_user', 'AdminUserController');
            $authApi->resource('permission', 'PermissionController');
            $authApi->resource('role', 'RoleController');

            $authApi->get('logs', 'LogOperationController@index');
        });
    });
});
