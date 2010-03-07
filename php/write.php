<?
/*
 * Write chat values into DB
 *
 * Author - Nick Jalbert (nickjalbert@gmail.com)
 *
 */

include 'functions.php';

function getInsertQuery($time, $name, $words) {
    global $table_name;
    $insert_query;
    if ($time == "") {
        $insert_query = "INSERT INTO $table_name ";
        $insert_query .= "(name, words) ";
        $insert_query .= "VALUES (";
        $insert_query .= "'".$name."',";
        $insert_query .= "'".$words."')";
    } else {
        $insert_query = "INSERT INTO $table_name ";
        $insert_query .= "(time, name, words) ";
        $insert_query .= "VALUES (";
        $insert_query .= "'".$time."',";     
        $insert_query .= "'".$name."',";
        $insert_query .= "'".$words."')";
    }
    return $insert_query;
}

function getSelectQuery($size_limit) {
    global $table_name;
    $select_query = "SELECT * FROM $table_name ";
    $select_query .= "ORDER BY time DESC LIMIT 0,$size_limit";
    return $select_query;
}

function getTruncateQuery() {
    global $table_name;
    $reset_query = "TRUNCATE TABLE $table_name";
    return $reset_query;
}

function getDeleteAfterQuery($after) {
    global $table_name;
    $delete_query = "DELETE FROM $table_name WHERE time < '$after'";
    return $delete_query;
}

function resetSequenceNumber($num, $chat_history_size) {
    if ($num > 10000) {
        $result = mysql_query(getSelectQuery($chat_history_size));
        $i = 0;
        $save = Array();
        while ($arr = mysql_fetch_array($result)) {
            $str = getInsertQuery($arr["time"], $arr["name"], $arr["words"]);
            $save[$i] = $str;
            $i++;
        }
        mysql_query(getTruncateQuery());
        $i =0;
        while ($i < count($save)) {
            $query = $save[$i];
            mysql_query($query);
            $i++;
        }
    }
}

function removeOld($chat_history_size) {
    $result = mysql_query(getSelectQuery($chat_history_size));
    $last_date;
    $last_seq;
    while ($arr = mysql_fetch_array($result)) {
        $last_date = $arr["time"];
        $last_seq = $arr["seqnum"];
    }
    mysql_query(getDeleteAfterQuery($last_date));
    resetSequenceNumber($last_seq, $chat_history_size);
}

$conn = connectToDB();
if ($next_seqnum > $seqnum_max) {
    $next_seqnum = 0;
}

$name = $_REQUEST["name"];
$words = $_REQUEST["words"];

$name = sanitize($name);
$words = sanitize($words);

if ($words == "") {
    exit();
}

if ($name == "") {
    $name = "Scary Ghost";
}
$insert_query = getInsertQuery("", $name, $words);
mysql_query($insert_query);

removeOld($chat_history_size);

mysql_close($conn);

?>
