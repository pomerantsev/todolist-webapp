"use strict";var app=angular.module("myTodolistWebfrontApp",["ngRoute","ngCookies","ngResource","config"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{token:["tokenHandler",function(a){return a.get()}]}}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).otherwise({redirectTo:"/"})}]).config(["$httpProvider",function(a){var b=["$rootScope","$location","$q",function(a,b,c){var d=function(a){return a},e=function(b){if(401==b.status){var d=c.defer();return a.$broadcast("event:unauthorized"),d.promise}return c.reject(b)};return function(a){return a.then(d,e)}}];a.responseInterceptors.push(b)}]).run(["$rootScope","$http","$location","tokenHandler",function(a,b,c){a.$on("event:unauthorized",function(){c.path("/login")})}]);app.controller("MainCtrl",["$scope","Todos","$timeout","tokenHandler","$rootScope",function(a,b,c,d,e){a.newTodo={title:"",completed:!1,priority:2},a.todos=b.query(),a.predicate="created_at",a.setOrder=function(b){a.predicate=b},a.createTodo=function(){b.save(a.newTodo,function(b){a.todos.push(b),a.newTodo.title=""},function(b){a.errors=b.data})},a.$watch("newTodo",function(){a.errors=null},!0),a.$watch("editedTodo",function(){a.errors=null},!0),a.toggleCompleted=function(a){a.$patch()},a.editTodo=function(b){b.editing=!0,a.editedTodo=angular.copy(b)},a.saveEditing=function(b){a.editedTodo.$patch().then(function(){b.title=a.editedTodo.title,b.due_date=a.editedTodo.due_date,b.priority=a.editedTodo.priority,b.editing=!1},function(b){a.errors=b.data})},a.cancelEditing=function(b){a.errors=null,b.editing=!1},a.deleteTodo=function(c){b.delete({id:c.id},function(){a.todos.splice(a.todos.indexOf(c),1)})},a.email=d.get().email,a.logout=function(){d.set(null,null),e.$broadcast("event:unauthorized")}}]),app.controller("LoginCtrl",["$scope","$rootScope","$location","$http","backend","tokenHandler",function(a,b,c,d,e,f){a.submitting=!1,a.login=function(){a.submitting=!0,d({url:e+"/users/sign_in",method:"POST",data:{user:a.user}}).success(function(d){a.submitting=!1,d.success?(b.$broadcast("event:authenticated"),f.set(d.auth_token,d.user.email),c.path("/")):a.user.errors=d.info})},a.signup=function(){a.submitting=!0,d({url:e+"/users",method:"POST",data:{user:a.user}}).success(function(d){a.submitting=!1,b.$broadcast("event:authenticated"),f.set(d.auth_token,d.user.email),c.path("/")}).error(function(b){a.submitting=!1,a.user.errors=b})}}]),app.factory("backend",["ENV",function(a){var b;return"production"===a?b="https://todolist-api.herokuapp.com":"development"===a&&(b="http://localhost:3000"),b}]),app.factory("Todos",["$resource","backend","tokenHandler",function(a,b,c){var d=a(b+"/todos/:id",{},{patch:{method:"PATCH",params:{id:"@id"}}});return c.wrapActions(d,["query","save","delete","patch"]),d}]),app.factory("tokenHandler",["$rootScope","$http","$q","$location","$cookies",function(a,b,c,d,e){var f=e.token,g=e.email,h=function(a,b){a["_"+b]=a[b],a[b]=function(c,d,e){return a["_"+b](angular.extend({},c||{},{user_token:i.get().token,user_email:i.get().email}),d,e)}},i={set:function(a,b){f=e.token=a,g=e.email=b},get:function(){return f?{token:f,email:g}:(a.$broadcast("event:unauthorized"),void 0)},wrapActions:function(a,b){for(var c=a,d=0;d<b.length;d++)h(c,b[d]);return c}};return i}]),app.directive("errors",function(){return{restrict:"E",scope:{value:"@"},template:"<div class='alert alert-danger' ng-show='value'>{{value}}</div>"}});