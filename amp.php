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

$app->get('/am/p', function () use ($app) {
    $twig = $app['twig'];
    define('USER', 'Debdulal');
    define('PASS', '4Ew3vM!CitEmhTT');
    $COOKIE_DATA = '';
	$LOGGED_USER = doLogin ();
	if (!isLoggedIn ()){
		die ("Login Failed");
    }
    $POIList = getPOIList();
	if ( count($POIList) > 94 ){
		die ("As of ".date("M d, Y h:i a e").", ".USER." has used ".count($POIList)." of 100 Snapshot Views.  Please visit 'My Profile' in AboutMyProperty.ca and switch to another property.");
    } else {
        $tmp = array_values($POIList);
        $tmp2 = end($tmp);
        $rn     = (isset ($_REQUEST['rn']) && !empty ($_REQUEST['rn'])) ? $_REQUEST['rn'] : $tmp2;
        $poiJSON = getPOIDetailsJSON ($rn);
        return $twig->render('amp.twig', [
            'amp_curl' => json_decode($poiJSON), 
            'rnum' => $rn, 
            'ampuser' => USER, 
            'subjectaddress' => "https://www.google.com/maps/embed/v1/streetview?location="."25+Elm+Ave%2c+Toronto"."&key=AIzaSyB8wub48JNwyNav0lY_lCcR-0nAS8-bcVE",
            'poicount' => count($POIList)
            ]);    
    }
});

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
	if ( count($POIList) > 94 ){
		die ("As of ".date("M d, Y h:i a e").", ".USER." has used ".count($POIList)." of 100 Snapshot Views.  Please visit 'My Profile' in AboutMyProperty.ca and switch to another property.");
    } else {
        $tmp = array_values($POIList);
        $tmp2 = end($tmp);
        $rn     = (isset ($_POST['rn']) && !empty ($_POST['rn'])) ? $_POST['rn'] : $tmp2;
        $poiJSON = getPOIDetailsJSON ($rn);
        ////////////// GET LAT LON OF SUBJECT//////////////////////////
        $conn = new PDO(getenv('MYSQL_DSN'), getenv('MYSQL_USER'), getenv('MYSQL_PASSWORD'));
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $stmt = $conn->prepare("SELECT CONCAT(tblontario.v3_lat, ',', tblontario.v3_lng) AS LATLNG
        FROM tblontario WHERE tblontario.RollNum = :rollnumber ");        
        $stmt->execute(array(':rollnumber' => $rn));
        $results = $stmt->fetchAll(PDO::FETCH_OBJ);
        foreach($results as $row) {
            foreach($row as $key => $value) {
                $latlng = $value;
            }
        }
        $conn = null;
        // Learning how to pull APTS data from Google and pass into a TWIG template 
        return $twig->render('amp.twig', [
            'amp_curl' => json_decode($poiJSON), 
            'rnum' => $rn, 
            'ampuser' => USER, 
            'google_maps_sv__of_subject' => "https://www.google.com/maps/embed/v1/streetview?location=".$latlng."&key=AIzaSyB8wub48JNwyNav0lY_lCcR-0nAS8-bcVE",
            'poicount' => count($POIList)
            ]);    
    }
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
    sleep (1);
    curl_close($s);

    $prop_json = json_decode($contents, true);

    return $prop_json['data']['snaps'];
}