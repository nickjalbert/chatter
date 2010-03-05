<?
/*
 * Read chat values from DB
 *
 * Author - Nick Jalbert (nickjalbert@gmail.com)
 *
 */

include 'functions.php';

$conn = connectToDB();
$result = mysql_query("SELECT * FROM $table_name");
$table_array = array();
$i = 0;

while ($row = mysql_fetch_array($result)) {
    $table_array[$i] = $row;
    $i++;
}

print json_encode($table_array);

mysql_close($conn);

?>
