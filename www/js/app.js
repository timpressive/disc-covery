// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives', 'app.services', 'app.constants', 'ngCordovaOauth', 'ngCordova', 'spotify', 'ionic.cloud'])

  .config(function ($ionicCloudProvider, $ionicConfigProvider, $sceDelegateProvider) {
    $ionicCloudProvider.init({
      "core": {
        "app_id": "334f2990"
      },
      "push": {
        "sender_id": "991771295875",
        "pluginConfig": {
          "android": {
            "iconColor": "#343434"
          }
        }
      }
    });

    $ionicConfigProvider.tabs.position('bottom');
    $sceDelegateProvider.resourceUrlWhitelist(['self', '*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

  })

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .run(function ($rootScope, $stateParams, $ionicPush, $state, $ionicPlatform) {
    function unauthorized() {
      console.log("User is unauthorized, sending to login");
      $state.go('login');
    }

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
      console.log(window.localStorage.user);
      if(!window.localStorage.user && toState.mustBeLoggedIn) {
        event.preventDefault();
        unauthorized();
      } else {
        console.log('User is authorized');
      }
    });

    $ionicPlatform.on('deviceready', function () {
      if(!window.localStorage.user) {
        unauthorized();
      }
    });
  })

  /*
   This directive is used to disable the "drag to open" functionality of the Side-Menu
   when you are dragging a Slider component.
   */
  .directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function ($ionicSideMenuDelegate, $rootScope) {
    return {
      restrict: "A",
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

        function stopDrag() {
          $ionicSideMenuDelegate.canDragContent(false);
        }

        function allowDrag() {
          $ionicSideMenuDelegate.canDragContent(true);
        }

        $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
        $element.on('touchstart', stopDrag);
        $element.on('touchend', allowDrag);
        $element.on('mousedown', stopDrag);
        $element.on('mouseup', allowDrag);

      }]
    };
  }])

  /*
   This directive is used to open regular and dynamic href links inside of inappbrowser.
   */
  .directive('hrefInappbrowser', function () {
    return {
      restrict: 'A',
      replace: false,
      transclude: false,
      link: function (scope, element, attrs) {
        var place = attrs['hrefInappbrowser'] || '_system';
        element.bind('click', function (event) {

          var href = event.currentTarget.href;

          window.open(href, place, 'location=yes');

          event.preventDefault();
          event.stopPropagation();

        });
      }
    };
  });
