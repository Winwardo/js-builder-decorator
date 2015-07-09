var should = require('chai').should(),
    builder_decorator = require('../builder-decorator'),
    BuildDecorator = builder_decorator.BuildDecorator;

var student1 = {
  name: "John",
  age: 18,
  address: {postcode: "90210"}
};
var student2 = {
  name: "Mary",
  age: 16,
  address: {postcode: "WD40"}
};


describe('#BuildDecorator', function() {
  it('decorates a class', function() {
    var StudentClass = function(){
      this.name = "A name";
    };
    var StudentClassBuilder = new BuildDecorator(StudentClass);
    
    var student = new StudentClassBuilder().name(student1.name).build();
    student.name().should.equal(student1.name);
  });
  
  it('decorates an object', function() {
    var StudentObject = {
      name: "A name"
    };
    var StudentObjectBuilder = new BuildDecorator(StudentObject);
    
    var student = new StudentObjectBuilder().name(student1.name).build();
    student.name().should.equal(student1.name);
  });
  
  it('makes setters and getters for all fields', function(){
    var StudentClass = function(){
      this.name = "Some name";
      this.age = 17;
      this.address = {};
    };
    var StudentClassBuilder = new BuildDecorator(StudentClass);
        
    var student = new StudentClassBuilder()
      .name(student1.name)
      .age(student1.age)
      .address(student1.address)
      .build();
      
    student.name().should.equal(student1.name);
    student.age().should.equal(student1.age);
    student.address().should.equal(student1.address);
  });
  
  it('can create multiple objects', function(){
    var StudentClass = function(){
      this.name = "Some name";
      this.age = 17;
      this.address = {}
    };
    var StudentClassBuilder = new BuildDecorator(StudentClass);
        
    var newStudent1 = new StudentClassBuilder()
      .name(student1.name)
      .build();
    var newStudent2 = new StudentClassBuilder()
      .name(student2.name)
      .build();
      
    newStudent1.name().should.equal(student1.name); 
    newStudent2.name().should.equal(student2.name); 
  });
  
  it('can preserve functions', function(){
    var StudentClass = function () {
      this.name = undefined;
      this.age = 0;
      this.prettyName = function(){
        return "My name is " + this.name() + ", and I am " + this.age() + " years old.";
      };
    };
    var StudentClassBuilder = new BuildDecorator(StudentClass, {lockFunctionsAfterBuild: true});
    
    var student = new StudentClassBuilder()
      .name("John")
      .age(18)
      .build();
    student.prettyName().should.equal("My name is John, and I am 18 years old.");
  });
  
  it('can set functions', function(){    
    var StudentClass = function(){
      this.name = undefined;
      this.age = 0;
      this.prettyName = function(){
        return "My name is " + this.name() + ", and I am " + this.age() + " years old.";
      };
    };
    var StudentClassBuilder = new BuildDecorator(StudentClass, {lockFunctionsAfterBuild: true});
    
    var student = new StudentClassBuilder()
      .name("John")
      .age(18)
      .prettyName(function() { return "Hey!"; })
      .build();
      
    student.prettyName().should.equal("Hey!");    
  });
  
  it('can get functions instead of calling', function(){    
    var StudentClass = function(){
      this.prettyName = function(){
        // Do whatever
      };
    };
    var StudentClassBuilder = new BuildDecorator(StudentClass, {lockFunctionsAfterBuild: false});
    
    var student = new StudentClassBuilder()
      .prettyName(function() { return "Hey!"; })
      .build();

    student.prettyName().should.not.equal("Hey!");
    student.prettyName()().should.equal("Hey!");
  });
  
});