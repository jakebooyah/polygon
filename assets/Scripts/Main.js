/* global cc */
import Player from './Player';

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
        playerNode: cc.Node,
        roomNode: cc.Node,
        playerAnimation: cc.Animation,
        roomAnimation: cc.Animation,
    },

    // use this for initialization
    onLoad() {
        this.player.setOnExitRoomCallback(this.onPlayerExitRoom.bind(this));

        this.playerAnimation.on('finished', this.onPlayerFinishSpawning, this);
        this.playerAnimation.play('PlayerFadeIn');
        this.roomAnimation.play('RoomExpand');
    },

    onPlayerFinishSpawning() {
        this.playerAnimation.off('finished', this.onPlayerFinishSpawning, this);
        this.player.canMove = true;
    },

    onPlayerExitRoom(room) {
        cc.log('room: ' + room);
        this.player.canMove = false;

        this.playerAnimation.on('finished', this.onPlayerEnterRoom, this);

        if (room === DIRECTION.RIGHT) {
            this.roomNode.color = new cc.Color(182, 178, 215);
            this.playerNode.color = new cc.Color(182, 178, 215);
            this.playerAnimation.play('PlayerEnterFromLeft');
        } else if (room === DIRECTION.LEFT) {
            this.roomNode.color = new cc.Color(232, 239, 232);
            this.playerNode.color = new cc.Color(232, 239, 232);
            this.playerAnimation.play('PlayerEnterFromRight');
        }
    },

    onPlayerEnterRoom() {
        this.playerAnimation.off('finished', this.onPlayerEnterRoom, this);
        this.player.reset();
    },

});
