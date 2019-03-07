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

// $app->post('/', function () use ($app) {
//     $twig = $app['twig'];
//     return $twig->render('amp.twig');
// });

// $app->get('/am/p', function () use ($app) {
//     $twig = $app['twig'];
//     return $twig->render('amp.twig');
// });


$app->post('/am/p', function () use ($app) {
    $twig = $app['twig'];   

    define('USER', 'Debdulal');
    define('PASS', '4Ew3vM!CitEmhTT');

    $COOKIE_DATA = '';
	$LOGGED_USER = doLogin ();

	if (!isLoggedIn ()){
		die ("Login Failed");
    }
 
    $POIList = getPOIList();
    $poiCount = count($POIList);
    //use POST rn if used, else use last in POIList, which unfortunately seems to be ordered by rollnum instead of entry date
    $rn     = (isset ($_POST['ROLL_NUMBER']) && !empty ($_POST['ROLL_NUMBER'])) ? $_POST['ROLL_NUMBER'] : end(array_values($POIList));
    $poiJSON = getPOIDetailsJSON ($rn);

//     //$LOGIN_STATUS = isLoggedIn();	 
//     //dumpVar('LOGIN_STATUSxxx:'.$LOGIN_STATUS);

//     if (!isLoggedIn ()){
//         dumpVar('Need to login...');
//         define('USER', 'Debdulal');
//         define('PASS', '4Ew3vM!CitEmhTT');    
//         //$starttime = microtime(true);
//         //$COOKIE_FILE = '';
//         $LOGGED_USER = doLogin ();	        
//         $rn = '190410169000200';
//         $poiJSON = getPOIDetailsJSON ($rn);
//         //$POIList = getPOIList();
//         //dumpVar ($POIList);
//         //if rn is not posted, then use the first/last from getPOIList
//         //end(array_values($POIList))
//         //dumpVar (end(array_values($POIList)));
//         // $rn     = (isset ($_POST['ROLL_NUMBER']) && !empty ($_POST['ROLL_NUMBER'])) ? $_POST['ROLL_NUMBER'] : end(array_values($POIList));
         dumpVar ("As of ".date("Y-m-d H:i:s").", ".USER." has used ".count($POIList)." of 100 Snapshot Views.");
//         //$rn     = (isset ($_POST['ROLL_NUMBER']) && !empty ($_POST['ROLL_NUMBER'])) ? $_POST['ROLL_NUMBER'] : '190410169000300';
//         //dumpVar ("Data for ".$_POST['rollNum']." retrieved in ".round($timediff, 1)." seconds:");

//   //      dumpVar (json_decode($poiJSON));
//         //echo "stop";    
//       //  exit;
// //        return $twig->render('amp.twig', ['amp_curl' => json_decode($poiJSON,true)]);
        return $twig->render('amp.twig', ['amp_curl' => json_decode($poiJSON)]);

// 	} else {
//         dumpVar('Already logged in');
//         $_REQUEST['ROLL_NUMBER'] = trim ($_REQUEST['ROLL_NUMBER']);
//         $rn     = (isset ($_REQUEST['ROLL_NUMBER']) && !empty ($_REQUEST['ROLL_NUMBER'])) ? $_REQUEST['ROLL_NUMBER'] : '190410123000200';
//         $poiJSON = getPOIDetailsJSON ($rn);
//         return $twig->render('amp.twig', ['amp_curl' => json_decode($poiJSON,true)]);

//     }



});

return $app;

