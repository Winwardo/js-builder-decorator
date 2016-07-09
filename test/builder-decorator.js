'use strict';

var should = require('chai').should(),
    expect = require('chai').expect,
    BuilderDecorator = require('../src/builder-decorator').BuilderDecorator;

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
    var StudentClassBuilder = BuilderDecorator(StudentClass);
    
    var student = StudentClassBuilder().name(student1.name).build();
    student.name().should.equal(student1.name);
  });
  
  it('decorates an object', function() {
    var StudentObject = {
      name: "A name"
    };
    var StudentObjectBuilder = BuilderDecorator(StudentObject);
    
    var student = StudentObjectBuilder().name(student1.name).build();
    student.name().should.equal(student1.name);
  });
  
  it('makes setters and getters for all fields', function(){
    var StudentClass = function(){
      this.name = "Some name";
      this.age = 17;
      this.address = {};
    };
    var StudentClassBuilder = BuilderDecorator(StudentClass);
        
    var student = StudentClassBuilder()
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
    var StudentClassBuilder = BuilderDecorator(StudentClass);
        
    var newStudent1 = StudentClassBuilder()
      .name(student1.name)
      .build();
    var newStudent2 = StudentClassBuilder()
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
    var StudentClassBuilder = BuilderDecorator(StudentClass, {lockFunctionsAfterBuild: true});
    
    var student = StudentClassBuilder()
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
    var StudentClassBuilder = BuilderDecorator(StudentClass, {lockFunctionsAfterBuild: true});
    
    var student = StudentClassBuilder()
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
    var StudentClassBuilder = BuilderDecorator(StudentClass, {lockFunctionsAfterBuild: false});
    
    var student = StudentClassBuilder()
      .prettyName(function() { return "Hey!"; })
      .build();

    student.prettyName().should.not.equal("Hey!");
    student.prettyName()().should.equal("Hey!");
  });
  
  it('allows null fields by default', function(){
    var StudentClass = function(){
      this.name = "A name";
    };
    var StudentClassBuilder = BuilderDecorator(StudentClass);
    
    var student = StudentClassBuilder().name(null).build();
    should.equal(student.name(), null);
  });
  
  it('defaults to the object\'s value if not set', function(){
    var StudentClass = function(){
      this.name = "A name";
    };
    var StudentClassBuilder = BuilderDecorator(StudentClass);
    
    var student = StudentClassBuilder().build();
    should.equal(student.name(), "A name");
  });
  
  it('throws a null-field exception if we tell it to and forget to set a field', function(){
    var StudentClass = function(){
      this.name = "A name";
    };
    var StudentClassBuilder = BuilderDecorator(StudentClass, {allFieldsMustBeSet: true});
    
    // Name not set
    expect(function(){
      var student = StudentClassBuilder().build();
    }).to.throw("The following fields were not set: name");
  });
  
  it('throws a null-field exception if we tell it to and forget to set multiple fields', function(){
    var StudentClass = function(){
      this.name = "A name";
      this.age = 17;
    };
    var StudentClassBuilder = BuilderDecorator(StudentClass, {allFieldsMustBeSet: true});
    
    // Name not set
    expect(function(){
      var student = StudentClassBuilder().build();
    }).to.throw("The following fields were not set: name,age");
  });

  it('creates a new immutable copy on each set', function(){
    var StudentClass = function(){
      this.name = undefined;
      this.other = "ignore"
    };
    var StudentClassBuilder = BuilderDecorator(StudentClass);
    
    var studentJohn = StudentClassBuilder().name("John");
    var studentSteve = studentJohn.name("Steve");

    should.equal(studentJohn.build().name(), "John");
    should.equal(studentSteve.build().name(), "Steve");
  });

  it('deep freezes responses from getters to avoid accidental mutation', function(){
    var StudentClass = function(){
      this.details = {};
    };
    var StudentClassBuilder = BuilderDecorator(StudentClass);
    
    var student = StudentClassBuilder().details({mark: 50}).build();
    var data = student.details()
    
    expect(function(){
      data.mark = 20;
    }).to.throw();

  });
});