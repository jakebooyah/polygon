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

    show(levelData, toShuffle, nextColour) {
        cc.log('test');

        if (toShuffle) {
            if (levelData.length) {
                let shuffle = require('knuth-shuffle').knuthShuffle, levelData, shuffledlevelData;
                levelData = shuffle(levelData.slice(0));
            }
        }

        cc.log(levelData);

        // configuring hintsAnimation
        for (let n = 0; n < levelData.length; n++) {
            // top
            if (n == 0) {
                if (levelData[n].shape == SHAPE.DIAMOND) {
                    this.top.rotation = 45;
                } else if (levelData[n].shape == SHAPE.BOX) {
                    this.top.rotation = 0;
                } else if (levelData[n].shape == SHAPE.NONE) {
                    this.top.active = false;
                }

                if (levelData[n].colour) {
                    this.top.color = nextColour;
                }
            }
            // right
            if (n == 0) {
                if (levelData[n].shape == SHAPE.DIAMOND) {
                    this.right.rotation = 45;
                } else if (levelData[n].shape == SHAPE.BOX) {
                    this.right.rotation = 0;
                } else if (levelData[n].shape == SHAPE.NONE) {
                    this.right.active = false;
                }

                if (levelData[n].colour) {
                    this.right.color = nextColour;
                }
            }
            // bottom
            if (n == 0) {
                if (levelData[n].shape == SHAPE.DIAMOND) {
                    this.bottom.rotation = 45;
                } else if (levelData[n].shape == SHAPE.BOX) {
                    this.bottom.rotation = 0;
                } else if (levelData[n].shape == SHAPE.NONE) {
                    this.bottom.active = false;
                }

                if (levelData[n].colour) {
                    this.bottom.color = nextColour;
                }
            }
            // left
            if (n == 0) {
                if (levelData[n].shape == SHAPE.DIAMOND) {
                    this.left.rotation = 45;
                } else if (levelData[n].shape == SHAPE.BOX) {
                    this.left.rotation = 0;
                } else if (levelData[n].shape == SHAPE.NONE) {
                    this.left.active = false;
                }

                if (levelData[n].colour) {
                    this.left.color = nextColour;
                }
            }
        }

        this.hintsAnimation.play('HintsFadeIn');
    },

    hide() {
        this.hintsAnimation.play('HintsFadeOut');
    }
});
