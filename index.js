/**
* Copyright 2016 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

require.config({
	'paths': {
		'ibmmfpfanalytics': 'node_modules/ibm-mfp-web-sdk/lib/analytics/ibmmfpfanalytics',
		'mfp': 'node_modules/ibm-mfp-web-sdk/ibmmfpf',
		'userLoginChallengeHandler': 'UserLoginChallengeHandler',
		'pinCodeChallengeHandler': 'PinCodeChallengeHandler',
	}
});

require(['ibmmfpfanalytics', 'mfp', 'userLoginChallengeHandler','pinCodeChallengeHandler'], function(wlanalytics, WL, UL, PC) {
    var wlInitOptions = {
        mfpContextRoot : '/mfp', // "mfp" is the default context root in the MobileFirst Developer Kit
        applicationId : 'com.sample.stepupweb'
    };

    WL.Client.init(wlInitOptions).then (
        function() {
			document.getElementById("getBalance").addEventListener("click", getBalance);
		    document.getElementById("transferFunds").addEventListener("click", transferFunds);
		    document.getElementById("logout").addEventListener("click", logout);
			
		    UL.init();
			PC.init();
		    
		    showLoginDiv();
		}
	);	
	
	function getBalance() {
	    var resourceRequest = new WLResourceRequest("/adapters/ResourceAdapter/balance", WLResourceRequest.GET);
	    resourceRequest.send().then(
	        function (response) {
	            WL.Logger.debug("Balance: " + response.responseText);
	            document.getElementById("resultLabel").innerHTML = "Balance: " + response.responseText;
	        },
	        function (response) {
	            WL.Logger.debug("Failed to get balance: " + JSON.stringify(response));
	            document.getElementById("resultLabel").innerHTML = "Failed to get balance.";
	        });
	}

	function transferFunds(){
	  //Preemptively check if user is logged in before asking for the amount
	  WLAuthorizationManager.obtainAccessToken("StepUpUserLogin").then(
	      function (accessToken) {
	        var amount = prompt("Enter amount:");
	        if(amount !== null && !isNaN(amount)){
	          var resourceRequest = new WLResourceRequest("/adapters/ResourceAdapter/transfer", WLResourceRequest.POST);

	          resourceRequest.sendFormParameters({"amount":amount}).then(
	              function (response) {
	                  document.getElementById("resultLabel").innerHTML = "Transfer successful";
	              },
	              function (response) {
	                  WL.Logger.debug("Failed to get balance: " + JSON.stringify(response));
	                  document.getElementById("resultLabel").innerHTML = "Failed to perform transfer.";
	              });
	        }
	      },
	      function (response) {
	          WL.Logger.debug("obtainAccessToken onFailure: " + JSON.stringify(response));
	  });
	}

	function logout() {
	    WLAuthorizationManager.logout("StepUpUserLogin").then(
	        function () {
	            WL.Logger.debug("logout from userLoginChallengeHandler onSuccess");
	            WLAuthorizationManager.logout("StepUpPinCode").then(function () {
	                WL.Logger.debug("logout from pinCodeChallengeHandler onSuccess");
	                location.reload();
	            }, function (error) {
	                WL.Logger.debug("logout from pinCodeChallengeHandler onFailure: " + JSON.stringify(error));
	            });
	        },
	        function (error) {
	            WL.Logger.debug("logout from userLoginChallengeHandler onFailure: " + JSON.stringify(error));
	        });
	}

});

function showLoginDiv() {
    document.getElementById('protectedDiv').style.display = 'none';
    document.getElementById('statusMsg').innerHTML = "";
    document.getElementById('loginDiv').style.display = 'block';
    document.getElementById('logout').style.display = 'none';
}

function showProtectedDiv() {
    document.getElementById('loginDiv').style.display = 'none';
    document.getElementById('resultLabel').innerHTML = "";
    document.getElementById('protectedDiv').style.display = 'block';
    document.getElementById('logout').style.display = 'block';
}
