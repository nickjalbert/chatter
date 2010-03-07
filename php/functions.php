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

/*
 * Sanitization functions by Denham Coote
 * http://www.denhamcoote.com/php-howto-sanitize-database-inputs
 *
 */

function cleanInput($input) {

    $search = array(
        '@<script[^>]*?>.*?</script>@si',   // Strip out javascript
        '@<[\/\!]*?[^<>]*?>@si',            // Strip out HTML tags
        '@<style[^>]*?>.*?</style>@siU',    // Strip style tags properly
        '@<![\s\S]*?--[ \t\n\r]*>@'         // Strip multi-line comments
    );

    $output = preg_replace($search, '', $input);
    return $output;
}

function sanitize($input) {
    if (is_array($input)) {
        foreach($input as $var=>$val) {
            $output[$var] = sanitize($val);
        }
    }
    else {
        if (get_magic_quotes_gpc()) {
            $input = stripslashes($input);
        }
        $input  = cleanInput($input);
        $output = mysql_real_escape_string($input);
    }
    return $output;
}

?>
