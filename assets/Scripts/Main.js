/* global cc */
import Player from './Player';
import Rotatable from './Rotatable';

const DIRECTION = cc.Enum({
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
});

cc.Class({
    extends: cc.Component,

    properties: {
        player: Player,
        rotatable: Rotatable,

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
        this.roomNode.color = colour;
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
        this.playerAnimation.off('finished', this.onPlayerEnterRoom, this);
        this.player.canMove = true;
    },

    onRotateDone() {
        this.player.canMove = true;
    },

});
