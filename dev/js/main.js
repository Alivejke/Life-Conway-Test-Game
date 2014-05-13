$(function () {
    var life = new Life({
    	universeWidth: 30,
    	universeHeight: 20
    });

    var viewModel = {
        universe: life.getUniverse(),
        startGame: life.start,
        stopGame: life.stop,
        saveState: life.save,
        loadState: life.load,
        toggleCell: function (cell) {
        	life.toggleCell({
        		x: cell.x,
        		y: cell.y,
        		val: cell.val()
        	});
        }
    };
     
    ko.applyBindings(viewModel);
});