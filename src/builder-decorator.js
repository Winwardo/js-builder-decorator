//! MIT License, Topher Winward 2015.
//! https://github.com/Winwardo/js-builder-decorator


"use strict";

(function(){

    /**
     * Decorate any given object or class with builder functions
     */
    var BuilderDecorator = function(decorated_, options) {
        var _ = require('underscore')

        var createSafeCopy = function(e) {
            var copy = cloneObject(e)      

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

            for (var key in obj) {
                temp[key] = cloneObject(obj[key]);
            }
         
            return temp;
        }

        // -----
       
        var doIt = function(decorated_) {
            if (options == undefined) {
                options = {};
            }

            var decorated;
            if (decorated_ instanceof Function) {
                decorated = createSafeCopy(new decorated_());
            } else {
                decorated = createSafeCopy(decorated_);
            }

            // -----

            var builderObj = {}
            builderObj.__builderData = decorated           

            

            var makeSetter = function(fieldName) {
                return function(a) {
                    var builderData = _.clone(this.__builderData)
                    builderData[fieldName] = a;


                    var copy = {}
                    copy = applySetters(copy, cloneObject(decorated))
                    applyBuilder(copy)
                    copy.__builderData = builderData;

                    return cloneObject(copy);
                }
            }

            var applySetters = function(builderObj__, decorated__) {
                var b = cloneObject(builderObj__);
                for (var x in decorated__) {
                    b[x] = cloneObject(makeSetter(x));
                }
                return b;
            }

            builderObj = applySetters(builderObj, decorated);

            var applyBuilder = function(builderObj__) {
                var b = cloneObject(builderObj__);
                b.build = function() {
                    var that = cloneObject(this);

                    // check all fields are set
                    if (options.allFieldsMustBeSet) {
                        var unsetFields = [];
                        for (var field in that.__builderData) {
                            var fieldData = that.__builderData[field];
                            if (fieldData === null || fieldData === undefined) {
                                unsetFields.push(field);
                            }
                        }
                        
                        if (unsetFields.length !== 0) {
                            throw "The following fields were not set: " + unsetFields
                        }
                    }

                    var response = {}

                    var makeGetter = function(builderData, w) {
                        return function() {
                            return cloneObject(builderData[w]);
                        }
                    }

                    for (var x in decorated) {
                        if (options.lockFunctionsAfterBuild && decorated[x] instanceof Function) {
                            response[x] = that.__builderData[x]
                        } else {
                            response[x] = makeGetter(that.__builderData, x)
                        }
                    }

                    return response
                }
                return b;
            }
            builderObj = applyBuilder(builderObj)
            return builderObj
        }
        return function() { return doIt(decorated_) }
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
