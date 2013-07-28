# Tree Visitor Async

Visit nodes in the tree asynchronously and sequentially.

Like [Tree Visitor](https://github.com/curvedmark/tree-visitor), but actions accept an additional callback function that should be called when it's done processing the node.

## API

```javascript
var fs = require('fs');
var VisitorAsync = require('tree-visitor-async');

var nodes = [
	{ type: 'import', value: 'path/to/file1' },
	{ type: 'import', value: 'path/to/file2' },
];
var visitorAsync = new VisitorAsync({
	import: function (visitor, importNode, done) {
		fs.readFile(importNode.value, 'utf8', function (err, content) {
			if (err) return done(err);
			console.log(content);
			done();
		});
	}
});
visitorAsync.visit(nodes, function (err) {
	if (err) throw err;
});
```
`visit()` also accepts a callback function that will be called when all node in the tree has been processed.