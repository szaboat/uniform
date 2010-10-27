module("Select Tests", {
  setup: function(){
    S.open('select.html');
  }
});

test("Select Wrapped",function(){
  equals(S("div.selector #regular").size(), 1,  "Wrapped normal select");
  equals(S("div.selector span").size(), 1, "Has sibling span");
  equals(S("div.selector span").text(), S("#regular option:first").text(), "Span has correct text");
  equals(S("div.selector #multiple").size(), 0, "Did not wrap multiple select");
});

