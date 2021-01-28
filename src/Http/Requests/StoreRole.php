<?php

namespace SheaXiang\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use SheaXiang\Admin\Rules\AllowLetterNumber;

class StoreRole extends FormRequest
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
		$id = $this->route('role');
        return [
			'permissions' => 'array|nullable',
			'name' => ['required', 'between:2,20', 'unique:admin_roles,name,'.$id, new AllowLetterNumber()],
			'slug' => ['required', 'between:2,20', 'unique:admin_roles,slug,'.$id]
        ];
    }

	public function messages()
	{
		return [
			'permissions.array' => '权限为数组',
			'name.required'      => '角色名称必填',
			'name.between' => '角色名称必须在2到20个字符之间',
			'name.unique' => '角色名称不可重复',
			'name.allow_letter'      => '角色名称必须为英文',
            'slug.required'      => '标识必填',
			'slug.between' => '标识必须在2到20个字符之间',
			'slug.unique' => '标识不可重复',
			'slug.allow_letter'      => '标识必须为英文',
		];
	}
}
