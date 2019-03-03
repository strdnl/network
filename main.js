var endpoint = "https://www.jsonstore.io/80f28716932659018694272f8d67be0c06f2ed83e868c761ee07d5397b0cd7a3";
var keyIV = "";

function ivcreate(){

str = window.location.hash.substr(1);
var k1 = Math.floor(Math.random() * 7) + 0;
var k2 = Math.floor(Math.random() * 7) + 0;
var key = ("" + k1 + k2);
var n = str.charCodeAt(k1);
	
var n2 = str.charCodeAt(k2);

keyIV = (n* n2) / 6.666;
	console.log(keyIV);
//document.getElementById("aes-key").innerHTML = result
//document.getElementById("rkey").innerHTML = key
//document.getElementById("stringy").innerHTML = text
window.location.hash = str + key ;
return keyIV;	
	
}

function ivrecreate(){

var str = window.location.hash.substring(1,9);
var k1 = window.location.hash.substring(9, 10);
var k2 = window.location.hash.substring(10, 11);
var key = ("" + k1 + k2);
var n = str.charCodeAt(k1);
var n2 = str.charCodeAt(k2);

keyIV = (n* n2) / 6.666 ;
	console.log(keyIV);
//document.getElementById("aes-key").innerHTML = result
//document.getElementById("rkey").innerHTML = key
//document.getElementById("stringy").innerHTML = text
// window.location.hash = str + key ;	
return keyIV;		
}

function encrypt(url){
		
	var stub = window.location.hash.substring (1, 6);
var stub2 = window.location.hash.substring(1);
var result2 = keyIV/2

var salt = CryptoJS.PBKDF2(stub2, stub2, { keySize: 256/32, iterations: result2 }).toString();
console.log(salt);
var hash = CryptoJS.PBKDF2(stub, salt, { keySize: 512/32, iterations: keyIV }).toString();
console.log(hash);   
var codex = CryptoJS.AES.encrypt(url, hash).toString();
console.log(codex);
var codex2 = CryptoJS.AES.encrypt(codex, hash).toString();
	console.log(codex2);
    // var codex3 = JSON.stringify(codex2);
    return codex2;
}

function geturl(){
    url = document.getElementById("urlinput").value;
    var protocol_ok = url.startsWith("http://") || url.startsWith("https://") || url.startsWith("ftp://") || url.startsWith("data:text/");
    if(!protocol_ok){
        var newurl = "http://"+url;
	    var sha = CryptoJS.SHA256(newurl).toString(CryptoJS.enc.Base64);
	     var hmac = CryptoJS.HmacMD5(newurl, sha).toString(CryptoJS.enc.Base64);
        window.location.hash = hmac.substring(0, 8)
       return newurl;
        
        }else{
		var sha = CryptoJS.SHA256(url).toString(CryptoJS.enc.Base64);
		var hmac = CryptoJS.HmacMD5(url, sha).toString(CryptoJS.enc.Base64);
        window.location.hash = hmac.substring(0, 8)
            return url;
        }
}

function getrandom() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function genhash(){
    if (window.location.hash == ""){
	    var ur = document.getElementById("urlinput").value;
	var sha = CryptoJS.SHA256(ur).toString(CryptoJS.enc.Base64);    
        window.location.hash = sha.substring(0, 8)

    }
}

function send_request(url) {
	this.url = url;
//	var hotp = new jsOTP.hotp();
// var hmacCode = hotp.getOtp(window.location.hash.substring(6,9), keyIV);
 //   console.log(hmacCode);
    $.ajax({
       //  'url': endpoint + "/" + window.location.hash.substring(6,9),  
       'url': endpoint + "/" + window.location.hash.substring(6,9),
	    'type': 'POST',
        'data': JSON.stringify(this.url),
        'dataType': 'json',
        'contentType': 'application/json; charset=utf-8'
})
}

function shorturl(){
	document.getElementById("aes-key").innerHTML = "ENCRYPTING..." ;
    var longurl = geturl();
	console.log(longurl);
    // genhash();
	console.log(longurl);
	var key2 = ivcreate();
   var longurl = encrypt(longurl);
    send_request(longurl);
	
document.getElementById("aes-key").innerHTML = "locked with " + keyIV + " rounds" ;
}

var hashh = window.location.hash.substring(6, 9)
console.log(hashh);
if (window.location.hash != "") {
	// document.getElementById("aes-key").innerHTML = "DECRYPTING..." ;
    $.getJSON(endpoint + "/" + hashh, function (data) {
        data = data["result"];
             ivrecreate();
	    	var stub = window.location.hash.substring (1, 6);
var stub2 = window.location.hash.substring(1);
var result2 = keyIV/2
console.log(result2);
	
	console.log(stub);
	//console.log(key2);
	
var salt = CryptoJS.PBKDF2(stub2, stub2, { keySize: 256/32, iterations: result2 }).toString();
console.log(salt);
var hash = CryptoJS.PBKDF2(stub, salt, { keySize: 512/32, iterations: keyIV }).toString();
console.log(hash); 
	    var key1 = window.location.hash.substring(1, 6);
	    var decrypted1 = CryptoJS.AES.decrypt(data, hash);
            var decrypted2 = decrypted1.toString(CryptoJS.enc.Utf8);
            var decrypted3 = CryptoJS.AES.decrypt(decrypted2, hash);
            var decrypted =  decrypted3.toString(CryptoJS.enc.Utf8);
var sha = CryptoJS.SHA256(decrypted).toString(CryptoJS.enc.Base64);
	    var hmac = CryptoJS.HmacMD5(decrypted, sha).toString(CryptoJS.enc.Base64);
        if (window.location.hash.substring(1, 9) == hmac.substring(0, 8)) {
            window.location.href = decrypted;}

    });
}
