var assert = require('assert');
var Promise = require('promise-now');
var VisitorAsync = require('../VisitorAsync');
require("mocha-as-promised")();

describe('VisitorAsync', function () {
	it('should visit a single node', function () {
		var count = 0;
		var node = { type: 'number', value: 1 };

		return new VisitorAsync({
			number: function (visitor, number) {
				++count;
				assert.equal(number.value, 1);
			}
		}).visit(node).then(function () {
			if (!count) throw new Error('node is never visited');
		});
	});

	it('should visit a single node asynchronously', function () {
		var count = 0;
		var node = { type: 'number', value: 1 };

		return new VisitorAsync({
			number: function (visitor, number) {
				var promise = new Promise();
				setTimeout(function () {
					++count;
					try {
						assert.equal(number.value, 1);
					} catch (err) {
						return promise.reject(err);
					}
					promise.fulfill();
				}, 0);
				return promise;
			}
		}).visit(node).then(function () {
			if (!count) throw new Error('node is never visited');
		});
	});

	it('should visit an array of nodes', function () {
		var count = 0;
		var nodes = [
			{ type: 'number', value: 1 },
			{ type: 'string', value: 'abc'}
		];

		return new VisitorAsync({
			number: function (visitor, number) {
				++count;
				assert.equal(number.value, 1);
			},
			string: function (visitor, string) {
				++count;
				assert.equal(string.value, 'abc');
			}
		}).visit(nodes).then(function () {
			if (count !== 2) throw new Error('some node is never visited');
		});
	});

	it('should visit an array of nodes asynchronously', function () {
		var count = 0;
		var nodes = [
			{ type: 'number', value: 1 },
			{ type: 'string', value: 'abc'}
		];

		return new VisitorAsync({
			number: function (visitor, number) {
				var promise = new Promise();
				setTimeout(function () {
					++count;
					try {
						assert.equal(number.value, 1);
					} catch (err) {
						return promise.reject(err);
					}
					promise.fulfill();
				}, 0);
				return promise;
			},
			string: function (visitor, string) {
				var promise = new Promise();
				setTimeout(function () {
					++count;
					try {
						assert.equal(string.value, 'abc');
					} catch (err) {
						return promise.reject(err);
					}
					promise.fulfill();
				}, 0);
				return promise;
			}
		}).visit(nodes).then(function () {
			if (count !== 2) throw new Error('some node is never visited');
		});
	});

	it('should visit nested node', function () {
		var count = 0;
		var node = {
			type: 'expression',
			value: { type: 'number', value: 1 }
		};

		return new VisitorAsync({
			expression: function (visitor, expression) {
				++count;
				return visitor.visit(expression.value);
			},
			number: function (visitor, number) {
				++count;
				assert.equal(number.value, 1);
			}
		}).visit(node).then(function () {
			if (count !== 2) throw new Error('some node is never visited');
		});
	});

	it('should visit nested node asynchronously', function () {
		var count = 0;
		var node = {
			type: 'expression',
			value: { type: 'number', value: 1 }
		};

		return new VisitorAsync({
			expression: function (visitor, expression) {
				var promise = new Promise();
				setTimeout(function () {
					++count;
					visitor.visit(expression.value).then(function () {
						promise.fulfill();
					});
				}, 0);
				return promise;
			},
			number: function (visitor, number) {
				var promise = new Promise();
				setTimeout(function () {
					++count;
					try {
						assert.equal(number.value, 1);
					} catch (err) {
						return promise.reject(err);
					}
					promise.fulfill();
				}, 0);
				return promise;
			}
		}).visit(node).then(function () {
			if (count !== 2) throw new Error('some node is never visited');
		});
	});

	it("should stop at the first error", function (done) {
			var result = 1;
			var nodes = [
				{ type: 'number', value: 1 },
				{ type: 'string', value: 'abc' }
			];

			return new VisitorAsync({
				number: function (transformer, number, cb) {
					throw new Error('error');
				},
				string: function (transformer, string, cb) {
					result = 2;
				}
			}).visit(nodes).then(null, function () {
				assert.equal(result, 1);
			});
		});
});