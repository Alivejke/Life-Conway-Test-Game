function Life (options) {
    var defaults = {
        universeWidth: 10,
        universeHeight: 10,
        speed: 1500
    };
    
    this.settings = {};
    this.universe = [];

    $.extend(this.settings, defaults, options);

    this.init();

    this.universe[5][5] = 1;
    this.universe[5][4] = 1;
    this.universe[5][6] = 1;

    this.start();
}

Life.prototype.cl = function() {
    var self = this;

    console.table( self.universe );
};

Life.prototype.init = function() {
    this.createUniverse();
};

Life.prototype.createUniverse = function() {
    for (var x = 0; x < this.settings.universeWidth; x++) {
        this.universe[x] = [];

        for (var y = 0; y < this.settings.universeHeight; y++) {
            this.universe[x].push(0);
        };
    };
};

Life.prototype.start = function() {
    var self = this;

    setTimeout(function() {
        self.universeOld = $.extend(true, [], self.universe);

        for (var x = 0; x < self.settings.universeWidth; x++) {
            for (var y = 0; y < self.settings.universeHeight; y++) {
                self.checkNeighbours(x, y);
            };
        };

        self.cl();
        self.start();
    }, self.settings.speed);
};


Life.prototype.checkNeighbours = function(x, y) {
    var aliveNeighbours = 0,
        neighbours = [],
        yPrev = y - 1 >= 0  ? y-1 : this.settings.universeWidth - 1,
        yNext = y + 1 <= this.settings.universeWidth - 1 ? y + 1 : 0,
        xPrev = x - 1 >= 0 ? x - 1 : this.settings.universeHeight - 1,
        xNext = x + 1 <= this.settings.universeHeight - 1 ? x + 1 : 0;

    neighbours.push(this.universeOld[xPrev][yPrev]);
    neighbours.push(this.universeOld[xPrev][y]);
    neighbours.push(this.universeOld[xPrev][yNext]);
    neighbours.push(this.universeOld[xNext][yPrev]);
    neighbours.push(this.universeOld[xNext][y]);
    neighbours.push(this.universeOld[xNext][yNext]);
    neighbours.push(this.universeOld[x][yPrev]);
    neighbours.push(this.universeOld[x][yNext]);

    for (var i = 0; i < neighbours.length; i++) {
        if(neighbours[i]) {
            aliveNeighbours++;
        }
    };

    if(this.universeOld[x][y]) {
        if(aliveNeighbours < 2 || aliveNeighbours > 3) {
            this.toggleCell(x, y);
        }
    } else {
        if(aliveNeighbours === 3) {
            this.toggleCell(x, y);
        }
    }
};

Life.prototype.toggleCell = function(x, y) {
    if(this.universeOld[x][y] === 1) {
        this.universe[x][y] = 0;
    } else {
        this.universe[x][y] = 1;
    }
};