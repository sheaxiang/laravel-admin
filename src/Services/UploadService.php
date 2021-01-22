<?php


namespace SheaXiang\Admin\Services;


use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class UploadService
{
    //定义一个允许的后缀名属性
    protected $allow_image_ext = ['jpg', 'jpeg', 'png', 'gif'];

    protected $baseImagePath = '/uploads/images/';

    protected $baseFilePath = '/uploads/';

    protected $baseSliceFilePath = '/uploads/slice/';


    public function upload($file, string $uploadDir, $type = 1, $isTranscode = false)
    {
        $response = [];

        switch ($type) {
            case 1:
                $response = $this->image($file, $uploadDir, $isTranscode);
                break;
        }

        return $response;
    }

    public function image($file, $uploadDir, $isTranscode)
    {
        //进行后缀名的验证,如果没有那么就默认为png
        $extension = $this->formatFileExtension($file->getClientOriginalExtension(), 'png');
        $originalName = $file->getClientOriginalName();

        if (!in_array($extension, $this->allow_image_ext)) {
            return false;
        }

        //定义存储路径
        $folder_name =  $this->baseImagePath . $uploadDir . '/' . date("Ym/d/");

        //定义文件名
        $file_name = $this->generateFileNameAndExtension($extension);

        //将图片移动到目标储存位置
        $file->move(public_path($folder_name), $file_name);
        $url = $folder_name . $file_name;
        $previewPath = $folder_name . 'preview/';
        $previewAndNamePath = $previewPath . $file_name;

        if ($isTranscode) {
            if (!is_dir(public_path($previewPath))) {
                mkdir(public_path($previewPath), 777, true);
            }

            Image::make(public_path($url))->resize(737, 485)->save(public_path($previewAndNamePath));
        }

        //返回图片已经存储的路径
        return ['url' => $url, 'originalName' => $originalName, 'dirName' => $folder_name,
            'transcodePath' => $previewAndNamePath, 'extension' => $extension, 'host' => url('/')];
    }

    //todo 错误格式
    public function slice($file, $identifier, $blob_num, $total_blob_num, $totalSize, $filePath)
    {
        //原始名称,带后缀
        $originalName = $file->getClientOriginalName();

        $realPath = $file->getRealPath(); //临时文件的绝对路径

        $extension = $file->getClientOriginalExtension();

        //定义存储路径

        $fileTempPath = $this->baseSliceFilePath . '/' . date("Ym/d") . '/' . $extension . '/' . $identifier . '.' . $extension . '.temp';
        $fileRealTempPath = public_path($fileTempPath);

        //上传分片
        if (!File::exists($fileRealTempPath)) {
            if (Storage::disk('local')->put($fileTempPath, '') === false) {
                throw new \Exception('创建临时文件失败');
            }
        }

        if (File::append($fileRealTempPath, File::get($realPath)) === false) {
            throw new \Exception('分块写入文件失败');
        }

        //判断是否是最后一块，如果是则进行文件合成
        if ($blob_num == $total_blob_num) {
            $fileName = $this->generateFileName();
            $dirName = $this->baseFilePath . $filePath . '/' . date("Ym/d") . '/' . $extension . '/' . $fileName . '/';
            $filePath =  $dirName . $fileName . '.' . $extension;

            if (File::size($fileRealTempPath) != $totalSize) {
                Storage::disk('local')->delete($fileTempPath);

                throw new \Exception('上传文件被损坏,请重新上传');
            }

            if (Storage::disk('local')->move($fileTempPath, $filePath) === false) {
                throw new \Exception('合并资源失败');
            }

            //主要解决文件加密变成stream的情况
            return ['url' => $filePath, 'originalName' => $originalName, 'extension' => $extension, 'fileName' => $fileName, 'dirName' => $dirName, 'fileType' => mime_content_type(public_path($filePath))];
        }

        return ['blob_num' => $blob_num, 'total_blob_num' => $total_blob_num];
    }

    public function generateFileNameAndExtension($extension)
    {
        return $this->generateFileName() . "." . $extension;
    }

    public function generateFileName()
    {
        return time() . "_" .  Str::random(10);
    }

    public function formatFileExtension($extension, $default = null)
    {
        return $extension ? strtolower($extension) : $default;
    }
}
