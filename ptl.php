<?php
use Silex\Application;
use Silex\Provider\TwigServiceProvider;
$app = new Application();
$app->register(new TwigServiceProvider());
$app['twig.path'] = [ __DIR__ ];

///////////// MPAC DISCLOSURE ////////////////////////////////
$app->get('/mpac/disclosure', function () use ($app) {
    /** @var Twig_Environment $twig */
    $twig = $app['twig'];
    return $twig->render('md.twig');
});

$app->post('/mpac/disclosure', function () use ($app) {
    /** @var Twig_Environment $twig */
    $twig = $app['twig'];
    $url = 'https://sightline.mpac.ca/casemgmt/get-pack';
    $ch = curl_init();
    $options = [
        CURLOPT_URL => $url,
        CURLOPT_POST => 2,
        CURLOPT_POSTFIELDS => "{\"uriKey\":\"bd8a07c615bc20bd24ec355d52ccc469\",\"rollNumber\":\"".$_POST['ROLL_NUMBER']."\"}",
        CURLOPT_RETURNTRANSFER => true
    ];
    curl_setopt_array($ch, $options);
    $result = curl_exec($ch);
    curl_close($ch);
    return $twig->render('md.twig', ['md_curl' => json_decode($result,true)]);
});

/////////// PROPERTY TAX LOOKUP ///////////////////////
$app->get('/', function () use ($app) {
    /** @var Twig_Environment $twig */
    $twig = $app['twig'];
    return $twig->render('ptl.twig');
});
$app->get('/toronto/tax', function () use ($app) {
    /** @var Twig_Environment $twig */
    $twig = $app['twig'];
    return $twig->render('ptl.twig');
});
$app->post('/toronto/tax', function () use ($app) {
    /** @var Twig_Environment $twig */
    $twig = $app['twig'];
    $url = 'https://secure.toronto.ca/cc_api/account/view';
    $ch = curl_init();
    $options = [
        CURLOPT_URL => $url,
        CURLOPT_POST => 4,
        CURLOPT_POSTFIELDS => "{\"ROLL_NUMBER\":\"".$_POST['ROLL_NUMBER']."\",\"LAST_NAME\":\"".$_POST['LAST_NAME']."\",\"POSTAL_CODE\":\"".$_POST['POSTAL_CODE']."\",\"CUSTOMER_NUMBER\":\"".$_POST['CUSTOMER_NUMBER']."\"}",
        CURLOPT_RETURNTRANSFER => true,
    ];
    curl_setopt_array($ch, $options);
    $result = curl_exec($ch);
    curl_close($ch);
    return $twig->render('ptl.twig', ['ptl_curl' => json_decode($result,true)]);
});
return $app;
