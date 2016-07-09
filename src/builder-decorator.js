//! MIT License, Topher Winward 2015.
//! https://github.com/Winwardo/js-builder-decorator

"use strict";

(function(){
    /**
     * Decorate any given object or class with builder functions
     */
    var BuilderDecorator = function(decorated_, options) {
        var decorated;
        if (decorated_ instanceof Function) {
            decorated = new decorated_();
        } else {
            decorated = decorated_;
        }

        // -----
        
        if (options == undefined) {
            options = {};
        }
        
        // -----
        
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
         
            var temp = obj.constructor(); // give temp the original obj's constructor
            for (var key in obj) {
                temp[key] = cloneObject(obj[key]);
            }
         
            return temp;
        }

        // -----
       
        var builderObj = {}
        builderObj.__builderData = {}

        

        var makeSetter = function(fieldName) {
            return function(a) {
                var copy = cloneObject(this);
                copy.__builderData[fieldName] = a;
                console.log("this, copy")
                console.log(this);
                console.log(copy);
                return copy;
            }
        }

        var applySetters = function(builderObj__, decorated__) {
            for (var x in decorated__) {
                builderObj__[x] = makeSetter(x);
            }
        }

        applySetters(builderObj, decorated);

        builderObj.build = function() {
            var that = this;

            var response = {}

            var makeGetter = function(builderData, w) {
                return function() {
                    return builderData[w];
                }
            }

            for (var x in decorated) {
                // response[x] = function() { return that.__builderData[x]; }
                response[x] = makeGetter(that.__builderData, x)
            }

            // console.log("Building:")
            // console.log(response)

            return response
        }

        // console.log("builderObj")
        // console.log(builderObj)
        return function() { return builderObj }
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
