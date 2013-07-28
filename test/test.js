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
				++count;
				assert.equal(number.value, 1);
				cb();
			},
			string: function (visitor, string, cb) {
				++count;
				assert.equal(string.value, 'abc');
				cb();
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
				++count;
				visitor.visit(expression.value, cb);
			},
			number: function (visitor, number, cb) {
				++count;
				assert.equal(number.value, 1);
				cb();
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
				++count;
				assert.equal(number.value, 1);
				cb();
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
				++count;
				cb();
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
				++count;
				cb();
			}
		}).visit(node, function (err) {
			if (err) return done(err);
			if (count) return done(new Error('node is not ignored'));
		});
	});
});