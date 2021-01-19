<?php

namespace SheaXiang\Admin\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class AdminUser extends Authenticatable implements JWTSubject
{
	use Notifiable, SoftDeletes;

	protected $guard_name = 'admin';

    protected $dates = ['deleted_at'];

	protected $hidden = ['password'];

	protected $fillable = [
		'name',
        'password',
        'avatar',
        'user_name',
        'status',
        'token'
	];

	/**
	 * Get the identifier that will be stored in the subject claim of the JWT.
	 *
	 * @return mixed
	 */
	public function getJWTIdentifier()
	{
		return $this->getKey();
	}

	/**
	 * Return a key value array, containing any custom claims to be added to the JWT.
	 *
	 * @return array
	 */
	public function getJWTCustomClaims()
	{
		return [];
	}
}
