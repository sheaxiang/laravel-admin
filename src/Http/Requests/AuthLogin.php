<?php

namespace SheaXiang\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthLogin extends FormRequest
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
            'name'        => 'required',
            'password' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'      => '账号必填',
            'password.required' => '密码必填',
        ];
    }
}
