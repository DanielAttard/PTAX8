<?php
class TableRows extends RecursiveIteratorIterator {
function __construct($it) {
parent::__construct($it, self::LEAVES_ONLY);
}
}
$conn = new PDO(getenv('MYSQL_DSN'), getenv('MYSQL_USER'), getenv('MYSQL_PASSWORD'));
$conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$stmt = $conn->prepare("SELECT CONCAT(RollNum, ' -- ', `Address`, ' -- ', Municipality) AS SubjectProperty
FROM tblontario WHERE tblontario.RollNum = :term 
LIMIT 20 ");        

$stmt->execute(array(':term' => $_GET['term']));

$array = array();
foreach(new TableRows(new RecursiveArrayIterator($stmt->fetchAll())) AS $x) {
$array[] = $x;
}
$array = $array ?: array('Roll Number Not Found');
echo json_encode($array);
$conn = null;
?>
