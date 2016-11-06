'use strict';

angular.module('LifeSaver.version', [
  'LifeSaver.version.interpolate-filter',
  'LifeSaver.version.version-directive'
])

.value('version', '0.1');
