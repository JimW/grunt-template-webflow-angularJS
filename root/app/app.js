/// <reference path="../Scripts/angular-1.1.4.js" />

/*#######################################################################
  
  Dan Wahlin
  http://twitter.com/DanWahlin
  http://weblogs.asp.net/dwahlin
  http://pluralsight.com/training/Authors/Details/dan-wahlin

  Normally like to break AngularJS apps into the following folder structure
  at a minimum:

  /app
      /controllers      
      /directives
      /services
      /partials
      /views

  #######################################################################*/


// var Webflow = Webflow || [];
// Webflow.push(readyFunction);

var app = angular.module('customersApp', ['ngRoute']);

// function readyFunction () {
//   console.log(Webflow.api.env()); 
  
  // console.log($scope.Webflow.location("http://www.waterwash.com")); 
  // $scope.Webflow.
// };
 //

   

  //This configures the routes and associates each route with a view and a controller
  app.config(function ($routeProvider) {
      $routeProvider
          .when('/customers',
              {
                  controller: 'CustomersController',
                  templateUrl: '/templates/customers.html'
              })
          //Define a route that has a route parameter in it (:customerID)
          .when('/customerorders/:customerID',
              {
                  controller: 'CustomerOrdersController',
                  templateUrl: '/templates/customer_orders.html'
              })
          //Define a route that has a route parameter in it (:customerID)
          .when('/orders',
              {
                  controller: 'OrdersController',
                  templateUrl: '/templates/orders.html'
              })
          .otherwise({ redirectTo: '/customers' });
  });





// };
