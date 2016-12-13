/* global cc */
import Player from './Player';
import Rotatable from './Rotatable';
import Hints from './Hints';

const DIRECTION = cc.Enum({
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
});

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

const LEVELS = [
    [
        // 0
        {
            shape: SHAPE.DIAMOND,
            action: ACTION.NEXT
        }, {
            shape: SHAPE.BOX,
            action: ACTION.BACK
        }, {
            shape: SHAPE.BOX,
            action: ACTION.BACK
        }, {
            shape: SHAPE.BOX,
            action: ACTION.BACK
        },
    ],
    [
        // 1
        {
            shape: SHAPE.DIAMOND,
            action: ACTION.BACK
        }, {
            shape: SHAPE.DIAMOND,
            action: ACTION.BACK
        }, {
            shape: SHAPE.DIAMOND,
            action: ACTION.BACK
        }, {
            shape: SHAPE.BOX,
            action: ACTION.NEXT
        },
    ],
    [
        // 2
        {
            shape: SHAPE.DIAMOND,
            action: ACTION.NEXT
        }, {
            shape: SHAPE.BOX,
            action: ACTION.BACK
        }, {
            shape: SHAPE.BOX,
            action: ACTION.BACK
        }, {
            shape: SHAPE.BOX,
            action: ACTION.BACKRANDOM
        },
    ],
    [
        // 3
        {
            shape: SHAPE.DIAMOND,
            action: ACTION.KILL
        }, {
            shape: SHAPE.DIAMOND,
            action: ACTION.BACK
        }, {
            shape: SHAPE.DIAMOND,
            action: ACTION.BACKRANDOM
        }, {
            shape: SHAPE.BOX,
            action: ACTION.NEXT
        },
    ],
    [
        // 4
        {
            shape: SHAPE.DIAMOND,
            action: ACTION.NEXT
        }, {
            shape: SHAPE.BOX,
            action: ACTION.BACK
        }, {
            shape: SHAPE.BOX,
            action: ACTION.BACKRANDOM
        }, {
            shape: SHAPE.BOX,
            action: ACTION.KILL
        },
    ],
    [
        // 5
        {
            shape: SHAPE.DIAMOND,
            action: ACTION.KILL
        }, {
            shape: SHAPE.DIAMOND,
            action: ACTION.BACKRANDOM
        }, {
            shape: SHAPE.DIAMOND,
            action: ACTION.BACK
        }, {
            shape: SHAPE.BOX,
            action: ACTION.NEXT
        },
    ],
    [
        // 6
        {
            shape: SHAPE.DIAMOND,
            action: ACTION.NEXT,
            colour: true
        }, {
            shape: SHAPE.DIAMOND,
            action: ACTION.BACK
        }, {
            shape: SHAPE.BOX,
            action: ACTION.BACK
        }, {
            shape: SHAPE.BOX,
            action: ACTION.BACK
        },
    ],
    [
        // 7
        {
            shape: SHAPE.DIAMOND,
            action: ACTION.BACKRANDOM
        }, {
            shape: SHAPE.DIAMOND,
            action: ACTION.KILL
        }, {
            shape: SHAPE.BOX,
            action: ACTION.NEXT,
            colour: true
        }, {
            shape: SHAPE.BOX,
            action: ACTION.BACK
        },
    ],
    [
        // 8
        {
            shape: SHAPE.DIAMOND,
            action: ACTION.NEXT,
            colour: true
        }, {
            shape: SHAPE.DIAMOND,
            action: ACTION.BACK
        }, {
            shape: SHAPE.DIAMOND,
            action: ACTION.BACKRANDOM
        }, {
            shape: SHAPE.BOX,
            action: ACTION.KILL
        },
    ],
    [
        // 9
        {
            shape: SHAPE.DIAMOND,
            action: ACTION.BACK,
            colour: true
        }, {
            shape: SHAPE.BOX,
            action: ACTION.NEXT,
            colour: true
        }, {
            shape: SHAPE.BOX,
            action: ACTION.BACK
        }, {
            shape: SHAPE.BOX,
            action: ACTION.BACKRANDOM
        },
    ],
    [
        // 10
        {
            shape: SHAPE.DIAMOND,
            action: ACTION.NEXT
        }, {
            shape: SHAPE.NONE,
            action: ACTION.BACK
        }, {
            shape: SHAPE.NONE,
            action: ACTION.BACKRANDOM
        }, {
            shape: SHAPE.NONE,
            action: ACTION.KILL
        },
    ],
    [
        // 11
        {
            shape: SHAPE.DIAMOND,
            action: ACTION.KILL
        }, {
            shape: SHAPE.DIAMOND,
            action: ACTION.KILL
        }, {
            shape: SHAPE.BOX,
            action: ACTION.NEXT
        }, {
            shape: SHAPE.BOX,
            action: ACTION.BACK
        },
    ],
    [
        // 12
        {
            shape: SHAPE.NONE,
            action: ACTION.NEXT
        }, {
            shape: SHAPE.NONE,
            action: ACTION.BACK
        }, {
            shape: SHAPE.NONE,
            action: ACTION.BACKRANDOM
        }, {
            shape: SHAPE.NONE,
            action: ACTION.KILL
        },
    ],
    [
        // 13
        {
            shape: SHAPE.NONE,
            action: ACTION.NEXT
        }, {
            shape: SHAPE.NONE,
            action: ACTION.KILL
        }, {
            shape: SHAPE.NONE,
            action: ACTION.BACK
        }, {
            shape: SHAPE.NONE,
            action: ACTION.BACKRANDOM
        },
    ],
];

