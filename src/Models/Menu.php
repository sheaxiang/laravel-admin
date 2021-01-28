<?php

namespace SheaXiang\Admin\Models;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

class Menu extends Model
{
	use NodeTrait;

    protected $fillable = [
    	'_lft',
		'_rgt',
		'parent_id',
		'name',
		'order',
		'is_hide',
		'icon',
		'path',
	];

    protected $appends = [
        'hideInMenu'
    ];

    public function getHideInMenuAttribute()
    {
        return (boolean) $this->is_hide;
    }
}
