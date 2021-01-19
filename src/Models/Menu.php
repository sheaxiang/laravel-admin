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
		'hidden',
		'icon',
		'path',
	];

	protected $casts = [
		'hidden' => 'boolean'
	];
}
