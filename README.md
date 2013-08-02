# Tree Visitor Async

Visit nodes in the tree asynchronously and sequentially. Support promises.

Asynchronous version of [Tree Visitor](https://github.com/curvedmark/tree-visitor). Actions can return a promise and `.visit()` returns a promise.

## Example

```javascript
var fs = require('fs');
var Q = require('q');
var VisitorAsync = require('tree-visitor-async');

var nodes = [
	{ type: 'import', value: 'path/to/file1' },
	{ type: 'import', value: 'path/to/file2' },
];
var visitorAsync = new VisitorAsync({
	import: function (importNode) {
		var deferred = Q.defer();
		fs.readFile(importNode.value, 'utf8', function (err, content) {
			if (err) return deferred.reject(err);
			console.log(content);
			deferred.resolve(content);
		});
		return deferred.promise;
	}
});
visitorAsync.visit(nodes).then(function () {
	this === visitorAsync;
	console.log('done');
});
```

Actions are passed to the returned promise as fulfill callbacks. So, for example, if an action throws an error or returns a rejected promise, subsequent nodes won't be visited.

`this` keyword in the fulfill callbacks and the reject callbacks refers the visitor object (e.g., `visitorAsync` in the previous example).