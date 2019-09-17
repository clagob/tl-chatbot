<?php
//////////////////////////////////////////////////////
// Telephone look up - API
//////////////////////////////////////////////////////
//
// Global Telephone Validation
// Version 15b
// https://idmp.gb.co.uk/wicket/bookmarkable/com.gb.sherlock.pages.documentation.IntegrationGuideValidationTelephone?8
//

  //
 // Settings
////////////////////////////////////////////////////

$customerReference = 'Albany Park';

////////////////////////////////////////////////////

$wsdl     = 'https://idmp.gb.co.uk/idm-globalservices-ws/GlobalServices15b.wsdl';
$username = 'inchoramarketing@aspectwebmedia.com';
$password = 'Inchora!M4rk3ting';

$profileGuid = '454F13CA-8C71-40D6-9FEF-A88D821C99E4';
$configurationId = '2'; //billing profile

$email_notification = "webservices@inchora.com"; // Notification in case of error

////////////////////////////////////////////////////
// ENV settings - override default

if ( isset($_ENV['GBUK-profileGuid']) ) {
  $profileGuid = $_ENV['GBUK-profileGuid'];
}
if ( isset($_ENV['GBUK-configurationId']) ) {
  $configurationId = $_ENV['GBUK-configurationId'];
}
if ( isset($_ENV['GBUK-customerReference']) ) {
  $customerReference = $_ENV['GBUK-customerReference'];
}

if ( isset($_ENV['GBUK-wsdl']) ) {
  $wsdl = $_ENV['GBUK-wsdl'];
}
if ( isset($_ENV['GBUK-username']) ) {
  $username = $_ENV['GBUK-username'];
}
if ( isset($_ENV['GBUK-password']) ) {
  $password = $_ENV['GBUK-password'];
}

if ( isset($_ENV['GBUK-emailNotification']) ) {
  $email_notification = $_ENV['GBUK-emailNotification'];
}

////////////////////////////////////////////////////

// Response Init
$json_res = array();
header('Content-Type: application/json');

// BLOCK EXTERNAL CONNECTIONS - ANTI HACKS
// The API can be used just from the same domain only
if ( notRequestedByTheSameDomain() ) {
  header($_SERVER["SERVER_PROTOCOL"]." 403 Permission Error");
  $json_res = array();
  $json_res['status']  = 'false';
  $json_res['message'] = 'ERROR - no permissions';
  echo json_encode($json_res);
  exit();
}

