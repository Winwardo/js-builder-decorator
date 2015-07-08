// MIT License, Topher Winward 2015.
// https://github.com/Winwardo/js-builder-decorator
"use strict";

var BuildDecorator = function(decorated, lockFunctionsAfterBuild) {
    return function(){
        if (decorated instanceof Function) {
            decorated = new decorated();
        }
        
        this.builderData = Object.create(decorated);
        var builderData = this.builderData;
        var builderObj = {};
        
        var makeSetter = function(fieldname) {
            return function(fielddata) {
                builderData[fieldname] = fielddata;
                return this;
            };
        };
        
        for (var x in decorated) {
            builderObj[x] = makeSetter(x);
        }
        
        builderObj.build = function(){
            var makeGetter = function(w){
                return function(){
                    return builderData[w];
                };
            };
            
            var builtObj = {};
            for (var y in builderData) {
                if (lockFunctionsAfterBuild && decorated[y] instanceof Function) {
                    builtObj[y] = builderData[y];
                }
                else
                {
                    builtObj[y] = makeGetter(y);
                }
            }
            
            return builtObj;
        };
        
        return builderObj;
    };
};

var defaultAddress = {
    street: "41 Oakdene Road",
    country: "Mongolia"
};

var StudentObject = {
    name: "Some name to overwrite",
    age: undefined,
    address: defaultAddress,
    pretty: function() {
        return "My name is " + this.name() + ", and I am " + this.age() + " years old.";
    }
};

var StudentClass = function() {
    this.name = "A name";
    this.age = "An age!";
    this.address = defaultAddress;
    this.pretty = function(){ return "I'm " + this.name() + "!"; };
};

var StudentClassBuilder = new BuildDecorator(StudentClass, true);
var StudentObjectBuilder = new BuildDecorator(StudentObject, true);
var StudentBuilderNoFunctionLock = new BuildDecorator(StudentObject, false);

var john = new StudentClassBuilder().name("James").age(19).age(20).build();
var mary = new StudentObjectBuilder().name("Mary").age(18).build();
var alice = new StudentBuilderNoFunctionLock().name("Alice").pretty(function(){ return "I'm not locked!"; }).build();

console.log(john.name(), john.age(), john.address(), john.pretty());
console.log(mary.name(), mary.age(), mary.address(), mary.pretty());
console.log(alice.name(), alice.age(), alice.address(), alice.pretty(), alice.pretty()());