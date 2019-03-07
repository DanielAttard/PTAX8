<?php
use Silex\Application;
use Silex\Provider\TwigServiceProvider;
$app = new Application();
$app->register(new TwigServiceProvider());
$app['twig.path'] = [ __DIR__ ];

$app->get('/', function () use ($app) {
    $twig = $app['twig'];
    return $twig->render('amp.twig');
});

$app->get('/am/q', function () use ($app) {
    $twig = $app['twig'];
    return $twig->render('amq.twig');
});

$app->post('/am/q', function () use ($app) {
    $twig = $app['twig'];

    $dirname = dirname(__FILE__);
    define('USER', 'Debdulal');
    define('PASS', '4Ew3vM!CitEmhTT');
    // define('USER', 'AMP_R');
    // define('PASS', 'gh-B5zi6597PqXh');
    define('COOKIE_DIR', $dirname . DIRECTORY_SEPARATOR . 'tmp');


    if (! file_exists(COOKIE_DIR))
	{
	    mkdir(COOKIE_DIR, 0777, TRUE);
	}
	$starttime = microtime(true);
    $COOKIE_FILE = '';
	$LOGGED_USER = doLogin ();
    if (!isLoggedIn ()){
		die ("Login Failed");
    }
    $RN = '190410123000100';   //$_POST['RN'];	
    dumpVar('RN:'.number_format($RN,0,'',''));


    $POILists   = [];
	//$POILists[] = '190410123000800';


    $POILists = getPOIList ();  
    dumpVar($POILists);

    //showPOIList($POIList);
    //$a = ($_POST['rollNum']=="" ? end(array_values($POIList)) : $_POST['rollNum']);
    //$a = $_POST['rollNum'];
    //$b = getPOIDetailsJSON ($_POST['rollNum']);	
	//$c = json_decode($b);
    //$d = json_encode($c, JSON_UNESCAPED_SLASHES);
	//$e = json_decode($d, JSON_PRETTY_PRINT);
    $endtime = microtime(true);
    $timediff = $endtime - $starttime;

    dumpVar ("USER: ".USER."   PASS: ".PASS." <br>COOKIE_DIR: ".COOKIE_DIR.'<br>');
    dumpVar ("As of ".date("Y-m-d H:i:s").", ".USER." has used ".count($POILists)." of 100 Snapshot Views.");
	dumpVar ("Data for ".$_POST['rollNum']." retrieved in ".round($timediff, 1)." seconds:");
    //dumpVar ($e);
    
    //@unlink($COOKIE_FILE);   

    return $twig->render('amq.twig');
});

$app->post('/am/q', function () use ($app) {
    $twig = $app['twig'];

    $dirname = dirname(__FILE__);
    // define('USER', 'Debdulal');
    // define('PASS', '4Ew3vM!CitEmhTT');
    define('USER', 'AMP_R');
    define('PASS', 'gh-B5zi6597PqXh');
    define('COOKIE_DIR', $dirname . DIRECTORY_SEPARATOR . 'tmp');


    if (! file_exists(COOKIE_DIR))
	{
	    mkdir(COOKIE_DIR, 0777, TRUE);
	}
	$starttime = microtime(true);
    $COOKIE_FILE = '';
	$LOGGED_USER = doLogin ();
    if (!isLoggedIn ()){
		die ("Login Failed");
    }
    $RN = '190410123000100';   //$_POST['RN'];	
    dumpVar('RN:'.number_format($RN,0,'',''));


    $POILists   = [];
	//$POILists[] = '190410123000800';


    $POILists = getPOIList ();  
    dumpVar($POILists);

    //showPOIList($POIList);
    //$a = ($_POST['rollNum']=="" ? end(array_values($POIList)) : $_POST['rollNum']);
    //$a = $_POST['rollNum'];
    //$b = getPOIDetailsJSON ($_POST['rollNum']);	
	//$c = json_decode($b);
    //$d = json_encode($c, JSON_UNESCAPED_SLASHES);
	//$e = json_decode($d, JSON_PRETTY_PRINT);
    $endtime = microtime(true);
    $timediff = $endtime - $starttime;

    dumpVar ("USER: ".USER."   PASS: ".PASS." <br>COOKIE_DIR: ".COOKIE_DIR.'<br>');
    dumpVar ("As of ".date("Y-m-d H:i:s").", ".USER." has used ".count($POILists)." of 100 Snapshot Views.");
	dumpVar ("Data for ".$_POST['rollNum']." retrieved in ".round($timediff, 1)." seconds:");
    //dumpVar ($e);
    
    @unlink($COOKIE_FILE);   

    return $twig->render('amq.twig');
});

// $app->post('/', function () use ($app) {
//     $twig = $app['twig'];
//     return $twig->render('amp.twig');
// });


