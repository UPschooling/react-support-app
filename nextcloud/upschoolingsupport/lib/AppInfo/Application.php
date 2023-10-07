<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: Dennis Nikolay <dennisnikolay@posteo.de>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\UPschoolingSupport\AppInfo;

use OCP\AppFramework\App;

class Application extends App {
	public const APP_ID = 'upschoolingsupport';

	public function __construct() {
		parent::__construct(self::APP_ID);
	}
}
