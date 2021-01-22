<?php

namespace SheaXiang\Admin\Http\Controllers;

use SheaXiang\Admin\Services\UploadService;
use SheaXiang\Admin\Http\Requests\StoreUploadFile;
use Illuminate\Http\Request;

class UploadController extends BaseController
{
    public $uploadService;

    public $request;

    public function __construct(UploadService $uploadService, Request $request)
    {
        $this->uploadService = $uploadService;
        $this->request = $request;
    }

    /**
     * 上传图片
     */
    public function image($type)
    {
        return succeed($this->uploadService->upload($this->request->file('image'), "admin/$type"));
    }

    /**
     * 上传编辑器图片
     */
    public function editorImage($type)
    {
        return succeed($this->uploadService->upload($this->request->file('image'), "admin/editorImage/$type"));
    }

    /**
     * 上传编辑器内的文件
     */
    public function sliceEditor(StoreUploadFile $request)
    {
        return succeed($this->uploadService->slice($this->request->file('file'), $request->identifier, $request->chunkNumber,$request->totalChunks, $request->totalSize, 'admin/editor'));
    }
}
