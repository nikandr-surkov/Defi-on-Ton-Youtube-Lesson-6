import "@stdlib/deploy";

struct TokenInfo {
    ticker: String;
    decimals: Int;
}

// messages can contain maps
message Replace {
    items: map<Int, Address>;
}

contract MapsStructsMessages with Deployable {

    // maps with Int as key
    mi1: map<Int, TokenInfo>;
    mi2: map<Int, Bool>;
    mi3: map<Int, Int>;
    mi4: map<Int, Address>;

    // maps with Address as key
    ma1: map<Address, TokenInfo>;
    ma2: map<Address, Bool>;
    ma3: map<Address, Int>;
    ma4: map<Address, Address>;

    // Int with possible zero value
    opt: Int?;

    init() {
        // no need to initialize maps if they're empty
        self.mi2.set(1, true);        
        self.opt = null;
    }

    receive("set keys") {
        // keys are Int
        self.mi1.set(17, TokenInfo{ticker: "durev", decimals: 9});
        self.mi2.set(0x8346f3d, true);
        self.mi3.set(pow(2, 100), pow(2, 200));
        self.mi4.set(-900, address("EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0"));

        // keys are Address
        self.ma1.set(address("EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0"), TokenInfo{ticker: "durev", decimals: 9});
        self.ma2.set(address("EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"), true);
        self.ma3.set(address("EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0"), ton("1.75"));
        self.ma4.set(address("EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"), myAddress());
    }

    receive("delete keys") {
        // keys are Int
        self.mi1.set(17, null);
        self.mi2.set(0x8346f3d, null);
        self.mi3.set(pow(2, 100), null);
        self.mi4.set(-900, null);

        // keys are Address
        self.ma1.set(address("EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0"), null);
        self.ma2.set(address("EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"), null);
        self.ma3.set(address("EQB02DJ0cdUD4iQDRbBv4aYG3htePHBRK1tGeRtCnatescK0"), null);
        self.ma4.set(address("EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"), null);
    }

    receive("clear") {
        self.mi1 = emptyMap();
        self.mi2 = emptyMap();
        self.mi3 = emptyMap();
        self.mi4 = emptyMap();
        self.ma1 = emptyMap();
        self.ma2 = emptyMap();
        self.ma3 = emptyMap();
        self.ma4 = emptyMap();
    }

    receive(msg: Replace) {
        // replace all items in the map
        self.mi4 = msg.items;
    }

    get fun oneItem(key: Int): Address? {
        return self.mi4.get(key);
    }

    get fun itemCheck(): String {
        if(self.mi1.get(17) == null) {
            return "not found";
        }
        let item: TokenInfo = self.mi1.get(17)!!; // !! tells the compiler this can't be null
        return item.ticker;
    }

    get fun allItems(): map<Address, TokenInfo> {
        return self.ma1;
    }

}
