/**
 * GB OTP Generator
 * GASS OTP Server, send randomize int through Gmail account.
 * @author GB_Sources
 * @version v1.0.0
 * @license GPL-3.0 license
 */


// randomizee func
class randomize{
  constructor(_digit){
    this.n_digit = _digit;

  }

  create(){
    var digit = Math.round(Math.random() * 10**this.n_digit);
    return this.nZero(digit, this.n_digit);
  }

  nZero(x,n_digit){
    var x_str = String(x);
    var x_len = x_str.length;
    var r_len = x_len < n_digit? n_digit - x_len : 0;

    return "0".repeat(r_len) + x_str;
  }
}

// BYTE to HexString func
function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}


// hasting MD5
function MD5(str){
  return toHexString(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, str));
}


// main send email func
function sendOTP(recipient, Kode_OTP) {

  var subject = "OTP | NOREPLY GB_Sources";
  var template =  HtmlService.createTemplateFromFile("OTP");
  template.Kode_OTP = Kode_OTP;

  var mail_body = template.evaluate().getContent();


  var opt = {
    htmlBody: mail_body,
    noReply: true
  }

  var res = GmailApp.sendEmail(recipient, subject, "", opt)
  console.log(res);
}




// ===================================================================
// WEBSERVER CONFIG
function send(obj){
  obj = typeof obj == "object"? JSON.stringify(obj) : obj;
  return ContentService.createTextOutput(obj);
}


function doGet(e){
  var p = e.parameter;
  var to = p.to;

  try{
    if(!to) throw "please provide recepient";

    // CREATE RANDOM OTP
    const rand = new randomize(6);
    var Kode_OTP = rand.create();

    // GET HASH
    var md5 = MD5(Kode_OTP);


    // SEND EMAIL
    sendOTP(to, Kode_OTP);

    return send({
      code: 200,
      data: {
        hash: md5
      }
    })
    

  }catch(err){
    var obj = !err.message? { code: 500, message: err} : err;
    return send(obj)
  }

}

