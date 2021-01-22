<?php

namespace SheaXiang\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use SheaXiang\Admin\Rules\AllowLetterNumber;

class UpdateAdminUserMy extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => ['required', 'between:2,20', 'unique:admin_users,name,'.auth('admin')->id(), new AllowLetterNumber()],
            'user_name' => 'required|unique:admin_users,user_name,'.auth('admin')->id(),
            'password' => 'nullable|between:6,20'
        ];
    }

    public function messages()
    {
        return [
            'name.required'      => '登录名必填',
            'user_name.required'      => '昵称必填',
            'name.between' => '登录名必须在2到20个字符之间',
            'name.unique' => '登录名不可重复',
            'password.between' => '密码长度必须在6到20个字符之间',
        ];
    }
}
