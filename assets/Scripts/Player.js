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
        speed: 300,
    },

    // use this for initialization
    onLoad() {
        this.canMove = false;
        this.haveExitedRoom = false;
        this.setInputControl();
    },

    reset() {
        this.haveExitedRoom = false;
        this.canMove = true;
    },

    setOnExitRoomCallback(callback) {
        this._onExitRoom = callback;
    },

    setInputControl() {
        let self = this;
        // add keyboard event listener
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.left = true;
                        self.right = false;
                        break;
                    case cc.KEY.d:
                        self.left = false;
                        self.right = true;
                        break;
                }
            },
            // when releasing the button, stop acceleration in this direction
            onKeyReleased: function(keyCode) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.left = false;
                        break;
                    case cc.KEY.d:
                        self.right = false;
                        break;
                }
            }
        }, self.node);
    },

    update(dt) {
        let player = this.node;

        if (this.canMove) {
            if (this.right && !this.left) {
                player.x = player.x + (this.speed * dt);
            }
            if (this.left && !this.right) {
                player.x = player.x - (this.speed * dt);
            }
        }

        if (Math.abs(player.x) > 250) {
            this.canMove = false;

            let room;

            if (player.x > 0) room = DIRECTION.RIGHT;
            if (player.x < 0) room = DIRECTION.LEFT;

            if (!this.haveExitedRoom) {
                this.haveExitedRoom = true;
                this._onExitRoom(room);
            }
        }
    },

});
