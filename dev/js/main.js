$(function () {
    var life = new Life({
        samples: samples
    });

    var viewModel = {
        universe: life.getUniverse(),
        startGame: life.start,
        stopGame: life.stop,
        saveState: life.save,
        loadState: life.load,
        applySample: life.applySample,
        samples: life.samples,
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