'use strict';

describe('LifeSaver.version module', function() {
  beforeEach(module('LifeSaver.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
