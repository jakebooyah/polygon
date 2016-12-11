/* global cc */
import Hints from './Hints';

const DIRECTION = cc.Enum({
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
});

cc.Class({
    extends: cc.Component,

    properties: {
        playerAnimation: cc.Animation,
        hints: Hints,
    },

    // use this for initialization
    onLoad() {
        this.canMove = false;
    },

    setOnExitRoomCallback(callback) {
        this._onExitRoom = callback;
    },

    moveLeft() {
        if (!this.canMove) return;
        this.canMove = false;
        this.hints.hide();
        this.playerAnimation.on('finished', this.onPlayerExitRoom, this);
        this.playerAnimation.play('PlayerExitLeft');
    },

    moveRight() {
        if (!this.canMove) return;
        this.canMove = false;
        this.hints.hide();
        this.playerAnimation.on('finished', this.onPlayerExitRoom, this);
        this.playerAnimation.play('PlayerExitRight');
    },

    onPlayerExitRoom() {
        this.playerAnimation.off('finished', this.onPlayerExitRoom, this);

        let player = this.node;
        let room;

        if (player.x > 0) room = DIRECTION.RIGHT;
        if (player.x < 0) room = DIRECTION.LEFT;

        this._onExitRoom(room);
    },

});
