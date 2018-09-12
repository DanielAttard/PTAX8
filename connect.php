<?php
$dsn = getenv('MYSQL_DSN');
$user = getenv('MYSQL_USER');
$password = getenv('MYSQL_PASSWORD');
if(!isset($dsn, $user) || false === $password) {
	throw new Exception('Set MYSQL_DSN, MYSQL_USER, and MYSQL_PASSWORD environment variables');
}
echo "dsn: $dsn <br>";
echo "user: $user <br>" ;
echo "password: $password <br>" ;
$db = new PDO($dsn, $user, $password);
?>
