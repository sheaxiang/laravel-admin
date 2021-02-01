<?php

namespace SheaXiang\Admin\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OperationLog extends Model
{
    protected $table = 'admin_operation_logs';

    protected $fillable = ['user_id', 'path', 'method', 'ip', 'input'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class,'user_id');
    }
}