cc.Class({
    extends: cc.Component,

    properties: {
        player: Player,
        rotatable: Rotatable,
        hints: Hints,

        levelColours: [cc.Color],

        progressBar: cc.PageView,

        progressBarContentNode: cc.Node,
        roomNode: cc.Node,

        progressBarAnimation: cc.Animation,
        playerAnimation: cc.Animation,
        roomAnimation: cc.Animation,
        pathAnimation: cc.Animation,
        controlsAnimation: cc.Animation,
        rotatableAnimation: cc.Animation,
        theEndAnimation: cc.Animation,

        rain: cc.AudioClip,
        forest: cc.AudioClip,
        bell: cc.AudioClip,
    },

    // use this for initialization
    onLoad() {
        this.player.setOnExitRoomCallback(this.onPlayerExitRoom.bind(this));
        this.rotatable.setOnRotateDoneCallback(this.onRotateDone.bind(this));

        this.currentLevel = 0;
        this.setLevelColour(this.levelColours[0]);

        this.gameHasEnded = false;

        this.setUpProgressBarColour();

        this.rainAudioId = cc.audioEngine.play(this.rain, true, 0.3);

        this.roomAnimation.on('finished', this.onRoomFinishExpand, this);
        this.roomAnimation.play('RoomExpand');
    },

    setLevelColour(colour) {
        let action = cc.tintTo(1, colour.r, colour.g, colour.b);
        this.roomNode.runAction(action);
    },

    setUpProgressBarColour() {
        let levels = this.progressBarContentNode.children;
        let levelColours = this.levelColours;
        let length = levels.length;

        if (length == levelColours.length) {
            for (let n = 0; n < length; n++) {
                levels[n].getChildByName('Box').color = levelColours[n];
            }
        }
    },

    movePlayerRight() {
        this.player.moveRight();
    },

    movePlayerLeft() {
        this.player.moveLeft();
    },

    rotate() {
        this.player.canMove = false;
        this.rotatable.rotate();
    },

    onRoomFinishExpand() {
        this.roomAnimation.off('finished', this.onRoomFinishExpand, this);

        this.playerAnimation.on('finished', this.onPlayerFinishSpawning, this);
        this.playerAnimation.play('PlayerFadeIn');
        this.pathAnimation.play('PathFadeIn');

    },

    onPlayerFinishSpawning() {
        this.playerAnimation.off('finished', this.onPlayerFinishSpawning, this);
        this.progressBarAnimation.play('ProgressBarFadeIn');
        this.controlsAnimation.play('ControlsFadeIn');
        let currentLevel = this.currentLevel;
        this.currentLevelData = LEVELS[currentLevel];

        this.hints.show(LEVELS[currentLevel], this.levelColours[currentLevel + 1]);
        this.player.canMove = true;
        this.rotatable.canRotate = true;
    },

    onPlayerExitRoom(direction) {
        this.playerAnimation.on('finished', this.onPlayerEnterRoom, this);

        let rotation = this.rotatable.getCurrentRotation();
        let action;

        if (direction === DIRECTION.RIGHT) {
            if (rotation == 0) {
                action = this.currentLevelData[1].action;
            } else if (rotation == 90) {
                action = this.currentLevelData[0].action;
            } else if (rotation == 180) {
                action = this.currentLevelData[3].action;
            } else if (rotation == 270) {
                action = this.currentLevelData[2].action;
            }

        } else if (direction === DIRECTION.LEFT) {
            if (rotation == 0) {
                action = this.currentLevelData[3].action;
            } else if (rotation == 90) {
                action = this.currentLevelData[2].action;
            } else if (rotation == 180) {
                action = this.currentLevelData[1].action;
            } else if (rotation == 270) {
                action = this.currentLevelData[0].action;
            }

        }

        if (action == ACTION.BACK) {
            let futureLevel = this.currentLevel - 1;
            if (futureLevel < 0) futureLevel = 0;
            this.currentLevel = futureLevel;
        } else if (action == ACTION.NEXT) {
            cc.audioEngine.play(this.bell, false, 0.5);
            this.currentLevel = this.currentLevel + 1;
        } else if (action == ACTION.KILL) {
            this.currentLevel = 0;
        } else if (action == ACTION.BACKRANDOM) {
            this.currentLevel = Math.floor(Math.random() * this.currentLevel);
        }

        let colour = this.levelColours[this.currentLevel];
        this.setLevelColour(colour);
        this.progressBar.scrollToPage(this.currentLevel);

        if (this.currentLevel == this.levelColours.length - 1) {
            this.currentLevel = this.levelColours.length - 1;
            this.setLevelColour(this.levelColours[this.currentLevel]);
            this.progressBar.scrollToPage(this.currentLevel);

            this.showEnding();
        } else {
            if (direction === DIRECTION.RIGHT) {
                this.playerAnimation.play('PlayerEnterFromLeft');
            } else if (direction === DIRECTION.LEFT) {
                this.playerAnimation.play('PlayerEnterFromRight');
            }
        }
    },

    onPlayerEnterRoom() {
        let currentLevel = this.currentLevel;

        let shuffledLevelData = this.shuffleArray(LEVELS[currentLevel]);
        this.currentLevelData = shuffledLevelData;

        this.hints.show(shuffledLevelData, this.levelColours[currentLevel + 1]);

        this.playerAnimation.off('finished', this.onPlayerEnterRoom, this);

        this.rotatable.resetRotation();
        this.player.canMove = true;
    },

    onRotateDone() {
        this.player.canMove = true;
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

    showEnding() {
        this.gameHasEnded = true;

        cc.audioEngine.setVolume(this.rainAudioId, 0.1);
        cc.audioEngine.play(this.forest, true, 0.3);

        this.hints.hide();
        this.controlsAnimation.play('ControlsFadeOut');
        this.progressBarAnimation.play('ProgressBarFadeOut');
        this.pathAnimation.play('PathShrink');
        this.pathAnimation.playAdditive('PathFadeOut');

        this.rotatable.canRotate = false;
        this.rotatableAnimation.play('Win');

        setTimeout(() => {
            this.theEndAnimation.play('TheEndFadeIn');
        }, 3000);
    },

});
