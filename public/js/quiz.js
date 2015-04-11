/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var token;
	function login() {
	  var type = "redirect";
	  var url = "http://www.quizalize.com/quiz#/";
	  Zzish.init("2d14d1984a2e3293bd13aab34c85e2ea");
	
	  token = localStorage.getItem("zzishtoken");
	  email = localStorage.getItem("emailAddress");
	  if (token == null && email == null) {
	    Zzish.login(type, url, function (err, message) {
	      $("#LoginButton").html("Logout");
	      console.log("Logged in with status and message", err, message);
	      if (!err) {
	        loginUser(message);
	      } else {
	        console.log("Error", err);
	      }
	    });
	  } else if (email != null) {
	    localStorage.clear();
	    $("#LoginButton").html("Login with Zzish");
	    location.href = "/quiz/";
	  } else {
	    Zzish.logout(token, function (err, message) {
	      localStorage.clear();
	      $("#LoginButton").html("Login with Zzish");
	      location.href = "/quiz/";
	    });
	  }
	}
	
	$(document).ready(function () {
	  quizData = localStorage.getItem("quizData");
	  emailAddress = localStorage.getItem("emailAddress");
	  if (quizData != undefined) {
	    qj = $.parseJSON(quizData);
	    if (qj != undefined && qj.length > 0) {
	      $("#myquizzes").show();
	    } else {
	      $("#myquizzes").hide();
	    }
	    if (emailAddress != null) {
	      $("#LoginButton").html("Logout");
	    }
	  } else {
	    $("#myquizzes").hide();
	  }
	});

/***/ }
/******/ ]);
//# sourceMappingURL=quiz.js.map