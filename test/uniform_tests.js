module("Textarea Tests", {
  setup: function(){
    //S.open('uniform.html')
  }
});

test("Textarea Class",function(){
  $("#textareaTest").uniform();
  ok($("#textareaTest").hasClass("uniform"), "Has the uniform class");
});

test("Text Input Class",function(){
  $("#inputText").uniform();
  ok($("#inputText").hasClass("text"), "Has the text class");
});

test("Email Input Class",function(){
  $("#inputEmail").uniform();
  ok($("#inputEmail").hasClass("email"), "Has the email class");
});
