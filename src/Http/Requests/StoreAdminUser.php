<?php
namespace SheaXiang\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use SheaXiang\Admin\Rules\AllowLetterNumber;

class StoreAdminUser extends FormRequest
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
        $id = $this->route('admin_user');
        $rules =  [
            'password' => 'nullable|between:4,20',
            'name'        => ['required', 'between:2,20', 'unique:admin_users,name,'.$id, new AllowLetterNumber()],
            'user_name'        => 'required|unique:admin_users,user_name,'.$id
        ];

        if (!$id) {
            $rules['password'] = 'required';
        }
        return $rules;
    }

    public function messages()
    {
        return [
            'name.required'      => '管理员名称必填',
            'name.between' => '管理员名称必须在2到20个字符之间',
            'name.unique' => '管理员名称不可重复',
            'name.allow_letter_number' => '登录名只能为英文和数字',
            'password.required'      => '密码必填',
            'name.allow_letter'      => '管理员名称必须为英文',
            'password.between' => '密码长度必须在4到20个字符之间',
            'user_name.required' => '管理员用户名必填',
            'user_name.unique' => '管理员用户名不可重复',
        ];
    }
}
