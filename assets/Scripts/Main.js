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
        {shape: SHAPE.DIAMOND, action: ACTION.NEXT},
        {shape: SHAPE.BOX, action: ACTION.BACK},
        {shape: SHAPE.BOX, action: ACTION.BACK},
        {shape: SHAPE.BOX, action: ACTION.BACK},
    ],
    [
        // 1
        {shape: SHAPE.DIAMOND, action: ACTION.BACK},
        {shape: SHAPE.DIAMOND, action: ACTION.BACK},
        {shape: SHAPE.DIAMOND, action: ACTION.BACK},
        {shape: SHAPE.BOX, action: ACTION.NEXT},
    ],
    [
        // 2
        {shape: SHAPE.DIAMOND, action: ACTION.NEXT},
        {shape: SHAPE.BOX, action: ACTION.BACK},
        {shape: SHAPE.BOX, action: ACTION.BACK},
        {shape: SHAPE.BOX, action: ACTION.BACKRANDOM},
    ],
    [
        // 3
        {shape: SHAPE.DIAMOND, action: ACTION.KILL},
        {shape: SHAPE.DIAMOND, action: ACTION.BACK},
        {shape: SHAPE.DIAMOND, action: ACTION.BACKRANDOM},
        {shape: SHAPE.BOX, action: ACTION.NEXT},
    ],
    [
        // 4
        {shape: SHAPE.DIAMOND, action: ACTION.NEXT},
        {shape: SHAPE.BOX, action: ACTION.BACK},
        {shape: SHAPE.BOX, action: ACTION.BACKRANDOM},
        {shape: SHAPE.BOX, action: ACTION.KILL},
    ],
    [
        // 5
        {shape: SHAPE.DIAMOND, action: ACTION.KILL},
        {shape: SHAPE.DIAMOND, action: ACTION.BACKRANDOM},
        {shape: SHAPE.DIAMOND, action: ACTION.BACK},
        {shape: SHAPE.BOX, action: ACTION.NEXT},
    ],
    [
        // 6
        {shape: SHAPE.DIAMOND, action: ACTION.NEXT, colour: true},
        {shape: SHAPE.DIAMOND, action: ACTION.BACK},
        {shape: SHAPE.BOX, action: ACTION.BACK},
        {shape: SHAPE.BOX, action: ACTION.BACK},
    ],
    [
        // 7
        {shape: SHAPE.DIAMOND, action: ACTION.BACKRANDOM},
        {shape: SHAPE.DIAMOND, action: ACTION.KILL},
        {shape: SHAPE.BOX, action: ACTION.NEXT, colour: true},
        {shape: SHAPE.BOX, action: ACTION.BACK},
    ],
    [
        // 8
        {shape: SHAPE.DIAMOND, action: ACTION.NEXT, colour: true},
        {shape: SHAPE.DIAMOND, action: ACTION.BACK},
        {shape: SHAPE.DIAMOND, action: ACTION.BACKRANDOM},
        {shape: SHAPE.BOX, action: ACTION.KILL},
    ],
    [
        // 9
        {shape: SHAPE.DIAMOND, action: ACTION.BACK, colour: true},
        {shape: SHAPE.BOX, action: ACTION.NEXT, colour: true},
        {shape: SHAPE.BOX, action: ACTION.BACK},
        {shape: SHAPE.BOX, action: ACTION.BACKRANDOM},
    ],
    [
        // 10
        {shape: SHAPE.DIAMOND, action: ACTION.NEXT},
        {shape: SHAPE.NONE, action: ACTION.BACK},
        {shape: SHAPE.NONE, action: ACTION.BACKRANDOM},
        {shape: SHAPE.NONE, action: ACTION.KILL},
    ],
    [
        // 11
        {shape: SHAPE.DIAMOND, action: ACTION.KILL},
        {shape: SHAPE.DIAMOND, action: ACTION.KILL},
        {shape: SHAPE.BOX, action: ACTION.NEXT},
        {shape: SHAPE.BOX, action: ACTION.BACK},
    ],
    [
        // 12
        {shape: SHAPE.NONE, action: ACTION.NEXT},
        {shape: SHAPE.NONE, action: ACTION.BACK},
        {shape: SHAPE.NONE, action: ACTION.BACKRANDOM},
        {shape: SHAPE.NONE, action: ACTION.KILL},
    ],
    [
        // 13
        {shape: SHAPE.NONE, action: ACTION.NEXT},
        {shape: SHAPE.NONE, action: ACTION.KILL},
        {shape: SHAPE.NONE, action: ACTION.BACK},
        {shape: SHAPE.NONE, action: ACTION.BACKRANDOM},
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

    },

    // use this for initialization
    onLoad() {
        this.player.setOnExitRoomCallback(this.onPlayerExitRoom.bind(this));
        this.rotatable.setOnRotateDoneCallback(this.onRotateDone.bind(this));

        this.currentLevel = 0;
        this.setLevelColour(this.levelColours[0]);

        this.setUpProgressBarColour();

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
        this.hints.show(LEVELS[currentLevel], false, this.levelColours[currentLevel + 1]);
        this.player.canMove = true;
    },

    onPlayerExitRoom(direction) {
        this.playerAnimation.on('finished', this.onPlayerEnterRoom, this);

        if (direction === DIRECTION.RIGHT) {
            this.currentLevel = this.currentLevel + 1;
            if (this.currentLevel >= this.levelColours.length - 1) this.currentLevel = this.levelColours.length - 1;

            this.setLevelColour(this.levelColours[this.currentLevel]);
            this.progressBar.scrollToPage(this.currentLevel);

            this.playerAnimation.play('PlayerEnterFromLeft');
        } else if (direction === DIRECTION.LEFT) {
            this.currentLevel = this.currentLevel - 1;
            if (this.currentLevel < 0) this.currentLevel = 0;

            this.setLevelColour(this.levelColours[this.currentLevel]);
            this.progressBar.scrollToPage(this.currentLevel);

            this.playerAnimation.play('PlayerEnterFromRight');
        }
    },

    onPlayerEnterRoom() {
        let currentLevel = this.currentLevel;

        this.hints.show(LEVELS[currentLevel], true, this.levelColours[currentLevel + 1]);
        this.playerAnimation.off('finished', this.onPlayerEnterRoom, this);
        this.player.canMove = true;
    },

    onRotateDone() {
        this.player.canMove = true;
    },

});
