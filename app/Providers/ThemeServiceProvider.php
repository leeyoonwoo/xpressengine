<?php
/**
 * @author      XE Developers <developers@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html LGPL-2.1
 * @link        https://xpressengine.io
 */

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Xpressengine\Plugin\PluginRegister;
use Xpressengine\Support\Exceptions\AccessDeniedHttpException;
use Xpressengine\Theme\AbstractTheme;
use Xpressengine\Theme\ThemeHandler;

class ThemeServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application events.
     *
     * @return void
     */
    public function boot()
    {
        // TODO: move code to valid location!!!
        // TODO: check permission!!
        $this->registerInterceptForThemePreview();
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(ThemeHandler::class, function ($app) {
            /** @var PluginRegister $register */
            $register = $app['xe.pluginRegister'];

            $themeHandler = $app['xe.interception']->proxy(ThemeHandler::class, 'XeTheme');

            $blankThemeClass = $app['config']->get('xe.theme.blank');

            /** @var ThemeHandler $themeHandler */
            $themeHandler = new $themeHandler($register, $app['xe.config'], $app['view'], $blankThemeClass::getId());
            $themeHandler->setCachePath(storage_path('app/theme/views'));

            return $themeHandler;
        });
        $this->app->alias(ThemeHandler::class, 'xe.theme');

        $this->resolving();
    }

    /**
     * Register resolving callbacks.
     *
     * @return void
     */
    protected function resolving()
    {
        $this->app->resolving('xe.theme', function () {
            $this->registerMobileResolver();
            $this->setThemeHandlerForTheme();
        });
    }

    /**
     * registerInterceptForThemePreview
     *
     * @return void
     */
    protected function registerInterceptForThemePreview()
    {
        $preview_theme = $this->app['request']->get('preview_theme', null);
        if ($preview_theme !== null) {
            intercept(
                'XeTheme@getSelectedTheme',
                'preview_theme',
                function ($target) use ($preview_theme) {
                    if (!auth()->user()->isAdmin()) {
                        throw new AccessDeniedHttpException();
                    }

                    /** @var ThemeHandler $themeHandler */
                    $themeHandler = $target->getTargetObject();
                    $themeHandler->selectTheme($preview_theme);
                    return $target();
                }
            );
        }
    }

    private function registerMobileResolver()
    {
        $this->app['xe.theme']->setMobileResolver(function(){
            return app('request')->isMobile();
        });
    }

    private function setThemeHandlerForTheme()
    {
        AbstractTheme::setHandler($this->app->make('xe.theme'));
    }
}
