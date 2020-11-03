//
//     Angular directive for KeyLines v6.1.2-56105
//
//     Copyright © 2011-2020 Cambridge Intelligence Limited.
//     All rights reserved.
//

angular.module('ngKeylines', [])

.factory('klComponentsFactory', ['$q', function ($q) {
  function klPaths(base, images) {
    var paths = {
      images: base // default if not separately defined
    };
    if (angular.isDefined(images)) {
      paths.images = images;
    }
    return paths;
  }

  // Define the factory
  var factory = {};

  factory.create = function (klComponents, klBasePath, klImagesPath) {
    // KeyLines paths configuration
    var paths = klPaths(klBasePath || '', klImagesPath);
    KeyLines.paths(paths);
    // Use promise object $q from AngularJS
    KeyLines.promisify($q);

    // KeyLines create components
    return KeyLines.create(klComponents);
  };

  return factory;
}])

.controller('klComponentsController', ['klComponentsFactory', function (klComponentsFactory) {
  var that = this;
  var declarations = [];

  // Declare a new component to create
  that.declareComponent = function (componentSpec, controller) {
    // Save the component and controller to create
    declarations.push([componentSpec, controller]);
  };

  // Create the KeyLines components using the factory
  that.createComponents = function () {
    // Call the service only if there is something to create
    if (declarations.length > 0) {
      var components = declarations.map(function(decl) { return decl[0]; });
      // Call the service to create all the kl components
      klComponentsFactory
        .create(components, that.klBasePath, that.klImagesPath)
        .then(function (klComponents) {
          // Notify all the component controllers
          declarations.map(function (decl, i) {
            decl[1].onComponentCreated(klComponents[i]);
          });

          // Call the callback and attach the components
          if (that.klReady) {
            that.klReady()(klComponents);
          }
        })
        .catch(function (error) {
          throw new Error(error);
        });
    }
  };
}])

.controller('klComponentController', ['$parse', '$timeout', 'klComponentsFactory', function ($parse, $timeout, klComponentsFactory) {
  var that = this;
  var klComponent = false;
  var klParentContext = false;
  var klEvents = {};

  // Init the component
  that.initComponent = function (attributes, parentContext) {
    // Save the parent context
    klParentContext = parentContext;
    // Register events based on attributes
    registerEvents(attributes);
  };

  // Create the KeyLines component using the factory
  that.createComponent = function (toCreate) {
    // Call the service to create the kl component
    klComponentsFactory
      .create(toCreate, that.klBasePath, that.klImagesPath)
      .then(function (klComponent) {
        // Notify that the component is created
        that.onComponentCreated(klComponent);

        // Call the callback and attach the component
        if (that.klReady) {
          that.klReady()(klComponent);
        }
      })
      .catch(function (error) {
        throw new Error(error);
      });
  };

  // Once the component is created
  that.onComponentCreated = function (component) {
    // Save the component
    klComponent = component;
    attachEvents();
  };

  // Detach registered events for the component
  that.detachEvents = function () {
    if (klComponent) {
      angular.forEach(klEvents, function (eventFn, eventName) {
        klComponent.off(eventName);
      });
    }
  };

  function toKebabCase(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  // Register the events found on attributes
  function registerEvents(attributes) {
    angular.forEach(attributes, function (expression, eventName) {
      // Determine if it's a kl events
      if (!that[eventName] && eventName.search(/kl/i) !== -1) {
        // https://docs.google.com/presentation/d/15XgHRI8Ng2MXKZqglzP3PugWFZmIDKOnlAXDGZW2Djg/edit#slide=id.g2a0ec7d53_00
        // parse the events and build an object containing them
        eventName = toKebabCase(eventName);
        eventName = eventName.replace('kl-', ''); // remove kl prefix
        klEvents[eventName.toLowerCase()] = $parse(expression);
      }
    });
  }

  // Attach the events to the component
  function attachEvents() {
    if (klComponent && klParentContext) {
      // attach the KeyLines events asked to the component
      angular.forEach(klEvents, function (eventFn, eventName) {
        klComponent.on(eventName, function (props) {
          // Force to trigger a new digest cycle
          // Ensure that the parent scope will be refreshed
          // It's necessary to update the variables attached to the scope of the controller used in the view
          // Otherwise the values will not change in the view
          $timeout();
          // Evaluate the functions parsed before
          // Gives KeyLines event arguments
          return eventFn(klParentContext)(props);
        });
      });
    }
  }
}])

.directive('klComponents', function () {
  return {
    // Restriction on elements and attributes
    restrict: 'AE',
    // Isolated scope
    scope: {
      klBasePath: '@?', // optional
      klImagesPath: '@?', // optional
      klReady: '&?' // optional
    },
    // ControllerAs 'syntax'
    controllerAs: 'componentsCtrl',
    // Bind scope properties to the controller
    bindToController: true,
    // Controller to register components
    controller: 'klComponentsController',
    // Create the HTML component
    link: function (scope, element, attrs, klComponentsController) {
      // Create the components
      klComponentsController.createComponents();
    }
  };
})

.directive('klComponent', function () {
  return {
    // Require the klComponents directive
    require: '^?klComponents', // optional
    // Restriction on elements and attributes
    restrict: 'AE',
    // Isolated scope
    scope: {
      klType: '@?', // optional
      // Note: if Angular >= 1.5 then it's better to use single binding '<?'
      klOptions: '=?', // optional
      klClass: '=?', // optional
      klImagesPath: '@?', // optional
      klReady: '&?' // optional
    },
    // ControllerAs 'syntax'
    controllerAs: 'componentCtrl',
    // Bind scope properties to the controller
    bindToController: true,
    // Controller to expose the API of the component
    controller: 'klComponentController',
    // Register the HTML component
    link: function (scope, element, attrs, klComponentsController) {
      var klComponentController = scope.componentCtrl;
      // Define the component to create
      var toCreate = {
        type: klComponentController.klType || 'chart',
        options: klComponentController.klOptions || {}
      };
      toCreate.container = element[0];

      var style = element[0].style;
      style.display = 'block';

      // Init the component
      klComponentController.initComponent(attrs, scope.$parent);

      // Test whether multiple components are defined or only one
      if (klComponentsController) {
        // Declare a new component to create
        klComponentsController.declareComponent(toCreate, klComponentController);
      } else {
        // Simply create a new component
        klComponentController.createComponent(toCreate);
      }

      // Detach all events
      scope.$on('$destroy', function () {
        klComponentController.detachEvents();
      });
    }
  };
});
