/* global cc */

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
    },

    // use this for initialization
    onLoad() {
        this.setInputControl();
    },

    setOnExitRoomCallback(callback) {
        this._onExitRoom = callback;
    },

    setInputControl() {
        let self = this;
        // add keyboard event listener
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function(keyCode) {
                switch (keyCode) {
                    case cc.KEY.a:
                        break;
                    case cc.KEY.d:
                        break;
                }
            }
        }, self.node);
    },

    leftButtonClick() {
        this.playerAnimation.on('finished', this.onPlayerExitRoom, this);
        this.playerAnimation.play('PlayerExitLeft');
    },

    rightButtonClick() {
        this.playerAnimation.on('finished', this.onPlayerExitRoom, this);
        this.playerAnimation.play('PlayerExitRight');
    },

    onPlayerExitRoom() {
        this.playerAnimation.off('finished', this.onPlayerExitRoom, this);

        let player = this.node;
        let room;

        if (player.x > 0) room = DIRECTION.RIGHT;
        if (player.x < 0) room = DIRECTION.LEFT;

        if (!this.haveExitedRoom) {
            this.haveExitedRoom = true;
            this._onExitRoom(room);
        }
    },

});
