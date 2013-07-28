module.exports = VisitorAsync;

function VisitorAsync(actions) {
	this._actions = actions;
}

VisitorAsync.prototype.visit = function(node, done) {
	if (!done) throw new Error('Missing callback function');
	if (Array.isArray(node)) this._visitNodes(node, done);
	else this._visitNode(node, done);
};

VisitorAsync.prototype._visitNodes = function (nodes, done) {
	var self = this;
	visitNodesFrom(0);

	function visitNodesFrom(i) {
		if (i >= nodes.length) return done.call(self, null, nodes);
		self._visitNode(nodes[i], function (err, node) {
			if (err) return done.call(self, err);
			visitNodesFrom(i + 1);
		});
	}
};

VisitorAsync.prototype._visitNode = function (node, done) {
	if (node !== Object(node) || !node.type) return done.call(this, null, node);
	var action = this._actions[node.type] || this._actions.node;
	if (action) return action.call(this._actions, this, node, done.bind(this));
	done.call(this, null, node);
};