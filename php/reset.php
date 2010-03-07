<?
/*
 * Empties DB
 *
 * Author - Nick Jalbert (nickjalbert@gmail.com)
 *
 */

include 'functions.php';

$conn = connectToDB();
$reset_query = "TRUNCATE TABLE $table_name";
mysql_query($reset_query);
mysql_close($conn);

?>
