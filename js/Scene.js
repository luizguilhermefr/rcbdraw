function Scene () {
    this.solids = [];
    this.dirty = false;

    this.makeDirty = function () {
        this.dirty = true;
    };

    this.addSolid = function (solid) {
        this.solids.push(solid);
    };

    this.removeSolid = function (index) {
        for (let i = 0; i < this.solids.length; i++) {
            if (i === id) {
                this.solids.splice(index, 1);
                this.dirty = true;
                return true;
            }
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

    this.bringForward = function(index) {
        if (index === this.solids.length - 1) {
            return false;
        }
        let tmp = this.solids[index];
        this.solids[index] = this.solids[index + 1];
        this.solids[index + 1] = tmp;

        return {
            index: index + 1,
            solid: tmp
        };
    };

    this.bringBackward = function(index) {
        if (index === 0) {
            return false;
        }
        let tmp = this.solids[index];
        this.solids[index] = this.solids[index - 1];
        this.solids[index - 1] = tmp;

        return {
            index: index - 1,
            solid: tmp
        };
    };
}