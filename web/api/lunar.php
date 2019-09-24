<?php
//////////////////////////////////////////////////////
// LUNAR Media integration - SOAP Web Service
////////////////////////////////////////////////////
//
// Updated: 22/09/2019
//
// This version will get the following info from the cookies if available
// - utm_source
// - utm_medium
// - utm_campaign
// - utm_term
// - incid
//
//
//  FIELD LIST and VALIDATION:
//  https://crmtest.lunarmedia.co.uk/net/webservices/fieldlookup.aspx?MediaCampaignID=10339
//  https://crm.lunarmedia.co.uk/net/webservices/fieldlookup.aspx?MediaCampaignID=12129 [AP]
//

//
// Settings
////////////////////////////////////////////////////
//
// LIVE: http://crm.lunarmedia.co.uk/net/webservices/inbound/soappost.aspx
// TEST: http://crmtest.lunarmedia.co.uk/net/webservices/inbound/soappost.aspx
//
$soap_url = 'http://crm.lunarmedia.co.uk/net/webservices/inbound/soappost.aspx';

// Notification in case of error
$email_notification = "webservices@inchora.com, michael.manning@betterprotect.co.uk";

////////////////////////////////////////////////////

try {

  // Response Init
  header('Content-Type: application/json');
  $json_res = array();

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

  // Get request Input
  $data = json_decode(file_get_contents("php://input"), TRUE);
  if (count($data)==0) {
    $data = $_POST;
  }

  // Set all the possible fields to avoid errors
  $_FORM = array();
  $_FIELDS = array(
    // 'client-ref',
    'mcid',
    // 'k',
    'amount',
    'product-term',
    'policy-cover-type',
    'quote-for',
    'your-title',
    'your-firstname',
    'your-lastname',
    'your-telephone',
    'your-email',
    'your-dob',
    'p-title',
    'p-firstname',
    'p-lastname',
    'p-dob',
    'acceptance-terms',
    'your-day',
    'your-time',
    'cover-for',
    'notes'
  );
  if( !empty($data) ){
    foreach ($_FIELDS as $key) {
      if (isset($data[$key])) {
        $_FORM[$key] = $data[$key];
      } else {
        $_FORM[$key] = '';
      }
    }
  }

  // Convert date from HTML yyyy-mm-dd to Lunar dd/mm/yyyy
  if( isset($_FORM['your-dob']) && !empty($_FORM['your-dob']) ){
    $_FORM['your-dob'] = date("d/m/Y", strtotime($_FORM['your-dob']));
  }
  if( isset($_FORM['p-dob']) && !empty($_FORM['p-dob']) ){
    $_FORM['p-dob'] = date("d/m/Y", strtotime($_FORM['p-dob']));
  }
  if( isset($_FORM['your-day']) && !empty($_FORM['your-day']) ){
    $_FORM['your-day'] = date("d/m/Y", strtotime($_FORM['your-day']));
  }


  ////////////////////////////////////////////////////////

  // GOOGLE UTM TRACKING
  $client_ref = 'web-none';
  $keywords   = 'none'; // Client source ref

  $client_ref = getCookie('utm_source') ?  getCookie('utm_source') . ' - ' . getCookie('utm_medium') . ' - ' . getCookie('utm_campaign') : 'web-none';
  $keywords   = getCookie('utm_term', 'none');

  // TRACKING ID by INCHORA
  $incid = getCookie('incid', '');

  ////////////////////////////////////////////////////////


  // Main
  if ( TRUE || !empty($_POST) && empty($_POST['password']) )  // "password" is an honeypot - ANTI SPAM - it has to be empty
  {
    // $is_lunar_heath   = $_FORM['is-lunar-health'] ? true : false;
    // from the FORM
    $MediaCampaignID  = $_FORM['mcid'];
    $ClientDataSource = substr(preg_replace('/([^a-z0-9 -])/', '-', strtolower(urldecode($keywords))), 0, 50); //keywords if available
    $ClientReference  = substr(preg_replace('/([^a-zA-Z0-9_ -])/', '-', urldecode($client_ref)), 0, 50);
    $Amount           = $_FORM['amount']?$_FORM['amount']:'0';
    $ProductTerm      = intval($_FORM['product-term']);
    $PolicyCoverType  = $_FORM['policy-cover-type'];
    $quote_for        = $_FORM['quote-for'];  // not to import - just check
    $SecondApplicant  = '';
    $App1Title        = $_FORM['your-title'];
    $App1FirstName    = $_FORM['your-firstname'];
    $App1Surname      = $_FORM['your-lastname'];
    $App1HomeTelephone = $_FORM['your-telephone'];
    $App1EmailAddress = $_FORM['your-email'];
    $App1DOB          = $_FORM['your-dob']?$_FORM['your-dob']:'01/01/1900';
    $App2Title        = $_FORM['p-title'];
    $App2FirstName    = $_FORM['p-firstname'];
    $App2Surname      = $_FORM['p-lastname'];
    $App2DOB          = $_FORM['p-dob'];
    $cover_for        = $_FORM['cover-for'];  // not to import - just check
    $Notes            = $_FORM['notes'];

    $acceptance_terms = $_FORM['acceptance-terms'];  // not to import

    // callback date and time
    $BestContactDate  = '';
    $your_day         = $_FORM['your-day'];
    $your_time        = $_FORM['your-time'];


    // VALUE CHECK anc CALCULATE
    ////////////////////////////////////////////////////////
    if ( !empty($quote_for) ) {
      if ($quote_for == '1'){
        $SecondApplicant = 'N';
        $App2Title = '';
      } elseif ($quote_for == '2'){
        $SecondApplicant = 'Y';
      }
    }

    if( !empty($your_day) || !empty($your_time) ) {
      if( !empty($your_day) ) {
        $BestContactDate .= $your_day;
      } else {
        $BestContactDate .= '01/01/1900';
      }
      $BestContactDate .= ' ';
      if( !empty($your_time) ) {
        $BestContactDate .= $your_time;
      } else {
        $BestContactDate .= '00:00';
      }
    }


    // Campaigns are set in different account that have different validations.
    $ProductType = 'Life Insurance';
    // just for PMI - $is_lunar_heath
    if ( !empty($cover_for) ) {
      $Notes .= PHP_EOL.'Cover for: ' . $cover_for;
    }
    ////////////////////////////////////////////////////////

    // Extra security info
    $Notes .= PHP_EOL;
    $Notes .= PHP_EOL.'Security Info:';
    $Notes .= PHP_EOL.'==============';
    $Notes .= PHP_EOL.'User Agent: '.@$_SERVER[HTTP_USER_AGENT];
    $Notes .= PHP_EOL.'Remote IP: '.@$_SERVER[REMOTE_ADDR];
    $Notes .= PHP_EOL.'Request timestamp: '.@$_SERVER[REQUEST_TIME_FLOAT];

    ////////////////////////////////////////////////////////

    $xml_post_string = '<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:soap="https://www.w3.org/2001/12/soap-envelope">
    <soap:Body>
      <executeSoap xmlns:lead="'.$soap_url.'">
        <MediaCampaignID>'.$MediaCampaignID.'</MediaCampaignID>
        <ClientReference>'.$ClientReference.'</ClientReference>
        <ClientDataSource>'.$ClientDataSource.'</ClientDataSource>
        <LeadCost/>
        <Amount>'.$Amount.'</Amount>
        <ProductTerm>'.$ProductTerm.'</ProductTerm>
        <ProductType>'.$ProductType.'</ProductType>
        <PolicyCoverType>'.$PolicyCoverType.'</PolicyCoverType>
        <App1HomeTelephone>'.$App1HomeTelephone.'</App1HomeTelephone>
        <App1MobileTelephone/>
        <App1WorkTelephone/>
        <App1EmailAddress>'.$App1EmailAddress.'</App1EmailAddress>
        <App1MaritalStatus/>
        <App1Title>'.$App1Title.'</App1Title>
        <App1FirstName>'.$App1FirstName.'</App1FirstName>
        <App1Surname>'.$App1Surname.'</App1Surname>
        <App1DOB>'.$App1DOB.'</App1DOB>
        <AddressLine1></AddressLine1>
        <AddressPostCode></AddressPostCode>
        <App2Title>'.$App2Title.'</App2Title>
        <App2FirstName>'.$App2FirstName.'</App2FirstName>
        <App2Surname>'.$App2Surname.'</App2Surname>
        <App2DOB>'.$App2DOB.'</App2DOB>
        <BestContactDate>'.$BestContactDate.'</BestContactDate>
        <Notes>'.$Notes.'</Notes>
        <SecondApplicant>'.$SecondApplicant.'</SecondApplicant>
        <incid>'.$incid.'</incid>
      </executeSoap>
    </soap:Body>
  </soap:Envelope>';

    // print($xml_post_string.PHP_EOL.PHP_EOL);

    // connection
    $headers = array(
      "Content-type: text/xml;charset=\"utf-8\"",
      "Accept: text/xml",
      "Cache-Control: no-cache",
      "Pragma: no-cache",
      "SOAPAction: ".$soap_url, //SOAPAction: your op URL
      "Content-length: ".strlen($xml_post_string),
    );
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_URL, $soap_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //curl_setopt($ch, CURLOPT_USERPWD, $soapUser.":".$soapPassword); // username and password - declared at the top of the doc
    //curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $xml_post_string); // the SOAP request
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $res = curl_exec($ch);

    //print($res.PHP_EOL.PHP_EOL);

    if (curl_errno($ch)) {
      //print curl_error($ch).PHP_EOL.PHP_EOL;
      header($_SERVER['SERVER_PROTOCOL'].' 500 Connection Error');
      $json_res['status']  = '-405';
      $json_res['message'] = 'SOAP ERROR: '.curl_error($ch);
      $json_res['soapNo']  = '';
    }
    else
    {
      $xml_res = simplexml_load_string($res);
      //print_r($xml_res);
      // Read soap response and build json response
      $json_res['status']  = strval($xml_res->xpath('//executeSoapStatus')[0]);
      $json_res['message'] = strval($xml_res->xpath('//executeSoapResult')[0]);
      $json_res['soapNo']  = strval($xml_res->xpath('//executeSoapNo')[0]);

      if ($json_res['status']!=1) {
       try {
          // send email
          $message =  $json_res['message']. PHP_EOL.PHP_EOL . print_r($_POST, true) . PHP_EOL.PHP_EOL . $xml_post_string . PHP_EOL.PHP_EOL . $res . PHP_EOL.PHP_EOL . print_r($_SERVER, true);
          mail ( $email_notification , "ISSUE with submission FORM  to Lunar" , $message );
        } catch (Exception $err) {

        }
      }
      //print_r($json_res);
    }

    // Closing
    curl_close($ch);
  }
  else
  {
    // Generic connection error
    header($_SERVER["SERVER_PROTOCOL"]." 400 Connection Error");
    $json_res = array();
    $json_res['status']  = '-400';
    $json_res['message'] = 'ERROR';
    $json_res['soapNo']  = '';
  }

  // Response - JSON
  echo json_encode($json_res);

} catch (Exception $e) {

  try {
    // send email
    $message =  print_r($_POST, true) . PHP_EOL.PHP_EOL . $xml_post_string . PHP_EOL.PHP_EOL . $res . PHP_EOL.PHP_EOL . print_r($_SERVER, true);
    mail ( $email_notification , "ERROR submission FORM to Lunar" , $message );
  } catch (Exception $e2) {

  }

  // SERVER ERROR
  $json_res = array();
  header($_SERVER['SERVER_PROTOCOL'].' 500 Server Error');
  $json_res['status']  = '-500';
  $json_res['message'] = 'Server ERROR';
  $json_res['soapNo']  = '';
  echo json_encode($json_res);

}

////////////////////////////////////////////////////

function notRequestedByTheSameDomain() {
  return (strpos($_SERVER['HTTP_REFERER'], $_SERVER['SERVER_NAME']) === false);
}


function getCookie($name, $default='') {
  if ( isset($_COOKIE[$name]) && !empty($_COOKIE[$name]) ) {
    return $_COOKIE[$name];
  }
  return $default;
}