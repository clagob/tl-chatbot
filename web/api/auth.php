<?php
////////////////////////////////////////////////////

$ALLOW_DOMAIN = 'thinklife.uk';

////////////////////////////////////////////////////

// $http_origin = $_SERVER['HTTP_ORIGIN'];
// $allowed_domains = array(
//   'http://domain1.com',
//   'http://domain2.com',
// );
// if (in_array($http_origin, $allowed_domains))
// {
//     header("Access-Control-Allow-Origin: $http_origin");
// }
header('Access-Control-Allow-Origin: *');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS')
{
  header('Access-Control-Allow-Headers: Content-Type');
  header('Access-Control-Allow-Methods: OPTIONS, GET, PUT, POST, DELETE, PATCH');
  // header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Max-Age: 1728000');
  exit();
}

////////////////////////////////////////////////////

header('Content-Type: application/json');
$json_res = array();

////////////////////////////////////////////////////

// BLOCK EXTERNAL CONNECTIONS - ANTI HACKS
// The API can be used just from the same domain only
if ( notRequestedByTheSameDomain() ) {
  header($_SERVER["SERVER_PROTOCOL"]." 403 Permission Error");
  $json_res = array();
  $json_res['status']  = '-403';
  $json_res['message'] = 'ERROR - no permissions';
  echo json_encode($json_res);
  exit();
}

function notRequestedByTheSameDomain() {
  global $ALLOW_DOMAIN;
  if ($_SERVER['SERVER_NAME'] == 'localhost') {
    $ALLOW_DOMAIN = 'localhost';
  }
  // return (strpos($_SERVER['HTTP_REFERER'], $_SERVER['SERVER_NAME']) === false);
  return (strpos($_SERVER['HTTP_REFERER'], $ALLOW_DOMAIN) === false);
}

