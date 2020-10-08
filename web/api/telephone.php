<?php
//////////////////////////////////////////////////////
// Telephone look up - API
//////////////////////////////////////////////////////
//
// Global Telephone Validation
// Version 19
// https://idmp.gb.co.uk/wicket/bookmarkable/com.gb.sherlock.pages.documentation.IntegrationGuideValidationTelephone?8
//

include 'auth.php';

//
// Settings
////////////////////////////////////////////////////

$customerReference = 'ThinkLife';

////////////////////////////////////////////////////

$wsdl = 'https://idmp.gb.co.uk/idm-globalservices-ws/GlobalServices15b.wsdl';
$username = 'username';
$password = '*******';

$profileGuid = '454F13CA-8C71-40D6-9FEF-A88D821C99E4';
$configurationId = '2'; //billing profile

$email_notification = "claudio@gobetti.org"; // Notification in case of error

////////////////////////////////////////////////////
// ENV settings - override default

if (isset($_ENV['GBUK-profileGuid'])) {
    $profileGuid = $_ENV['GBUK-profileGuid'];
}
if (isset($_ENV['GBUK-configurationId'])) {
    $configurationId = $_ENV['GBUK-configurationId'];
}
if (isset($_ENV['GBUK-customerReference'])) {
    $customerReference = $_ENV['GBUK-customerReference'];
}

if (isset($_ENV['GBUK-wsdl'])) {
    $wsdl = $_ENV['GBUK-wsdl'];
}
if (isset($_ENV['GBUK-username'])) {
    $username = $_ENV['GBUK-username'];
}
if (isset($_ENV['GBUK-password'])) {
    $password = $_ENV['GBUK-password'];
}

if (isset($_ENV['GBUK-emailNotification'])) {
    $email_notification = $_ENV['GBUK-emailNotification'];
}

////////////////////////////////////////////////////

if (!empty($_POST['telephone'])) {
    $telephone = $_POST['telephone'];

    // Create SOAP Client
    try {
        $options = array("trace" => true, "exceptions" => true);
        $client = new SoapClient($wsdl, $options);
        $client2 = new SoapClient($wsdl, $options);
    } catch (Exception $e) {
        $json_res = array();
        $json_res['valid'] = 'true'; // not stopping
        $json_res['message'] = 'Create SOAP Client error:' . PHP_EOL . $e->getMessage();
        sendNotificationEmail($json_res['message']);
        echo json_encode($json_res);
        exit();
    }

    // SOAP method: Authenticate User
    try {
        $auth = $client->AuthenticateUser(array('username' => $username, 'password' => $password));
        $token = $auth->authenticationToken;
    } catch (Exception $e) {
        $json_res = array();
        $json_res['valid'] = 'true'; // not stopping
        $json_res['message'] = 'SOAP method - Authenticate User ERROR:' . PHP_EOL . $e->getMessage();
        sendNotificationEmail($json_res['message']);
        echo json_encode($json_res);
        exit();
    }

    // SOAP method: Execute Capture (Phone Validation)
    try {
        $params = array(
            'securityHeader' => array(
                'authenticationToken' => $token
                , 'username' => $username,
            ),
            'profileRequest' => array(
                'customerReference' => $customerReference,
                'profileGuid' => $profileGuid,
                'configurationId' => $configurationId,
                'requestData' => array(
                    'address' => null,
                    'telephone' => array('number' => $telephone, 'type' => 'UNKNOWN'),
                    'filters' => null,
                    'options' => array('relatedDataItems' => null, 'offset' => '0', 'maxReturn' => '100', 'casing' => 'MIXED', 'transliteration' => 'NATIVE', 'countryCodeFormat' => 'ISO3'),
                    'additionalData' => null,
                ),
            ),
        );
        $validatePhone = $client2->ExecuteCapture($params);
        $transactionGuid = $validatePhone->transactionGuid;
        $telephone = $validatePhone->profileResponse->profileResponseDetails->validateResponse->response->input;
        $status = $validatePhone->profileResponse->profileResponseDetails->validateResponse->response->status;
        $validityFlag = $validatePhone->profileResponse->profileResponseDetails->validateResponse->response->validityFlag;
        $validationCodes = items_to_array($validatePhone->profileResponse->profileResponseDetails->validateResponse->response->validationCodes->item);
        $ResultCode = $validationCodes['ResultCode'];
        $json_res = array();
        $json_res['transactionGuid'] = $transactionGuid;
        $json_res['telephone'] = $telephone;
        $json_res['status'] = $status;
        $json_res['validityFlag'] = $validityFlag;
        $json_res['ResultCode'] = $ResultCode;
        //print_r($json_res);

        // Response TRUE when is VALID or UNKNOWN (~~if not in the 300 range~~)
        //if( !empty($ResultCode) && ($ResultCode<300 || $ResultCode>=400) ) {
        if (!empty($validityFlag) && ($validityFlag == 'VALID' || $validityFlag == 'UNKNOWN')) {
            $json_res['valid'] = 'true';
        } else {
            $json_res['valid'] = 'false';
        }
    } catch (Exception $e) {
        $json_res = array();
        $json_res['valid'] = 'true'; // not stopping
        $json_res['message'] = 'SOAP method - Execute Capture ERROR:' . PHP_EOL . $e->getMessage();
        sendNotificationEmail($json_res['message']);
    }
} else {
    // Parameter not provided - SPAM
    $json_res = array();
    $json_res['valid'] = 'true'; // not stopping
    $json_res['message'] = 'POSSIBLE SPAM';
}

echo json_encode($json_res);

////////////////////////////////////////////////////

function sendNotificationEmail($text)
{
    try {
        // send email
        $message = $text . PHP_EOL . PHP_EOL . print_r($_POST, true) . PHP_EOL . PHP_EOL . $xml_post_string . PHP_EOL . PHP_EOL . $res . PHP_EOL . PHP_EOL . print_r($_SERVER, true);
        mail($email_notification, "ISSUE with Telephone Validation FORM - " . $customerReference, $message);
    } catch (Exception $err) {}
}

function items_to_array($items)
{
    $result = array();
    if (is_array($items)) {
        foreach ($items as $item) {
            if (is_object($item)) {
                $result[$item->key] = $item->value;
            }
        }
    }
    return $result;
}
