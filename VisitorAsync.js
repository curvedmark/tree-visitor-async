var Visitor = require('tree-visitor');
var Promise = require('promise-now');

module.exports = VisitorAsync;

function VisitorAsync() {}
VisitorAsync.prototype = new Visitor();

VisitorAsync.prototype._visitNodes = function (nodes) {
	var promise = this._visitNode();
	for (var i = 0, len = nodes.length; i < len; ++i) {
		promise = promise.then(this._visitNode.bind(this, nodes[i]));
	}
	return promise.then(function () { return nodes; });
};

var _visitNode = Visitor.prototype._visitNode;
VisitorAsync.prototype._visitNode = function (node) {
	var promise = new Promise().fulfill(undefined, this);
	return promise.then(function () {
		return _visitNode.call(this, node);
	});
};