# js-builder-decorator
Decorate any Javascript object with a convenient builder, which returns an immutable object with getters.

[![Build Status](https://travis-ci.org/Winwardo/js-builder-decorator.svg?branch=master)](https://travis-ci.org/Winwardo/js-builder-decorator)
[![npm version](https://badge.fury.io/js/js-builder-decorator.svg)](http://badge.fury.io/js/js-builder-decorator)
[![npm version](https://david-dm.org/winwardo/js-builder-decorator.svg)](https://david-dm.org/winwardo/js-builder-decorator)

###Standard usage:

    var StudentClass = function(){
      this.name = "Some default name";
      this.age = undefined;
      this.address = {};
      this.prettyName = function(){};
    };
    var StudentClassBuilder = BuilderDecorator(StudentClass);
  
    var student = StudentClassBuilder()
      .name("John")
      .age(17)
      .address({postcode: "90210"})
      .prettyName(function(){ return "Hi, I'm " + this.name() + "!"; })
      .build();
      
    student.name();       // "John"
    student.age();        // 17
    student.address();    // {postcode: "90210"}
    student.prettyName(); // function(){ return "Hi, I'm " + this.name() + "!"; }
    
###Requiring in Node:
    var BuilderDecorator = require('js-builder-decorator').BuilderDecorator;

###Locking functions after build
    var StudentClassBuilderLocked = BuilderDecorator(StudentClass, {lockFunctionsAfterBuild: true});
    var student = StudentClassBuilderLocked()
      .name("John")
      .prettyName(function(){ return "Hi, I'm " + this.name() + "!"; })
      .build();
      
    student.name();       // "John"
    student.prettyName(); // "Hi, I'm John!"
    
###Enforcing no null fields
	// Throwing exception if any field isn't set
	var StudentClassBuilderNoNulls = BuilderDecorator(StudentClass, {allFieldsMustBeSet: true});

	try {
		var student = StudentClassBuilderNoNulls().build(); // This throws an exception
	} catch (E) {
		console.log(E); // The following fields were not set: name,age,address,prettyName
	}

##Installation
If you have Node.js installed, run `npm i js-builder-decorator` in your project directory.  
Else, you can download the latest version from Github [here](https://raw.githubusercontent.com/Winwardo/js-builder-decorator/master/builder-decorator.min.js).
