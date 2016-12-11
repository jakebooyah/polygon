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
        this.currentRotation = 0;
        this.canRotate = true;
    },

    setOnRotateDoneCallback(callback) {
        this._onRotateDone = callback;
    },

    rotate() {
        if (!this.canRotate) return;
        this.canRotate = false;
        this.pathAnimation.on('finished', this.onPathShrinkDone, this);
        this.pathAnimation.play('PathShrink');
    },

    getCurrentRotation() {
        return this.currentRotation;
    },

    resetRotation() {
        this.node.rotation = 0;
        this.currentRotation = 0;
    },

    onPathShrinkDone() {
        this.pathAnimation.off('finished', this.onPathShrinkDone, this);

        this.rotatableAnimation.on('finished', this.onRotateDone, this);
        let clips = this.rotatableAnimation.getClips();

        let clip = clips.find(
            (element) => {
                return element._name == 'Rotate';
            }
        );

        this.rotatableAnimation.removeClip (clip, true);

        clip.curveData.props.rotation[0].value = this.currentRotation;
        this.currentRotation += 90;
        clip.curveData.props.rotation[1].value = this.currentRotation;

        if (this.currentRotation == 360) this.currentRotation = 0;

        this.rotatableAnimation.addClip(clip, 'Rotate');

        this.rotatableAnimation.play('Rotate');
    },

    onRotateDone() {
        this.rotatableAnimation.off('finished', this.onRotateDone, this);

        this.pathAnimation.on('finished', this.onRotateComplete, this);
        this.pathAnimation.play('PathExpand');
    },

    onRotateComplete() {
        this.pathAnimation.off('finished', this.onRotateComplete, this);
        this.canRotate = true;
        this._onRotateDone();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
