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
];
