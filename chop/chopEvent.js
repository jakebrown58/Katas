function Chopper(){
}


function EventHub() {
	var listeners = [];


	this.registerEvent = function(evt) {
		listeners.push(evt);
	}

	this.fireEvent = function(evt) {

	}
}


if (typeof exports !== 'undefined') {
   exports.Chopper = Chopper
}