function getPOIDetailsJSON ($rn) {
    global $COOKIE_DATA;
    $target_url = "https://aboutmyproperty.ca/property/json/$rn/poi";

    $headers   = [];
    $headers[] = 'Host: aboutmyproperty.ca';
    $headers[] = 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0';
    $headers[] = 'Accept: application/json, text/javascript, */*; q=0.01';
    $headers[] = 'Accept-Language: en-US,en;q=0.5';
    $headers[] = 'Referer: https://aboutmyproperty.ca/neighbourhood';
    $headers[] = 'X-Requested-With: XMLHttpRequest';
    $headers[] = 'Connection: keep-alive';
    $headers[] = 'Content-Length: 0';
    $headers[] = 'TE: Trailers';
    $headers[] = 'Cookie: ' . $COOKIE_DATA;

    $s = curl_init();
    curl_setopt($s, CURLOPT_URL, $target_url);
    curl_setopt($s, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($s, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($s, CURLOPT_HEADER, 0);
    curl_setopt($s, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($s, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($s, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0');

    $contents = curl_exec($s);
    sleep (1);
    curl_close($s);

    return $contents;
}

function doLogin() {
    global $COOKIE_DATA;
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
    curl_setopt($s, CURLOPT_HEADER, 1);
    curl_setopt($s, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($s, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($s, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0');
    $contents = curl_exec($s);

    $matches = null;
    preg_match_all ('/Set-Cookie:(.*?)path=\//ims', $contents, $matches);
    $matches = $matches[1];
    $cookies = array(trim(array_shift ($matches)) . ' path=/; secure; HttpOnly');
    $cookies = implode(";",$cookies);
    $cookies = sizeCokkie($cookies);
    $COOKIE_DATA = $cookies;

    if (strpos ($contents, '{"success":true') !== false){
        return TRUE;
    }
    else{
        return FALSE;
    }
}

function isLoggedIn () {
    global $COOKIE_DATA;
    $target_url  = 'https://aboutmyproperty.ca/neighbourhood';

    $headers   = [];
    $headers[] = 'Host: aboutmyproperty.ca';
    $headers[] = 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0';
    $headers[] = 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
    $headers[] = 'Accept-Language: en-US,en;q=0.5';
    $headers[] = 'Referer: https://aboutmyproperty.ca/pierportal';
    $headers[] = 'Connection: keep-alive';
    $headers[] = 'Upgrade-Insecure-Requests: 1';
    $headers[] = 'TE: Trailers';
    $headers[] = 'Cookie: ' . $COOKIE_DATA;

    $s = curl_init();
    curl_setopt($s, CURLOPT_URL, $target_url);
    curl_setopt($s, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($s, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($s, CURLOPT_HEADER, 1);
    curl_setopt($s, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($s, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($s, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0');
    $contents = curl_exec($s);

    //dumpVar($contents);

    if (preg_match('/Sign Out/ims', $contents, $match1)
        || preg_match('/\/auth\/logout/ims', $contents, $match2)
    ) {
        return TRUE;
    }else{
        return FALSE;
    }
}

function dumpVar ($message = null){
    echo "<pre>";
    print_r ($message);
    echo "</pre>";
}

function getValue($regex, $html)
{
    $value = "";
    if(preg_match('/'.$regex.'/ims', $html, $val)){
        $value = $val[1];
    }
    return trim($value);
}

function sizeCokkie($cookie)
{
   $cookies = array();
   $cookies = explode(';', $cookie);
   $cookies = array_unique($cookies);
   $cookie  = rtrim(implode(';', $cookies), ';');

   return $cookie;
}

function getPOIList () {
    global $COOKIE_DATA;
    //dumpVar("COOKIE_DATA:".$COOKIE_DATA);
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
    // this is the original way of writing cookie to a file which doesn't work with GAE
    // curl_setopt($s, CURLOPT_COOKIEJAR, $COOKIE_FILE);
    // curl_setopt($s, CURLOPT_COOKIEFILE, $COOKIE_FILE);
    // now using this:
    curl_setopt($s, CURLOPT_COOKIE, $COOKIE_DATA);
    
    $contents = curl_exec($s);
    //dumpVar($contents);
    
    sleep (1);
    curl_close($s);

    $prop_json = json_decode($contents, true);

    return $prop_json['data']['snaps'];
}