function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001,
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx());
            } else {
                if (!condition) {
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    typeof(onReady) === "string" ? eval(onReady) : onReady();
                    clearInterval(interval);
                }
            }
        }, 100);
};

if (phantom.args.length === 0 || phantom.args.length > 2) {
    console.log('Usage: run-jasmine.js URL');
    phantom.exit();
}

var page = typeof require != 'undefined' ? require('webpage').create() : typeof WebPage != 'undefined' ? new WebPage() : null;
if (page) {
    page.onConsoleMessage = function(msg) {
        console.log(msg);
    };

    page.open(phantom.args[0], function(status) {
//	if(status!=="success"){
//		console.log("Unable to access network");
//		console.log(status);
//		phantom.exit();
//	}
//	else{
        waitFor(function() {
            return page.evaluate(function() {
                var runner = document.body.querySelector('.runner');
                if (!runner) {
                    return!!runner;
                }
                return!!runner.querySelector('.description');
            });
        }, function() {
            page.evaluate(function() {
                var suites = document.body.querySelectorAll('.suite');
                for (var i = 0; i < suites.length; i++) {
                    var suite = suites[i];
                    var suiteName = suite.querySelector('.description').innerText;
                    var passOrFail = suite.className.indexOf('passed') != -1 ? "Passed" : "Failed!";
                    console.log('Suite: ' + suiteName + '\t' + passOrFail);
                    console.log('--------------------------------------------------------');
                    var specs = suite.querySelectorAll('.spec');
                    for (var j = 0; j < specs.length; j++) {
                        var spec = specs[j];
                        var passed = spec.className.indexOf('passed') != -1;
                        var specName = spec.querySelector('.description').innerText;
                        var passOrFail = passed ? 'Passed' : "Failed!"
                        console.log('\t' + specName + '\t' + passOrFail);
                        if (!passed) {
                            console.log('\t\t-> Message: ' + spec.querySelector('.resultMessage.fail').innerText);
                            var trace = spec.querySelector('.stackTrace');
                            console.log('\t\t-> Stack: ' + (trace != null ? trace.innerText : 'not supported by phantomJS yet'));
                        }
                    }
                    console.log('');
                }
                var runner = document.body.querySelector('.runner');
                console.log('--------------------------------------------------------');
                console.log('Finished: ' + runner.querySelector('.description').innerText);
            });
            console.log('');
            phantom.exit();
        }, 300001);
//		}
    });
}
else {
    console.log('Could not create WebPage');
    phantom.exit();
}

