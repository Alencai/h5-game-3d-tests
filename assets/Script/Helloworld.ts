import TestClass from "./Test";
import {testenum2} from "./Test";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Node)
    role:cc.Node = null

    @property(cc.Node)
    dragon:cc.Node = null

    @property(cc.Node)
    arrow:cc.Node = null

    @property(cc.Node)
    target:cc.Node = null

    @property(cc.Node)
    control:cc.Node = null

    @property(cc.Node)
    control_bg:cc.Node = null

    @property(cc.Node)
    control_front:cc.Node = null

    _isMoving:boolean = false
    _arrows:cc.Node[] = []
    _arrowmoves:cc.Vec2[] = []
    _angle:number = 0
    _interval:number = 0;
    _left:number = 0;
    _right:number = 0;
    _top:number = 0;
    _bottom:number = 0;

    start () {
        let width = this.node.width - 40;
        let height = this.node.height - 40;
        this.arrow.active = false;
        this._left = -width/2; 
        this._right = width/2; 
        this._bottom = -height/2; 
        this._top = height/2; 
        this.initTouchBoard();
    }

    update(dt) {
        this.arrowAct(dt);
        if (this._isMoving) {
            this.move(dt);
            return;
        }
        this.shot(dt);
    }

    initTouchBoard() {
        if (this.control) {
            this.control.on(cc.Node.EventType.TOUCH_START, (evt:cc.Touch) => {
                let pos = this.control.convertToNodeSpaceAR(evt.getLocation());
                this.control_bg.setPosition(pos);
                this.control_front.setPosition(pos);
            });
            this.control.on(cc.Node.EventType.TOUCH_MOVE, (evt:cc.Touch) => {
                let pos = this.control.convertToNodeSpaceAR(evt.getLocation());
                let cur = this.control_bg.getPosition();
                let dis = pos.sub(cur);
                let len = dis.mag();
                if (len > 120) {
                    let scale = 120 / len;
                    dis.x *= scale;
                    dis.y *= scale;
                }
                this.faceTo(this.getAngle(dis.x, dis.y));
                this._isMoving = true;
                this.control_front.setPosition(cur.add(dis));
            });
            this.control.on(cc.Node.EventType.TOUCH_END, () => {
                this._isMoving = false;
                this.control_bg.setPosition(0, 0);
                this.control_front.setPosition(0, 0);
            });
            this.control.on(cc.Node.EventType.TOUCH_CANCEL, () => {
                this._isMoving = false;
                this.control_bg.setPosition(0, 0);
                this.control_front.setPosition(0, 0);
            });
        }
    }

    move(dt:number) {
        this._interval = 0;
        let speed = 4;
        let rat = this._angle * Math.PI / 180;
        let posx = this.role.x + speed * Math.sin(rat);
        let posy = this.role.y + speed * Math.cos(rat);
        if (posx < this._left) posx = this._left;
        else if (posx > this._right) posx = this._right;
        if (posy < this._bottom) posy = this._bottom;
        else if (posy > this._top) posy = this._top;
        this.role.x = posx;
        this.role.y = posy;
    }

    shot(dt:number) {
        this._interval -= dt;
        if (this._interval > 0) {
            return;
        }
        this._interval = 0.5;
        let disx = this.target.x - this.role.x;
        let disy = this.target.y - this.role.y;
        let angle = this.getAngle(disx, disy);
        let rat = angle * Math.PI / 180;
        this.faceTo(angle);
        this.arrowNew(angle, rat);
    }

    arrowNew(angle:number, rat:number) {
        let bornpos = 110;
        let speed = 8;
        let speedx = speed * Math.sin(rat);
        let speedy = speed * Math.cos(rat);
        let arrow = cc.instantiate(this.arrow);
        arrow.active = true;
        arrow.x = this.role.x + bornpos * Math.sin(rat);
        arrow.y = this.role.y + bornpos * Math.cos(rat);
        arrow.parent = this.node;
        arrow.rotation = angle;
        this._arrows.push(arrow);
        this._arrowmoves.push(cc.v2(speedx, speedy));
    }

    arrowAct(dt:number) {
        let speed = 8;
        for (let idx = this._arrows.length - 1; idx >= 0; --idx) {
            let item = this._arrows[idx];
            let posx = item.x;
            let posy = item.y;
            if (posx < this._left 
             || posx > this._right
             || posy < this._bottom
             || posy > this._top) {
                item.destroy();
                this._arrows.splice(idx, 1);
                this._arrowmoves.splice(idx, 1);
                continue;
            }
            let speed = this._arrowmoves[idx];
            item.x = posx + speed.x;
            item.y = posy + speed.y;
        }
    }

    faceTo (angle:number) {
        this._angle = angle;
        this.dragon.eulerAngles = new cc.Vec3(-90, 180, angle);
    }

    getAngle(disX:number, disY:number):number {
        if (disY < 0) {
            return Math.atan(disX / disY) * 180 / Math.PI + 180;
        }
        if (disY > 0) {
            return Math.atan(disX / disY) * 180 / Math.PI;
        }
        return disX < 0 ? -90 : 90;
    }
}


