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

define(['mfp'], function(WL) {
    var securityCheckName = 'StepUpPinCode';
    
        function init() { 
            var pinCodeChallengeHandler = WL.Client.createSecurityCheckChallengeHandler(securityCheckName);
            pinCodeChallengeHandler.handleChallenge = function(challenge) {
                var msg = "";

                // Create the title string for the prompt
                if (challenge.errorMsg !== null) {
                    msg = challenge.errorMsg + "\n";
                } else {
                    msg = "This data requires a PIN code.\n";
                }
                msg += "Remaining attempts: " + challenge.remainingAttempts;

                // Display a prompt for user to enter the pin code
                var pinCode = prompt(msg, "");
                while (pinCode === "") {
                    pinCode = prompt("You must set a pin code", "");
                }

                if (pinCode) { // calling submitChallengeAnswer with the entered value
                    pinCodeChallengeHandler.submitChallengeAnswer({
                        "pin": pinCode
                    });
                } else { // calling cancel in case user pressed the cancel button
                    pinCodeChallengeHandler.cancel();
                }


            };

            // handleFailure
            pinCodeChallengeHandler.handleFailure = function(error) {
                WL.Logger.debug("Challenge Handler Failure!");

                if (error.failure !== null && error.failure !== undefined) {
                    if (error.failure == "Account blocked") {
                        if (error.failure == "Account blocked") {
                            document.getElementById("logoutButton").style.display = 'none';
                            document.getElementById("enrollButton").style.display = 'inline-block';
                            document.getElementById("getPublicData").style.display = 'none';
                            document.getElementById("getTransactions").style.display = 'none';
                            document.getElementById('responseTextarea').value = "";
                        }
                        enroll();
                    } else {
                        alert("Error:" + JSON.stringify(error.failure));
                    }
                } else {
                    alert("Unknown error");
                }
            };
        }

    return {
        init: init
    };
});

