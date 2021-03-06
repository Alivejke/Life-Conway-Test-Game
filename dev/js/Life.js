

function Life (options) {
    var self = this,
        defaults = {
            universeWidth: 100,
            universeHeight: 100,
            speed: 150,
            state: 'stopped'
        };

    init();

    function loglife () {
        for (var i = 0; i < self.universeMatrix.length; i++) {
            console.log(self.universeMatrix[i]);
        };
        console.log('\n');
    }

    function init() {
        self.settings = {};

        self.universe = ko.observableArray();

        $.extend(self.settings, defaults, options);

        createUniverse();

        if(self.settings.samples) {
            loadState(self.settings.samples.gosperGliderGun);
        }
    };

    function createUniverse() {
        saveState();

        for (var x = 0; x < self.settings.universeHeight; x++) {
            self.universe().push(ko.observableArray());

            for (var y = 0; y < self.settings.universeWidth; y++) {
                self.universe()[x].push({
                    x: x,
                    y: y,
                    val: ko.observable(0)
                });
            };
        };
    };

    function start() {
        if(self.settings.state === 'running') return;
        self.settings.state = 'running';

        gameTick();
    };

    function gameTick() {
        self.stopId = setTimeout(function() {
            saveState();

            for (var x = 0; x < self.settings.universeHeight; x++) {
                for (var y = 0; y < self.settings.universeWidth; y++) {
                    checkNeighbours(x, y);
                };
            };
            
            gameTick();
        }, self.settings.speed);
    };

    function saveState() {
        self.universeMatrix = [];

        for (var i = self.universe().length - 1; i >= 0; i--) {
            self.universeMatrix[i] = [];

            for (var j = 0; j < self.universe()[i]().length; j++) {
                self.universeMatrix[i].push( self.universe()[i]()[j].val() );
            };
        };
    };

    function loadState(universeMatrix) {
        for (var i = self.universe().length - 1; i >= 0; i--) {
            for (var j = 0; j < self.universe()[i]().length; j++) {
                self.universe()[i]()[j].val(universeMatrix[i][j]);
            };
        };
    };

    function stop() {
        if(self.settings.state === 'stopped') return;
        self.settings.state = 'stopped';

        clearTimeout(self.stopId);
    };


    function checkNeighbours(x, y) {
        var aliveNeighbours = 0,
            neighbours = [],
            yPrev = y - 1 >= 0 ? y - 1 : self.settings.universeWidth - 1,
            yNext = y + 1 <= self.settings.universeWidth - 1 ? y + 1 : 0,
            xPrev = x - 1 >= 0  ? x-1 : self.settings.universeHeight - 1,
            xNext = x + 1 <= self.settings.universeHeight - 1 ? x + 1 : 0;

        neighbours.push(self.universeMatrix[xPrev][yPrev]);
        neighbours.push(self.universeMatrix[xPrev][y]);
        neighbours.push(self.universeMatrix[xPrev][yNext]);
        neighbours.push(self.universeMatrix[xNext][yPrev]);
        neighbours.push(self.universeMatrix[xNext][y]);
        neighbours.push(self.universeMatrix[xNext][yNext]);
        neighbours.push(self.universeMatrix[x][yPrev]);
        neighbours.push(self.universeMatrix[x][yNext]);

        for (var i = 0; i < neighbours.length; i++) {
            if(neighbours[i]) {
                aliveNeighbours++;
            }
        };

        if(self.universeMatrix[x][y]) {
            if(aliveNeighbours < 2 || aliveNeighbours > 3) {
                toggleCell({
                    val: self.universeMatrix[x][y],
                    x: x, 
                    y: y
                });
            }
        } else {
            if(aliveNeighbours === 3) {
                toggleCell({
                    val: self.universeMatrix[x][y],
                    x: x, 
                    y: y
                });;
            }
        }
    };

    function toggleCell(cell) {
        if(cell.val === 1) {
            self.universe()[cell.x]()[cell.y].val(0);
        } else {
            self.universe()[cell.x]()[cell.y].val(1);
        }
    };

    function saveStateToLS () {
        saveState();
        locache.set('lifeState', self.universeMatrix);
    }

    function loadStateFromLS () {
        var universeMatrix = locache.get('lifeState');
        loadState(universeMatrix);
    }

    return {
        start: start,
        toggleCell: toggleCell,
        stop: stop,
        save: saveStateToLS,
        load: loadStateFromLS,
        samples: self.settings.samples,
        applySample: loadState,
        getUniverse: function () {
            return self.universe;
        }
    }
}

