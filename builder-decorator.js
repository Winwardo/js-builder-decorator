//! MIT License, Topher Winward 2015.
//! https://github.com/Winwardo/js-builder-decorator

"use strict";

(function(){
    /**
     * Decorate any given object or class with builder functions
     */
    var BuilderDecorator = function(decorated, options) {
        if (options == undefined) {
            options = {};
        }
        return function(){
            if (decorated instanceof Function) {
                decorated = new decorated();
            }
            else if (decorated instanceof Array) {
                throw(new Error("An array may not be decorated."));
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
                    if (options.lockFunctionsAfterBuild && decorated[y] instanceof Function) {
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
        }
    };
    
    // NPM exports
    if(typeof module !== 'undefined') {
        module.exports = {BuilderDecorator: BuilderDecorator};
    }
    
    // Standard js exports
    if(typeof window !== 'undefined') {
        window.BuilderDecorator = BuilderDecorator;
    }
})();