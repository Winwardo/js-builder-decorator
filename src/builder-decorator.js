//! MIT License, Topher Winward 2015.
//! https://github.com/Winwardo/js-builder-decorator

"use strict";

(function(){
    /**
     * Decorate any given object or class with builder functions
     */
    var BuilderDecorator = function(decorated_, options) {
        
        var createSafeCopy = function(e) {
            var copy = Object.create(e);            
            if (options.allFieldsMustBeSet === true) {
                for (var field in copy) {
                    copy[field] = null;
                }
            }            
            return copy;
        }
                
        // -----

        function cloneObject(obj) {
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }
         
            var temp = obj;
            // if (obj.constructor instanceof Function) {
            //     temp = obj.constructor(); // give temp the original obj's constructor
            // }

            for (var key in obj) {
                temp[key] = cloneObject(obj[key]);
            }
         
            return temp;
        }

        // -----
       
        var doIt = function(decorated_) {
            var decorated;
            if (decorated_ instanceof Function) {
                decorated = cloneObject(new decorated_());
            } else {
                decorated = cloneObject(decorated_);
            }

            // -----
            
            if (options == undefined) {
                options = {};
            }


            var builderObj = {}
            builderObj.__builderData = decorated

            

            var makeSetter = function(fieldName) {
                return function(a) {
                    // var copy = cloneObject(this);
                    // copy.__builderData[fieldName] = a;
                    // console.log("this, copy")
                    // console.log(this);
                    // console.log(copy);

                    var builderData = cloneObject(this.__builderData)
                    builderData[fieldName] = a;

                    var copy = {}
                    applySetters(copy, cloneObject(decorated))
                    applyBuilder(copy)
                    copy.__builderData = builderData;

                    console.log("copy", copy)

                    return copy;
                }
            }

            var applySetters = function(builderObj__, decorated__) {
                for (var x in decorated__) {
                    builderObj__[x] = makeSetter(x);
                }
            }

            applySetters(builderObj, decorated);

            var applyBuilder = function(builderObj__) {
                builderObj__.build = function() {
                    var that = this;

                    var response = {}

                    var makeGetter = function(builderData, w) {
                        return function() {
                            return builderData[w];
                        }
                    }

                    for (var x in decorated) {
                        // response[x] = function() { return that.__builderData[x]; }
                        // response[x] = makeGetter(that.__builderData, x)

                        if (options.lockFunctionsAfterBuild && decorated[x] instanceof Function) {
                            console.log("FUNCTIONY GOODNESS")
                            console.log(that)
                            response[x] = that.__builderData[x]
                        } else {
                            response[x] = makeGetter(that.__builderData, x)
                        }
                    }

                    // console.log("Building:")
                    // console.log(response)

                    return response
                }
            }
            applyBuilder(builderObj)

            // console.log("builderObj")
            // console.log(builderObj)

            // return function() { return builderObj }
            return builderObj
        }
        return function() { return doIt(decorated_) }
        // return doIt(decorated_);
    };
    
    // NPM exports
    if(typeof module !== 'undefined') {
        module.exports = {BuilderDecorator: BuilderDecorator };
    }
    
    // Standard js exports
    if(typeof window !== 'undefined') {
        window.BuilderDecorator = BuilderDecorator;
    }
})();
