var Promise = require('promise-now');

module.exports = VisitorAsync;

function VisitorAsync(actions) {
	this._actions = actions;
}

VisitorAsync.prototype.visit = function(node) {
	if (Array.isArray(node)) return this._visitNodes(node);
	return this._visitNode(node);
};

VisitorAsync.prototype._visitNodes = function (nodes) {
	var promise = this._visitNode();
	for (var i = 0, len = nodes.length; i < len; ++i) {
		promise = promise.then(this._visitNode.bind(this, nodes[i]));
	}
	return promise.then(function () { return nodes; });
};

VisitorAsync.prototype._visitNode = function (node) {
	var promise = new Promise().fulfill(node, this);
	if (node !== Object(node) || !node.type) return promise;

	var action = this._actions[node.type] || this._actions.node;
	if (!action) return promise;

	return promise.then(action);
};