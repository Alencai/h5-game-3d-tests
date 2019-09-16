
export default class TestClass {

    log(txt: cc.Label) {
        cc.log(1234);

        let ss = ():number => {
            return 5678;
        };
        cc.log(ss());
        let a = new cc.NodePool();
        a.put(txt.node);
        cc.log("abcdefghijklmnopqrstuvwxyz");
    }
}

const enum testenum{
    aaa,
    bbb,
    ccc
}

export const enum testenum2{
    aaa,
    bbb,
    ccc
}

export let sssseeee = testenum.aaa;