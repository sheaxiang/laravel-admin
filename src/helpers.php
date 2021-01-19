<?php

if (!function_exists('request_intersect')) {
    /**
     * request intersect
     *
     * @param $keys
     * @return array
     */
    function request_intersect($keys) {
        return array_filter(request()->only(is_array($keys) ? $keys : func_get_args()));
    }
}

if (!function_exists('respondWithToken')) {

    function respondWithToken($token, $guard = 'api', array $data = null)
    {
        $resData = [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth($guard)->factory()->getTTL()
        ];

        if(!empty($data)){
            $resData = array_merge($data,$resData);
        }
        return succeed($resData);
    }
}

if(!function_exists('filterEmoji')) {
    // 过滤掉emoji表情
    function filterEmoji($str)
    {
        $str = preg_replace_callback( '/./u',
            function (array $match) {
                return strlen($match[0]) >= 4 ? '' : $match[0];
            },
            $str);
        return $str;
    }
}

if (!function_exists('downloadFile')) {
    /**
     * @param $path 路径
     * @param $originalFileName 原始文件名
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    function downloadFile($path, $originalFileName)
    {
        return response()->download(public_path($path), $originalFileName);
    }
}

