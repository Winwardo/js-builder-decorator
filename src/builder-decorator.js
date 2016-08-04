//! MIT License, Topher Winward 2015.
//! https://github.com/Winwardo/js-builder-decorator


'use strict';

(function () {
    /**
     * Decorate any given object or class with builder functions
     */
  var BuilderDecorator = function (decorated_, options) {
    'use strict';
    var _ = require('underscore');

    // -----

    var createSafeCopy = function (e, allFieldsMustBeSet) {
      var copy = cloneObjectWithFunctions(e);

      if (allFieldsMustBeSet === true) {
        for (var field in copy) {
          copy[field] = null;
        }
      }

      return copy;
    };

        // -----

    function cloneObjectWithFunctions(obj) {
      if (obj === null || typeof obj !== 'object') {
        return obj;
      }

      var temp = obj;

      for (var key in obj) {
        temp[key] = cloneObjectWithFunctions(obj[key]);
      }

      return temp;
    }

        // -----

    var newBuilder = function (decorated_, options_) {
      if (options_ == undefined) {
        options_ = {};
      }

      var decorated;
      if (decorated_ instanceof Function) {
        decorated = createSafeCopy(new decorated_(), options_.allFieldsMustBeSet);
      } else {
        decorated = createSafeCopy(decorated_, options_.allFieldsMustBeSet);
      }

            // -----

      var builderObj = { __builderData: decorated };

      var makeSetter = function (fieldName) {
        return function (fieldData) {
          var builderData = _.clone(this.__builderData);
          builderData[fieldName] = fieldData;

          var copy = {};
          copy = applySetters(copy, decorated);
          applyBuilder(copy);
          copy.__builderData = builderData;

          return copy;
        };
      };

      var applySetters = function (builderObj__, decorated__) {
        var newBuilderObj = cloneObjectWithFunctions(builderObj__);
        for (var field in decorated__) {
          newBuilderObj[field] = makeSetter(field);
        }
        return newBuilderObj;
      };

      builderObj = applySetters(builderObj, decorated);

      var applyBuilder = function (builderObj__) {
        var newBuilderObj = cloneObjectWithFunctions(builderObj__);
        newBuilderObj.build = function () {
          var that = this;

                    // check all fields are set
          if (options_.allFieldsMustBeSet) {
            var unsetFields = [];
            for (var field in that.__builderData) {
              var fieldData = that.__builderData[field];
              if (fieldData === null || fieldData === undefined) {
                unsetFields.push(field);
              }
            }

            if (unsetFields.length !== 0) {
              throw 'The following fields were not set: ' + unsetFields;
            }
          }

          var response = {};

          var makeGetter = function (builderData, w) {
            var result;
            var bData = builderData[w];

            if (bData === null) {
              result = null;
            } else {
              result = cloneObjectWithFunctions(builderData[w]);
            }

            return function () {
              return result;
            };
          };

          for (var field in decorated) {
            if (options_.lockFunctionsAfterBuild && decorated[field] instanceof Function) {
              response[field] = that.__builderData[field];
            } else {
              response[field] = makeGetter(that.__builderData, field);
            }
          }

          return response;
        };
        return newBuilderObj;
      };
      builderObj = applyBuilder(builderObj);
      return builderObj;
    };
    return function () { return newBuilder(decorated_, options); };
  };

    // NPM exports
  if (typeof module !== 'undefined') {
    BuilderDecorator.BuilderDecorator = BuilderDecorator;
    module.exports = BuilderDecorator;
  }

    // Standard js exports
  if (typeof window !== 'undefined') {
    window.BuilderDecorator = BuilderDecorator;
  }
})();
