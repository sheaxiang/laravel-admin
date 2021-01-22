<?php

namespace SheaXiang\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUploadFile extends FormRequest
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
            'file'      => 'file',
            'identifier'      => 'required',
            'chunkNumber'      => 'required',
            'totalChunks'      => 'required',
            'totalSize'      => 'required',
        ];
    }

	public function messages()
	{
		return [
			'file.file'      => '不是一个文件',
			'identifier.required'      => '文件唯一名称必传',
			'chunkNumber.required'      => '当前分块数量必传',
			'totalChunks.required'      => '总分块必传',
			'totalSize.required'      => '总文件大小必传',
		];
	}
}
