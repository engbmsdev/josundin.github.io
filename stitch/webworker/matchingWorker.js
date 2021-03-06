//bruteForceMatching Worker.js

"use strict";

function matchingWorker(descriptors1, descriptors2, threshold, id){

	//var that = new desObj(descriptors1, descriptors2);
	var matches = [];

	var lowe_criterion = threshold;
	computeDescriptor();
	self.postMessage({'type': 'data', 'matches': matches, 'id': id});
	self.close();
	function computeVectorDistance(p ,q){
	// dist = dot( (vec1 - vec2).T,(vec1 - vec2))
	//var d = Math.sqrt(Math.pow(p[0] - q[0], 2) + Math.pow(p[1] - q[1], 2));
	var d = 0;
	for(var i =0; i < p.length; i++)
		d += Math.pow(p[i] - q[i], 2);

	return d;//Math.sqrt(d);

	}

	function byDist(a, b) {
		if (a[1] < b[1]) return -1;
		if (b[1] < a[1]) return 1;
		return 0;
	}

	function computeDescriptor() {

		var dists = [];
		var test = [];
		var dista = [];
		var imgdata = [];
		for (var i = 0; i < descriptors1.length; i++) {
			dists = [];
			test = [];
			for(var j = 0; j < descriptors2.length; j++) {
				dista = computeVectorDistance(descriptors1[i][1], descriptors2[j][1]);
				imgdata = [descriptors2[j][0], dista];
				dists.push(imgdata);
				test.push(dista);
			}
			//sort
			dists.sort(byDist);
			//Lowe criterion with threshold for these descriptors
			if((dists[0][1] / dists[1][1] ) < lowe_criterion)
			matches.push([descriptors1[i][0] ,dists[0][0]]);	   
		}
	}
}
//wait for the start 'CalculatePi' message
//e is the event and e.data contains the JSON object
self.onmessage = function(e) {

	var data = e.data;
	var matching = matchingWorker(data.desc1, data.desc2, data.thresh, data.id);
	//matching.computeDescriptor();
}