$app->post('/am/p', function () use ($app) {
    $twig = $app['twig'];
    $dirname = dirname(__FILE__);
    define('USER', 'AMP_R');
    define('PASS', 'gh-B5zi6597PqXh');
    // define('USER', 'Debdulal');
    // define('PASS', '4Ew3vM!CitEmhTT');

    define('COOKIE_DIR', $dirname . DIRECTORY_SEPARATOR . 'tmp');
	dumpVar ("USER: ".USER."   PASS: ".PASS." <br>COOKIE_DIR: ".COOKIE_DIR.'<br>');
	if (! file_exists(COOKIE_DIR))
	{
	    mkdir(COOKIE_DIR, 0777, TRUE);
	}
	$starttime = microtime(true);
    $COOKIE_FILE = '';
    $LOGGED_USER = doLogin ();	    
    if (!isLoggedIn ()){
		die ("Login Failedddd");
	}
    
    $RN = '190410123000100';   //$_POST['RN'];	
    dumpVar('RN:'.number_format($RN,0,'',''));
    

	$data = getPOIDetailsJSON ($RN);	
	$json = json_decode($data);
	$mpac = json_encode($json, JSON_PRETTY_PRINT);
	$endtime = microtime(true);
	$timediff = $endtime - $starttime;
	dumpVar ("Elapsed time is ".round($timediff, 1)." seconds:");
	dumpVar ($mpac);
    return $twig->render('amp.twig');
    //return $twig->render('amp.twig', ['amp_curl' => json_decode($result,true)]);
});


function dumpVar ($message = null){
    echo "<pre>";
    print_r ($message);
    echo "</pre>";
}

function doLogin() {
	
    global $COOKIE_FILE;
    $COOKIE_FILE = tempnam (COOKIE_DIR, "CURLCOOKIE");
    $target_url  = 'https://aboutmyproperty.ca/auth/process';

    $data              = array ();
    $data['userID']    = USER;
    $data['password']  = PASS;
    $data['captcha']   = 'on';

    $fields_string = '';
    foreach($data as $key => $value)
    {
       $fields_string .= '&'.$key.'='.$value;
    }

    $fields_string=ltrim($fields_string,'&');

    $headers   = [];
    $headers[] = 'Host: aboutmyproperty.ca';
    $headers[] = 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0';
    $headers[] = 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
    $headers[] = 'Accept-Language: en-US,en;q=0.5';
    $headers[] = 'Referer: https://aboutmyproperty.ca/';
    $headers[] = 'Content-Type: application/x-www-form-urlencoded';
    $headers[] = 'Connection: keep-alive';
    $headers[] = 'Upgrade-Insecure-Requests: 1';
    $headers[] = 'Content-Length: '.strlen($fields_string);

    $s = curl_init();
    curl_setopt($s, CURLOPT_URL, $target_url);
    curl_setopt($s, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($s, CURLOPT_POST, true);
    curl_setopt($s, CURLOPT_POSTFIELDS, $fields_string);
    curl_setopt($s, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($s, CURLOPT_HEADER, 0);
    curl_setopt($s, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($s, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($s, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0');
    curl_setopt($s, CURLOPT_COOKIEJAR, $COOKIE_FILE);
    curl_setopt($s, CURLOPT_COOKIEFILE, $COOKIE_FILE);

    $contents = curl_exec($s);
    $contents = json_decode ($contents, true);

    if ($contents['success']==1){
        return TRUE;
    }
    else{
        return FALSE;
    }
}

function isLoggedIn () {
    global $COOKIE_FILE;
    $target_url  = 'https://aboutmyproperty.ca/neighbourhood';

    $headers   = [];
    $headers[] = 'Host: aboutmyproperty.ca';
    $headers[] = 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0';
    $headers[] = 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
    $headers[] = 'Accept-Language: en-US,en;q=0.5';
    $headers[] = 'Referer: https://aboutmyproperty.ca/pierportal';
    $headers[] = 'Connection: keep-alive';
    ##$headers[] = 'Cookie: PHPSESSID=ks8nbusp2mesdevlim091d85o7; mpac_captcha=1; mpac_captchaSnapshotFrequency=50; cc_mode=default; _ga=GA1.2.2006699545.1548895585; _gid=GA1.2.569840335.1548895585; font_zoom=0; _gat=1; mpac_locale=en_EN; pier=1';
    $headers[] = 'Upgrade-Insecure-Requests: 1';
    $headers[] = 'TE: Trailers';

    $s = curl_init();
    curl_setopt($s, CURLOPT_URL, $target_url);
    curl_setopt($s, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($s, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($s, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($s, CURLOPT_HEADER, 0);
    curl_setopt($s, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($s, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($s, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0');
    curl_setopt($s, CURLOPT_COOKIEJAR, $COOKIE_FILE);
    curl_setopt($s, CURLOPT_COOKIEFILE, $COOKIE_FILE);

    $contents = curl_exec($s);

    if (preg_match('/Sign Out/ims', $contents, $match1)
        || preg_match('/\/auth\/logout/ims', $contents, $match2)
    ) {
        return TRUE;
    }else{
        return FALSE;
    }
}





return $app;



?>