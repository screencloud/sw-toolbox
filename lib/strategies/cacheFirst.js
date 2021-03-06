/*
	Copyright 2014 Google Inc. All Rights Reserved.

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/
'use strict';
var globalOptions = require('../options');
var helpers = require('../helpers');

function cacheFirst(request, values, options) {
  options = options || {};
  var cacheOptions = options.cache || globalOptions.cache;
  var cacheQueryOptions = cacheOptions.queryOptions;
  helpers.debug('Strategy: cache first [' + request.url + ']', options);
  // var url = helpers.stripIgnoredUrlParameters(request.url,
  // options.ignoreUrlParametersMatching);
  return helpers.openCache(options).then(function(cache) {
    return cache.match(request, cacheQueryOptions).then(function(response) {
      var now = Date.now();
      if (helpers.isResponseFresh(response, cacheOptions.maxAgeSeconds, now)) {
        return response;
      }

      return helpers.fetchAndCache(request, options);
    });
  });
}

module.exports = cacheFirst;
