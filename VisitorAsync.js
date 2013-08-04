var Visitor = require('tree-visitor');
var Promise = require('promise-now');
var _visitNode = Visitor.prototype._visitNode;

module.exports = VisitorAsync;

function VisitorAsync() {}
VisitorAsync.prototype = new Visitor();

VisitorAsync.prototype._visitNodes = function (nodes) {
	var promise = new Promise().fulfill(undefined, this);
	for (var i = 0, len = nodes.length; i < len; ++i) {
		promise = promise.then(_visitNode.bind(this, nodes[i]));
	}
	return promise.then(function () { return nodes; });
};

VisitorAsync.prototype._visitNode = function (node) {
	var promise = new Promise().fulfill(undefined, this);
	return promise.then(function () {
		return _visitNode.call(this, node);
	});
};