function Scene () {

    this.paintersAlgorithm = function (depthAxis, vrp) {
        this.solids.sort(function (a, b) {
            switch (depthAxis) {
                case 'x' : return a.getDistance(vrp).getX() < b.getDistance(vrp).getX();
                case 'y' : return a.getDistance(vrp).getY() < b.getDistance(vrp).getY();
                default : return a.getDistance(vrp).getZ() < b.getDistance(vrp).getZ();
            }
        });
        this.solids.forEach(function (s) {
            s.paintersAlgorithm(depthAxis, vrp)
        });
    };

    this.makeDirty = function () {
        this.dirty = true;
    };

    this.addSolid = function (solid) {
        this.solids.push(solid);
    };

    this.removeSolid = function (index) {
        let removed = this.solids.splice(index, 1);
        if (removed.length > 0) {
            this.dirty = true;
            return true;
        }

        return false;
    };

    this.changeSolid = function (index, newSolid) {
        this.solids[index] = newSolid;
    };

    this.getSolids = function () {
        return this.solids;
    };

    this.getSolidAt = function (index) {
        return this.solids[index];
    };

    this.isDirty = function () {
        return this.dirty;
    };

    this.resetDirt = function () {
        this.dirty = false;
    };

    this.solids = [];

    this.dirty = false;
}