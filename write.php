<?
/*
 * Write chat values into DB
 *
 * Author - Nick Jalbert (nickjalbert@gmail.com)
 *
 */

include 'functions.php';

function getLastSeqnum() {
    global $table_name;
    $last_chat_query = "SELECT seqnum FROM $table_name WHERE time = (SELECT MAX(time) FROM $table_name)";
    $result = mysql_query($last_chat_query);
    $arr = mysql_fetch_array($result);
    $lastseq = $arr["seqnum"];
    return $lastseq;
}

function removeNextSeqNum($next_seqnum) {
    global $table_name;
    $delete_query = "DELETE FROM $table_name WHERE seqnum = $next_seqnum";
    mysql_query($delete_query);
}

$conn = connectToDB();
$next_seqnum = getLastSeqnum() + 1;
if ($next_seqnum > $seqnum_max) {
    $next_seqnum = 0;
}

removeNextSeqNum($next_seqnum);
$name = $_REQUEST["name"];
$words = $_REQUEST["words"];

$name = sanitize($name);
$words = sanitize($words);

if ($words == "") {
    exit();
}

if ($name == "") {
    $name = "ScaryGhost";
}

$insert_query = "INSERT INTO $table_name ";
$insert_query .= "(time, seqnum, name, words) ";
$insert_query .= "VALUES (NOW(),'".$next_seqnum."',";
$insert_query .= "'".$name."',";
$insert_query .= "'".$words."')";

mysql_query($insert_query);

mysql_close($conn);

?>
