<?php

return [
    'auth' => [

        'guard' => 'admin',

        'guards' => [
            'admin' => [
                'driver' => 'jwt',
                'provider' => 'admin',
            ],
        ],

        'providers' => [
            'admin' => [
                'driver' => 'eloquent',
                'model' => SheaXiang\Admin\Models\AdminUser::class,
            ],
        ],
    ],

    'operation_log' => [

        'enable' => true,

        /*
         * Only logging allowed methods in the list
         */
        'allowed_methods' => ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'],

        'except' => [
            'api/admin/logs*',
        ],
    ],
];