if ( !empty($_POST['telephone']) ) {
  $telephone = $_POST['telephone'];

  // Create SOAP Client
  try {
    $options = array("trace"=>true, "exceptions"=>true);
    $client = new SoapClient($wsdl, $options);
    $client2 = new SoapClient($wsdl, $options);
  } catch (Exception $e) {
    $json_res = array();
    $json_res['success'] = 'true'; // not stopping
    $json_res['message'] = 'Create SOAP Client error:' .PHP_EOL. $e->getMessage();
    sendNotificationEmail($json_res['message']);
    //echo $json_res['success'];
    echo json_encode($json_res);
    exit();
  }

  // SOAP method: Authenticate User
  try {
    $auth = $client->AuthenticateUser( array('username'=>$username, 'password'=>$password) );
    $token = $auth->authenticationToken;
  }
  catch (Exception $e)
  {
    $json_res = array();
    $json_res['success'] = 'true'; // not stopping
    $json_res['message'] = 'SOAP method - Authenticate User ERROR:' .PHP_EOL. $e->getMessage();
    sendNotificationEmail($json_res['message']);
    //echo $json_res['success'];
    echo json_encode($json_res);
    exit();
  }

  // SOAP method: Execute Capture (Phone Validation)
  try {
    $params = array(
      'securityHeader' => array(
          'authenticationToken' => $token
          , 'username' => $username
      ),
      'profileRequest' => array(
          'customerReference' => $customerReference,
          'profileGuid' => $profileGuid,
          'configurationId' => $configurationId,
          'requestData' => array(
              'address' => NULL,
              'telephone' => array('number'=>$telephone, 'type'=>'UNKNOWN'),
              'filters' => NULL,
              'options' => array('relatedDataItems'=> NULL, 'offset'=>'0', 'maxReturn'=>'100', 'casing'=>'MIXED', 'transliteration'=>'NATIVE', 'countryCodeFormat'=>'ISO3'),
              'additionalData' => NULL
          )
      )
    );
    $validatePhone = $client2->ExecuteCapture($params);
    //print_r($validatePhone);
    $transactionGuid = $validatePhone->transactionGuid;
    $telephone = $validatePhone->profileResponse->profileResponseDetails->validateResponse->response->input;
    $status = $validatePhone->profileResponse->profileResponseDetails->validateResponse->response->status;
    $validityFlag = $validatePhone->profileResponse->profileResponseDetails->validateResponse->response->validityFlag;
    $validationCodes = items_to_array($validatePhone->profileResponse->profileResponseDetails->validateResponse->response->validationCodes->item);
    $ResultCode = $validationCodes['ResultCode'];
    $json_res = array();
    //$json_res['soapResponse'] = print_r($validatePhone, true);
    $json_res['transactionGuid'] = $transactionGuid;
    $json_res['telephone'] = $telephone;
    $json_res['status'] = $status;
    $json_res['validityFlag'] = $validityFlag;
    $json_res['ResultCode'] = $ResultCode;
    //print_r($json_res);

    // Response TRUE when is VALID or UNKNOWN (~~if not in the 300 range~~)
    //if( !empty($ResultCode) && ($ResultCode<300 || $ResultCode>=400) ) {
    if( !empty($validityFlag) && ($validityFlag=='VALID' || $validityFlag=='UNKNOWN') ) {
       $json_res['success'] = 'true';
    } else {
       $json_res['success'] = 'false';
    }
  }
  catch (Exception $e)
  {
    $json_res = array();
    $json_res['success']  = 'true'; // not stopping
    $json_res['message'] = 'SOAP method - Execute Capture ERROR:' .PHP_EOL. $e->getMessage();
    sendNotificationEmail($json_res['message']);
  }
} else {
  // Parameter not provided - SPAM
  $json_res = array();
  $json_res['success']  = 'true'; // not stopping
  $json_res['message'] = 'POSSIBLE SPAM';
}

//echo $json_res['success'];
echo json_encode($json_res);

////////////////////////////////////////////////////

// function requestedByTheSameDomain() {
//   // $myDomain       = $_SERVER['SCRIPT_URI'];
//   // $requestsSource = $_SERVER['HTTP_REFERER'];
//   // return parse_url($myDomain, PHP_URL_HOST) === parse_url($requestsSource, PHP_URL_HOST);
//   return (strpos($_SERVER['HTTP_REFERER'], $_SERVER['SERVER_NAME']) === true);
// }

function sendNotificationEmail($text) {
  try {
    // send email
    $message =  $text. PHP_EOL.PHP_EOL . print_r($_POST, true) . PHP_EOL.PHP_EOL . $xml_post_string . PHP_EOL.PHP_EOL . $res . PHP_EOL.PHP_EOL . print_r($_SERVER, true);
    mail ( $email_notification , "ISSUE with Telephone Validation FORM - " . $customerReference , $message);
  } catch (Exception $err) { }
}

function items_to_array($items) {
  $result = array();
  if ( is_array($items) ) {
    foreach ($items as $item){
      if ( is_object($item) ) {
        $result[$item->key] = $item->value;
      }
    }
  }
  return $result;
}

////////////////////////////////////////////////////

function notRequestedByTheSameDomain() {
  return (strpos($_SERVER['HTTP_REFERER'], $_SERVER['SERVER_NAME']) === false);
}
