var assert = require('assert');
var Promise = require('promise-now');
var VisitorAsync = require('..');
require("mocha-as-promised")();

describe('VisitorAsync', function () {
	it('should visit a single node', function () {
		var count = 0;
		var node = { type: 'number', value: 1 };

		function MyVisitorAsync() {}
		MyVisitorAsync.prototype = new VisitorAsync();

		MyVisitorAsync.prototype.visit_number = function (number) {
			++count;
			assert.equal(number.value, 1);
		};

		return new MyVisitorAsync().visit(node).then(function () {
			if (!count) throw new Error('node is never visited');
		});
	});

	it('should visit a single node asynchronously', function () {
		var count = 0;
		var node = { type: 'number', value: 1 };

		function MyVisitorAsync() {}
		MyVisitorAsync.prototype = new VisitorAsync();

		MyVisitorAsync.prototype.visit_number = function (number) {
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
		};

		return new MyVisitorAsync().visit(node).then(function () {
			if (!count) throw new Error('node is never visited');
		});
	});

	it('should visit an array of nodes', function () {
		var count = 0;
		var nodes = [
			{ type: 'number', value: 1 },
			{ type: 'string', value: 'abc'}
		];

		function MyVisitorAsync() {}
		MyVisitorAsync.prototype = new VisitorAsync();

		MyVisitorAsync.prototype.visit_number = function (number) {
			++count;
			assert.equal(number.value, 1);
		};

		MyVisitorAsync.prototype.visit_string = function (string) {
			++count;
			assert.equal(string.value, 'abc');
		};

		return new MyVisitorAsync().visit(nodes).then(function () {
			if (count !== 2) throw new Error('some node is never visited');
		});
	});

	it('should visit an array of nodes asynchronously', function () {
		var count = 0;
		var nodes = [
			{ type: 'number', value: 1 },
			{ type: 'string', value: 'abc'}
		];

		function MyVisitorAsync() {}
		MyVisitorAsync.prototype = new VisitorAsync();

		MyVisitorAsync.prototype.visit_number = function (number) {
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
		};

		MyVisitorAsync.prototype.visit_string = function (string) {
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
		};

		return new MyVisitorAsync().visit(nodes).then(function () {
			if (count !== 2) throw new Error('some node is never visited');
		});
	});

	it('should visit nested node', function () {
		var count = 0;
		var node = {
			type: 'expression',
			value: { type: 'number', value: 1 }
		};

		function MyVisitorAsync() {}
		MyVisitorAsync.prototype = new VisitorAsync();

		MyVisitorAsync.prototype.visit_expression = function (expression) {
			++count;
			return this.visit(expression.value);
		};

		MyVisitorAsync.prototype.visit_number = function (number) {
			++count;
			assert.equal(number.value, 1);
		};

		return new MyVisitorAsync().visit(node).then(function () {
			if (count !== 2) throw new Error('some node is never visited');
		});
	});

	it('should visit nested node asynchronously', function () {
		var count = 0;
		var node = {
			type: 'expression',
			value: { type: 'number', value: 1 }
		};

		function MyVisitorAsync() {}
		MyVisitorAsync.prototype = new VisitorAsync();

		MyVisitorAsync.prototype.visit_expression = function (expression) {
			var promise = new Promise();
			setTimeout(function () {
				++count;
				this.visit(expression.value).then(function () {
					promise.fulfill();
				});
			}.bind(this), 0);
			return promise;
		};

		MyVisitorAsync.prototype.visit_number = function (number) {
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
		};

		return new MyVisitorAsync().visit(node).then(function () {
			if (count !== 2) throw new Error('some node is never visited');
		});
	});

	it("should stop at the first error", function (done) {
		var result = 1;
		var nodes = [
			{ type: 'number', value: 1 },
			{ type: 'string', value: 'abc' }
		];

		function MyVisitorAsync() {}
		MyVisitorAsync.prototype = new VisitorAsync();

		MyVisitorAsync.prototype.visit_number = function (number) {
			throw new Error('error');
		};

		MyVisitorAsync.prototype.visit_string = function (string) {
			result = 2;
		};

		return new MyVisitorAsync().visit(nodes).then(null, function () {
			assert.equal(result, 1);
		});
	});
});