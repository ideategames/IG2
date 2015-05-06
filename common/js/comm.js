/*
-----------------------------------------------------------------------------------------
--
-- comm.js
--
// Copyright 2014, 2015 IdeateGames
// This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. 
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or 
// send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
// 
// Author: David Marques
//
-----------------------------------------------------------------------------------------
*/


IGactiveComm = false
$.getScript("/common/js/server.js", function() {
    IGconsole("Server, FB: "+IGisIGServer+":"+server+":"+IGuseFB);
});

function DMMGetHttpRequest(packet,page) {
    // if (packet.query == "userData") {IGconsole("not recording data")}
    if ((IGisIGServer)) {
        IGactiveComm = true
        function preload() {
            var u = IGmydev
            var stuffing = "&stuffing=" + CryptoJS.SHA1(CryptoJS.SHA1(IGapp + IGmadwiz + DMMalias + IGgame) + DMMalias + IGgame);
            var encoded = "&query="+packet.query+"&topic="+EventType
            // packet needs to be a table, a set of a/v pairs
            for (var prop in packet) { 
                    // if type(v) == "table" then
                    //     print(MOAIJsonParser.encode(v)); encoded = encoded + "&" + a + "=" + MOAIJsonParser.encode(v)
                    // else
                        if (prop != "query") {encoded = encoded + "&" + prop + "=" + packet[prop]}
                    // end
            }
            var dest = "http://" + server + "/init/"+IGapp+"/" + page +".jsonp"
            var msg =  "?sender=" + DMMsender + stuffing +encoded+ "&app="+ IGapp+"&u="+u +"&game="+ IGgame +"&alias=" + DMMalias
    //        IGconsole("sending: " + msg)

            $.ajaxSetup({
                headers: { "Access-Control-Allow-Origin": "*" }
            });

            $.ajax( {
                beforeSend: function(xhr){
                    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
                },
                type: 'get',
                url: dest+msg,
                async: false,
                dataType: "jsonp",
                error: function (errormessage) {
                    IGactiveComm = false
                    IGconsole("error: " + JSON.stringify(errormessage));
                },
                success: function(data) { 
                    IGactiveComm = false
                    // IGconsole("data: "+JSON.stringify(data));
                    DMMComm.message = data
                    dispatchComm[data.query]()
                }
            })

            .done(function() {
                IGactiveComm = false
                IGconsole( "json success" );
            })
            .fail(function() {
                IGactiveComm = false
                // alert("Network error. Please reload the page.")
                IGconsole( "request failed" );
            })
            .always(function() {
                IGactiveComm = false
            });

        }

        IGconsole("sending "+packet.query+":"+page)
        preload()
    // create()
    }
}
