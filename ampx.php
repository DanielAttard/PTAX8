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

$app->post('/', function () use ($app) {
    $twig = $app['twig'];
    return $twig->render('amp.twig');
});

$app->get('/am/p', function () use ($app) {
    $twig = $app['twig'];
    return $twig->render('amp.twig');
});


$app->post('/am/p', function () use ($app) {
    $twig = $app['twig'];   
    
    // test roll number: 211010002528200
    
    define('USER', 'Debdulal');
    define('PASS', '4Ew3vM!CitEmhTT');
    define('COOKIE_DIR', sys_get_temp_dir());
    
	//if (! file_exists(COOKIE_DIR))
	//{
	//   mkdir(COOKIE_DIR, 0777, TRUE);
	//}

    $starttime = microtime(true);
    $COOKIE_FILE = '';
    $LOGGED_USER = doLogin ();	    
    if (!isLoggedIn ()){
		die ("Login Failed");
	}
    $RN = '190410123000100';   //$_POST['RN'];	
    dumpVar('RN:'.number_format($RN,0,'',''));
    // Debdulal - This is the function call that fails, 
    // It does not seem to use correct cookie_file 
    $POIList = getPOIList (); 
    //$data = getPOIDetailsJSON ($RN);	
	//$json = json_decode($data);
	//$mpac = json_encode($json, JSON_PRETTY_PRINT);
	$endtime = microtime(true);
	$timediff = $endtime - $starttime;
	dumpVar ("Elapsed time is ".round($timediff, 1)." seconds:");
	//dumpVar ($mpac);
    return $twig->render('amp.twig');
    //return $twig->render('amp.twig', ['amp_curl' => json_decode($result,true)]);
});

return $app;

function dumpVar ($message = null){
    echo "<pre>";
    print_r ($message);
    echo "</pre>";
}

function doLogin() {
    global $COOKIE_FILE;
//    $COOKIE_FILE = tempnam (COOKIE_DIR, "CURLCOOKIE_");
    $COOKIE_FILE = tempnam (sys_get_temp_dir(), "CURLCOOKIE_");
    $target_url = 'https://aboutmyproperty.ca/auth/process';
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
    ##$headers[] = 'Cookie: mpac_captcha=1; mpac_captchaSnapshotFrequency=50; cc_mode=default; _ga=GA1.2.644130062.1548890007; _gid=GA1.2.718278349.1548890007; font_zoom=0; mpac_locale=en_EN; pier=1; PHPSESSID=4ii7cu4k162f87b344vjvd4iv6';
    $headers[] = 'Upgrade-Insecure-Requests: 1';
    $headers[] = 'Content-Length: '.strlen($fields_string);
    $s = curl_init();
    curl_setopt($s, CURLOPT_URL, $target_url);
    curl_setopt($s, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($s, CURLOPT_POST, true);
    curl_setopt($s, CURLOPT_POSTFIELDS, $fields_string);
    curl_setopt($s, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($s, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($s, CURLOPT_HEADER, 0);
    curl_setopt($s, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($s, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($s, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0');
    curl_setopt($s, CURLOPT_COOKIEJAR, $COOKIE_FILE);
    curl_setopt($s, CURLOPT_COOKIEFILE, $COOKIE_FILE);
    $contents = curl_exec($s);
    $contents = json_decode ($contents, true);
    dumpVar($contents);
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

function getPOIList () {
    global $COOKIE_FILE;

    dumpVar("COOKIE_DIR: ".COOKIE_DIR.'<br>');
    dumpVar("COOKIE_FILE:".$COOKIE_FILE);

    $target_url = "https://aboutmyproperty.ca/neighbourhood/list/mode/poi";

    $headers   = [];
    $headers[] = 'Host: aboutmyproperty.ca';
    $headers[] = 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0';
    $headers[] = 'Accept: */*';
    $headers[] = 'Accept-Language: en-US,en;q=0.5';
    $headers[] = 'Referer: https://aboutmyproperty.ca/neighbourhood';
    $headers[] = 'X-Requested-With: XMLHttpRequest';
    $headers[] = 'Connection: keep-alive';
    $headers[] = 'Cache-Control: max-age=0';
    $headers[] = 'TE: Trailers';

    $s = curl_init();
    curl_setopt($s, CURLOPT_URL, $target_url);
    curl_setopt($s, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($s, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($s, CURLOPT_HEADER, 0);
    curl_setopt($s, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($s, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($s, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0');
    curl_setopt($s, CURLOPT_COOKIEJAR, $COOKIE_FILE);
    curl_setopt($s, CURLOPT_COOKIEFILE, $COOKIE_FILE);
    
    $contents = curl_exec($s);
    dumpVar($contents);
    
    sleep (1);
    curl_close($s);

    $prop_json = json_decode($contents, true);

    return $prop_json['data']['snaps'];
}

function getPOIDetailsJSON ($snap) {
    global $COOKIE_FILE;

    $target_url = "https://aboutmyproperty.ca/property/json/$snap/poi";
    
    $headers   = [];
    $headers[] = 'Host: aboutmyproperty.ca';
    $headers[] = 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0';
    $headers[] = 'Accept: application/json, text/javascript, */*; q=0.01';
    $headers[] = 'Accept-Language: en-US,en;q=0.5';
    $headers[] = 'Referer: https://aboutmyproperty.ca/neighbourhood';
    $headers[] = 'X-Requested-With: XMLHttpRequest';
    $headers[] = 'Connection: keep-alive';
    ##$headers[] = 'Cookie: PHPSESSID=m0t77jgbccolpikv6qt43uu9p5; mpac_captcha=1; mpac_captchaSnapshotFrequency=50; cc_mode=default; _ga=GA1.2.644130062.1548890007; _gid=GA1.2.718278349.1548890007; font_zoom=0; mpac_locale=en_EN; pier=1; dontShowNeighbourhoodHelp=true';
    $headers[] = 'Content-Length: 0';
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

    dumpVar($contents);

    sleep (1);
    curl_close($s);

    return $contents;
}
