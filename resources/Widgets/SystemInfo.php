<?php
/**
 * @author      XE Developers <developers@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html LGPL-2.1
 * @link        https://xpressengine.io
 */

namespace Xpressengine\Widgets;

use Config;
use View;
use Xpressengine\Widget\AbstractWidget;

/**
 * SystemInfo.php
 *
 * PHP version 5
 *
 * @category
 */
class SystemInfo extends AbstractWidget
{

    protected static $id = 'widget/xpressengine@systemInfo';

    /**
     * getCodeCreationForm
     *
     * @param array $args
     *
     * @return mixed
     */
    public function renderSetting(array $args = [])
    {
        // TODO: Implement renderSetting() method.
    }

    /**
     * render
     *
     * @return mixed
     * @internal param array $args to render parameter array
     *
     */
    public function render()
    {
        $request = app('request');

        $viewData = [
            'serverSoftware' => $request->server("SERVER_SOFTWARE"),
            'phpVersion' => phpversion(),
            'debugMode' => $request->server("APP_DEBUG"),
            'cacheDriver' => config('cache.default'),
            'documentRoot' => $request->server("DOCUMENT_ROOT"),
            'maintenanceMode' => app()->isDownForMaintenance(),
            'timeZone' => Config::get('app.timezone')
        ];

        return View::make('widget.widgets.systemInfo.show', [
            'viewData' => $viewData,
        ]);
    }
}
