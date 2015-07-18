//! MIT License, Topher Winward 2015.
//! https://github.com/Winwardo/js-builder-decorator

"use strict";

(function(){
    /**
     * Decorate any given object or class with builder functions
     */
    var BuilderDecorator = function(decorated, options) {
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
       
        var main = function() {
            var builderData = {},
                builderObj = {}
            
            // -----
            
            var makeSetter = function(fieldname) {
                return function(fielddata) {
                    builderData[fieldname] = fielddata;
                    return this;
                };
            };
            
            // -----
            
            var createAllSetters = function() {
                for (var x in decorated) {
                    builderObj[x] = makeSetter(x);
                }
            };
            
            // -----
            
            var createBuildFunction = function() {
                builderObj.build = function(){
                    var builtObj = {}
                    
                    // -----
                    
                    var checkAllFieldsSet = function () {
                        if (options.allFieldsMustBeSet === true) {
                            var unsetFields = [];
                            for (var field in builderData) {
                                var fieldData = builderData[field];
                                if (fieldData === null) {
                                    unsetFields.push(field);
                                }
                            }
                            
                            if (unsetFields.length !== 0) {
                                throw "The following fields were not set: " + unsetFields
                            }
                        }
                    };
                    
                    // -----
                    
                    var createAllGetters = function() {
                        var makeGetter = function(w){
                            return function(){
                                return builderData[w];
                            };
                        };
                        
                        // -----
                    
                        for (var y in builderData) {
                            if (options.lockFunctionsAfterBuild && decorated[y] instanceof Function) {
                                builtObj[y] = builderData[y];
                            }
                            else
                            {
                                builtObj[y] = makeGetter(y);
                            };
                        };
                    };
                    
                    // -----
                    
                    checkAllFieldsSet();
                    createAllGetters();
                    
                    return builtObj;
                };
            }
            
            // -----
            
            var makeBuilderObj = function() {
                if (decorated instanceof Function) {
                    decorated = new decorated();
                }
                else if (decorated instanceof Array) {
                    throw(new Error("An array may not be decorated."));
                }
                
                builderData = createSafeCopy(decorated);
                createAllSetters();
                createBuildFunction();
                
                return builderObj; 
            }            
            
            // -----
            
            return makeBuilderObj();
        }
        
        return main
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