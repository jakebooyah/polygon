/* global cc */

const SHAPE = cc.Enum({
    BOX: 0,
    DIAMOND: 1,
    NONE: 2
});

const ACTION = cc.Enum({
    BACK: 0,
    NEXT: 1,
    BACKRANDOM: 2,
    KILL: 3
});

cc.Class({
    extends: cc.Component,

    properties: {
        top: cc.Node,
        right: cc.Node,
        bottom: cc.Node,
        left: cc.Node,
        hintsAnimation: cc.Animation,
    },

    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    },

    show(levelData, toShuffle, nextColour) {
        if (toShuffle) {
            if (levelData.length) {
                levelData = this.shuffleArray(levelData.slice(0));
            }
        }
        // configuring hintsAnimation
        for (let n = 0; n < levelData.length; n++) {
            // top
            if (n == 0) {
                if (levelData[n].shape == SHAPE.DIAMOND) {
                    this.top.active = true;
                    this.top.rotation = 45;
                } else if (levelData[n].shape == SHAPE.BOX) {
                    this.top.active = true;
                    this.top.rotation = 0;
                } else if (levelData[n].shape == SHAPE.NONE) {
                    this.top.active = false;
                }

                if (levelData[n].colour) {
                    this.top.color = nextColour;
                } else {
                    this.top.color = new cc.Color(255, 255, 255);
                }
            }
            // right
            if (n == 1) {
                if (levelData[n].shape == SHAPE.DIAMOND) {
                    this.right.active = true;
                    this.right.rotation = 45;
                } else if (levelData[n].shape == SHAPE.BOX) {
                    this.right.active = true;
                    this.right.rotation = 0;
                } else if (levelData[n].shape == SHAPE.NONE) {
                    this.right.active = false;
                }

                if (levelData[n].colour) {
                    this.right.color = nextColour;
                } else {
                    this.right.color = new cc.Color(255, 255, 255);
                }
            }
            // bottom
            if (n == 2) {
                if (levelData[n].shape == SHAPE.DIAMOND) {
                    this.bottom.active = true;
                    this.bottom.rotation = 45;
                } else if (levelData[n].shape == SHAPE.BOX) {
                    this.bottom.active = true;
                    this.bottom.rotation = 0;
                } else if (levelData[n].shape == SHAPE.NONE) {
                    this.bottom.active = false;
                }

                if (levelData[n].colour) {
                    this.bottom.color = nextColour;
                } else {
                    this.bottom.color = new cc.Color(255, 255, 255);
                }
            }
            // left
            if (n == 3) {
                if (levelData[n].shape == SHAPE.DIAMOND) {
                    this.left.active = true;
                    this.left.rotation = 45;
                } else if (levelData[n].shape == SHAPE.BOX) {
                    this.left.active = true;
                    this.left.rotation = 0;
                } else if (levelData[n].shape == SHAPE.NONE) {
                    this.left.active = false;
                }

                if (levelData[n].colour) {
                    this.left.color = nextColour;
                } else {
                    this.left.color = new cc.Color(255, 255, 255);
                }
            }
        }

        this.hintsAnimation.play('HintsFadeIn');
    },

    hide() {
        this.hintsAnimation.play('HintsFadeOut');
    }
});
