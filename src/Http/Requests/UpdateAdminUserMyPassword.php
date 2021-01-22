<?php

namespace SheaXiang\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdminUserMyPassword extends FormRequest
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
            'old_password' => 'required',
            'password' => 'required|between:6,20|confirmed',
            'password_confirmation' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'old_password.required'      => '旧密码必填',
            'password.required'      => '密码必填',
            'password.between'      => '密码必须在6到20个字符之间',
            'password_confirmation.required' => '确认密码必填',
            'password.confirmed' => '两次密码不一致',
        ];
    }
}
