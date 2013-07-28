var assert = require('assert');
var VisitorAsync = require('../VisitorAsync');

describe('VisitorAsync', function () {
	it('should throw error if no callback passed', function () {
		assert.throws(function () {
			new VisitorAsync({}).visit({});
		}, /callback/);
	});

	it('should visit a single node', function (done) {
		var count = 0;

		var node = { type: 'number', value: 1 };
		new VisitorAsync({
			number: function (visitor, number, cb) {
				setTimeout(function () {
					++count;
					assert.equal(number.value, 1);
					cb();
				}, 0);
			}
		}).visit(node, function (err) {
			if (err) return done(err);
			if (!count) return done(new Error('node is never visited'));
			done();
		});
	});

	it('should visit an array of nodes', function (done) {
		var count = 0;

		var nodes = [
			{ type: 'number', value: 1 },
			{ type: 'string', value: 'abc'}
		];
		new VisitorAsync({
			number: function (visitor, number, cb) {
				setTimeout(function () {
					++count;
					assert.equal(number.value, 1);
					cb();
				}, 0);
			},
			string: function (visitor, string, cb) {
				setTimeout(function () {
					++count;
					assert.equal(string.value, 'abc');
					cb();
				}, 0);
			}
		}).visit(nodes, function (err) {
			if (err) return done(err);
			if (count !== 2) return done(new Error('some node is never visited'));
			done();
		});
	});

	it('should visit nested node', function (done) {
		var count = 0;

		var node = {
			type: 'expression',
			value: { type: 'number', value: 1 }
		};
		new VisitorAsync({
			expression: function (visitor, expression, cb) {
				setTimeout(function () {
					++count;
					visitor.visit(expression.value, cb);
				}, 0);
			},
			number: function (visitor, number, cb) {
				setTimeout(function () {
					++count;
					assert.equal(number.value, 1);
					cb();
				}, 0);
			}
		}).visit(node, function (err) {
			if (err) return done(err);
			if (count !== 2) return done(new Error('some node is never visited'));
			done();
		});
	});

	it('should visit node with catch-all action', function (done) {
		var count = 0;

		var node = { type: 'number', value: 1 };
		new VisitorAsync({
			node: function (visitor, number, cb) {
				setTimeout(function () {
					++count;
					assert.equal(number.value, 1);
					cb();
				}, 0);
			}
		}).visit(node, function (err) {
			if (err) return done(err);
			if (!count) return done(new Error('node is never visited'));
			done();
		});
	});

	it('should ignore object does not have key type', function () {
		var count = 0;

		var node = { value: 1 };
		new VisitorAsync({
			node: function (visitor, node, cb) {
				setTimeout(function () {
					++count;
					cb();
				}, 0);
			}
		}).visit(node, function (err) {
			if (err) return done(err);
			if (count) return done(new Error('node is not ignored'));
		});
	});

	it('should ignore null', function () {
		var count = 0;

		var node = null;
		new VisitorAsync({
			node: function (visitor, node, cb) {
				setTimeout(function () {
					++count;
					cb();
				}, 0);
			}
		}).visit(node, function (err) {
			if (err) return done(err);
			if (count) return done(new Error('node is not ignored'));
		});
	});

	it('should ignore node for having no matching action', function (done) {
		var nodes = [
			{ type: 'number', value: 1 },
			{ type: 'string', value: 'abc' }
		];
		new VisitorAsync({}).visit(nodes, function (err, result) {
			if (err) return done(err);
			assert.equal(result, nodes);
			done();
		});
	});

	it('should set callback context', function (done) {
		var visitorAsync = new VisitorAsync({});
		visitorAsync.visit({}, function (err, result) {
			if (err) return done(err);
			assert.equal(this, visitorAsync, 'equal');
			done();
		});
	});
});