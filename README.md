# Tree Visitor Async

Visit nodes in the tree asynchronously and sequentially. Support promises.

Asynchronous version of [Tree Visitor](https://github.com/curvedmark/tree-visitor). Actions can return a promise and `.visit()` returns a promise.

## API

```javascript
var fs = require('fs');
var Q = require('q');
var VisitorAsync = require('tree-visitor-async');
var nodes = [
	{ type: 'import', value: 'path/to/file1' },
	{ type: 'import', value: 'path/to/file2' },
];

function MyVisitorAsync() {}
MyVisitorAsync.prototype = new VisitorAsync();

MyVisitorAsync.prototype.visit_import = function (importNode) {
	var deferred = Q.defer();
	fs.readFile(importNode.value, 'utf8', function (err, content) {
		if (err) return deferred.reject(err);
		console.log(content);
		deferred.resolve(content);
	});
	return deferred.promise;
};

new MyVisitorAsync().visit(nodes).then(function () {
	console.log('done');
});
```

Methods are passed to the returned promise as fulfill callbacks. So, for example, if a method throws an error or returns a rejected promise, subsequent nodes won't be visited.

`this` keyword in the fulfill & reject callbacks refers the created visitor object (e.g., `new MyVisitorAsync()` in the previous example).