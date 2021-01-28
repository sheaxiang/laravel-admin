<?php

namespace SheaXiang\Admin\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    protected $table = 'admin_roles';

    protected $fillable = [
    	'name',
		'slug'
	];

    public function administrators(): BelongsToMany
    {
        return $this->belongsToMany(AdminUser::class, 'admin_role_users', 'role_id', 'user_id');
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'admin_role_permissions', 'role_id', 'permission_id');
    }

    public function can(string $permission): bool
    {
        return $this->permissions()->where('slug', $permission)->exists();
    }

    public function cannot(string $permission): bool
    {
        return !$this->can($permission);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($model) {
            $model->administrators()->detach();

            $model->permissions()->detach();
        });
    }
}
