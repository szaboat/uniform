describe("uniform", function () {
  
  var select;
  
  beforeEach(function () {
    select = jQuery('<select id="select"><option>foo</option><option>bar</option></select>');
    select.appendTo('body');
    select.uniform();
  });
  
  afterEach(function(){
    select.parent().remove();
  });
  
  describe('select', function(){
    describe("initialize", function () {

      it("should return an object", function () {
        expect(typeof jQuery().uniform()).toBe('object');
      });

      it("should have a div with a .selector class", function () {
        expect(select.parent().hasClass('selector')).toBe(true);
      });
            
    });
  });  
});