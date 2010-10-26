module("Input Tests", {
  setup: function(){
    S.open('input.html')
  }
});

test("Password Class",function(){
  ok(S("#passwordTest").hasClass("password"), "Has the password class");
});

test("Email Class",function(){
  ok(S("#emailTest").hasClass("email"), "Has the email class");
});

test("Text Class",function(){
  ok(S("#textTest").hasClass("text"), "Has the text class");
});

