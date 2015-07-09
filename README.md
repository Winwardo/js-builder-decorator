# js-builder-decorator
Decorate any Javascript object with a convenient builder, which returns an immutable object with getters.

[![Build Status](https://travis-ci.org/Winwardo/js-builder-decorator.svg?branch=master)](https://travis-ci.org/Winwardo/js-builder-decorator)

###Standard usage:

    var StudentClass = function(){
      this.name = "Some default name";
      this.age = undefined;
      this.address = {};
    };
    var StudentClassBuilder = new BuildDecorator(StudentClass);
  
    var student = new StudentClassBuilder()
      .name("John")
      .age(17)
      .address({postcode: "90210"})
      .prettyName(function(){ return "Hi, I'm " + this.name() + "!"; }
      .build();
      
    student.name();       // "John"
    student.age();        // 17
    student.address();    // {postcode: "90210"}
    student.prettyName(); // function(){ return "Hi, I'm " + this.name() + "!"; }
    
###Locking functions after build
    var StudentClassBuilderLocked = new BuildDecorator(StudentClass, {lockFunctionsAfterBuild: true});
    var student = new StudentClassBuilderLocked()
      .name("John")
      .prettyName(function(){ return "Hi, I'm " + this.name() + "!"; }
      .build();
      
    student.name();       // "John"
    student.prettyName(); // "Hi, I'm John!"
