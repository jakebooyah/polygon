/* global cc */
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        rotatableAnimation: cc.Animation,
        pathAnimation: cc.Animation,
    },

    // use this for initialization
    onLoad() {

    },

    setOnRotateDoneCallback(callback) {
        this._onRotateDone = callback;
    },

    rotate() {
        this.pathAnimation.on('finished', this.onPathShrinkDone, this);
        this.pathAnimation.play('PathShrink');
    },

    onPathShrinkDone() {
        this.pathAnimation.off('finished', this.onPathShrinkDone, this);

        this.rotatableAnimation.on('finished', this.onRotateDone, this);
        this.rotatableAnimation.play();
    },

    onRotateDone() {
        this.rotatableAnimation.off('finished', this.onRotateDone, this);

        this.pathAnimation.on('finished', this.onRotateComplete, this);
        this.pathAnimation.play('PathExpand');
    },

    onRotateComplete() {
        this.pathAnimation.off('finished', this.onRotateComplete, this);
        this._onRotateDone();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
