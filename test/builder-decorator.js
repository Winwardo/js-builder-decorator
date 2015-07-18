var should = require('chai').should(),
    expect = require('chai').expect
    builder_decorator = require('../src/builder-decorator'),
    BuilderDecorator = builder_decorator.BuilderDecorator;

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


describe('#BuilderDecorator', function() {
  it('decorates a class', function() {
    var StudentClass = function(){
      this.name = "A name";
    };
    var StudentClassBuilder = new BuilderDecorator(StudentClass);
    
    var student = new StudentClassBuilder().name(student1.name).build();
    student.name().should.equal(student1.name);
  });
  
  it('decorates an object', function() {
    var StudentObject = {
      name: "A name"
    };
    var StudentObjectBuilder = new BuilderDecorator(StudentObject);
    
    var student = new StudentObjectBuilder().name(student1.name).build();
    student.name().should.equal(student1.name);
  });
  
  it('makes setters and getters for all fields', function(){
    var StudentClass = function(){
      this.name = "Some name";
      this.age = 17;
      this.address = {};
    };
    var StudentClassBuilder = new BuilderDecorator(StudentClass);
        
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
    var StudentClassBuilder = new BuilderDecorator(StudentClass);
        
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
    var StudentClassBuilder = new BuilderDecorator(StudentClass, {lockFunctionsAfterBuild: true});
    
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
    var StudentClassBuilder = new BuilderDecorator(StudentClass, {lockFunctionsAfterBuild: true});
    
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
    var StudentClassBuilder = new BuilderDecorator(StudentClass, {lockFunctionsAfterBuild: false});
    
    var student = new StudentClassBuilder()
      .prettyName(function() { return "Hey!"; })
      .build();

    student.prettyName().should.not.equal("Hey!");
    student.prettyName()().should.equal("Hey!");
  });
  
  it('allows null fields by default', function(){
    var StudentClass = function(){
      this.name = "A name";
    };
    var StudentClassBuilder = new BuilderDecorator(StudentClass);
    
    var student = new StudentClassBuilder().name(null).build();
    should.equal(student.name(), null);
  });
  
  it('defaults to the object\'s value if not set', function(){
    var StudentClass = function(){
      this.name = "A name";
    };
    var StudentClassBuilder = new BuilderDecorator(StudentClass);
    
    var student = new StudentClassBuilder().build();
    should.equal(student.name(), "A name");
  });
  
  it('throws a null-field exception if we tell it to and forget to set a field', function(){
    var StudentClass = function(){
      this.name = "A name";
    };
    var StudentClassBuilder = new BuilderDecorator(StudentClass, {allFieldsMustBeSet: true});
    
    // Name not set
    expect(function(){
      var student = new StudentClassBuilder().build();
    }).to.throw("The following fields were not set: name");
  });
  
  it('throws a null-field exception if we tell it to and forget to set multiple fields', function(){
    var StudentClass = function(){
      this.name = "A name";
      this.age = 17;
    };
    var StudentClassBuilder = new BuilderDecorator(StudentClass, {allFieldsMustBeSet: true});
    
    // Name not set
    expect(function(){
      var student = new StudentClassBuilder().build();
    }).to.throw("The following fields were not set: name,age");
  });
});