<?php
/**
 * AbstractWidget class. This file is part of the Xpressengine package.
 *
 * PHP version 5
 *
 * @category    Widget
 * @package     Xpressengine\Widget
 * @author      XE Developers <develops@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html LGPL-2.1
 * @link        https://xpressengine.io
 */

namespace Xpressengine\Widget;

use Xpressengine\Plugin\ComponentInterface;
use Xpressengine\Plugin\ComponentTrait;

/**
 * 이 클래스는 Xpressengine 에서 Widget 구현할 때 필요한 추상클래스이다.
 * Widget 를 Xpressengine 에 등록하려면
 * 이 추상 클래스를 상속받은 클래스를 작성하여야 한다.
 *
 * @category    Widget
 * @package     Xpressengine\Widget
 * @author      XE Developers <developers@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER Corp. <http://www.navercorp.com>
 * @license     http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html LGPL-2.1
 * @link        https://xpressengine.io
 */
abstract class AbstractWidget implements ComponentInterface
{
    use ComponentTrait;

    /**
     * @var array
     */
    public static $ratingWhiteList = ['super', 'manager', 'member', 'guest'];

    protected $config;

    public function __construct($config = null)
    {
        $this->config = $config;
    }

    /**
     * getCodeCreationForm
     *
     * @param array $args
     *
     * @return mixed
     */
    public function renderSetting(array $args = [])
    {
        return null;
    }

    public function resolveSetting(array $inputs = [])
    {
        return $inputs;
    }

    /**
     * set or get config info
     *
     * @param array|null $config
     *
     * @return array|void
     */
    public function setting(array $config = null)
    {
        if($config !== null) {
            $this->config = $config;
        }
        return $this->config;
    }

}
