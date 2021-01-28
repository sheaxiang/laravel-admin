<?php

namespace SheaXiang\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use SheaXiang\Admin\Rules\AllowLetterNumber;

class StorePermissions extends FormRequest
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
		$id = $this->route('permission');
        return [
			'name' => ['required', 'unique:admin_permissions,name,'.$id],
			'slug' => ['required', 'unique:admin_permissions,slug,'.$id, new AllowLetterNumber()],
        ];
    }

	public function messages()
	{
		return [
			'name.required'      => '权限名称必填',
			'name.unique' => '权限名称不可重复',
            'slug.required'      => '标识必填',
			'slug.allow_letter'      => '标识必须为英文',
			'slug.unique' => '标识不可重复',
		];
	}
}
