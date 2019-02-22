<?php
// Install composer dependencies with "composer install"
// @see http://getcomposer.org for more information.
require __DIR__ . '/vendor/autoload.php';

// $app = require __DIR__ . '/app.php';
//$app = require __DIR__ . '/ptl.php';
$app = require __DIR__ . '/amp.php';

// Run the app!
// use "gcloud app deploy" or run locally with dev_appserver.py
$app['debug'] = true;
$app->run();
