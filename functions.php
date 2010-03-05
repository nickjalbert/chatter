<?
/*
 * DB connection function
 *
 * Don't forget to make db_info.php file defining the variables:
 *      -$dbhost
 *      -$dbname
 *      -$dbuser
 *      -$dbpass
 *
 * Author - Nick Jalbert (nickjalbert@gmail.com)
 *
 */

include "db_info.php";
$table_name = "chatter";
$chat_history_size = 20;
$seqnum_max = $chat_history_size + 1;

function connectToDB() {
    global $dbhost, $dbname, $dbuser, $dbpass; 
    $conn = mysql_connect($dbhost, $dbuser, $dbpass) 
        or die ("Error connecting to $dbhost as $dbuser");
    mysql_select_db($dbname, $conn)
        or die ("Could not select db $dbname");
    return $conn;

}

?>
