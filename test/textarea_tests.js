module("Textarea Tests", {
  setup: function(){
    S.open('textarea.html')
  }
});

test("Textarea Class",function(){
  ok(S("#textareaTest").hasClass("uniform"), "Has the uniform class");
});
