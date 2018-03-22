<?php
/**
 * This file is tag package service provider class.
 *
 * PHP version 5
 *
 * @category    Tag
 * @package     Xpressengine\Tag
 * @author      XE Developers <developers@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html LGPL-2.1
 * @link        https://xpressengine.io
 */

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Xpressengine\Tag\SimpleDecomposer;
use Xpressengine\Tag\Tag;
use Xpressengine\Tag\TagHandler;
use Xpressengine\Tag\TagRepository;

/**
 * laravel 에서의 사용을 위한 register
 *
 * @category    Tag
 * @package     Xpressengine\Tag
 */
class TagServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application events.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->resolving('xe.tag', function () {
            TagRepository::setModel(Tag::class);
        });
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(TagHandler::class, function ($app) {
            $proxyClass = $app['xe.interception']->proxy(TagHandler::class, 'XeTag');

            return new $proxyClass(new TagRepository, new SimpleDecomposer);
        });
        $this->app->alias(TagHandler::class, 'xe.tag');
    }
}
