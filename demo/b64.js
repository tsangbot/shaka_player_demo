/* $Date: 2007-06-12 18:02:31 $ */

// from: http://bannister.us/weblog/2007/06/09/simple-base64-encodedecode-javascript/
// Handles encode/decode of ASCII and Unicode strings.

/* eslint-disable */

var UTF8 = {};  // eslint-disable-line no-var
UTF8.encode = function(s) {
    let u = [];
    for (let i = 0; i < s.length; ++i) {
        let c = s.charCodeAt(i);
        if (c < 0x80) {
            u.push(c);
        } else if (c < 0x800) {
            u.push(0xC0 | (c >> 6));
            u.push(0x80 | (63 & c));
        } else if (c < 0x10000) {
            u.push(0xE0 | (c >> 12));
            u.push(0x80 | (63 & (c >> 6)));
            u.push(0x80 | (63 & c));
        } else {
            u.push(0xF0 | (c >> 18));
            u.push(0x80 | (63 & (c >> 12)));
            u.push(0x80 | (63 & (c >> 6)));
            u.push(0x80 | (63 & c));
        }
    }
    return u;
};
UTF8.decode = function(u) {
    let a = [];
    let i = 0;
    while (i < u.length) {
        let v = u[i++];
        if (v < 0x80) {
            // no need to mask byte
        } else if (v < 0xE0) {
            v = (31 & v) << 6;
            v |= (63 & u[i++]);
        } else if (v < 0xF0) {
            v = (15 & v) << 12;
            v |= (63 & u[i++]) << 6;
            v |= (63 & u[i++]);
        } else {
            v = (7 & v) << 18;
            v |= (63 & u[i++]) << 12;
            v |= (63 & u[i++]) << 6;
            v |= (63 & u[i++]);
        }
        a.push(String.fromCharCode(v));
    }
    return a.join('');
};

var BASE64 = {};  // eslint-disable-line no-var
(function(T) {
    let encodeArray = function(u) {
        let i = 0;
        let a = [];
        let n = 0 | (u.length / 3);
        while (n-- > 0) {
            var v = (u[i] << 16) + (u[i+1] << 8) + u[i+2];  // eslint-disable-line no-var
            i += 3;
            a.push(T.charAt(63 & (v >> 18)));
            a.push(T.charAt(63 & (v >> 12)));
            a.push(T.charAt(63 & (v >> 6)));
            a.push(T.charAt(63 & v));
        }
        if ((u.length - i) == 2) {
            var v = (u[i] << 16) + (u[i+1] << 8);  // eslint-disable-line no-var
            a.push(T.charAt(63 & (v >> 18)));
            a.push(T.charAt(63 & (v >> 12)));
            a.push(T.charAt(63 & (v >> 6)));
            a.push('=');
        } else if ((u.length - i) == 1) {
            var v = (u[i] << 16);  // eslint-disable-line no-var
            a.push(T.charAt(63 & (v >> 18)));
            a.push(T.charAt(63 & (v >> 12)));
            a.push('==');
        }
        return a.join('');
    };
    let R = (function() {
        let a = [];
        for (let i=0; i<T.length; ++i) {
            a[T.charCodeAt(i)] = i;
        }
        a['='.charCodeAt(0)] = 0;
        return a;
    })();
    let decodeArray = function(s) {
        let i = 0;
        let u = [];
        let n = 0 | (s.length / 4);
        while (n-- > 0) {
            let v = (R[s.charCodeAt(i)] << 18) + (R[s.charCodeAt(i+1)] << 12) + (R[s.charCodeAt(i+2)] << 6) + R[s.charCodeAt(i+3)];  // eslint-disable-line max-len
            u.push(255 & (v >> 16));
            u.push(255 & (v >> 8));
            u.push(255 & v);
            i += 4;
        }
        if (u) {
            if (s.charAt(i-2) == '=') {
                u.pop();
                u.pop();
            } else if (s.charAt(i-1) == '=') {
                u.pop();
            }
        }
        return u;
    };
    let ASCII = {};
    ASCII.encode = function(s) {
        let u = [];
        for (let i = 0; i<s.length; ++i) {
            u.push(s.charCodeAt(i));
        }
        return u;
    };
    ASCII.decode = function(u) {
        for (let i = 0; i<s.length; ++i) {
            a[i] = String.fromCharCode(a[i]);
        }
        return a.join('');
    };
    BASE64.decodeArray = function(s) {
        let u = decodeArray(s);
        return new Uint8Array(u);
    };
    BASE64.encodeArray = function(u) {
        return encodeArray(u);
    };
    BASE64.encodeASCII = function(s) {
        let u = ASCII.encode(s);
        return encodeArray(u);
    };
    BASE64.decodeASCII = function(s) {
        let a = decodeArray(s);
        return ASCII.decode(a);
    };
    BASE64.encode = function(s) {
        let u = UTF8.encode(s);
        return encodeArray(u);
    };
    BASE64.decode = function(s) {
        let u = decodeArray(s);
        return UTF8.decode(u);
    };
})('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/');

if (undefined === btoa) {
    var btoa = BASE64.encode;  // eslint-disable-line no-var
}
if (undefined === atob) {
    var atob = BASE64.decode;  // eslint-disable-line no-var
}
