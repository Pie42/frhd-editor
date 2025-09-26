var Tc = Object.defineProperty;
var Ic = (n, e, t) =>
  e in n
    ? Tc(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
    : (n[e] = t);
var G = (n, e, t) => Ic(n, typeof e != "symbol" ? e + "" : e, t);
var cr,
  A,
  Gs,
  mt,
  lo,
  Ys,
  ei,
  Ni,
  ti,
  ni,
  Xs,
  mn = {},
  Qs = [],
  Dc = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
  dr = Array.isArray;
function tt(n, e) {
  for (var t in e) n[t] = e[t];
  return n;
}
function Zs(n) {
  var e = n.parentNode;
  e && e.removeChild(n);
}
function ri(n, e, t) {
  var r,
    i,
    o,
    s = {};
  for (o in e)
    o == "key" ? (r = e[o]) : o == "ref" ? (i = e[o]) : (s[o] = e[o]);
  if (
    (arguments.length > 2 &&
      (s.children = arguments.length > 3 ? cr.call(arguments, 2) : t),
    typeof n == "function" && n.defaultProps != null)
  )
    for (o in n.defaultProps) s[o] === void 0 && (s[o] = n.defaultProps[o]);
  return Vn(n, s, r, i, null);
}
function Vn(n, e, t, r, i) {
  var o = {
    type: n,
    props: e,
    key: t,
    ref: r,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    constructor: void 0,
    __v: i ?? ++Gs,
    __i: -1,
    __u: 0,
  };
  return i == null && A.vnode != null && A.vnode(o), o;
}
function se(n) {
  return n.children;
}
function qe(n, e) {
  (this.props = n), (this.context = e);
}
function Mt(n, e) {
  if (e == null) return n.__ ? Mt(n.__, n.__i + 1) : null;
  for (var t; e < n.__k.length; e++)
    if ((t = n.__k[e]) != null && t.__e != null) return t.__e;
  return typeof n.type == "function" ? Mt(n) : null;
}
function el(n) {
  var e, t;
  if ((n = n.__) != null && n.__c != null) {
    for (n.__e = n.__c.base = null, e = 0; e < n.__k.length; e++)
      if ((t = n.__k[e]) != null && t.__e != null) {
        n.__e = n.__c.base = t.__e;
        break;
      }
    return el(n);
  }
}
function ii(n) {
  ((!n.__d && (n.__d = !0) && mt.push(n) && !Wn.__r++) ||
    lo !== A.debounceRendering) &&
    ((lo = A.debounceRendering) || Ys)(Wn);
}
function Wn() {
  var n, e, t, r, i, o, s, l;
  for (mt.sort(ei); (n = mt.shift()); )
    n.__d &&
      ((e = mt.length),
      (r = void 0),
      (o = (i = (t = n).__v).__e),
      (s = []),
      (l = []),
      t.__P &&
        (((r = tt({}, i)).__v = i.__v + 1),
        A.vnode && A.vnode(r),
        Ei(
          t.__P,
          r,
          i,
          t.__n,
          t.__P.namespaceURI,
          32 & i.__u ? [o] : null,
          s,
          o ?? Mt(i),
          !!(32 & i.__u),
          l
        ),
        (r.__v = i.__v),
        (r.__.__k[r.__i] = r),
        rl(s, r, l),
        r.__e != o && el(r)),
      mt.length > e && mt.sort(ei));
  Wn.__r = 0;
}
function tl(n, e, t, r, i, o, s, l, a, c, d) {
  var f,
    h,
    p,
    m,
    g,
    x = (r && r.__k) || Qs,
    y = e.length;
  for (t.__d = a, Ac(t, e, x), a = t.__d, f = 0; f < y; f++)
    (p = t.__k[f]) != null &&
      typeof p != "boolean" &&
      typeof p != "function" &&
      ((h = p.__i === -1 ? mn : x[p.__i] || mn),
      (p.__i = f),
      Ei(n, p, h, i, o, s, l, a, c, d),
      (m = p.__e),
      p.ref &&
        h.ref != p.ref &&
        (h.ref && Ti(h.ref, null, p), d.push(p.ref, p.__c || m, p)),
      g == null && m != null && (g = m),
      65536 & p.__u || h.__k === p.__k
        ? (a = nl(p, a, n))
        : typeof p.type == "function" && p.__d !== void 0
        ? (a = p.__d)
        : m && (a = m.nextSibling),
      (p.__d = void 0),
      (p.__u &= -196609));
  (t.__d = a), (t.__e = g);
}
function Ac(n, e, t) {
  var r,
    i,
    o,
    s,
    l,
    a = e.length,
    c = t.length,
    d = c,
    f = 0;
  for (n.__k = [], r = 0; r < a; r++)
    (s = r + f),
      (i = n.__k[r] =
        (i = e[r]) == null || typeof i == "boolean" || typeof i == "function"
          ? null
          : typeof i == "string" ||
            typeof i == "number" ||
            typeof i == "bigint" ||
            i.constructor == String
          ? Vn(null, i, null, null, null)
          : dr(i)
          ? Vn(se, { children: i }, null, null, null)
          : i.constructor === void 0 && i.__b > 0
          ? Vn(i.type, i.props, i.key, i.ref ? i.ref : null, i.__v)
          : i) != null
        ? ((i.__ = n),
          (i.__b = n.__b + 1),
          (l = Rc(i, t, s, d)),
          (i.__i = l),
          (o = null),
          l !== -1 && (d--, (o = t[l]) && (o.__u |= 131072)),
          o == null || o.__v === null
            ? (l == -1 && f--, typeof i.type != "function" && (i.__u |= 65536))
            : l !== s &&
              (l == s - 1
                ? (f = l - s)
                : l == s + 1
                ? f++
                : l > s
                ? d > a - s
                  ? (f += l - s)
                  : f--
                : l < s && f++,
              l !== r + f && (i.__u |= 65536)))
        : (o = t[s]) &&
          o.key == null &&
          o.__e &&
          !(131072 & o.__u) &&
          (o.__e == n.__d && (n.__d = Mt(o)), oi(o, o, !1), (t[s] = null), d--);
  if (d)
    for (r = 0; r < c; r++)
      (o = t[r]) != null &&
        !(131072 & o.__u) &&
        (o.__e == n.__d && (n.__d = Mt(o)), oi(o, o));
}
function nl(n, e, t) {
  var r, i;
  if (typeof n.type == "function") {
    for (r = n.__k, i = 0; r && i < r.length; i++)
      r[i] && ((r[i].__ = n), (e = nl(r[i], e, t)));
    return e;
  }
  n.__e != e &&
    (e && n.type && !t.contains(e) && (e = Mt(n)),
    t.insertBefore(n.__e, e || null),
    (e = n.__e));
  do e = e && e.nextSibling;
  while (e != null && e.nodeType === 8);
  return e;
}
function Jn(n, e) {
  return (
    (e = e || []),
    n == null ||
      typeof n == "boolean" ||
      (dr(n)
        ? n.some(function (t) {
            Jn(t, e);
          })
        : e.push(n)),
    e
  );
}
function Rc(n, e, t, r) {
  var i = n.key,
    o = n.type,
    s = t - 1,
    l = t + 1,
    a = e[t];
  if (a === null || (a && i == a.key && o === a.type && !(131072 & a.__u)))
    return t;
  if (r > (a != null && !(131072 & a.__u) ? 1 : 0))
    for (; s >= 0 || l < e.length; ) {
      if (s >= 0) {
        if ((a = e[s]) && !(131072 & a.__u) && i == a.key && o === a.type)
          return s;
        s--;
      }
      if (l < e.length) {
        if ((a = e[l]) && !(131072 & a.__u) && i == a.key && o === a.type)
          return l;
        l++;
      }
    }
  return -1;
}
function ao(n, e, t) {
  e[0] === "-"
    ? n.setProperty(e, t ?? "")
    : (n[e] =
        t == null ? "" : typeof t != "number" || Dc.test(e) ? t : t + "px");
}
function An(n, e, t, r, i) {
  var o;
  e: if (e === "style")
    if (typeof t == "string") n.style.cssText = t;
    else {
      if ((typeof r == "string" && (n.style.cssText = r = ""), r))
        for (e in r) (t && e in t) || ao(n.style, e, "");
      if (t) for (e in t) (r && t[e] === r[e]) || ao(n.style, e, t[e]);
    }
  else if (e[0] === "o" && e[1] === "n")
    (o = e !== (e = e.replace(/(PointerCapture)$|Capture$/i, "$1"))),
      (e =
        e.toLowerCase() in n || e === "onFocusOut" || e === "onFocusIn"
          ? e.toLowerCase().slice(2)
          : e.slice(2)),
      n.l || (n.l = {}),
      (n.l[e + o] = t),
      t
        ? r
          ? (t.u = r.u)
          : ((t.u = Ni), n.addEventListener(e, o ? ni : ti, o))
        : n.removeEventListener(e, o ? ni : ti, o);
  else {
    if (i == "http://www.w3.org/2000/svg")
      e = e.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (
      e != "width" &&
      e != "height" &&
      e != "href" &&
      e != "list" &&
      e != "form" &&
      e != "tabIndex" &&
      e != "download" &&
      e != "rowSpan" &&
      e != "colSpan" &&
      e != "role" &&
      e != "popover" &&
      e in n
    )
      try {
        n[e] = t ?? "";
        break e;
      } catch {}
    typeof t == "function" ||
      (t == null || (t === !1 && e[4] !== "-")
        ? n.removeAttribute(e)
        : n.setAttribute(e, e == "popover" && t == 1 ? "" : t));
  }
}
function co(n) {
  return function (e) {
    if (this.l) {
      var t = this.l[e.type + n];
      if (e.t == null) e.t = Ni++;
      else if (e.t < t.u) return;
      return t(A.event ? A.event(e) : e);
    }
  };
}
function Ei(n, e, t, r, i, o, s, l, a, c) {
  var d,
    f,
    h,
    p,
    m,
    g,
    x,
    y,
    v,
    N,
    R,
    J,
    $,
    ge,
    ne,
    T,
    V = e.type;
  if (e.constructor !== void 0) return null;
  128 & t.__u && ((a = !!(32 & t.__u)), (o = [(l = e.__e = t.__e)])),
    (d = A.__b) && d(e);
  e: if (typeof V == "function")
    try {
      if (
        ((y = e.props),
        (v = "prototype" in V && V.prototype.render),
        (N = (d = V.contextType) && r[d.__c]),
        (R = d ? (N ? N.props.value : d.__) : r),
        t.__c
          ? (x = (f = e.__c = t.__c).__ = f.__E)
          : (v
              ? (e.__c = f = new V(y, R))
              : ((e.__c = f = new qe(y, R)),
                (f.constructor = V),
                (f.render = zc)),
            N && N.sub(f),
            (f.props = y),
            f.state || (f.state = {}),
            (f.context = R),
            (f.__n = r),
            (h = f.__d = !0),
            (f.__h = []),
            (f._sb = [])),
        v && f.__s == null && (f.__s = f.state),
        v &&
          V.getDerivedStateFromProps != null &&
          (f.__s == f.state && (f.__s = tt({}, f.__s)),
          tt(f.__s, V.getDerivedStateFromProps(y, f.__s))),
        (p = f.props),
        (m = f.state),
        (f.__v = e),
        h)
      )
        v &&
          V.getDerivedStateFromProps == null &&
          f.componentWillMount != null &&
          f.componentWillMount(),
          v && f.componentDidMount != null && f.__h.push(f.componentDidMount);
      else {
        if (
          (v &&
            V.getDerivedStateFromProps == null &&
            y !== p &&
            f.componentWillReceiveProps != null &&
            f.componentWillReceiveProps(y, R),
          !f.__e &&
            ((f.shouldComponentUpdate != null &&
              f.shouldComponentUpdate(y, f.__s, R) === !1) ||
              e.__v === t.__v))
        ) {
          for (
            e.__v !== t.__v && ((f.props = y), (f.state = f.__s), (f.__d = !1)),
              e.__e = t.__e,
              e.__k = t.__k,
              e.__k.forEach(function (be) {
                be && (be.__ = e);
              }),
              J = 0;
            J < f._sb.length;
            J++
          )
            f.__h.push(f._sb[J]);
          (f._sb = []), f.__h.length && s.push(f);
          break e;
        }
        f.componentWillUpdate != null && f.componentWillUpdate(y, f.__s, R),
          v &&
            f.componentDidUpdate != null &&
            f.__h.push(function () {
              f.componentDidUpdate(p, m, g);
            });
      }
      if (
        ((f.context = R),
        (f.props = y),
        (f.__P = n),
        (f.__e = !1),
        ($ = A.__r),
        (ge = 0),
        v)
      ) {
        for (
          f.state = f.__s,
            f.__d = !1,
            $ && $(e),
            d = f.render(f.props, f.state, f.context),
            ne = 0;
          ne < f._sb.length;
          ne++
        )
          f.__h.push(f._sb[ne]);
        f._sb = [];
      } else
        do
          (f.__d = !1),
            $ && $(e),
            (d = f.render(f.props, f.state, f.context)),
            (f.state = f.__s);
        while (f.__d && ++ge < 25);
      (f.state = f.__s),
        f.getChildContext != null && (r = tt(tt({}, r), f.getChildContext())),
        v &&
          !h &&
          f.getSnapshotBeforeUpdate != null &&
          (g = f.getSnapshotBeforeUpdate(p, m)),
        tl(
          n,
          dr(
            (T =
              d != null && d.type === se && d.key == null
                ? d.props.children
                : d)
          )
            ? T
            : [T],
          e,
          t,
          r,
          i,
          o,
          s,
          l,
          a,
          c
        ),
        (f.base = e.__e),
        (e.__u &= -161),
        f.__h.length && s.push(f),
        x && (f.__E = f.__ = null);
    } catch (be) {
      if (((e.__v = null), a || o != null)) {
        for (e.__u |= a ? 160 : 32; l && l.nodeType === 8 && l.nextSibling; )
          l = l.nextSibling;
        (o[o.indexOf(l)] = null), (e.__e = l);
      } else (e.__e = t.__e), (e.__k = t.__k);
      A.__e(be, e, t);
    }
  else
    o == null && e.__v === t.__v
      ? ((e.__k = t.__k), (e.__e = t.__e))
      : (e.__e = Pc(t.__e, e, t, r, i, o, s, a, c));
  (d = A.diffed) && d(e);
}
function rl(n, e, t) {
  e.__d = void 0;
  for (var r = 0; r < t.length; r++) Ti(t[r], t[++r], t[++r]);
  A.__c && A.__c(e, n),
    n.some(function (i) {
      try {
        (n = i.__h),
          (i.__h = []),
          n.some(function (o) {
            o.call(i);
          });
      } catch (o) {
        A.__e(o, i.__v);
      }
    });
}
function Pc(n, e, t, r, i, o, s, l, a) {
  var c,
    d,
    f,
    h,
    p,
    m,
    g,
    x = t.props,
    y = e.props,
    v = e.type;
  if (
    (v === "svg"
      ? (i = "http://www.w3.org/2000/svg")
      : v === "math"
      ? (i = "http://www.w3.org/1998/Math/MathML")
      : i || (i = "http://www.w3.org/1999/xhtml"),
    o != null)
  ) {
    for (c = 0; c < o.length; c++)
      if (
        (p = o[c]) &&
        "setAttribute" in p == !!v &&
        (v ? p.localName === v : p.nodeType === 3)
      ) {
        (n = p), (o[c] = null);
        break;
      }
  }
  if (n == null) {
    if (v === null) return document.createTextNode(y);
    (n = document.createElementNS(i, v, y.is && y)), (o = null), (l = !1);
  }
  if (v === null) x === y || (l && n.data === y) || (n.data = y);
  else {
    if (
      ((o = o && cr.call(n.childNodes)), (x = t.props || mn), !l && o != null)
    )
      for (x = {}, c = 0; c < n.attributes.length; c++)
        x[(p = n.attributes[c]).name] = p.value;
    for (c in x)
      if (((p = x[c]), c != "children")) {
        if (c == "dangerouslySetInnerHTML") f = p;
        else if (c !== "key" && !(c in y)) {
          if (
            (c == "value" && "defaultValue" in y) ||
            (c == "checked" && "defaultChecked" in y)
          )
            continue;
          An(n, c, null, p, i);
        }
      }
    for (c in y)
      (p = y[c]),
        c == "children"
          ? (h = p)
          : c == "dangerouslySetInnerHTML"
          ? (d = p)
          : c == "value"
          ? (m = p)
          : c == "checked"
          ? (g = p)
          : c === "key" ||
            (l && typeof p != "function") ||
            x[c] === p ||
            An(n, c, p, x[c], i);
    if (d)
      l ||
        (f && (d.__html === f.__html || d.__html === n.innerHTML)) ||
        (n.innerHTML = d.__html),
        (e.__k = []);
    else if (
      (f && (n.innerHTML = ""),
      tl(
        n,
        dr(h) ? h : [h],
        e,
        t,
        r,
        v === "foreignObject" ? "http://www.w3.org/1999/xhtml" : i,
        o,
        s,
        o ? o[0] : t.__k && Mt(t, 0),
        l,
        a
      ),
      o != null)
    )
      for (c = o.length; c--; ) o[c] != null && Zs(o[c]);
    l ||
      ((c = "value"),
      m !== void 0 &&
        (m !== n[c] ||
          (v === "progress" && !m) ||
          (v === "option" && m !== x[c])) &&
        An(n, c, m, x[c], i),
      (c = "checked"),
      g !== void 0 && g !== n[c] && An(n, c, g, x[c], i));
  }
  return n;
}
function Ti(n, e, t) {
  try {
    if (typeof n == "function") {
      var r = typeof n.__u == "function";
      r && n.__u(), (r && e == null) || (n.__u = n(e));
    } else n.current = e;
  } catch (i) {
    A.__e(i, t);
  }
}
function oi(n, e, t) {
  var r, i;
  if (
    (A.unmount && A.unmount(n),
    (r = n.ref) && ((r.current && r.current !== n.__e) || Ti(r, null, e)),
    (r = n.__c) != null)
  ) {
    if (r.componentWillUnmount)
      try {
        r.componentWillUnmount();
      } catch (o) {
        A.__e(o, e);
      }
    r.base = r.__P = null;
  }
  if ((r = n.__k))
    for (i = 0; i < r.length; i++)
      r[i] && oi(r[i], e, t || typeof n.type != "function");
  t || n.__e == null || Zs(n.__e), (n.__c = n.__ = n.__e = n.__d = void 0);
}
function zc(n, e, t) {
  return this.constructor(n, t);
}
function Bc(n, e, t) {
  var r, i, o, s;
  A.__ && A.__(n, e),
    (i = (r = typeof t == "function") ? null : e.__k),
    (o = []),
    (s = []),
    Ei(
      e,
      (n = ((!r && t) || e).__k = ri(se, null, [n])),
      i || mn,
      mn,
      e.namespaceURI,
      !r && t ? [t] : i ? null : e.firstChild ? cr.call(e.childNodes) : null,
      o,
      !r && t ? t : i ? i.__e : e.firstChild,
      r,
      s
    ),
    rl(o, n, s);
}
function Lc(n, e) {
  var t = {
    __c: (e = "__cC" + Xs++),
    __: n,
    Consumer: function (r, i) {
      return r.children(i);
    },
    Provider: function (r) {
      var i, o;
      return (
        this.getChildContext ||
          ((i = []),
          ((o = {})[e] = this),
          (this.getChildContext = function () {
            return o;
          }),
          (this.componentWillUnmount = function () {
            i = null;
          }),
          (this.shouldComponentUpdate = function (s) {
            this.props.value !== s.value &&
              i.some(function (l) {
                (l.__e = !0), ii(l);
              });
          }),
          (this.sub = function (s) {
            i.push(s);
            var l = s.componentWillUnmount;
            s.componentWillUnmount = function () {
              i && i.splice(i.indexOf(s), 1), l && l.call(s);
            };
          })),
        r.children
      );
    },
  };
  return (t.Provider.__ = t.Consumer.contextType = t);
}
(cr = Qs.slice),
  (A = {
    __e: function (n, e, t, r) {
      for (var i, o, s; (e = e.__); )
        if ((i = e.__c) && !i.__)
          try {
            if (
              ((o = i.constructor) &&
                o.getDerivedStateFromError != null &&
                (i.setState(o.getDerivedStateFromError(n)), (s = i.__d)),
              i.componentDidCatch != null &&
                (i.componentDidCatch(n, r || {}), (s = i.__d)),
              s)
            )
              return (i.__E = i);
          } catch (l) {
            n = l;
          }
      throw n;
    },
  }),
  (Gs = 0),
  (qe.prototype.setState = function (n, e) {
    var t;
    (t =
      this.__s != null && this.__s !== this.state
        ? this.__s
        : (this.__s = tt({}, this.state))),
      typeof n == "function" && (n = n(tt({}, t), this.props)),
      n && tt(t, n),
      n != null && this.__v && (e && this._sb.push(e), ii(this));
  }),
  (qe.prototype.forceUpdate = function (n) {
    this.__v && ((this.__e = !0), n && this.__h.push(n), ii(this));
  }),
  (qe.prototype.render = se),
  (mt = []),
  (Ys =
    typeof Promise == "function"
      ? Promise.prototype.then.bind(Promise.resolve())
      : setTimeout),
  (ei = function (n, e) {
    return n.__v.__b - e.__v.__b;
  }),
  (Wn.__r = 0),
  (Ni = 0),
  (ti = co(!1)),
  (ni = co(!0)),
  (Xs = 0);
var Fc = 0;
function u(n, e, t, r, i, o) {
  e || (e = {});
  var s,
    l,
    a = e;
  if ("ref" in a)
    for (l in ((a = {}), e)) l == "ref" ? (s = e[l]) : (a[l] = e[l]);
  var c = {
    type: n,
    props: a,
    key: t,
    ref: s,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    constructor: void 0,
    __v: --Fc,
    __i: -1,
    __u: 0,
    __source: i,
    __self: o,
  };
  if (typeof n == "function" && (s = n.defaultProps))
    for (l in s) a[l] === void 0 && (a[l] = s[l]);
  return A.vnode && A.vnode(c), c;
}
const $c =
  '@charset "UTF-8";.loader-wrap{display:flex;align-items:center;justify-content:center}.loader-wrap .loader-spinner{width:26px;height:26px;border:3px solid currentColor;border-color:var(--ht-color-accent);border-bottom-color:transparent;border-radius:50%;display:inline-block;box-sizing:border-box;animation:rotation 1s linear infinite;opacity:.4}@keyframes rotation{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.loader-wrap .loader-circle{background-color:var(--ht-color-accent);border-radius:100%;display:inline-block;animation:loader-spinner 1.4s infinite ease-in-out both;margin-inline-end:1px}.loader-wrap .loader-circle.loader-circle-1{animation-delay:-.32s}.loader-wrap .loader-circle.loader-circle-2{animation-delay:-.16s}@keyframes loader-spinner{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.3)}}.reactions-wrap{margin-bottom:20px;text-align:center}.reactions-title{font-weight:600;margin-bottom:20px;font-size:1.1em}.reactions{display:inline-flex;justify-content:center;flex-wrap:wrap;gap:4px}.reaction{display:inline-flex;flex-direction:column;align-items:center;padding:8px 6px;cursor:pointer;transition:.2s transform;min-width:70px;font-weight:700;margin-bottom:10px;border-radius:var(--ht-box-radius);position:relative;overflow:hidden;z-index:0}.reaction.reacted{color:var(--ht-color-accent-text)}.reaction.reacted:before{position:absolute;content:"";top:0;left:0;width:100%;height:100%;background-color:var(--ht-color-accent);opacity:.8;z-index:-1}.reaction:focus{outline:2px solid var(--ht-color-accent)}.reaction img{width:32px;height:32px;margin-inline-end:8px}.reaction .reaction-top{display:inline-flex;align-items:center}.reaction .reaction-number{font-size:.9em}.reaction .reaction-text{margin-top:7px;font-size:.8em}@media only screen and (max-width: 640px){.reaction img{width:25px;height:25px}}.ratings{text-align:center;margin-bottom:20px}.ratings .ratings-title{font-size:1.125em}.ratings .ratings-inner{margin:10px 0}.ratings .ratings-average{font-size:1.3em;font-weight:600}.ratings .ratings-count{font-size:.975em}.rater-wrap{display:flex;align-items:center;justify-content:center;margin:4px 0}.rater{position:relative;font-size:1.2em}.rater .icon{cursor:pointer;display:inline-flex;align-items:center;padding:2px 1px}.star-placeholders,.star-handlers{display:flex;align-items:center}.star-placeholders{color:var(--ht-color-box-text-light)}.star-handlers{position:absolute;left:0;top:50%;transform:translateY(-50%);width:100%}.star-handlers>span:focus{outline:2px solid currentColor}.main-box{margin:10px 0}.main-box-footer{padding:10px 0 5px 0;text-align:center}.main-box-footer a{text-decoration:none;font-size:2.4rem;color:inherit}.main-box-header-wrap{margin: 10px 0px}.main-box-header-wrap .main-box-header{display:flex;align-items:center}.main-box-header-wrap .main-box-header-left{flex:1}.main-box-header-wrap .main-box-header-right{display:flex;align-items:center}.main-box-header-wrap .member-subscribe-button{margin-right:6px}.comments-count{font-size:1.125em;display:none}.login-signup{font-size:.7em;font-weight:600;text-transform:uppercase}.login-signup a{display:inline-block;padding:3px;cursor:pointer;margin-inline-start:2px;color:inherit;text-decoration:none}.login-signup-popup{position:fixed;top:0;left:0;width:100%;height:100%;z-index:200000;background-color:#0000004d;padding:30px;display:flex;align-items:center;justify-content:center}.login-signup-popup .popup-inner{border-radius:var(--ht-box-radius);box-shadow:var(--ht-box-shadow);border:var(--ht-box-border);background-color:var(--ht-color-box);color:var(--ht-color-box-text);width:350px;max-width:100%;z-index:200002;padding:25px}.login-signup-popup .popup-inner .login-signup-note{margin-bottom:10px}.login-signup-popup .popup-inner a{background-color:var(--ht-color-accent);color:var(--ht-color-accent-text);border-radius:var(--ht-button-radius);display:inline-block;padding:4px 12px;text-decoration:none;font-size:.8rem;font-weight:600;text-transform:uppercase}#comments{margin-top:20px}.comments-note{margin-bottom:20px;font-size:.95em}.comments-list{margin-bottom:4px}.comments-list.parent{margin:0 -12px}.comments-list .show-new-comments{padding:6px 12px}.comments-list .show-new-comments.reply{padding-top:0}.comments-list .no-comments{padding:60px 0;text-align:center;opacity:.5}.comments-top{display:flex}.comments-top .search-button{font-size:.9em;cursor:pointer;margin-inline-end:7px;padding:0 3px}.comment{width:100%;position:relative}.comment .comment-inside{padding:12px;display:flex;border-radius:var(--ht-box-radius)}.comment.new>.comment-inside{background-color:var(--ht-color-highlight-new)}.comment.highlight-upvote-1>.comment-inside{background-color:var(--ht-color-highlight-upvote-1)}.comment.highlight-upvote-2>.comment-inside{background-color:var(--ht-color-highlight-upvote-2)}.comment.depth-exceeded>.comment-replies{margin-inline-start:0!important}.comment.featured>.comment-inside{background-color:#ffd7001a}.comment.specific>.comment-inside{position:relative}.comment.specific>.comment-inside:before{content:"";background-color:var(--ht-color-accent);width:100%;height:100%;position:absolute;left:0;top:0;border-radius:var(--ht-box-radius);opacity:.1;z-index:-1}.comment.flashing>.comment-inside{animation:flash .5s ease-in-out 3 both}.comment.flashing>.comment-inside:before{content:"";background-color:var(--ht-color-accent);width:100%;height:100%;position:absolute;left:0;top:0;border-radius:var(--ht-box-radius);opacity:.1;z-index:-1}@keyframes flash{0%{transform:scale(1)}50%{transform:scale(1.025)}to{transform:scale(1)}}.comment-replies{margin-inline-start:32px}.comment-side{flex-shrink:0;position:relative;height:1%;z-index:15}.comment-main{margin-inline-start:10px;flex:1;min-width:0}.comment-tag{border-radius:20px;padding:2px 8px;font-size:.6em;font-weight:600;vertical-align:middle;display:grid;justify-content:right;margin-inline-end:7px;text-transform:uppercase}.comment-tag.featured{background:#ffe141;color:#69611e}.comment-tag.pending{background-color:#38a76d;color:#fff}.comment-tag.deleted,.comment-tag.spam{background-color:#d64541;color:#fff}.comment-tag.loved{color:var(--ht-color-accent);padding:0}.comment-tag.loved .icon{color:#d42012}.comment-meta{font-size:.85em;display:flex;align-items:center}.comment-meta-left{flex:1;display:flex}.comment-meta-left-1{display:flex;align-items:center}.comment-user{display:flex;flex-direction:column}.comment-user-name{font-weight:600;margin-inline-end:5px;vertical-align:middle}.comment-user-name button{text-align:left}.comment-user-title{font-size:.9em;color:var(--ht-color-box-text-light)}.comment-time{margin:0 10px;font-size:.9em;color:var(--ht-color-box-text-light);text-decoration:none}.comment-time:hover{text-decoration:none}.comment-edited{display:none;margin-inline-end:10px;font-size:.75em;color:var(--ht-color-box-text-light);font-style:italic}.comment-hidden{font-weight:600;font-size:.86em;color:var(--ht-color-box-text-light)}.comment-actions{font-size:.8em;color:var(--ht-color-box-text-light);display:flex}.comment-actions .action-button{margin-inline-start:5px;margin-inline-end:7px;position:relative}.comment-actions .action-button:hover{text-decoration:underline}.comment-actions .comment-actions-left{flex:1;display:flex;align-items:center}.comment-actions .comment-actions-right{display:flex}.comment-actions .comment-actions-right>div{margin-inline-end:7px}.comment-actions .mod{position:relative}.comment-actions .mod .mod-title{padding:10px;font-weight:600;text-align:center}.comment-actions .mod .mod-popup{width:150px;overflow:hidden;padding-bottom:10px}.comment-actions .mod .mod-popup button{display:block;width:100%;padding:6px 16px;text-align:left;text-transform:capitalize}.comment-actions .mod .mod-popup button:hover{background-color:var(--ht-color-input)}.comment-reply-editor,.comment-edit-editor{margin:15px 0}.comment-deleter{width:225px}.comment-deleter .text{padding:15px}.comment-deleter .footer{padding:8px;text-align:center;position:relative}.comment-deleter .footer:before{content:"";position:absolute;top:0;left:0;height:1px;width:100%;background-color:var(--ht-color-box-text);opacity:.06}.comment-link-copy{display:none;cursor:pointer}.comment-inside:hover .comment-link-copy,.comment-inside:focus-within .comment-link-copy{display:inline-block}.comment-inside:hover .comment-link-copy .icon,.comment-inside:focus-within .comment-link-copy .icon{font-size:.9em}.comment-replied-to{display:inline-block;padding:3px 15px;background:var(--ht-color-input);border-radius:20px;font-size:.7rem;cursor:pointer;margin-inline-start:5px}.comment-replied-to .user-data{margin-left:5px}.comment-replied-to img,.comment-replied-to span{vertical-align:middle}.comment-replied-to .user-name{margin-left:4px;text-decoration:none!important}.collapser{position:absolute;left:14px;width:28px;top:48px;height:calc(100% - 48px);cursor:pointer}.collapser .collapse-bar{position:absolute;top:0;left:50%;transform:translate(-50%);height:100%;width:2px;background-color:var(--ht-color-accent);opacity:.05;border-radius:20px}.collapser:hover .collapse-bar{opacity:.5}.comment.collapsed .collapser,.comment.collapsed .comment-content,.comment.collapsed .comment-actions,.comment.collapsed .comment-replies,.comment.collapsed .comment-reply-editor,.comment.collapsed .comment-hidden{display:none}.expander{margin-top:6px}.expander .icon{font-size:.6em}.vote{-webkit-user-select:none;user-select:none;margin-inline-end:7px;display:inline-block;cursor:pointer;position:relative}.vote .icon{display:inline-flex;align-items:center}.vote.voted{color:var(--ht-color-accent)}.vote-number{margin-inline-start:3px;vertical-align:middle}.voters{width:150px;max-height:300px;overflow:auto}.voters .user-row{padding:5px 10px;display:flex;align-items:center;font-weight:400;text-transform:initial}.voters .user-row .profile-picture{margin-inline-end:5px}.load-more.parent{padding:12px;text-align:center}.load-more:not(.parent){font-size:.8em;font-weight:600;padding:10px}#sorter{margin-bottom:4px;font-size:.85em;position:relative;flex:1}#sorter .icon{font-size:.7em;margin-inline-start:1px}.sort-button{text-transform:capitalize;-webkit-user-select:none;user-select:none;padding:0 10px 0 0}.sort-selector{width:120px;overflow:hidden;padding:10px 0}.sort-selector button{display:block;width:100%;text-align:left;padding:6px 16px;text-transform:capitalize;cursor:pointer;font-size:.95em}.sort-selector button:hover{background-color:var(--ht-color-input)}.sort-selector button.active{background-color:var(--ht-color-accent);color:var(--ht-color-accent-text)}.sort-selector-outside-clicker{z-index:2000;position:fixed;width:100%;height:100%;left:0;top:0}#search{margin-top:20px}#search .search-input{background-color:var(--ht-color-box);color:var(--ht-color-box-text);border-radius:var(--ht-box-radius);box-shadow:var(--ht-box-shadow);border:var(--ht-box-border);width:100%;padding:10px 15px;font-size:.9em}#search .back{margin-bottom:10px;font-size:.9em}#search .back .icon{transform:rotate(90deg);display:inline-block;font-size:.5em}#search .search-results{padding:20px 0}#search .has-more{text-align:center}.user-badge{border-radius:20px;padding: 2px 8px 2px 6px;font-size:.775em;font-weight:600;vertical-align:middle;display:flex;align-items:center;margin-inline-start:0px}.img-wrap{margin-right:4px;display:flex;align-items:center}.img-wrap img{width:15px!important;height:15px!important;border-radius:0}.typing{font-weight:600;cursor:pointer}.typing-text{position:relative}.typers-popup{width:200px;padding:5px 0;max-height:300px;overflow:auto;cursor:initial}.typers-popup .user-row{padding:5px 15px;display:flex;align-items:center}.typers-popup .profile-picture{margin-inline-end:5px}.flag{position:relative}.flag.active .flag-button{color:var(--ht-color-accent)}.flag-popup{position:absolute;bottom:100%;right:0;margin-bottom:5px;width:300px;border-radius:var(--ht-box-radius);box-shadow:var(--ht-box-shadow);border:var(--ht-box-border);background-color:var(--ht-color-box);color:var(--ht-color-box-text)}.flag-popup textarea{background-color:var(--ht-color-input);border-radius:var(--ht-box-radius);padding:10px;border:none;resize:none;outline:none;width:100%;height:80px;font-family:inherit}.flag-popup .body{padding:15px}.flag-popup .title{font-weight:600;margin-bottom:8px}.flag-popup .footer{position:relative;padding:8px;text-align:center}.flag-popup .footer:before{content:"";position:absolute;top:0;left:0;height:1px;width:100%;background-color:var(--ht-color-box-text);opacity:.06}.comment-content{margin:5px 0 10px;line-height:1.4em}.comment-content .comment-content-inner{overflow:hidden;word-break:break-word}.comment-content .overflow-expander{padding:5px;text-align:center}.comment-content .overflow-expander button{text-transform:uppercase}.comment-content pre code{display:block;overflow-x:auto;padding:1em 1.5em;border-radius:var(--ht-box-radius);background-color:var(--ht-color-box);color:var(--ht-color-box-text);position:relative;white-space:pre-wrap}.comment-content pre code:before{content:"";position:absolute;width:100%;height:100%;background-color:#0000000d;left:0;top:0;pointer-events:none}#app.light .hljs-comment{color:#697070}#app.light .hljs-punctuation,#app.light .hljs-tag{color:#444a}#app.light .hljs-tag .hljs-attr,#app.light .hljs-tag .hljs-name{color:#444}#app.light .hljs-attribute,#app.light .hljs-doctag,#app.light .hljs-keyword,#app.light .hljs-meta .hljs-keyword,#app.light .hljs-name,#app.light .hljs-selector-tag{font-weight:700}#app.light .hljs-deletion,#app.light .hljs-number,#app.light .hljs-quote,#app.light .hljs-selector-class,#app.light .hljs-selector-id,#app.light .hljs-string,#app.light .hljs-template-tag,#app.light .hljs-type{color:#800}#app.light .hljs-section,#app.light .hljs-title{color:#800;font-weight:700}#app.light .hljs-link,#app.light .hljs-operator,#app.light .hljs-regexp,#app.light .hljs-selector-attr,#app.light .hljs-selector-pseudo,#app.light .hljs-symbol,#app.light .hljs-template-variable,#app.light .hljs-variable{color:#ab5656}#app.light .hljs-literal{color:#695}#app.light .hljs-addition,#app.light .hljs-built_in,#app.light .hljs-bullet,#app.light .hljs-code{color:#397300}#app.light .hljs-meta{color:#1f7199}#app.light .hljs-meta .hljs-string{color:#38a}#app.light .hljs-emphasis{font-style:italic}#app.light .hljs-strong{font-weight:700}#app.dark .hljs-keyword,#app.dark .hljs-selector-tag,#app.dark .hljs-literal,#app.dark .hljs-section,#app.dark .hljs-link{color:#fff}#app.dark .hljs-string,#app.dark .hljs-title,#app.dark .hljs-name,#app.dark .hljs-type,#app.dark .hljs-attribute,#app.dark .hljs-symbol,#app.dark .hljs-bullet,#app.dark .hljs-built_in,#app.dark .hljs-addition,#app.dark .hljs-variable,#app.dark .hljs-template-tag,#app.dark .hljs-template-variable{color:#d88}#app.dark .hljs-comment,#app.dark .hljs-quote,#app.dark .hljs-deletion,#app.dark .hljs-meta{color:#979797}#app.dark .hljs-keyword,#app.dark .hljs-selector-tag,#app.dark .hljs-literal,#app.dark .hljs-title,#app.dark .hljs-section,#app.dark .hljs-doctag,#app.dark .hljs-type,#app.dark .hljs-name,#app.dark .hljs-strong{font-weight:700}#app.dark .hljs-emphasis{font-style:italic}.image-modal{position:fixed;padding:30px 0;top:0;left:0;background:#000c;width:100%;height:100%;z-index:20000;display:flex;align-items:center;justify-content:center;font-weight:400}.image-modal img{display:block;z-index:200002;max-width:100%;max-height:100%}.image-modal .modal-closer{position:absolute;width:100%;height:100%;top:0;left:0;z-index:200001}.specific-comment-view .button-wrap{padding-bottom:15px;text-align:center}.specific-comment-view .parent-loader{padding:10px 0;text-decoration:underline}.rich-editor-mention-autocomplete{position:relative;background-color:var(--ht-color-input);font-size:.9em;display:inline-block;padding:2px 5px;border-radius:5px;font-weight:600}.mention-suggestions{border-radius:var(--ht-box-radius);box-shadow:var(--ht-box-shadow);border:var(--ht-box-border);background-color:var(--ht-color-box);color:var(--ht-color-box-text);position:fixed;display:none;width:300px;margin-top:8px;z-index:10;font-size:.9em;max-height:300px;overflow:auto}.mention-suggestions.active{display:block}.mention-suggestions .user{display:flex;align-items:center;padding:8px 10px;cursor:pointer}.mention-suggestions .user:not(:first-child){position:relative}.mention-suggestions .user:not(:first-child):before{content:"";position:absolute;top:0;left:0;height:1px;width:100%;background-color:var(--ht-color-box-text);opacity:.06}.mention-suggestions .user .profile-picture{vertical-align:middle;margin-inline-end:5px}.mention-suggestions .user .user-name{pointer-events:none}.mention-suggestions .user .name-wrap{flex:1}.mention-suggestions .user .username{font-size:.7em}.mention-suggestions .user.active{background-color:var(--ht-color-accent);color:var(--ht-color-accent-text)}.online-count{text-transform:uppercase;font-size:.6em;margin:0 10px;padding:4px 8px;display:inline-flex;background:#0080001a;align-items:center;font-weight:600;border-radius:var(--ht-box-radius);cursor:pointer;position:relative;-webkit-user-select:none;user-select:none}.online-count:after{width:5px;height:5px;background:green;content:"";margin-inline-start:3px;display:inline-block;border-radius:50%}.online-list{-webkit-user-select:initial;user-select:initial;width:200px;max-height:300px;overflow:auto}.online-list .user-row{padding:5px 10px;display:flex;align-items:center;font-weight:400;text-transform:initial;font-size:1.2em}.online-list .user-row .profile-picture{margin-inline-end:5px}.online-list .has-more{text-align:center;padding:5px 0 10px}.comments-count{font-weight:600}.icon svg{width:1em;height:1em;fill:currentColor}.global-button{font-weight:600}.global-button.normal{padding:8px 23px;font-size:.9em}.global-button.small{padding:4px 12px;font-size:.8em}.global-button.medium{padding:7px 16px;font-size:.85em}.global-button.loading{color:transparent;position:relative}.global-button.loading .button-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);--ht-color-accent: var(--ht-color-accent-text)}.button-accent{background-color:var(--ht-color-accent);color:var(--ht-color-accent-text);border-radius:var(--ht-button-radius)}.profile-picture{cursor:pointer}.profile-picture.custom{display:inline-flex;justify-content:center;align-items:center;opacity:.6;background-color:var(--ht-color-accent);color:var(--ht-color-accent-text);font-size:.8em}.user-name.clickable{cursor:pointer;padding:2px 0px}.user-name.clickable:hover{text-decoration:underline}.popup-closer{position:absolute;width:100%;height:100%;top:0;left:0;z-index:200001}.user-profile-popup-wrap{position:fixed;padding:30px 80px;top:0;left:0;background:#0000004d;width:100%;height:100%;z-index:20000;display:flex;align-items:center;justify-content:center;font-weight:400}.user-profile-popup-wrap .popup-content{border-radius:var(--ht-box-radius);box-shadow:var(--ht-box-shadow);border:var(--ht-box-border);background-color:var(--ht-color-box);color:var(--ht-color-box-text);width:650px;max-width:100%;height:100%;z-index:200002;display:flex;flex-direction:column}.user-profile-popup-wrap .user-profile{padding:25px;position:relative}.user-profile-popup-wrap .user-profile:before{content:"";position:absolute;bottom:0;left:0;height:1px;width:100%;background-color:var(--ht-color-box-text);opacity:.06}.user-profile-popup-wrap .user-profile-inner{display:flex;width:480px;margin:auto;max-width:100%}.user-profile-popup-wrap .profile-right{margin-inline-start:15px;font-size:.875em;width:100%}.user-profile-popup-wrap .profile-right .name{font-size:1em;font-weight:600;margin-bottom:1px}.user-profile-popup-wrap .profile-right .username{color:var(--ht-color-box-text-light)}.user-profile-popup-wrap .profile-right .location,.user-profile-popup-wrap .profile-right .bio{margin:7px 0}.user-profile-popup-wrap .profile-right .website{font-weight:600;margin:7px 0}.user-profile-popup-wrap .profile-right .website a{color:var(--ht-color-accent)}.user-profile-popup-wrap .profile-right .actions{margin:10px 0}.user-profile-popup-wrap .profile-right .actions .global-button{margin-inline-end:6px}.user-profile-popup-wrap .section-selector{position:relative;padding:15px;text-align:center}.user-profile-popup-wrap .section-selector:before{content:"";position:absolute;bottom:0;left:0;height:1px;width:100%;background-color:var(--ht-color-box-text);opacity:.06}.user-profile-popup-wrap .section-selector .selector{text-transform:uppercase;font-size:.8em;padding:0 6px}.user-profile-popup-wrap .section-selector .selector.active{color:var(--ht-color-accent)}.user-profile-popup-wrap .section-selector .selector .count{font-size:.6em;padding:2px 7px;background:var(--ht-color-input);border-radius:10px;font-weight:600;margin-inline-start:4px;vertical-align:middle}.user-profile-popup-wrap .section-wrap{flex:1;overflow:auto}.user-profile-popup-wrap .user-comment{padding:15px 25px}.user-profile-popup-wrap .user-comment:not(:first-child){position:relative}.user-profile-popup-wrap .user-comment:not(:first-child):before{content:"";position:absolute;top:0;left:0;height:1px;width:100%;background-color:var(--ht-color-box-text);opacity:.06}.user-profile-popup-wrap .user-comment .page-title{margin-bottom:15px;padding:0 12px}.user-profile-popup-wrap .user-comment .page-title a{color:inherit}.user-profile-popup-wrap .has-more{text-align:center;margin-bottom:20px}.user-profile-popup-wrap .user-settings{padding:25px}.user-profile-popup-wrap .user-settings .title{font-weight:600;font-size:1em;margin-bottom:15px;text-align:center}.user-profile-popup-wrap .user-settings .setting{width:300px;max-width:100%;margin:auto;display:flex;padding:10px}.user-profile-popup-wrap .user-settings .setting .text{flex:1}.user-profile-popup-wrap .user-settings .save-wrap{padding:15px;text-align:center}.user-profile-popup-wrap .user-blocked .block{display:flex;align-items:center;padding:15px 25px;font-size:.9em}.user-profile-popup-wrap .user-blocked .block .user-name{flex:1;margin:0 12px}.user-profile-popup-wrap .user-moderation{width:450px;margin:auto;max-width:100%;padding:30px}.user-profile-popup-wrap .user-moderation .dual-view{display:flex;padding:5px;margin-bottom:15px}.user-profile-popup-wrap .user-moderation .dual-view .left{flex:1;font-weight:600;padding:3px}.user-profile-popup-wrap .user-moderation .dual-view .right{flex:2}.user-profile-popup-wrap .user-moderation .state-input input{cursor:pointer;vertical-align:middle;margin:0}.user-profile-popup-wrap .user-moderation .state-input label{cursor:pointer;vertical-align:middle;margin-left:5px;text-transform:capitalize}.user-profile-popup-wrap .user-moderation .user-note{border-radius:var(--ht-box-radius);box-shadow:var(--ht-box-shadow);border:var(--ht-box-border);width:100%;background-color:var(--ht-color-box);color:var(--ht-color-box-text);padding:8px 10px;resize:vertical;min-height:120px}.user-profile-popup-wrap .user-moderation .temp-ban-wrap{margin-top:6px}.user-profile-popup-wrap .user-moderation #temporary-ban-date{border-radius:var(--ht-box-radius);box-shadow:var(--ht-box-shadow);border:var(--ht-box-border);width:100%;background-color:var(--ht-color-box);color:var(--ht-color-box-text);padding:8px 10px}.user-profile-popup-wrap .user-moderation .privacy-note{text-align:center;font-size:.8em;color:var(--ht-color-box-text-light);margin-bottom:10px}.notifications{position:relative}.notification-icon{margin-inline-end:7px;padding:0 3px;display:inline-block;font-size:14px;cursor:pointer;vertical-align:middle;position:relative}.notifs-count-tag{position:absolute;right:100%;margin-inline-end:-6px;margin-top:-3px;font-size:.4em;width:11px;height:11px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background-color:var(--ht-color-accent);color:var(--ht-color-accent-text)}.notifications-popup{width:325px;max-height:350px;overflow:auto}.notifications-popup .read-all{padding:10px 20px 5px 0;font-size:.8em;text-align:right}.notifications-popup .has-more{text-align:center;margin-top:5px;margin-bottom:15px}.notification{display:flex;padding:10px;font-size:.9em;cursor:pointer;color:inherit;text-decoration:none}.notification:hover{background-color:var(--ht-color-input)}.notification .left{margin-inline-end:7px}.notification .right{flex:1}.notification .meta{opacity:.7}.notification .time{font-size:.7em}.notification .page-title{font-size:.85em}.notification.not-read .text{font-weight:600}.global-no-results{font-size:.8em;padding:10px;text-align:center;color:var(--ht-color-box-text-light)}.editor-wrap{display:flex}.editor-user{margin-inline-end:10px}.user-banned,.page-closed,.login-required{flex:1;display:flex;align-items:center;justify-content:center;padding:15px 20px;font-size:.9em;font-weight:600;background-color:var(--ht-color-box);color:var(--ht-color-box-text);border-radius:var(--ht-box-radius);box-shadow:var(--ht-box-shadow);border:var(--ht-box-border)}.user-banned{display:block;text-align:center;font-weight:600}.user-banned-reason{margin-top:3px;font-style:italic;font-weight:400;font-size:.9em}.login-required{display:block;text-align:center;cursor:pointer;text-decoration:none}.rich-editor{flex:1;background-color:var(--ht-color-box);color:var(--ht-color-box-text);border-radius:var(--ht-box-radius);box-shadow:var(--ht-box-shadow);border:var(--ht-box-border);min-width:0;position:relative}.rich-editor.publishing:before{content:"";position:absolute;width:100%;height:100%;left:0;top:0;z-index:1;cursor:wait}.rich-editor.focused .comment-writer .ProseMirror{min-height:75px}.editor-loader{background-color:var(--ht-color-box);color:var(--ht-color-box-text);border-radius:var(--ht-box-radius);box-shadow:var(--ht-box-shadow);flex:1;min-width:0;text-align:center;padding:20px}.comment-writer{transition:.3s box-shadow;border-radius:var(--ht-box-radius)}.comment-writer.focused .ProseMirror{min-height:75px}.comment-writer:focus-within{outline:none;box-shadow:0 0 0 1px var(--ht-color-accent-35)}.min-length-tip{font-size:.65em;color:var(--ht-color-box-text-light);position:relative;padding:5px 15px 0;text-align:right}.comment-buttons,.panel,.guest-form,.comment-error{position:relative;font-size:.9em}.comment-buttons{display:flex;align-items:center;padding:7px 15px}.comment-buttons .writer-buttons{flex:1}.comment-buttons .writer-buttons button{padding:6px;display:inline-flex;align-items:center}.comment-buttons .writer-buttons button:first-child{margin-left:0}.comment-buttons .writer-buttons button.active{color:var(--ht-color-accent);position:relative}.comment-buttons .writer-buttons button.active:before{content:"";width:24px;height:24px;border-radius:var(--ht-button-radius);position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:var(--ht-color-accent);opacity:.1}.comment-buttons .writer-buttons button .icon{display:inline-flex;align-items:center}.comment-buttons .writer-buttons svg{vertical-align:middle}.comment-buttons .action-buttons{font-size:.9em}.comment-buttons .action-buttons .cancel-button{margin-inline-end:8px}.panel{padding:15px}.guest-form{display:flex;font-size:1em;padding:4px 10px;gap:6px}.guest-form .guest-input{flex:1;position:relative}.guest-form input{width:100%;padding:6px 15px}.comment-error{padding:15px;color:#ab2525;display:flex;align-items:center}.comment-error .error-icon{background-color:#ab2525;display:inline-flex;width:16px;height:16px;align-items:center;justify-content:center;border-radius:50%;color:#fff;margin-inline-end:4px;font-size:.6em}.ProseMirror{padding:15px;outline:none!important;word-wrap:break-word;white-space:pre-wrap;white-space:break-spaces;-webkit-font-variant-ligatures:none;font-variant-ligatures:none;font-feature-settings:"liga" 0}.ProseMirror .ProseMirror-hideselection *::selection{background:transparent}.ProseMirror .ProseMirror-hideselection *::-moz-selection{background:transparent}.ProseMirror .ProseMirror-hideselection{caret-color:transparent}.ProseMirror .ProseMirror-selectednode{outline:1px solid blue}.ProseMirror[data-placeholder]:before{position:absolute;content:attr(data-placeholder);pointer-events:none;opacity:.5}.ProseMirror x-embed{pointer-events:none}.ProseMirror x-spoiler{font-size:.9em;background-color:var(--ht-color-input)!important;color:inherit!important;border-radius:20px;padding:1px 8px;display:inline-block}.ProseMirror x-spoiler:before{content:"Spoiler";font-size:.6em;vertical-align:middle;margin-right:5px;font-weight:600}.ProseMirror x-math{font-size:.9em;background-color:var(--ht-color-input)!important;border-radius:20px;display:inline-block;position:relative;padding:1px 8px 1px 40px}.ProseMirror x-math:before{content:"Math";font-size:.6em;vertical-align:middle;margin-right:5px;font-weight:600;position:absolute;left:10px;top:50%;transform:translateY(-50%);max-width:25px}.ProseMirror x-math:after{content:"​"}.ProseMirror pre code{display:block;background-color:var(--ht-color-input)!important;padding:1em 1.5em;border-radius:var(--ht-box-radius);overflow:auto;white-space:pre-wrap}.comment-content p,.ProseMirror p{margin:0}.comment-content img,.ProseMirror img{max-height:425px;max-width:100%;display:block;margin:0px 0;cursor:pointer}.comment-content blockquote,.ProseMirror blockquote{border-left:4px solid var(--ht-color-accent);margin:20px 10px;padding:15px}.comment-content :not(pre)>code,.ProseMirror :not(pre)>code{background:#87837826;color:#eb5757;border-radius:3px;font-size:.85em;padding:.2em .4em;font-family:monospace}.comment-content img.ProseMirror-separator,.ProseMirror img.ProseMirror-separator{display:inline!important;border:none!important;margin:0!important}.comment-content a:not(.bookmark),.ProseMirror a:not(.bookmark){color:var(--ht-color-accent)}.comment-content x-mention,.ProseMirror x-mention{position:relative;background-color:var(--ht-color-input);font-size:.9em;display:inline-block;padding:2px 5px;border-radius:5px;font-weight:600}.comment-content x-embed,.ProseMirror x-embed{display:block;padding:5px 5px;max-width:650px}.comment-content x-embed a.bookmark,.ProseMirror x-embed a.bookmark{cursor:pointer;display:flex;border-radius:var(--ht-box-radius);overflow:hidden;box-shadow:0 0 5px #0000000f;width:100%;white-space:normal;text-decoration:none;color:inherit}.comment-content x-embed a.bookmark .bookmark-details,.ProseMirror x-embed a.bookmark .bookmark-details{flex:1;display:flex;flex-direction:column;padding:15px 20px}.comment-content x-embed a.bookmark .bookmark-details .bookmark-title,.ProseMirror x-embed a.bookmark .bookmark-details .bookmark-title{font-weight:600}.comment-content x-embed a.bookmark .bookmark-details .bookmark-description,.ProseMirror x-embed a.bookmark .bookmark-details .bookmark-description{font-size:.9em;margin-top:4px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:6;line-clamp:6;-webkit-box-orient:vertical}.comment-content x-embed a.bookmark .bookmark-details .bookmark-site,.ProseMirror x-embed a.bookmark .bookmark-details .bookmark-site{font-size:.8em;margin-top:12px}.comment-content x-embed a.bookmark .bookmark-thumbnail,.ProseMirror x-embed a.bookmark .bookmark-thumbnail{flex:1;position:relative}.comment-content x-embed a.bookmark .bookmark-thumbnail img,.ProseMirror x-embed a.bookmark .bookmark-thumbnail img{object-fit:cover;position:absolute;top:0;left:0;width:100%;height:100%;margin:0}@media screen and (max-width: 700px){.comment-content x-embed a.bookmark,.ProseMirror x-embed a.bookmark{flex-direction:column-reverse}.comment-content x-embed a.bookmark .bookmark-thumbnail,.ProseMirror x-embed a.bookmark .bookmark-thumbnail{flex:initial;width:100%;height:200px}}.comment-content x-spoiler,.ProseMirror x-spoiler{background-color:#000;color:transparent;cursor:default}.comment-content x-spoiler:hover,.ProseMirror x-spoiler:hover{background-color:transparent;color:inherit}.comment-content pre code,.ProseMirror pre code{-moz-tab-size:4;tab-size:4;font-size:.9em}@keyframes blink{49%{border-color:unset}50%{border-color:#fff}99%{border-color:#fff}}.no-cursor{caret-color:transparent}div:focus .fake-cursor,span:focus .fake-cursor{margin-right:-1px;border-left-width:1px;border-left-style:solid;animation:blink 1s;animation-iteration-count:infinite;position:relative;z-index:1}.panel-gif input[type=text]{background-color:var(--ht-color-input);width:100%;padding:7px 10px;border:none;border-radius:var(--ht-box-radius);outline:none}.panel-gif img{margin-inline-end:10px;margin-bottom:10px;cursor:pointer}.panel-gif .gifs{margin:15px 0;max-height:250px;overflow:auto;text-align:center}.panel-gif .gif-footer{font-size:.65em;text-align:right}.panel-gif .gif-footer a{color:inherit;text-decoration:none}.emoji-panel .ep-header{margin-bottom:15px}.emoji-panel .eph-icon:not(.active){filter:grayscale(1)}.emoji-panel .ep-body{max-height:200px;overflow:auto}.emoji-panel .ep-cat{margin-bottom:10px}.emoji-panel .epc-title{font-weight:600;font-size:.9rem;margin-bottom:5px}.emoji-panel .ep-footer{margin-top:15px}.emoji-panel .epha-name{font-weight:600;font-size:.9rem}.emoji-panel .emoji-inline{display:inline-flex;width:25px;height:25px;font-size:17px;align-items:center;justify-content:center;cursor:pointer}.panel-image{display:flex;align-items:center;justify-content:center}.panel-image .or{margin:0 10px;text-transform:uppercase;font-size:.7em;font-weight:600}.panel-image .right{display:flex;flex:1;align-items:center}.panel-image input[type=text]{flex:1;padding:5px 10px;margin-inline-end:5px;background-color:var(--ht-color-input);width:100%;border:none;border-radius:var(--ht-box-radius);outline:none}.panel-link{display:flex}.panel-link .input-wrap{flex:1}.panel-link input[type=text]{flex:1;padding:5px 10px;background-color:var(--ht-color-input);width:100%;border:none;border-radius:var(--ht-box-radius);outline:none}.panel-link button{margin-inline-start:5px}.switch{position:relative;display:inline-block;width:48px;height:28px;vertical-align:middle}.switch:focus-within{outline:none;box-shadow:0 0 0 2px var(--ht-color-accent-35);border-radius:var(--ht-box-radius)}.switch input{opacity:0}.switch .slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:var(--ht-color-input);transition:.4s;-webkit-transition:.4s;border-radius:30px;-webkit-border-radius:30px}.switch .slider:before{position:absolute;content:"";height:20px;width:20px;border-radius:50%;left:4px;top:4px;bottom:4px;background-color:var(--ht-color-box);transition:.2s}.switch input:checked+.slider{background-color:var(--ht-color-accent)}.switch input:focus+.slider{box-shadow:var(--ht-box-shadow)}.switch input:checked+.slider:before{transform:translate(20px);-webkit-transform:translateX(20px)}.switch.small{width:40px;height:24px}.switch.small .slider:before{width:18px;height:18px;left:3px;top:3px;bottom:3px}.switch.small input:checked+.slider:before{transform:translate(16px)}.page-moderation-popup-wrap{position:fixed;padding:30px 80px;top:0;left:0;background:#0000004d;width:100%;height:100%;z-index:20000;display:flex;align-items:center;justify-content:center;font-weight:400}.page-moderation-popup-wrap .mod-content{border-radius:var(--ht-box-radius);box-shadow:var(--ht-box-shadow);border:var(--ht-box-border);background-color:var(--ht-color-box);color:var(--ht-color-box-text);width:650px;max-width:100%;z-index:200002;display:flex;flex-direction:column;padding:20px}.page-moderation-popup-wrap .mod-title{text-align:center;font-size:.8em;color:var(--ht-color-box-text-light)}.page-moderation-popup-wrap .duel-view{display:flex;padding:6px}.page-moderation-popup-wrap .duel-view .left{padding:5px;flex:2}.page-moderation-popup-wrap .duel-view .right{flex:1;text-align:right}.page-mod-icon{display:inline-block;margin-right:4px}.page-mod-icon svg{width:14px;height:14px}.global-popup{border-radius:var(--ht-box-radius);box-shadow:var(--ht-box-shadow);border:var(--ht-box-border);background-color:var(--ht-color-box);color:var(--ht-color-box-text);position:absolute;z-index:2001}.global-popup.bottom{top:100%;margin-top:5px}.global-popup.top{bottom:100%;margin-bottom:5px}.global-popup.left{left:0}.global-popup.right{right:0}.global-popup.center{left:50%;transform:translate(-50%)}.global-popup-closer{z-index:2000;position:fixed;width:100%;height:100%;left:0;top:0}.global-one-time-notification{position:fixed;bottom:0;left:0;height:60px;width:100%;display:flex;align-items:center;justify-content:center;z-index:1000000000;font-size:.8em;font-weight:600}.global-one-time-notification .notification{border-radius:var(--ht-box-radius);box-shadow:var(--ht-box-shadow);border:var(--ht-box-border);background-color:var(--ht-color-box);color:var(--ht-color-box-text);padding:10px 15px;animation:.3s one-time-notification-in}.global-one-time-notification.error .notification{background-color:#ab2525;color:#fff}.global-one-time-notification.error .error-icon{background-color:#fff;display:inline-flex;width:16px;height:16px;align-items:center;justify-content:center;border-radius:50%;color:#ab2525;margin-inline-end:4px}.global-one-time-notification.hidden .notification{animation:.3s one-time-notification-out both}@keyframes one-time-notification-in{0%{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes one-time-notification-out{0%{transform:translateY(0);opacity:1}to{transform:translateY(30px);opacity:0}}#app.rtl{direction:rtl;text-align:right;unicode-bidi:bidi-override}#app.rtl .collapser{left:initial;right:14px}#app.rtl .global-popup.left{left:initial;right:0}#app.rtl .global-popup.right{right:initial;left:0}#app.rtl #search .back .icon{transform:rotate(-90deg)}#app.rtl blockquote{border-right:4px solid var(--ht-color-accent);border-left:none}#app.rtl .notifs-count-tag{right:initial;left:100%}@media screen and (max-width: 600px){#app.rtl .comment .comment-side{float:right}#app.rtl .comment .collapser{right:4px}}@media screen and (max-width: 960px){.comment-meta{align-items:flex-start}.comment-meta-left{flex-direction:column}.comment-meta-left .comment-time{margin-left:0}.user-profile-popup-wrap{padding:40px 20px}.page-moderation-popup-wrap{padding:20px}.page-moderation-popup-wrap .page-moderation-panel{width:90%}}@media screen and (max-width: 600px){.rich-editor .guest-form{flex-direction:column}.rich-editor .guest-form .guest-input:nth-child(2){position:relative}.rich-editor .guest-form .guest-input:nth-child(2):before{content:"";position:absolute;top:0;left:0;height:1px;width:100%;background-color:var(--ht-color-box-text);opacity:.06}.rich-editor .comment-buttons{flex-direction:column;padding:0}.rich-editor .comment-buttons .writer-buttons{flex:1;width:100%;display:flex;justify-content:space-evenly;padding:10px 0}.rich-editor .comment-buttons .action-buttons{display:flex;width:100%;padding:10px;position:relative}.rich-editor .comment-buttons .action-buttons:before{content:"";position:absolute;top:0;left:0;height:1px;width:100%;background-color:var(--ht-color-box-text);opacity:.06}.rich-editor .comment-buttons .action-buttons button{flex:1}.rich-editor .panel-link{flex-direction:column}.rich-editor .panel-link .button-wrap{margin-top:10px;display:flex}.rich-editor .panel-link .button-wrap button{flex:1}.rich-editor .panel-link .button-wrap button:first-child{margin-inline-start:0}.rich-editor .panel-image{flex-direction:column}.rich-editor .panel-image .or{margin:10px}.rich-editor .panel-image .right{width:100%}.user-profile-popup-wrap .user-profile-inner{flex-direction:column}.user-profile-popup-wrap .user-profile-inner .profile-picture{width:60px!important;height:60px!important}.user-profile-popup-wrap .user-profile-inner .profile-right{margin-left:0}.comments-list.parent{margin:0 -6px}.comment .comment-inside{display:block;padding:6px}.comment .comment-main{margin-inline-start:12px}.comment .comment-side{float:left;margin-inline-end:5px;margin-inline-start:12px}.comment .collapser{left:4px;width:12px;top:6px;height:calc(100% - 12px)}.comment .comment-replies{margin-inline-start:20px}}*{box-sizing:border-box}a{border-radius:calc(var(--ht-box-radius) * .2);outline:none}a:focus{box-shadow:0 0 0 1px var(--ht-color-accent-35)}button{border:none;background-color:transparent;padding:0;-webkit-appearance:none;-moz-appearance:none;appearance:none;cursor:pointer;font-weight:inherit;font-size:inherit;font-family:inherit;color:inherit;-webkit-user-select:none;user-select:none;outline:none}button:focus{box-shadow:0 0 0 2px var(--ht-color-accent-35)}input[type=text]{border:none;background-color:var(--ht-color-input);-webkit-appearance:none;-moz-appearance:none;appearance:none;font-weight:inherit;font-size:inherit;font-family:inherit;color:inherit;outline:none;transition:.3s box-shadow;border-radius:var(--ht-box-radius)}input:focus{outline:none;box-shadow:0 0 0 1px var(--ht-color-accent-35)}#app{max-width:100%;text-align:initial;text-transform:initial;line-height:initial;word-spacing:initial;font-family:inherit;font-size:inherit;color:var(--ht-color-text);margin:auto}#error{padding:10px;background-color:#ffd7d7;color:#000;border-radius:20px;text-align:center;font-size:.9em}';
var Wt,
  U,
  Cr,
  uo,
  gn = 0,
  il = [],
  X = A,
  fo = X.__b,
  ho = X.__r,
  po = X.diffed,
  mo = X.__c,
  go = X.unmount,
  bo = X.__;
function ur(n, e) {
  X.__h && X.__h(U, n, gn || e), (gn = 0);
  var t = U.__H || (U.__H = { __: [], __h: [] });
  return n >= t.__.length && t.__.push({}), t.__[n];
}
function w(n) {
  return (gn = 1), Vc(ll, n);
}
function Vc(n, e, t) {
  var r = ur(Wt++, 2);
  if (
    ((r.t = n),
    !r.__c &&
      ((r.__ = [
        t ? t(e) : ll(void 0, e),
        function (l) {
          var a = r.__N ? r.__N[0] : r.__[0],
            c = r.t(a, l);
          a !== c && ((r.__N = [c, r.__[1]]), r.__c.setState({}));
        },
      ]),
      (r.__c = U),
      !U.u))
  ) {
    var i = function (l, a, c) {
      if (!r.__c.__H) return !0;
      var d = r.__c.__H.__.filter(function (h) {
        return !!h.__c;
      });
      if (
        d.every(function (h) {
          return !h.__N;
        })
      )
        return !o || o.call(this, l, a, c);
      var f = !1;
      return (
        d.forEach(function (h) {
          if (h.__N) {
            var p = h.__[0];
            (h.__ = h.__N), (h.__N = void 0), p !== h.__[0] && (f = !0);
          }
        }),
        !(!f && r.__c.props === l) && (!o || o.call(this, l, a, c))
      );
    };
    U.u = !0;
    var o = U.shouldComponentUpdate,
      s = U.componentWillUpdate;
    (U.componentWillUpdate = function (l, a, c) {
      if (this.__e) {
        var d = o;
        (o = void 0), i(l, a, c), (o = d);
      }
      s && s.call(this, l, a, c);
    }),
      (U.shouldComponentUpdate = i);
  }
  return r.__N || r.__;
}
function z(n, e) {
  var t = ur(Wt++, 3);
  !X.__s && sl(t.__H, e) && ((t.__ = n), (t.i = e), U.__H.__h.push(t));
}
function q(n) {
  return (
    (gn = 5),
    ol(function () {
      return { current: n };
    }, [])
  );
}
function ol(n, e) {
  var t = ur(Wt++, 7);
  return sl(t.__H, e) && ((t.__ = n()), (t.__H = e), (t.__h = n)), t.__;
}
function Uc(n, e) {
  return (
    (gn = 8),
    ol(function () {
      return n;
    }, e)
  );
}
function jc(n) {
  var e = U.context[n.__c],
    t = ur(Wt++, 9);
  return (
    (t.c = n),
    e ? (t.__ == null && ((t.__ = !0), e.sub(U)), e.props.value) : n.__
  );
}
function Hc() {
  for (var n; (n = il.shift()); )
    if (n.__P && n.__H)
      try {
        n.__H.__h.forEach(Un), n.__H.__h.forEach(si), (n.__H.__h = []);
      } catch (e) {
        (n.__H.__h = []), X.__e(e, n.__v);
      }
}
(X.__b = function (n) {
  (U = null), fo && fo(n);
}),
  (X.__ = function (n, e) {
    n && e.__k && e.__k.__m && (n.__m = e.__k.__m), bo && bo(n, e);
  }),
  (X.__r = function (n) {
    ho && ho(n), (Wt = 0);
    var e = (U = n.__c).__H;
    e &&
      (Cr === U
        ? ((e.__h = []),
          (U.__h = []),
          e.__.forEach(function (t) {
            t.__N && (t.__ = t.__N), (t.i = t.__N = void 0);
          }))
        : (e.__h.forEach(Un), e.__h.forEach(si), (e.__h = []), (Wt = 0))),
      (Cr = U);
  }),
  (X.diffed = function (n) {
    po && po(n);
    var e = n.__c;
    e &&
      e.__H &&
      (e.__H.__h.length &&
        ((il.push(e) !== 1 && uo === X.requestAnimationFrame) ||
          ((uo = X.requestAnimationFrame) || qc)(Hc)),
      e.__H.__.forEach(function (t) {
        t.i && (t.__H = t.i), (t.i = void 0);
      })),
      (Cr = U = null);
  }),
  (X.__c = function (n, e) {
    e.some(function (t) {
      try {
        t.__h.forEach(Un),
          (t.__h = t.__h.filter(function (r) {
            return !r.__ || si(r);
          }));
      } catch (r) {
        e.some(function (i) {
          i.__h && (i.__h = []);
        }),
          (e = []),
          X.__e(r, t.__v);
      }
    }),
      mo && mo(n, e);
  }),
  (X.unmount = function (n) {
    go && go(n);
    var e,
      t = n.__c;
    t &&
      t.__H &&
      (t.__H.__.forEach(function (r) {
        try {
          Un(r);
        } catch (i) {
          e = i;
        }
      }),
      (t.__H = void 0),
      e && X.__e(e, t.__v));
  });
var xo = typeof requestAnimationFrame == "function";
function qc(n) {
  var e,
    t = function () {
      clearTimeout(r), xo && cancelAnimationFrame(e), setTimeout(n);
    },
    r = setTimeout(t, 100);
  xo && (e = requestAnimationFrame(t));
}
function Un(n) {
  var e = U,
    t = n.__c;
  typeof t == "function" && ((n.__c = void 0), t()), (U = e);
}
function si(n) {
  var e = U;
  (n.__c = n.__()), (U = e);
}
function sl(n, e) {
  return (
    !n ||
    n.length !== e.length ||
    e.some(function (t, r) {
      return t !== n[r];
    })
  );
}
function ll(n, e) {
  return typeof e == "function" ? e(n) : e;
}
function Wc(n, e) {
  for (var t in e) n[t] = e[t];
  return n;
}
function yo(n, e) {
  for (var t in n) if (t !== "__source" && !(t in e)) return !0;
  for (var r in e) if (r !== "__source" && n[r] !== e[r]) return !0;
  return !1;
}
function ko(n, e) {
  (this.props = n), (this.context = e);
}
((ko.prototype = new qe()).isPureReactComponent = !0),
  (ko.prototype.shouldComponentUpdate = function (n, e) {
    return yo(this.props, n) || yo(this.state, e);
  });
var _o = A.__b;
A.__b = function (n) {
  n.type && n.type.__f && n.ref && ((n.props.ref = n.ref), (n.ref = null)),
    _o && _o(n);
};
var Jc = A.__e;
A.__e = function (n, e, t, r) {
  if (n.then) {
    for (var i, o = e; (o = o.__); )
      if ((i = o.__c) && i.__c)
        return e.__e == null && ((e.__e = t.__e), (e.__k = t.__k)), i.__c(n, e);
  }
  Jc(n, e, t, r);
};
var vo = A.unmount;
function al(n, e, t) {
  return (
    n &&
      (n.__c &&
        n.__c.__H &&
        (n.__c.__H.__.forEach(function (r) {
          typeof r.__c == "function" && r.__c();
        }),
        (n.__c.__H = null)),
      (n = Wc({}, n)).__c != null &&
        (n.__c.__P === t && (n.__c.__P = e), (n.__c = null)),
      (n.__k =
        n.__k &&
        n.__k.map(function (r) {
          return al(r, e, t);
        }))),
    n
  );
}
function cl(n, e, t) {
  return (
    n &&
      t &&
      ((n.__v = null),
      (n.__k =
        n.__k &&
        n.__k.map(function (r) {
          return cl(r, e, t);
        })),
      n.__c &&
        n.__c.__P === e &&
        (n.__e && t.appendChild(n.__e), (n.__c.__e = !0), (n.__c.__P = t))),
    n
  );
}
function Mr() {
  (this.__u = 0), (this.t = null), (this.__b = null);
}
function dl(n) {
  var e = n.__.__c;
  return e && e.__a && e.__a(n);
}
function Rn() {
  (this.u = null), (this.o = null);
}
(A.unmount = function (n) {
  var e = n.__c;
  e && e.__R && e.__R(), e && 32 & n.__u && (n.type = null), vo && vo(n);
}),
  ((Mr.prototype = new qe()).__c = function (n, e) {
    var t = e.__c,
      r = this;
    r.t == null && (r.t = []), r.t.push(t);
    var i = dl(r.__v),
      o = !1,
      s = function () {
        o || ((o = !0), (t.__R = null), i ? i(l) : l());
      };
    t.__R = s;
    var l = function () {
      if (!--r.__u) {
        if (r.state.__a) {
          var a = r.state.__a;
          r.__v.__k[0] = cl(a, a.__c.__P, a.__c.__O);
        }
        var c;
        for (r.setState({ __a: (r.__b = null) }); (c = r.t.pop()); )
          c.forceUpdate();
      }
    };
    r.__u++ || 32 & e.__u || r.setState({ __a: (r.__b = r.__v.__k[0]) }),
      n.then(s, s);
  }),
  (Mr.prototype.componentWillUnmount = function () {
    this.t = [];
  }),
  (Mr.prototype.render = function (n, e) {
    if (this.__b) {
      if (this.__v.__k) {
        var t = document.createElement("div"),
          r = this.__v.__k[0].__c;
        this.__v.__k[0] = al(this.__b, t, (r.__O = r.__P));
      }
      this.__b = null;
    }
    var i = e.__a && ri(se, null, n.fallback);
    return i && (i.__u &= -33), [ri(se, null, e.__a ? null : n.children), i];
  });
var wo = function (n, e, t) {
  if (
    (++t[1] === t[0] && n.o.delete(e),
    n.props.revealOrder && (n.props.revealOrder[0] !== "t" || !n.o.size))
  )
    for (t = n.u; t; ) {
      for (; t.length > 3; ) t.pop()();
      if (t[1] < t[0]) break;
      n.u = t = t[2];
    }
};
((Rn.prototype = new qe()).__a = function (n) {
  var e = this,
    t = dl(e.__v),
    r = e.o.get(n);
  return (
    r[0]++,
    function (i) {
      var o = function () {
        e.props.revealOrder ? (r.push(i), wo(e, n, r)) : i();
      };
      t ? t(o) : o();
    }
  );
}),
  (Rn.prototype.render = function (n) {
    (this.u = null), (this.o = new Map());
    var e = Jn(n.children);
    n.revealOrder && n.revealOrder[0] === "b" && e.reverse();
    for (var t = e.length; t--; ) this.o.set(e[t], (this.u = [1, 0, this.u]));
    return n.children;
  }),
  (Rn.prototype.componentDidUpdate = Rn.prototype.componentDidMount =
    function () {
      var n = this;
      this.o.forEach(function (e, t) {
        wo(n, t, e);
      });
    });
var Kc =
    (typeof Symbol < "u" && Symbol.for && Symbol.for("react.element")) || 60103,
  Gc =
    /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,
  Yc = /^on(Ani|Tra|Tou|BeforeInp|Compo)/,
  Xc = /[A-Z0-9]/g,
  Qc = typeof document < "u",
  Zc = function (n) {
    return (
      typeof Symbol < "u" && typeof Symbol() == "symbol"
        ? /fil|che|rad/
        : /fil|che|ra/
    ).test(n);
  };
(qe.prototype.isReactComponent = {}),
  [
    "componentWillMount",
    "componentWillReceiveProps",
    "componentWillUpdate",
  ].forEach(function (n) {
    Object.defineProperty(qe.prototype, n, {
      configurable: !0,
      get: function () {
        return this["UNSAFE_" + n];
      },
      set: function (e) {
        Object.defineProperty(this, n, {
          configurable: !0,
          writable: !0,
          value: e,
        });
      },
    });
  });
var So = A.event;
function ed() {}
function td() {
  return this.cancelBubble;
}
function nd() {
  return this.defaultPrevented;
}
A.event = function (n) {
  return (
    So && (n = So(n)),
    (n.persist = ed),
    (n.isPropagationStopped = td),
    (n.isDefaultPrevented = nd),
    (n.nativeEvent = n)
  );
};
var rd = {
    enumerable: !1,
    configurable: !0,
    get: function () {
      return this.class;
    },
  },
  Co = A.vnode;
A.vnode = function (n) {
  typeof n.type == "string" &&
    (function (e) {
      var t = e.props,
        r = e.type,
        i = {};
      for (var o in t) {
        var s = t[o];
        if (
          !(
            (o === "value" && "defaultValue" in t && s == null) ||
            (Qc && o === "children" && r === "noscript") ||
            o === "class" ||
            o === "className"
          )
        ) {
          var l = o.toLowerCase();
          o === "defaultValue" && "value" in t && t.value == null
            ? (o = "value")
            : o === "download" && s === !0
            ? (s = "")
            : l === "translate" && s === "no"
            ? (s = !1)
            : l === "ondoubleclick"
            ? (o = "ondblclick")
            : l !== "onchange" ||
              (r !== "input" && r !== "textarea") ||
              Zc(t.type)
            ? l === "onfocus"
              ? (o = "onfocusin")
              : l === "onblur"
              ? (o = "onfocusout")
              : Yc.test(o)
              ? (o = l)
              : r.indexOf("-") === -1 && Gc.test(o)
              ? (o = o.replace(Xc, "-$&").toLowerCase())
              : s === null && (s = void 0)
            : (l = o = "oninput"),
            l === "oninput" && i[(o = l)] && (o = "oninputCapture"),
            (i[o] = s);
        }
      }
      r == "select" &&
        i.multiple &&
        Array.isArray(i.value) &&
        (i.value = Jn(t.children).forEach(function (a) {
          a.props.selected = i.value.indexOf(a.props.value) != -1;
        })),
        r == "select" &&
          i.defaultValue != null &&
          (i.value = Jn(t.children).forEach(function (a) {
            a.props.selected = i.multiple
              ? i.defaultValue.indexOf(a.props.value) != -1
              : i.defaultValue == a.props.value;
          })),
        t.class && !t.className
          ? ((i.class = t.class), Object.defineProperty(i, "className", rd))
          : ((t.className && !t.class) || (t.class && t.className)) &&
            (i.class = i.className = t.className),
        (e.props = i);
    })(n),
    (n.$$typeof = Kc),
    Co && Co(n);
};
var Mo = A.__r;
A.__r = function (n) {
  Mo && Mo(n), n.__c;
};
var Oo = A.diffed;
A.diffed = function (n) {
  Oo && Oo(n);
  var e = n.props,
    t = n.__e;
  t != null &&
    n.type === "textarea" &&
    "value" in e &&
    e.value !== t.value &&
    (t.value = e.value == null ? "" : e.value);
};
const ul = Lc(null);
function C() {
  return jc(ul);
}
const id = 5,
  Pn = 6,
  zn = 10;
let od = (n, e, t, r) => (
    (n.events = n.events || {}),
    n.events[t + zn] ||
      (n.events[t + zn] = r((i) => {
        n.events[t].reduceRight((o, s) => (s(o), o), { shared: {}, ...i });
      })),
    (n.events[t] = n.events[t] || []),
    n.events[t].push(e),
    () => {
      let i = n.events[t],
        o = i.indexOf(e);
      i.splice(o, 1),
        i.length ||
          (delete n.events[t], n.events[t + zn](), delete n.events[t + zn]);
    }
  ),
  sd = 1e3,
  fl = (n, e) =>
    od(
      n,
      (r) => {
        let i = e(r);
        i && n.events[Pn].push(i);
      },
      id,
      (r) => {
        let i = n.listen;
        n.listen = (s) => (!n.lc && !n.active && (r(), (n.active = !0)), i(s));
        let o = n.off;
        return (
          (n.events[Pn] = []),
          (n.off = () => {
            setTimeout(() => {
              if (n.active && !n.lc) {
                n.active = !1;
                for (let s of n.events[Pn]) s();
                (n.events[Pn] = []), o();
              }
            }, sd);
          }),
          () => {
            (n.listen = i), (n.off = o);
          }
        );
      }
    ),
  ft = [],
  li = 0,
  O = (n) => {
    let e,
      t = [],
      r = {
        lc: 0,
        value: n,
        set(i) {
          (r.value = i), r.notify();
        },
        get() {
          return r.lc || r.listen(() => {})(), r.value;
        },
        notify(i) {
          e = t;
          let o = !ft.length;
          for (let s = 0; s < e.length; s++) ft.push(e[s], r.value, i);
          if (o) {
            li++;
            for (let s = 0; s < ft.length; s += 3) ft[s](ft[s + 1], ft[s + 2]);
            ft.length = 0;
          }
        },
        listen(i) {
          return (
            t === e && (t = t.slice()),
            (r.lc = t.push(i)),
            () => {
              t === e && (t = t.slice());
              let o = t.indexOf(i);
              ~o && (t.splice(o, 1), r.lc--, r.lc || r.off());
            }
          );
        },
        subscribe(i) {
          let o = r.listen(i);
          return i(r.value), o;
        },
        off() {},
      };
    return r;
  },
  ld = (n = {}) => {
    let e = O(n);
    return (
      (e.setKey = function (t, r) {
        typeof r > "u"
          ? t in e.value &&
            ((e.value = { ...e.value }), delete e.value[t], e.notify(t))
          : e.value[t] !== r &&
            ((e.value = { ...e.value, [t]: r }), e.notify(t));
      }),
      e
    );
  };
function ad(n) {
  let e = (t, ...r) => (
    e.cache[t] || (e.cache[t] = e.build(t, ...r)), e.cache[t]
  );
  return (
    (e.build = (t, ...r) => {
      let i = ld({ id: t });
      return (
        fl(i, () => {
          let o;
          return (
            n && (o = n(i, t, ...r)),
            () => {
              delete e.cache[t], o && o();
            }
          );
        }),
        i
      );
    }),
    (e.cache = {}),
    e
  );
}
function cd(n, e, t) {
  let r = new Set([...e, void 0]);
  return n.listen((i, o) => {
    r.has(o) && t(i, o);
  });
}
let Or = (n, e) => {
  Array.isArray(n) || (n = [n]);
  let t,
    r = [],
    i = () => {
      let s = n.map((l) => l.get());
      (t !== li || s.some((l, a) => l !== r[a])) &&
        ((t = li), (r = s), o.set(e(...s)));
    },
    o = O();
  return (
    fl(o, () => {
      let s = n.map((l) => l.listen(i, e));
      return (
        i(),
        () => {
          for (let l of s) l();
        }
      );
    }),
    o
  );
};
function Zt(n, e = {}) {
  let [, t] = w({});
  return (
    z(() => {
      let r,
        i,
        o,
        s = () => {
          r ||
            ((r = 1),
            (i = setTimeout(() => {
              (r = void 0), t({});
            })));
        };
      return (
        e.keys ? (o = cd(n, e.keys, s)) : (o = n.listen(s)),
        () => {
          o(), clearTimeout(i);
        }
      );
    }, [n, "" + e.keys]),
    n.get()
  );
}
function hl(n) {
  let e = "";
  for (const t in n)
    e != "" && (e += "&"), (e += t + "=" + encodeURIComponent(n[t]));
  return e;
}
function dd(n, e) {
  const t = hl(e);
  return n + "?" + t;
}
function M(n, e) {
  let t = b.get(n, "website");
  const r = e.split(".");
  for (const i of r) t = t[i];
  return t;
}
function No(n) {
  window.open(
    n,
    "_blank",
    "menubar=no,toolbar=no,location=no,scrollbars=yes,resizable=yes,width=600,height=600"
  );
}
function ud(n) {
  return M(n, "auth.type") === "hyvor";
}
function On(n) {
  return M(n, "auth.type") === "sso" && M(n, "auth.sso_type") === "stateless";
}
function fd(n) {
  return M(n, "auth.type") === "sso" && M(n, "auth.sso_type") === "openid";
}
class Re {
  static getKey(e) {
    return "ht_" + b.get(e, "websiteId") + "_token";
  }
  static getToken(e) {
    if (b.get(e, "website").id && On(e)) return b.get(e, "statelessSsoToken");
    try {
      return window.localStorage.getItem(this.getKey(e));
    } catch {
      return null;
    }
  }
  static saveToken(e, t) {
    window.localStorage.setItem(this.getKey(e), t);
  }
  static removeToken(e) {
    window.localStorage.removeItem(this.getKey(e));
  }
  static handleRequest(e, t) {
    if (t === "logout") {
      s({
        user: null,
        user_page_state: null,
        user_website_state: null,
        token: null,
      }),
        ud(e) && No("https://hyvor.com/account/logout");
      return;
    }
    const r = Math.ceil(Math.random() * 1e16),
      i = dd(pl(e, fd(e) ? "/auth/oidc" : "/auth/hyvor"), {
        action: t,
        nonce: r,
        origin: location.origin,
        pageId: b.get(e, "page").id,
      });
    function o(l) {
      const a = l.data;
      a.nonce === r && (window.removeEventListener("message", o), s(a));
    }
    function s(l) {
      b.set(e, "user", l.user),
        vl(e, l.user_page_state),
        wl(e, l.user_website_state),
        l.token ? Re.saveToken(e, l.token) : Re.removeToken(e);
    }
    window.addEventListener("message", o), No(i);
  }
  static login(e) {
    Re.handleRequest(e, "login");
  }
  static signup(e) {
    Re.handleRequest(e, "signup");
  }
  static logout(e) {
    Re.handleRequest(e, "logout");
  }
}
function k(n, e, t) {
  let r = b.get(n, "language").translations[e] || "";
  if (t) for (const [i, o] of Object.entries(t)) r = r.replace(i, o);
  return r;
}
function pl(n, e) {
  return b.get(n, "htDomain") + "/api/embed/v3/" + b.get(n, "websiteId") + e;
}
function hd(n, e) {
  return b.get(n, "htDomain") + "/api/console/v1/" + b.get(n, "websiteId") + e;
}
class D {
  static call(e) {
    let t =
      e.customUrl ||
      (e.isConsoleApi ? hd(e.context, e.endpoint) : pl(e.context, e.endpoint));
    e.method === "get" && e.data && (t += "?" + hl(e.data));
    const r = new XMLHttpRequest();
    if (
      ((r.onreadystatechange = function () {
        if (this.readyState === 4)
          if ((e.complete && e.complete(), this.status === 200)) {
            let o;
            try {
              o = JSON.parse(this.responseText);
            } catch {
              e.error && e.error(null);
            }
            e.success && e.success(o);
          } else {
            let o = null;
            try {
              o = JSON.parse(this.responseText).error;
              const s = o.match(/t:([a-zA-Z0-9_]+)(?:\:({.+}))?/);
              if (s) {
                const l = s[2] ? JSON.parse(s[2]) : null;
                o = k(e.context, s[1], l);
              }
            } catch {}
            e.error && e.error(o || "Unknown error");
          }
      }),
      r.open(e.method.toUpperCase(), t),
      e.data instanceof FormData ||
        r.setRequestHeader("Content-type", "application/json;charset=UTF-8"),
      !e.customUrl)
    ) {
      const o = Re.getToken(e.context);
      o && r.setRequestHeader("X-Embed-Token", o);
      const s = b.get(e.context, "socketId");
      s && r.setRequestHeader("X-Socket-ID", s);
    }
    let i;
    return (
      e.method !== "get" &&
        (i = e.data instanceof FormData ? e.data : JSON.stringify(e.data)),
      r.send(i),
      r
    );
  }
  static callPageApi(e) {
    const t = b.get(e.context, "page").id;
    return (e.endpoint = `/page/${t}` + e.endpoint), D.call(e);
  }
}
function Ii(n, e) {
  return n.id === e.id && n.type === e.type;
}
const bn = O([]);
function Di(n) {
  bn.set([...bn.get(), ...n.map((e) => e.id)]);
}
function pd(n) {
  bn.set(bn.get().filter((e) => e !== n.id));
}
function md(n) {
  return Zt(bn).indexOf(n.id) >= 0;
}
function gd(n, e) {
  const t = [],
    r = b.get(n, "lastOnlineAt"),
    i = b.get(n, "user");
  if (r && i) {
    for (const o of e)
      !o.is_hidden && !Ii(i, o.user) && o.created_at > r && t.push(o);
    Di(t);
  }
}
function bd() {
  const n = new URLSearchParams(window.location.search).get("ht-comment-id");
  return n ? Number(n) : null;
}
function xd(n) {
  const e = bd();
  b.set(n, "specificCommentId", e), e && zi(n, e);
}
function yd(n, e) {
  if (!b.get(n, "specificCommentId") || !e.parent_id) return;
  const t = b.get(n, "specificCommentRepliesList"),
    r = e.parent_id;
  let i = !1;
  for (const s of Object.values(t))
    if (s.indexOf(r) >= 0) {
      i = !0;
      break;
    }
  if (!i) return;
  const o = t[r] || [];
  (t[r] = [e.id, ...o]), b.set(n, "specificCommentRepliesList", t);
}
function Ai(n) {
  return document.getElementById("hyvor-talk-comments-" + n);
}
function Fe(n, e, t) {
  const r = Ai(n);
  if (!r) return;
  const i = new CustomEvent(e, { detail: t, cancelable: !0 });
  return r.dispatchEvent(i), i;
}
class kd {
  constructor() {
    G(this, "stores", {});
  }
  set(e) {
    this.stores[e.id] ? this.stores[e.id].set(e) : (this.stores[e.id] = O(e));
  }
  get(e) {
    return this.stores[e].get();
  }
  has(e) {
    return !!this.stores[e];
  }
  use(e) {
    return Zt(this.stores[e] || O(null));
  }
  all() {
    const e = {};
    for (const [t, r] of Object.entries(this.stores)) e[Number(t)] = r.get();
    return e;
  }
}
const Ce = new kd();
function Dt(n, e, t) {
  const r = b.get(n, "page");
  b.set(n, "page", { ...r, [e]: t });
}
function _d(n, e) {
  b.set(n, "page", e);
}
function ml(n) {
  const e = b.use("page");
  if (e.is_closed) return !0;
  const t = M(n, "comments_view.close_after_days");
  return (
    t > 0 &&
    Math.ceil(new Date().getTime() / 1e3) > e.created_at + t * 24 * 60 * 60
  );
}
function gl(n, e, t) {
  const r = b.get(n, "page");
  D.call({
    context: n,
    method: "patch",
    isConsoleApi: !0,
    endpoint: `/page/${r.id}`,
    data: { [e]: t },
  });
}
function vd(n, e) {
  gl(n, "is_closed", e), Dt(n, "is_closed", e);
}
function wd(n, e) {
  gl(n, "is_premoderation_on", e), Dt(n, "is_premoderation_on", e);
}
function Ri(n) {
  Dt(n, "comments_count", b.get(n, "page").comments_count + 1);
}
function Pi(n) {
  Dt(n, "comments_count", Math.max(b.get(n, "page").comments_count - 1, 0));
}
function bl({
  context: n,
  sort: e,
  isMore: t,
  parentCommentId: r = null,
  onSuccess: i,
}) {
  e || (e = b.get(n, "commentsSort"));
  const o = en(r),
    s = t ? (b.get(n, "commentsList")[o] || []).length : 0,
    l = { sort: e, offset: s };
  r && (l.parent_comment_id = r),
    t && (l.target_time = b.get(n, "commentsFirstLoadedAt")),
    D.callPageApi({
      context: n,
      method: "get",
      endpoint: "/comments",
      data: l,
      success: (a) => {
        if (
          (Ke(n, a.indexed),
          b.set(
            n,
            "commentsHasMoreIds",
            b.get(n, "commentsHasMoreIds").filter((c) => c !== o)
          ),
          t)
        ) {
          const c = b.get(n, "commentsList");
          for (const [f, h] of Object.entries(a.list)) {
            const p = c[f] || [];
            for (const m of h) p.indexOf(m) < 0 && p.push(m);
            c[f] = p;
          }
          b.set(n, "commentsList", c);
          const d = b.get(n, "commentsHasMoreIds");
          d.push(...a.has_more_ids), b.set(n, "commentsHasMoreIds", d);
        } else
          b.set(n, "commentsList", a.list),
            b.set(n, "commentsHasMoreIds", a.has_more_ids);
        i && i(a);
      },
    });
}
function Sd(
  n,
  {
    body: e,
    parentCommentId: t = null,
    guestName: r = null,
    guestEmail: i = null,
  },
  o,
  s
) {
  const l = { body: e };
  t && (l.parent_comment_id = t),
    r && (l.guest_name = r),
    i && (l.guest_email = i),
    D.callPageApi({
      context: n,
      method: "post",
      endpoint: "/comment",
      data: l,
      success: (a) => {
        if ((Ke(n, { [a.id]: a }), a.status !== "published")) Vd(n, a);
        else {
          const c = { ...b.get(n, "commentsList") },
            d = t ?? "PARENT",
            f = c[d] || [];
          (c[d] = [a.id, ...f]), b.set(n, "commentsList", c), Ri(n), yd(n, a);
        }
        o && o(a), Fe(n, "comment:published", a);
      },
      error: (a) => s && s(a),
    });
}
function Cd(n, e, t, r, i) {
  D.callPageApi({
    context: n,
    method: "post",
    endpoint: `/comment/${e}/edit`,
    data: { body: t },
    success: (o) => {
      o.is_hidden ||
        (Jt(n, o.id, "content", o.content),
        Jt(n, o.id, "content_html", o.content_html)),
        Ke(n, { [o.id]: o }),
        r && r(o),
        Fe(n, "comment:edited", o);
    },
    error: (o) => i && i(o),
  });
}
function Md(n, e) {
  yl(n, e),
    e.status === "published" && Pi(n),
    D.callPageApi({
      context: n,
      method: "post",
      endpoint: `/comment/${e.id}/delete`,
      success: (t) => {
        Fe(n, "comment:deleted", t);
      },
    });
}
function Od(n, e, t) {
  D.callPageApi({
    context: n,
    method: "get",
    endpoint: `/comment/${e}`,
    success: (r) => {
      Ke(n, { [r.id]: r }), t && t(r);
    },
  });
}
function en(n) {
  return n ?? "PARENT";
}
function xn(n) {
  return n.parent_id ?? "PARENT";
}
function fr(n, e) {
  Ke(n, { [e.id]: e });
}
function Ke(n, e) {
  for (const t of Object.values(e)) Ce.set(t);
  gd(n, Object.values(e));
}
function xl(n, e) {
  const t = {};
  e.forEach((r) => (t[r.id] = r)), Ke(n, t);
}
function hr(n, e) {
  return Ce.get(e);
}
function Jt(n, e, t, r) {
  let i = Ce.get(e);
  i && ((i = { ...i, [t]: r }), Ce.set(i));
}
function yl(n, e) {
  const r = b.get(n, "commentsList")[e.id] || [];
  if ((Ke(n, { [e.id]: Nd(e) }), !r.length)) {
    const i = { ...b.get(n, "commentsList") },
      o = e.parent_id ?? "PARENT",
      s = i[o] || [];
    (i[o] = s.filter((l) => l !== e.id)), b.set(n, "commentsList", i);
  }
  Ud(n, e.id);
}
function Nd(n) {
  return {
    id: n.id,
    is_hidden: !0,
    page_id: n.page_id,
    parent_id: n.parent_id,
    depth: n.depth,
    created_at: n.created_at,
  };
}
function kl(n, e, t = !1) {
  const r = b.get(n, "commentsList")[e] || [];
  let i = 0;
  return (
    r.forEach((o) => {
      i++, t && (i += kl(n, o, t));
    }),
    i
  );
}
function _l(n, e) {
  const t = b.get(n, "commentsList");
  for (const r of Object.values(t)) if (r.indexOf(e) >= 0) return !0;
  return !1;
}
function pr(n, e, t, r, i) {
  D.call({
    context: n,
    method: "patch",
    isConsoleApi: !0,
    endpoint: `/comment/${e}`,
    data: { [t]: r },
    success: () => {
      i && i();
    },
  });
}
function Eo(n, e, t) {
  pr(n, e.id, "status", t),
    yl(n, e),
    !e.is_hidden && e.status === "published" && Pi(n);
}
function Ed(n, e, t) {
  pr(n, e, "is_featured", t), Jt(n, e, "is_featured", t);
}
function Td(n, e, t) {
  pr(n, e, "is_loved", t), Jt(n, e, "is_loved", t);
}
function Id(n, e) {
  Ri(n), Di([e]), fr(n, e);
  const t = { ...b.get(n, "commentsList") },
    r = xn(e),
    i = t[r] || [];
  i.indexOf(e.id) >= 0 || ((t[r] = [e.id, ...i]), b.set(n, "commentsList", t));
}
function Dd(n, e) {
  const t = hr(n, e.id);
  ((!t.is_hidden && e.is_hidden) ||
    (!t.is_hidden &&
      t.status === "published" &&
      !e.is_hidden &&
      e.status !== "published")) &&
    Pi(n),
    ((t.is_hidden && !e.is_hidden) ||
      (!t.is_hidden &&
        t.status !== "published" &&
        !e.is_hidden &&
        e.status === "published")) &&
      Ri(n),
    fr(n, e);
}
function Ad(n) {
  const e = b.use("commentsBroadcasted");
  let t = 0;
  for (const r of e) xn(r) === n && t++;
  return t;
}
function Rd(n, e) {
  const t = b.get(n, "commentsBroadcasted"),
    r = t.filter((s) => xn(s) === e),
    i = r.map((s) => s.id),
    o = { ...b.get(n, "commentsList") };
  (o[e] = [...i, ...(o[e] || [])]),
    b.set(n, "commentsList", o),
    b.set(
      n,
      "commentsBroadcasted",
      t.filter((s) => xn(s) !== e)
    ),
    Di(r);
}
function Pd(n, e) {
  const t = b.get(n, "commentsBroadcasted").find((o) => o.id === e);
  if (!t) return !1;
  const r = { ...b.get(n, "commentsList") },
    i = xn(t);
  return (
    (r[i] = [e, ...(r[i] || [])]),
    b.set(n, "commentsList", r),
    b.set(
      n,
      "commentsBroadcasted",
      b.get(n, "commentsBroadcasted").filter((o) => o.id !== e)
    ),
    !0
  );
}
function zd(n, e) {
  const t = _l(n, e),
    r = Pd(n, e);
  return !t && !r ? !1 : (zi(n, e), !0);
}
function zi(n, e) {
  b.set(n, "flashingCommentId", e),
    setTimeout(() => {
      b.set(n, "flashingCommentId", null);
    }, 3e3);
}
function Bd(n) {
  var t;
  const e =
    (t = Ai(n).shadowRoot) == null
      ? void 0
      : t.querySelector(".comment.flashing");
  e && e.scrollIntoView(!0);
}
function Ld(n, e) {
  const t = Ce.all(),
    [r, i] = n.split("_");
  return Object.values(t)
    .filter((o) =>
      e
        ? "user" in o && o.user.id === Number(i) && o.user.type === r
        : "blocked_user_htid" in o && o.blocked_user_htid === n
    )
    .map((o) => o.id);
}
function Fd(n, e) {
  for (const t of e) Ce.set(t);
  b.set(
    n,
    "userHiddenComments",
    e.map((t) => ({ id: t.id, parent_id: t.parent_id }))
  );
}
function $d(n, e) {
  const t = b.use("userHiddenComments"),
    r = [];
  for (const i of t)
    en(i.parent_id) === n && e.indexOf(i.id) === -1 && r.push(i.id);
  return r;
}
function Vd(n, e) {
  b.set(n, "userHiddenComments", [
    { id: e.id, parent_id: e.parent_id },
    ...b.get(n, "userHiddenComments"),
  ]);
}
function Ud(n, e) {
  b.set(
    n,
    "userHiddenComments",
    b.get(n, "userHiddenComments").filter((t) => t.id !== e)
  );
}
const jd = {
  htDomain: () => O(null),
  components: () => O({}),
  colors: () => O("light"),
  palette: () => O({}),
  websiteId: () => O(0),
  website: () => O({}),
  page: () => O({}),
  language: () => O({}),
  notifsCount: () => O(0),
  reactions: ({ page: n }) => Or(n, (e) => e.reactions),
  ratings: ({ page: n }) => Or(n, (e) => e.ratings),
  commentsCount: ({ page: n }) => Or(n, (e) => e.comments_count),
  commentsView: () => O("comments"),
  commentsSort: () => O("newest"),
  commentsFirstLoadedAt: () => O(0),
  commentsList: () => O({ PARENT: [] }),
  commentsHasMoreIds: () => O([]),
  commentsBroadcasted: () => O([]),
  specificCommentId: () => O(null),
  specificCommentRepliesList: () => O({ PARENT: [] }),
  specificCommentHasMoreIds: () => O([]),
  focusedCommentId: () => O(null),
  flashingCommentId: () => O(null),
  badges: () => O([]),
  pageBadges: () => O({}),
  plans: () => O([]),
  typing: () => O({ PARENT: [] }),
  user: () => O(null),
  userReaction: () => O(null),
  userRating: () => O(null),
  userVotes: () => O({}),
  userFlags: () => O([]),
  userBlocked: () => O([]),
  userIsMod: () => O(!1),
  userIsShadowBanned: () => O(!1),
  userBan: () => O(null),
  userMembershipSubscription: () => O(null),
  userHiddenComments: () => O([]),
  lastOnlineAt: () => O(null),
  statelessSsoToken: () => O(null),
  socketId: () => O(""),
  profilePopupUser: () => O(null),
  modalImageUrl: () => O(null),
  license: () => O({}),
  hooks: () => O({}),
};
function Hd() {
  const n = {};
  function e(s) {
    if (!n[s]) {
      const l = {};
      for (const [a, c] of Object.entries(jd)) l[a] = c(l);
      n[s] = l;
    }
    return n[s];
  }
  function t(s, l) {
    return e(s)[l];
  }
  function r(s) {
    const l = C(),
      a = t(l, s);
    return Zt(a);
  }
  function i(s, l, a) {
    t(s, l).set(a);
  }
  function o(s, l) {
    return t(s, l).get();
  }
  return { getStore: t, use: r, set: i, get: o };
}
const Oe = Hd(),
  b = Oe;
function vl(n, e) {
  Oe.set(n, "lastOnlineAt", e ? e.last_online : null),
    Oe.set(n, "userReaction", e ? e.reaction : null),
    Oe.set(n, "userRating", e ? e.rating : null),
    Oe.set(n, "userVotes", e ? e.votes : {}),
    Oe.set(n, "userFlags", e ? e.flags : []),
    Fd(n, e ? e.hidden_comments : []);
}
function wl(n, e) {
  Oe.set(n, "notifsCount", e ? e.notifs_count : 0),
    Oe.set(n, "userIsMod", e ? e.is_mod : !1),
    Oe.set(n, "userIsShadowBanned", e ? e.is_shadow_banned : !1),
    Oe.set(n, "userBan", e ? e.ban : null),
    Oe.set(
      n,
      "userMembershipSubscription",
      e ? e.membership_subscription : null
    );
}
function qd(n, e) {
  return {
    reload: e,
    page: () => b.get(n, "page"),
    auth: {
      user: () => b.get(n, "user"),
      logout: () => {
        Re.logout(n);
      },
    },
  };
}
const Wd = (function () {
    const e = typeof document < "u" && document.createElement("link").relList;
    return e && e.supports && e.supports("modulepreload")
      ? "modulepreload"
      : "preload";
  })(),
  Jd = function (n) {
    return "/" + n;
  },
  To = {},
  Bi = function (e, t, r) {
    let i = Promise.resolve();
    if (t && t.length > 0) {
      document.getElementsByTagName("link");
      const o = document.querySelector("meta[property=csp-nonce]"),
        s =
          (o == null ? void 0 : o.nonce) ||
          (o == null ? void 0 : o.getAttribute("nonce"));
      i = Promise.all(
        t.map((l) => {
          if (((l = Jd(l)), l in To)) return;
          To[l] = !0;
          const a = l.endsWith(".css"),
            c = a ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${l}"]${c}`)) return;
          const d = document.createElement("link");
          if (
            ((d.rel = a ? "stylesheet" : Wd),
            a || ((d.as = "script"), (d.crossOrigin = "")),
            (d.href = l),
            s && d.setAttribute("nonce", s),
            document.head.appendChild(d),
            a)
          )
            return new Promise((f, h) => {
              d.addEventListener("load", f),
                d.addEventListener("error", () =>
                  h(new Error(`Unable to preload CSS for ${l}`))
                );
            });
        })
      );
    }
    return i
      .then(() => e())
      .catch((o) => {
        const s = new Event("vite:preloadError", { cancelable: !0 });
        if (((s.payload = o), window.dispatchEvent(s), !s.defaultPrevented))
          throw o;
      });
  },
  Sl = (n, e, t) => {
    const r = { ...b.get(n, "userVotes") };
    r[e] && !t ? delete r[e] : t && (r[e] = t), b.set(n, "userVotes", r);
  },
  Kd = (n, e, t) => {
    D.callPageApi({
      context: n,
      method: "post",
      endpoint: `/comment/${e}/vote`,
      data: { type: t },
      success: () => {
        Fe(n, "comment:voted", { comment: hr(n, e), vote: t });
      },
    });
  },
  Cl = 15,
  Io = { PARENT: 0 };
function Gd(n, e) {
  if (!e) return;
  const t = en(e),
    r = Io[t],
    i = Math.ceil(new Date().getTime() / 1e3);
  (!r || r < i - (Cl - 3)) && (Ml(n, e, !0), (Io[t] = i));
}
function Do(n, e) {
  Ml(n, e, !1);
}
function Yd(n, e) {
  const t = en(e.comment_id),
    r = b.get(n, "typing"),
    i = r[t] || [];
  if (e.status) {
    const o = i.find((s) => s.socket_id === e.socket_id) || {
      socket_id: e.socket_id,
    };
    (o.at = e.at),
      (o.user = e.user),
      (r[t] = [...i, o]),
      setTimeout(() => {
        Xd(n, e.comment_id, e.socket_id);
      }, Cl * 1e3);
  } else r[t] = i.filter((o) => o.socket_id !== e.socket_id);
  b.set(n, "typing", r);
}
function Xd(n, e, t) {
  const r = b.get(n, "typing"),
    i = en(e);
  (r[i] = (r[i] || []).filter((o) => o.socket_id !== t)), b.set(n, "typing", r);
}
function Ml(n, e, t) {
  D.callPageApi({
    context: n,
    method: "post",
    endpoint: "/online/typing",
    data: { comment_id: e, status: t },
  });
}
const Ol = O({}),
  $t = new Map(),
  Nr = new Map();
function Ao(n, e, t) {
  $t.has(n) || $t.set(n, []);
  const r = $t.get(n) || [];
  $t.set(n, [...r, { id: e, type: t }]), Nl(n);
}
function Qd(n) {
  const e = $t.get(n);
  if (!e) return;
  e.length > 100 && Nl(n);
  const t = e.slice(0, 100);
  t.length !== 0 &&
    ($t.set(
      n,
      e.filter((r) => !t.includes(r))
    ),
    D.callPageApi({
      context: n,
      method: "post",
      endpoint: "/comments/ids",
      data: { ids: t.map((r) => r.id) },
      success: (r) => {
        t.forEach(({ id: i, type: o }) => {
          const s = r.find((l) => l.id === i);
          s && (o === "create" ? Id(n, s) : o === "update" && Dd(n, s));
        });
      },
    }));
}
function Nl(n) {
  Nr.has(n) && clearTimeout(Nr.get(n)),
    Nr.set(
      n,
      setTimeout(() => {
        Qd(n);
      }, 5e3)
    );
}
const El = {};
function Zd(n) {
  return El[n];
}
class eu {
  constructor(e) {
    G(this, "context");
    G(this, "pageChannel");
    G(this, "userChannel");
    G(this, "client", null);
    (this.context = e),
      M(this.context, "realtime.on") &&
        (Bi(() => import("https://talk.hyvor.com/embed/pusher.js").then((t) => t.p), []).then((t) => {
          const r = Ol.get().services.pusher;
          (this.client = new t.default(r.app_key, {
            wsHost: r.host,
            wsPort: r.port,
            forceTLS: !1,
            disableStats: !0,
            enabledTransports: ["ws", "wss"],
          })),
            this.client.connection.bind("connected", () => {
              var i;
              b.set(
                this.context,
                "socketId",
                ((i = this.client) == null ? void 0 : i.connection.socket_id) ||
                  ""
              );
            }),
            (this.pageChannel = this.client.subscribe(
              "page." + b.get(this.context, "page").id
            )),
            b.getStore(e, "user").subscribe((i) => {
              this.setUserChannel(i);
            }),
            this.subscribePageEvent("online_count", (i) =>
              Dt(this.context, "online_count", i.count)
            ),
            this.subscribePageEvent("comment.created", (i) =>
              Ao(this.context, i.id, "create")
            ),
            this.subscribePageEvent("comment.updated", (i) =>
              Ao(this.context, i.id, "update")
            ),
            this.subscribePageEvent("typing", (i) => Yd(this.context, i)),
            this.subscribePageEvent("page.updated", (i) => {
              _d(this.context, i);
            });
        }),
        (El[e] = this));
  }
  setUserChannel(e) {
    this.client &&
      (this.userChannel && this.client.unsubscribe(this.userChannel.name),
      e &&
        ((this.userChannel = this.client.subscribe(`user.${e.type}.${e.id}`)),
        this.subscribeUserEvent(
          "voted",
          (t) =>
            t.page_id === b.get(this.context, "page").id &&
            Sl(this.context, t.comment_id, t.type)
        ),
        this.subscribeUserEvent(
          "notification",
          (t) =>
            t.website_id === b.get(this.context, "websiteId") &&
            b.set(
              this.context,
              "notifsCount",
              b.get(this.context, "notifsCount") + 1
            )
        ),
        this.subscribeUserEvent(
          "reacted",
          (t) =>
            t.page_id === b.get(this.context, "page").id &&
            b.set(this.context, "userReaction", t.reaction)
        )));
  }
  subscribeUserEvent(e, t) {
    this.userChannel && this.userChannel.bind(e, t);
  }
  subscribePageEvent(e, t) {
    this.pageChannel && this.pageChannel.bind(e, t);
  }
  disconnect() {
    var e;
    (e = this.client) == null || e.disconnect();
  }
}
class tu {
  constructor() {
    G(this, "ui", {});
    G(this, "light_palette", {});
    G(this, "dark_palette", {});
    G(this, "stylesheet", null);
    G(this, "current", { mode: "light" });
  }
  setFromConfig(e, t) {
    (this.ui = e.ui),
      (this.light_palette = e.light_palette),
      (this.dark_palette = e.dark_palette),
      t !== "os" && t !== "light" && t !== "dark" && (t = e.ui.color_theme),
      this.setStyles(t);
  }
  setStyles(e) {
    let t;
    window.hyvorTalkStyles
      ? (t = window.hyvorTalkStyles)
      : ((t = this), (window.hyvorTalkStyles = t)),
      t.stylesheet && document.head.removeChild(t.stylesheet);
    let r = e || "light";
    r === "os" &&
      (r =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");
    const i = r === "dark" ? t.dark_palette : t.light_palette,
      o = document.createElement("style");
    (o.textContent = `:root {
    --ht-color-text: ${i.text};
    --ht-color-accent: ${i.accent};
    --ht-color-accent-text: ${i.accent_text};
    --ht-color-box: ${i.box};
    --ht-color-box-text: ${i.box_text};
    --ht-color-box-text-light: ${i.box_text_light};
	--ht-color-input: ${i.input};

    /* accent variations */
    --ht-color-accent-35: color-mix(in srgb, var(--ht-color-accent) 35%, transparent);
    --ht-color-accent-15: color-mix(in srgb, var(--ht-color-accent) 15%, transparent);
    --ht-color-accent-5: color-mix(in srgb, var(--ht-color-accent) 5%, transparent);

    --ht-box-shadow: ${t.ui.box_shadow};
    --ht-box-radius: ${t.ui.box_radius};
    --ht-box-border: ${t.ui.box_border_size} solid ${t.ui.box_border_color};
    --ht-button-radius: ${t.ui.button_radius};

    --ht-color-danger: #ab2525;
    --ht-color-success: #5d995d;
    --ht-color-info: #5875b9;
    --ht-color-warning: #8b5b04;
}`),
      document.head.append(o),
      (t.stylesheet = o),
      (this.current = { mode: r });
  }
}
const Ro = new tu();
function nu({ size: n }) {
  const e = { small: 16, medium: 24, large: 30 }[n];
  return u("span", {
    class: "loader-spinner",
    style: {
      width: e,
      height: e,
      borderWidth: { small: 2, medium: 3, large: 3 }[n],
    },
  });
}
const Z = { //all the emojis and boosts stars svg icons
  star: () =>
    u("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      children: u("path", {
        d: "M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z",
      }),
    }),
  heart: () =>
    u("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      children: u("path", {
        d: "M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z",
      }),
    }),
  caret: () =>
    u("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 105.83 105.83",
      children: [
        u("path", {
          d: "M1.743 29.457a5.82 5.82 0 0 1 8.217-.676l46.446 39.381a5.82 5.82 0 1 1-7.541 8.894L2.42 37.674a5.82 5.82 0 0 1-.676-8.217z",
          paintOrder: "stroke fill markers",
        }),
        u("path", {
          d: "M104.09 29.456a5.82 5.82 0 0 0-8.217-.676L49.428 68.16a5.82 5.82 0 1 0 7.541 8.894l46.445-39.381a5.82 5.82 0 0 0 .676-8.217z",
          paintOrder: "stroke fill markers",
        }),
      ],
    }),
  thumbsUp: () =>
    u("img", {
    src: "assets/images/icons/boost-up.png",
    width: 15,
    height: 15,
    alt: "Boost",
    style: {
      filter: "grayscale(100%)",
    },
    }),
  thumbsDown: () =>
    u("img", {
    src: "assets/images/icons/bomb.png",
    width: 15,
    height: 15,
    alt: "Bomb",
    style: {
      filter: "grayscale(100%)",
    },
    }),
  thumbsUpActive: () =>
    u("img", {
    src: "assets/images/icons/boost-up.png",
    width: 15,
    height: 15,
    alt: "Boost"
    }),
  thumbsDownActive: () =>
    u("img", {
    src: "assets/images/icons/bomb.png",
    width: 15,
    height: 15,
    alt: "Bomb"
    }),
  star: () =>
    u("img", {
    src: "assets/images/icons/star.png",
    width: 15,
    height: 15,
    alt: "Star"
    }),
  blob: () =>
    u("img", {
    src: "assets/images/icons/blob.png",
    width: 30,
    height: 30,
    alt: "Blob"
    }),
  heli: () =>
    u("img", {
    src: "assets/images/icons/helicopter.png",
    width: 30,
    height: 30,
    alt: "Helicopter"
    }),
  truck: () =>
    u("img", {
    src: "assets/images/icons/truck.png",
    width: 30,
    height: 30,
    alt: "Truck"
    }),
  balloon: () =>
    u("img", {
    src: "assets/images/icons/balloon.png",
    width: 30,
    height: 30,
    alt: "Balloon"
    }),
  teleport: () =>
    u("img", {
    src: "assets/images/icons/teleport.png",
    width: 30,
    height: 30,
    alt: "Teleport"
    }),
  link: () =>
    u("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      children: u("path", {
        fillRule: "evenodd",
        d: "M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z",
      }),
    }),
  bold: () =>
    u("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      children: u("path", {
        fillRule: "evenodd",
        d: "M4 2a1 1 0 00-1 1v10a1 1 0 001 1h5.5a3.5 3.5 0 001.852-6.47A3.5 3.5 0 008.5 2H4zm4.5 5a1.5 1.5 0 100-3H5v3h3.5zM5 9v3h4.5a1.5 1.5 0 000-3H5z",
      }),
    }),
  italic: () =>
    u("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      children: u("path", {
        fillRule: "evenodd",
        d: "M6 2.75A.75.75 0 016.75 2h6.5a.75.75 0 010 1.5h-2.505l-3.858 9H9.25a.75.75 0 010 1.5h-6.5a.75.75 0 010-1.5h2.505l3.858-9H6.75A.75.75 0 016 2.75z",
      }),
    }),
  quote: () =>
    u("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      children: u("g", {
        children: [
          u("path", {
            d: "m7.3792 5.8233q0.38363 2.0672-0.94531 4.5398-1.3258 2.4896-3.5444 4.0406l-0.9688-1.0647q0.7485-0.59463 1.3828-1.2382 0.6512-0.64668 1.1015-1.4314 0.46097-0.82171 0.66149-1.6301 0.22061-0.79463 0.10723-1.8778l-0.94887 0.17609q-1.7283 0.32074-2.754-0.29517-1.0257-0.61591-1.2804-1.9884-0.20125-1.0844 0.48558-2.1058 0.68369-1.0383 1.9206-1.2679 1.8977-0.35218 3.1226 0.77013 1.2387 1.1022 1.66 3.3727z",
          }),
          u("path", {
            d: "m15.769 5.8233q0.38363 2.0672-0.94531 4.5398-1.3258 2.4896-3.5444 4.0406l-0.9688-1.0647q0.7485-0.59463 1.3828-1.2382 0.6512-0.64668 1.1015-1.4314 0.46097-0.82171 0.66149-1.6301 0.22061-0.79463 0.10723-1.8778l-0.94887 0.17609q-1.7283 0.32074-2.754-0.29517-1.0257-0.61591-1.2804-1.9884-0.20125-1.0844 0.48558-2.1058 0.68369-1.0383 1.9206-1.2679 1.8977-0.35218 3.1226 0.77013 1.2387 1.1022 1.66 3.3727z",
          }),
        ],
      }),
    }),
  emoji: () =>
    u("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      children: u("path", {
        fillRule: "evenodd",
        d: "M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM5 8a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zM5.32 9.636a.75.75 0 011.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 111.222.87l-.614-.431c.614.43.614.431.613.431v.001l-.001.002-.002.003-.005.007-.014.019a1.984 1.984 0 01-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.32 3.32 0 01-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 01.183-1.044h.001z",
      }),
    }),
  image: () =>
    u("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      children: u("path", {
        fillRule: "evenodd",
        d: "M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h.94a.76.76 0 01.03-.03l6.077-6.078a1.75 1.75 0 012.412-.06L14.5 10.31V2.75a.25.25 0 00-.25-.25H1.75zm12.5 11H4.81l5.048-5.047a.25.25 0 01.344-.009l4.298 3.889v.917a.25.25 0 01-.25.25zm1.75-.25V2.75A1.75 1.75 0 0014.25 1H1.75A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25zM5.5 6a.5.5 0 11-1 0 .5.5 0 011 0zM7 6a2 2 0 11-4 0 2 2 0 014 0z",
      }),
    }),
  gif: () =>
    u("svg", {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        u("path", {
          d: "m1.1426 1c-0.63314 0-1.1426 0.446-1.1426 1v12c0 0.554 0.50942 1 1.1426 1h13.715c0.63314 0 1.1426-0.446 1.1426-1v-12c0-0.554-0.50942-1-1.1426-1h-13.715zm0.64258 1.3125h12.43c0.15829 0 0.28516 0.1115 0.28516 0.25v10.875c0 0.1385-0.12687 0.25-0.28516 0.25h-12.43c-0.15829 0-0.28516-0.1115-0.28516-0.25v-10.875c0-0.1385 0.12687-0.25 0.28516-0.25z",
        }),
        u("path", {
          d: "m5.0742 5.3145c-0.48419 0-0.90166 0.084406-1.2441 0.26172-0.43632 0.22436-0.77418 0.55423-1.002 0.97656-0.2268 0.42052-0.33984 0.90137-0.33984 1.4316 0 0.4898 0.10137 0.94769 0.30273 1.3691 0.20408 0.42477 0.51524 0.75957 0.92188 0.99023 0.4066 0.22827 0.88168 0.3418 1.4141 0.3418 0.42164 0 0.83853-0.08081 1.2461-0.23828 0.40542-0.15804 0.72429-0.34104 0.95312-0.5625l0.050781-0.050781v-2.1797h-2.457v1.1602h0.16992 0.95508v0.34961c-0.12229 0.086475-0.25678 0.16785-0.42578 0.23438v-0.0019531c-0.1879 0.072736-0.37093 0.10938-0.55469 0.10938-0.37662 0-0.65663-0.12152-0.88281-0.375-0.21941-0.24778-0.3418-0.63541-0.3418-1.1875-1e-7 -0.50772 0.1203-0.86245 0.33398-1.0938v-0.0019532c0.22153-0.23596 0.50827-0.35352 0.90039-0.35352 0.25521 0 0.45028 0.060755 0.60547 0.17578l0.0019531 0.0019531c0.16008 0.1154 0.26478 0.26557 0.32422 0.47266l0.041016 0.14844 1.3008-0.24219-0.037109-0.17188c-0.10469-0.4806-0.34965-0.87232-0.72266-1.1484-0.37711-0.28285-0.88672-0.41602-1.5137-0.41602zm2.8379 0.083984v5.2031h0.16992 1.1523v-5.2031h-1.3223zm1.9258 0v5.2031h0.16992 1.1523v-2.0664h2.0293v-1.1621h-2.0293v-0.8125h2.3516v-1.1621h-3.6738z",
        }),
      ],
    }),
  bell: () =>
    u("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      children: u("path", {
        d: "M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z",
      }),
    }),
  search: () =>
    u("svg", {
      viewBox: "0 0 33.867 33.867",
      xmlns: "http://www.w3.org/2000/svg",
      children: u("g", {
        transform: "translate(0 -244.08)",
        children: u("path", {
          d: "m21.354 244.61a11.536 11.536 0 0 0-11.536 11.536 11.536 11.536 0 0 0 2.0382 6.5449l-10.553 11.201c-0.45492 0.48287-0.43212 1.2376 0.05055 1.6928l1.5971 1.5064c0.48267 0.45512 1.2372 0.43299 1.6921-0.0498l10.518-11.164a11.536 11.536 0 0 0 6.1928 1.8057 11.536 11.536 0 0 0 11.536-11.537 11.536 11.536 0 0 0-11.536-11.536zm-0.0035 4.0508a7.4854 7.4854 0 0 1 0.0035 0 7.4854 7.4854 0 0 1 7.4855 7.4852 7.4854 7.4854 0 0 1-7.4855 7.4855 7.4854 7.4854 0 0 1-7.4852-7.4855 7.4854 7.4854 0 0 1 7.4818-7.4852z",
          style: { paintOrder: "stroke fill markers" },
        }),
      }),
    }),
  flag: () =>
    u("img", {
    src: "assets/images/icons/checkpoint.png",
    width: 15,
    height: 15,
    alt: "Flag",
    style: {
      filter: "grayscale(100%)",
    },
    }),
  mod: () =>
    u("svg", {
      viewBox: "0 0 33.867 33.867",
      xmlns: "http://www.w3.org/2000/svg",
      children: u("g", {
        transform: "translate(0 -164.71)",
        children: u("g", {
          children: u("path", {
            d: "m16.933 165.76c-0.1797 0-0.13703 0.0137-0.17283 0.0218-0.0358 8e-3 -0.07591 0.0185-0.12371 0.0309-0.09561 0.0247-0.22348 0.0597-0.38205 0.10371-0.31715 0.088-0.75679 0.21269-1.2862 0.36568-1.0589 0.30596-2.4732 0.72157-3.9552 1.1607-2.9639 0.87828-6.1868 1.8493-7.3845 2.2359l-0.61856 0.20012c-0.23069 0.0743-0.38718 0.28887-0.38751 0.53124v1.0133c0 0.6171 0.090013 1.9563 0.20012 3.0746 1.1681 11.864 5.4411 19.527 12.791 22.536 0.06697 0.0275 0.13865 0.0417 0.21104 0.0418h-0.10916l0.98424 0.40206c0.13062 0.0541 0.27688 0.0567 0.40934 7e-3l0.79321-0.30018c2.2647-0.85244 4.1433-2.0861 5.9491-3.9024 3.3688-3.3885 5.5235-8.2832 6.6695-14.978 0.28941-1.6907 0.71823-5.7798 0.72044-7.0243l0.0019-0.86962c-3.31e-4 -0.24238-0.15682-0.45691-0.38751-0.53125l-0.61856-0.20011c-1.1977-0.38662-4.4207-1.3576-7.3845-2.2359-1.4819-0.43914-2.8962-0.85474-3.9551-1.1607-0.52946-0.15298-0.97091-0.27761-1.2881-0.36568-0.15858-0.0441-0.28462-0.079-0.38023-0.1037-0.0478-0.0123-0.08791-0.0228-0.12371-0.0309-0.0358-8e-3 0.0069-0.0218-0.17283-0.0218z",
          }),
        }),
      }),
    }),
  reply: () =>
    u("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16",
      children: u("path", {
        d: "M5.921 11.9 1.353 8.62a.719.719 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z",
      }),
    }),
};
function ue({ wrapperProps: n = {}, name: e }) {
  return u("span", {
    style: { verticalAlign: "middle" },
    className: "icon " + e + (n.class ? " " + n.class : ""),
    ...n,
    children: u(Tl, { name: "icon." + e }),
  });
}
const ru = {
  loader: nu,
  "icon.star": Z.star,
  "icon.heart": Z.heart,
  "icon.caret": Z.caret,
  "icon.thumbsUp": Z.thumbsUp,
  "icon.thumbsDown": Z.thumbsDown,
  "icon.thumbsUpActive": Z.thumbsUpActive,
  "icon.thumbsDownActive": Z.thumbsDownActive,
  "icon.link": Z.link,
  "icon.bold": Z.bold,
  "icon.italic": Z.italic,
  "icon.quote": Z.quote,
  "icon.emoji": Z.emoji,
  "icon.image": Z.image,
  "icon.gif": Z.gif,
  "icon.bell": Z.bell,
  "icon.search": Z.search,
  "icon.flag": Z.flag,
  "icon.mod": Z.mod,
  "icon.reply": Z.reply,
  "icon.heli": Z.heli,
  "icon.truck": Z.truck,
  "icon.blob": Z.blob,
  "icon.balloon": Z.balloon,
  "icon.teleport": Z.teleport,
  
};
function Tl(n) {
  const e = C(),
    { name: t } = n,
    r = b.get(e, "components")[t],
    i = ru[t],
    o = Object.keys(n)
      .filter((s) => s !== "name")
      .reduce((s, l) => ((s[l] = n[l]), s), {});
  return r ? u(r, { ...o }) : u(i, { ...o });
}
function W({ padding: n, size: e = "medium" }) {
  return u("div", {
    className: "loader-wrap",
    part: "loader-wrap",
    style: { padding: n },
    children: u(Tl, { name: "loader", size: e }),
  });
}
const iu = (n, e) => {
  const t = b.get(n, "userReaction");
  b.set(n, "userReaction", t === e ? null : e);
  const r = {};
  t && (r[t] = -1),
    e !== t && (r[e] = 1),
    ou(n, r),
    D.callPageApi({
      context: n,
      method: "post",
      endpoint: "/react",
      data: { type: e },
      success: () => {
        e !== t && Fe(n, "reaction", { type: e });
      },
    });
};
function ou(n, e) {
  const t = b.get(n, "reactions");
  for (const [r, i] of Object.entries(e)) t[r] += i;
  Dt(n, "reactions", t);
}
function su(n, e = 1) {
  const t = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "m" },
      { value: 1e9, symbol: "b" },
      { value: 1e12, symbol: "t" },
      { value: 1e15, symbol: "p" },
      { value: 1e18, symbol: "e" },
    ],
    r = /\.0+$|(\.[0-9]*[1-9])0+$/,
    i = t
      .slice()
      .reverse()
      .find(function (o) {
        return n >= o.value;
      });
  return i ? (n / i.value).toFixed(e).replace(r, "$1") + i.symbol : "0";
}
function Li(n, e, t = !1) {
  let r = e.toString();
  switch ((t && (r = su(e)), b.get(n, "language").code)) {
    case "fa":
      const o = [
        "&#1776;",
        "&#1777;",
        "&#1778;",
        "&#1779;",
        "&#1780;",
        "&#1781;",
        "&#1782;",
        "&#1783;",
        "&#1784;",
        "&#1785;",
      ];
      return r.replace(/\d/g, function (s) {
        return o[s];
      });
  }
  return r;
}
function Il({ number: n }) {
  const e = C(),
    t = Li(e, n);
  return u("span", { dangerouslySetInnerHTML: { __html: t } });
}
function lu({
  index: n,
  hasReacted: e,
  userReaction: t,
  count: r,
  reaction: i,
  onClick: o,
  displayType: s,
  onKeyDown: l,
}) {
  const a = C(),
    c =
      i.image_url || `${b.get(a, "htDomain")}/res/reactions/` + i.type + ".svg";
  return u("button", {
    className: "reaction" + (e ? " reacted" : ""),
    onClick: () => o(i.type),
    onKeyDown: (d) => l(d, i.type),
    "aria-label": i.text,
    "aria-pressed": e,
    tabIndex: e || (t === null && n === 0) ? 0 : -1,
    children: [
      u("span", {
        class: "reaction-top",
        children: [
          (s === "image" || s === "both") &&
            u("img", { src: c, alt: i.text || i.type }),
          u("span", {
            className: "reaction-number",
            children: u(Il, { number: r }),
          }),
        ],
      }),
      (s === "text" || s === "both") &&
        u("span", { className: "reaction-text", children: i.text }),
    ],
  });
}
function au() {
  const n = b.use("reactions"),
    e = b.use("userReaction"),
    t = ["superb", "love", "wow", "sad", "laugh", "angry"],
    r = C();
  function i(o) {
    var s, l;
    if (o.code === "ArrowRight" || o.code === "ArrowDown") {
      const a = o.target.nextElementSibling;
      if (a) a.focus();
      else {
        const c =
          (s = o.target.parentElement) == null ? void 0 : s.firstElementChild;
        c && c.focus();
      }
    } else if (o.code === "ArrowLeft" || o.code === "ArrowUp") {
      const a = o.target.previousElementSibling;
      if (a) a.focus();
      else {
        const c =
          (l = o.target.parentElement) == null ? void 0 : l.lastElementChild;
        c && c.focus();
      }
    }
  }
  return u("div", {
    className: "reactions-wrap",
    part: "reactions-wrap",
    role: "group",
    "aria-labelledby": "reactions-title-" + r,
    children: [
      u("div", {
        id: "reactions-title-" + r,
        className: "reactions-title",
        part: "reactions-title",
        children: M(r, "text.reactions") || k(r, "reactions_text"),
      }),
      u("div", {
        class: "reactions",
        part: "reactions",
        children: t.map((o, s) => {
          const l = M(r, "reactions.configs").find((a) => a.type === o);
          return (
            l.is_shown &&
            u(
              lu,
              {
                index: s,
                hasReacted: e === o,
                userReaction: e,
                reaction: l,
                count: n[o],
                onClick: (a) => iu(r, a),
                onKeyDown: i,
                displayType: M(r, "reactions.display_type"),
              },
              s
            )
          );
        }),
      }),
    ],
  });
}
function Dl(n) {
  const e = C();
  let t;
  if (n === 0) t = M(e, "text.comment_count_0") || k(e, "comments_0");
  else if (n === 1) t = M(e, "text.comment_count_1") || k(e, "comments_1");
  else {
    const r = M(e, "text.comment_count_multi") || k(e, "comments_multi"),
      i = Li(e, n);
    t = r.replace("*", i);
  }
  return t;
}
function cu() {
  const n = b.use("commentsCount");
  return u("span", {
    className: "comments-count",
    dangerouslySetInnerHTML: { __html: Dl(n) },
  });
}
function dt({
  children: n,
  name: e,
  onClose: t,
  vertical: r,
  horizontal: i,
  popupProps: o = {},
}) {
  return u(se, {
    children: [
      u("div", { class: `global-popup ${e} ${r} ${i}`, ...o, children: n }),
      t &&
        u("div", {
          class: "global-popup-closer",
          onClick: (s) => {
            s.stopPropagation(), t();
          },
        }),
    ],
  });
}
function At({ text: n, padding: e = 10 }) {
  const t = C();
  return (
    (n = n || k(t, "no_results")),
    u("div", { class: "global-no-results", style: { padding: e }, children: n })
  );
}
function Al(n) {
  const e = C(),
    t = b.use("user"),
    r = M(e, "profiles.profile");
  return n.type ? (r ? !0 : t && t.id === n.id && t.type === n.type) : !1;
}
function $e({ user: n, size: e = 32, profileOpener: t = !0 }) {
  const r = { borderRadius: "50%", width: e, height: e },
    i = C(),
    o = M(i, "profiles.mod_alias_picture"),
    s = n.type && n.is_mod && n.is_mod_alias && o,
    [l, a] = w(!1),
    [c, d] = w(s ? o : n.picture_url);
  function f() {
    const m = M(i, "profiles.default_picture");
    m && c !== m ? d(m) : a(!0);
  }
  const h = t && Al(n);
  function p() {
    h && Oc(i, n);
  }
  return l || !c
    ? u("span", {
        class: "profile-picture custom",
        style: r,
        onClick: p,
        children: n.name.substring(0, 1),
      })
    : u("img", {
        class: "profile-picture",
        src: c,
        alt: n.name,
        loading: "lazy",
        onError: f,
        style: r,
        onClick: p,
      });
}
function du(n) {
  const e = b.use("user");
  return e && e.id === n.id && e.type === n.type;
}
function Fi(n) {
  return n.type + "_" + n.id;
}
function uu(n, e, t, r, i) {
  D.call({
    context: n,
    method: "patch",
    isConsoleApi: !0,
    endpoint: `/user/${Fi(e)}`,
    data: { [t]: r },
    success: i,
  });
}
function te(n) {
  return u(at, { ...n, buttonType: "accent" });
}
function at(n) {
  const e = n.scale || "normal",
    t = n.isLoading ? "loading" : "",
    r =
      `global-button ${e} button-${n.buttonType} ${t}` +
      (n.class ? " " + n.class : "");
  return u("button", {
    ...n,
    className: r,
    children: [
      n.children,
      n.isLoading &&
        u("div", {
          class: "button-loader",
          children: u(W, { padding: 0, size: "small" }),
        }),
    ],
  });
}
function Rl({ time: n }) {
  const e = C(),
    t = new Date(n * 1e3),
    [r, i] = w(Po(e, t));
  let o = null;
  return (
    z(() => {
      const s = new Date(new Date().getTime() - 864e5);
      if (t > s)
        return (
          (o = setInterval(() => {
            i(Po(e, t));
          }, 1e4)),
          () => {
            if (o) return clearInterval(o);
          }
        );
    }, []),
    u("time", { dateTime: t.toLocaleString(), children: r })
  );
}
function Po(n, e) {
  const t = Math.floor((new Date().getTime() - e.getTime()) / 1e3);
  let r = Math.floor(t / 31536e3);
  function i(o) {
    return k(n, "ago_" + o + (r !== 1 ? "s" : ""), { "*": r });
  }
  return r >= 1
    ? i("year")
    : ((r = Math.floor(t / 2592e3)),
      r >= 1
        ? i("month")
        : ((r = Math.floor(t / 86400)),
          r >= 1
            ? i("day")
            : ((r = Math.floor(t / 3600)),
              r >= 1
                ? i("hour")
                : ((r = Math.floor(t / 60)),
                  r >= 1
                    ? i("minute")
                    : ((r = Math.floor(t)),
                      r >= 5 ? i("second") : k(n, "just_now"))))));
}
function fu({ onCollapse: n, comment: e }) {
  return u("div", {
    class: "collapser",
    onClick: () => n(),
    style: { zIndex: e.depth },
    children: u("div", { class: "collapse-bar" }),
  });
}
function hu({ commentId: n, onExpand: e }) {
  const t = C(),
    r = kl(t, n, !0),
    i =
      r > 0
        ? k(t, "expand_comments", { "*": (r + 1).toString() })
        : k(t, "expand_comment");
  return u("div", {
    class: "expander",
    children: u(te, {
      scale: "small",
      onClick: () => e(),
      children: [i, " ", u(ue, { name: "caret" })],
    }),
  });
}
function pu({ commentId: n, type: e }) {
  const t = C(),
    [r, i] = w(!0),
    [o, s] = w([]);
  return (
    z(() => {
      D.callPageApi({
        context: t,
        method: "get",
        endpoint: "/comment/" + n + "/voters",
        data: { type: e },
        complete: () => {
          i(!1);
        },
        success: (l) => {
          s(l);
        },
      });
    }, []),
    u(dt, {
      name: "voters",
      vertical: "top",
      horizontal: "left",
      onClose: null,
      popupProps: { onClick: (l) => l.stopPropagation() },
      children: r
        ? u(W, { padding: 10, size: "small" })
        : u("div", {
            children: o.map((l) =>
              u("div", {
                class: "user-row",
                children: [u($e, { user: l, size: 16 }), u(rn, { user: l })],
              })
            ),
          }),
    })
  );
}
const sn = O(null);
let Er = null,
  Tr = null;
function mu() {
  const n = Zt(sn);
  return n
    ? u("div", {
        class: `global-one-time-notification ${n.type} ${n.status}`,
        children: u("div", {
          class: "notification",
          children: [
            n.type === "error" &&
              u("span", { class: "error-icon", children: "!" }),
            n.content,
          ],
        }),
      })
    : null;
}
function Ot(n, e = "default", t = 3e3) {
  Er && clearTimeout(Er),
    Tr && clearTimeout(Tr),
    sn.set({ content: n, status: "shown", type: e }),
    (Er = setTimeout(() => {
      sn.set({ ...sn.get(), status: "hidden" }),
        (Tr = setTimeout(() => {
          sn.set(null);
        }, 300));
    }, t));
}
function zo({ comment: n, type: e }) {
  const t = b.use("userVotes"),
    r = b.use("user"),
    i = b.use("userBan"),
    o = t[n.id] === e,
    s = C(),
    l = n[e + "votes"],
    [a, c] = w(!1),
    d = q(null),
    f = window.innerWidth < 768;
  function h() {
    if (!r && !M(s, "voting.guest")) {
      Ot(k(s, "guest_vote"));
      return;
    }
    const y = o ? -1 : 1,
      v = e + "votes";
    if ((Jt(s, n.id, v, n[v] + y), t[n.id] && !o)) {
      const R = v === "upvotes" ? "downvotes" : "upvotes";
      Jt(s, n.id, R, n[R] - 1);
    }
    const N = o ? null : e;
    Kd(s, n.id, N), Sl(s, n.id, N);
  }
  function p() {
    M(s, "voting.voters") &&
      l &&
      (d.current && clearTimeout(d.current),
      a ||
        (d.current = setTimeout(() => {
          c(!0);
        }, 250)));
  }
  function m() {
    d.current && clearTimeout(d.current),
      a &&
        (d.current = setTimeout(() => {
          c(!1);
        }, 250));
  }
  function g() {
    M(s, "voting.voters") &&
      l &&
      (d.current && clearTimeout(d.current),
      a ||
        (d.current = setTimeout(() => {
          c(!0);
        }, 250)));
  }
  function x() {
    d.current && clearTimeout(d.current),
      a &&
        (d.current = setTimeout(() => {
          c(!1);
        }, 250));
  }
  return u("span", {
    className: "vote-wrap",
    children: u("button", {
      class: "vote" + (o ? " voted" : ""),
      onClick: h,
      disabled: i !== null,
      "aria-pressed": o,
      "aria-label": e === "up" ? "Upvote" : "Downvote",
      onMouseEnter: f ? void 0 : p,
      onMouseLeave: f ? void 0 : m,
      onFocus: f ? void 0 : g,
      onBlur: f ? void 0 : x,
      children: [
        u(ue, {
          name:
            "thumbs" + e[0].toUpperCase() + e.slice(1) + (o ? "Active" : ""),
        }),
        u("span", { class: "vote-number", children: l }),
        a && u(pu, { type: e, commentId: n.id }),
      ],
    }),
  });
}
function gu({ comment: n }) {
  const e = C(),
    t = M(e, "voting.type");
  return t === "none"
    ? null
    : u("div", {
        className: "votes",
        children: [
          u(zo, { comment: n, type: "up" }),
          t === "both" && u(zo, { comment: n, type: "down" }),
        ],
      });
}
function re(n) {
  this.content = n;
}
re.prototype = {
  constructor: re,
  find: function (n) {
    for (var e = 0; e < this.content.length; e += 2)
      if (this.content[e] === n) return e;
    return -1;
  },
  get: function (n) {
    var e = this.find(n);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  update: function (n, e, t) {
    var r = t && t != n ? this.remove(t) : this,
      i = r.find(n),
      o = r.content.slice();
    return (
      i == -1 ? o.push(t || n, e) : ((o[i + 1] = e), t && (o[i] = t)), new re(o)
    );
  },
  remove: function (n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new re(t);
  },
  addToStart: function (n, e) {
    return new re([n, e].concat(this.remove(n).content));
  },
  addToEnd: function (n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new re(t);
  },
  addBefore: function (n, e, t) {
    var r = this.remove(e),
      i = r.content.slice(),
      o = r.find(n);
    return i.splice(o == -1 ? i.length : o, 0, e, t), new re(i);
  },
  forEach: function (n) {
    for (var e = 0; e < this.content.length; e += 2)
      n(this.content[e], this.content[e + 1]);
  },
  prepend: function (n) {
    return (
      (n = re.from(n)),
      n.size ? new re(n.content.concat(this.subtract(n).content)) : this
    );
  },
  append: function (n) {
    return (
      (n = re.from(n)),
      n.size ? new re(this.subtract(n).content.concat(n.content)) : this
    );
  },
  subtract: function (n) {
    var e = this;
    n = re.from(n);
    for (var t = 0; t < n.content.length; t += 2) e = e.remove(n.content[t]);
    return e;
  },
  toObject: function () {
    var n = {};
    return (
      this.forEach(function (e, t) {
        n[e] = t;
      }),
      n
    );
  },
  get size() {
    return this.content.length >> 1;
  },
};
re.from = function (n) {
  if (n instanceof re) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new re(e);
};
function Pl(n, e, t) {
  for (let r = 0; ; r++) {
    if (r == n.childCount || r == e.childCount)
      return n.childCount == e.childCount ? null : t;
    let i = n.child(r),
      o = e.child(r);
    if (i == o) {
      t += i.nodeSize;
      continue;
    }
    if (!i.sameMarkup(o)) return t;
    if (i.isText && i.text != o.text) {
      for (let s = 0; i.text[s] == o.text[s]; s++) t++;
      return t;
    }
    if (i.content.size || o.content.size) {
      let s = Pl(i.content, o.content, t + 1);
      if (s != null) return s;
    }
    t += i.nodeSize;
  }
}
function zl(n, e, t, r) {
  for (let i = n.childCount, o = e.childCount; ; ) {
    if (i == 0 || o == 0) return i == o ? null : { a: t, b: r };
    let s = n.child(--i),
      l = e.child(--o),
      a = s.nodeSize;
    if (s == l) {
      (t -= a), (r -= a);
      continue;
    }
    if (!s.sameMarkup(l)) return { a: t, b: r };
    if (s.isText && s.text != l.text) {
      let c = 0,
        d = Math.min(s.text.length, l.text.length);
      for (
        ;
        c < d && s.text[s.text.length - c - 1] == l.text[l.text.length - c - 1];

      )
        c++, t--, r--;
      return { a: t, b: r };
    }
    if (s.content.size || l.content.size) {
      let c = zl(s.content, l.content, t - 1, r - 1);
      if (c) return c;
    }
    (t -= a), (r -= a);
  }
}
class _ {
  constructor(e, t) {
    if (((this.content = e), (this.size = t || 0), t == null))
      for (let r = 0; r < e.length; r++) this.size += e[r].nodeSize;
  }
  nodesBetween(e, t, r, i = 0, o) {
    for (let s = 0, l = 0; l < t; s++) {
      let a = this.content[s],
        c = l + a.nodeSize;
      if (c > e && r(a, i + l, o || null, s) !== !1 && a.content.size) {
        let d = l + 1;
        a.nodesBetween(
          Math.max(0, e - d),
          Math.min(a.content.size, t - d),
          r,
          i + d
        );
      }
      l = c;
    }
  }
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  textBetween(e, t, r, i) {
    let o = "",
      s = !0;
    return (
      this.nodesBetween(
        e,
        t,
        (l, a) => {
          let c = l.isText
            ? l.text.slice(Math.max(e, a) - a, t - a)
            : l.isLeaf
            ? i
              ? typeof i == "function"
                ? i(l)
                : i
              : l.type.spec.leafText
              ? l.type.spec.leafText(l)
              : ""
            : "";
          l.isBlock &&
            ((l.isLeaf && c) || l.isTextblock) &&
            r &&
            (s ? (s = !1) : (o += r)),
            (o += c);
        },
        0
      ),
      o
    );
  }
  append(e) {
    if (!e.size) return this;
    if (!this.size) return e;
    let t = this.lastChild,
      r = e.firstChild,
      i = this.content.slice(),
      o = 0;
    for (
      t.isText &&
      t.sameMarkup(r) &&
      ((i[i.length - 1] = t.withText(t.text + r.text)), (o = 1));
      o < e.content.length;
      o++
    )
      i.push(e.content[o]);
    return new _(i, this.size + e.size);
  }
  cut(e, t = this.size) {
    if (e == 0 && t == this.size) return this;
    let r = [],
      i = 0;
    if (t > e)
      for (let o = 0, s = 0; s < t; o++) {
        let l = this.content[o],
          a = s + l.nodeSize;
        a > e &&
          ((s < e || a > t) &&
            (l.isText
              ? (l = l.cut(Math.max(0, e - s), Math.min(l.text.length, t - s)))
              : (l = l.cut(
                  Math.max(0, e - s - 1),
                  Math.min(l.content.size, t - s - 1)
                ))),
          r.push(l),
          (i += l.nodeSize)),
          (s = a);
      }
    return new _(r, i);
  }
  cutByIndex(e, t) {
    return e == t
      ? _.empty
      : e == 0 && t == this.content.length
      ? this
      : new _(this.content.slice(e, t));
  }
  replaceChild(e, t) {
    let r = this.content[e];
    if (r == t) return this;
    let i = this.content.slice(),
      o = this.size + t.nodeSize - r.nodeSize;
    return (i[e] = t), new _(i, o);
  }
  addToStart(e) {
    return new _([e].concat(this.content), this.size + e.nodeSize);
  }
  addToEnd(e) {
    return new _(this.content.concat(e), this.size + e.nodeSize);
  }
  eq(e) {
    if (this.content.length != e.content.length) return !1;
    for (let t = 0; t < this.content.length; t++)
      if (!this.content[t].eq(e.content[t])) return !1;
    return !0;
  }
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  get childCount() {
    return this.content.length;
  }
  child(e) {
    let t = this.content[e];
    if (!t) throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  maybeChild(e) {
    return this.content[e] || null;
  }
  forEach(e) {
    for (let t = 0, r = 0; t < this.content.length; t++) {
      let i = this.content[t];
      e(i, r, t), (r += i.nodeSize);
    }
  }
  findDiffStart(e, t = 0) {
    return Pl(this, e, t);
  }
  findDiffEnd(e, t = this.size, r = e.size) {
    return zl(this, e, t, r);
  }
  findIndex(e, t = -1) {
    if (e == 0) return Bn(0, e);
    if (e == this.size) return Bn(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let r = 0, i = 0; ; r++) {
      let o = this.child(r),
        s = i + o.nodeSize;
      if (s >= e) return s == e || t > 0 ? Bn(r + 1, s) : Bn(r, i);
      i = s;
    }
  }
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  toStringInner() {
    return this.content.join(", ");
  }
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  static fromJSON(e, t) {
    if (!t) return _.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new _(t.map(e.nodeFromJSON));
  }
  static fromArray(e) {
    if (!e.length) return _.empty;
    let t,
      r = 0;
    for (let i = 0; i < e.length; i++) {
      let o = e[i];
      (r += o.nodeSize),
        i && o.isText && e[i - 1].sameMarkup(o)
          ? (t || (t = e.slice(0, i)),
            (t[t.length - 1] = o.withText(t[t.length - 1].text + o.text)))
          : t && t.push(o);
    }
    return new _(t || e, r);
  }
  static from(e) {
    if (!e) return _.empty;
    if (e instanceof _) return e;
    if (Array.isArray(e)) return this.fromArray(e);
    if (e.attrs) return new _([e], e.nodeSize);
    throw new RangeError(
      "Can not convert " +
        e +
        " to a Fragment" +
        (e.nodesBetween
          ? " (looks like multiple versions of prosemirror-model were loaded)"
          : "")
    );
  }
}
_.empty = new _([], 0);
const Ir = { index: 0, offset: 0 };
function Bn(n, e) {
  return (Ir.index = n), (Ir.offset = e), Ir;
}
function Kn(n, e) {
  if (n === e) return !0;
  if (!(n && typeof n == "object") || !(e && typeof e == "object")) return !1;
  let t = Array.isArray(n);
  if (Array.isArray(e) != t) return !1;
  if (t) {
    if (n.length != e.length) return !1;
    for (let r = 0; r < n.length; r++) if (!Kn(n[r], e[r])) return !1;
  } else {
    for (let r in n) if (!(r in e) || !Kn(n[r], e[r])) return !1;
    for (let r in e) if (!(r in n)) return !1;
  }
  return !0;
}
class L {
  constructor(e, t) {
    (this.type = e), (this.attrs = t);
  }
  addToSet(e) {
    let t,
      r = !1;
    for (let i = 0; i < e.length; i++) {
      let o = e[i];
      if (this.eq(o)) return e;
      if (this.type.excludes(o.type)) t || (t = e.slice(0, i));
      else {
        if (o.type.excludes(this.type)) return e;
        !r &&
          o.type.rank > this.type.rank &&
          (t || (t = e.slice(0, i)), t.push(this), (r = !0)),
          t && t.push(o);
      }
    }
    return t || (t = e.slice()), r || t.push(this), t;
  }
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t])) return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  isInSet(e) {
    for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return !0;
    return !1;
  }
  eq(e) {
    return this == e || (this.type == e.type && Kn(this.attrs, e.attrs));
  }
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  static fromJSON(e, t) {
    if (!t) throw new RangeError("Invalid input for Mark.fromJSON");
    let r = e.marks[t.type];
    if (!r)
      throw new RangeError(`There is no mark type ${t.type} in this schema`);
    let i = r.create(t.attrs);
    return r.checkAttrs(i.attrs), i;
  }
  static sameSet(e, t) {
    if (e == t) return !0;
    if (e.length != t.length) return !1;
    for (let r = 0; r < e.length; r++) if (!e[r].eq(t[r])) return !1;
    return !0;
  }
  static setFrom(e) {
    if (!e || (Array.isArray(e) && e.length == 0)) return L.none;
    if (e instanceof L) return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
}
L.none = [];
class Gn extends Error {}
class S {
  constructor(e, t, r) {
    (this.content = e), (this.openStart = t), (this.openEnd = r);
  }
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  insertAt(e, t) {
    let r = Ll(this.content, e + this.openStart, t);
    return r && new S(r, this.openStart, this.openEnd);
  }
  removeBetween(e, t) {
    return new S(
      Bl(this.content, e + this.openStart, t + this.openStart),
      this.openStart,
      this.openEnd
    );
  }
  eq(e) {
    return (
      this.content.eq(e.content) &&
      this.openStart == e.openStart &&
      this.openEnd == e.openEnd
    );
  }
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  toJSON() {
    if (!this.content.size) return null;
    let e = { content: this.content.toJSON() };
    return (
      this.openStart > 0 && (e.openStart = this.openStart),
      this.openEnd > 0 && (e.openEnd = this.openEnd),
      e
    );
  }
  static fromJSON(e, t) {
    if (!t) return S.empty;
    let r = t.openStart || 0,
      i = t.openEnd || 0;
    if (typeof r != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new S(_.fromJSON(e, t.content), r, i);
  }
  static maxOpen(e, t = !0) {
    let r = 0,
      i = 0;
    for (
      let o = e.firstChild;
      o && !o.isLeaf && (t || !o.type.spec.isolating);
      o = o.firstChild
    )
      r++;
    for (
      let o = e.lastChild;
      o && !o.isLeaf && (t || !o.type.spec.isolating);
      o = o.lastChild
    )
      i++;
    return new S(e, r, i);
  }
}
S.empty = new S(_.empty, 0, 0);
function Bl(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e),
    o = n.maybeChild(r),
    { index: s, offset: l } = n.findIndex(t);
  if (i == e || o.isText) {
    if (l != t && !n.child(s).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != s) throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, o.copy(Bl(o.content, e - i - 1, t - i - 1)));
}
function Ll(n, e, t, r) {
  let { index: i, offset: o } = n.findIndex(e),
    s = n.maybeChild(i);
  if (o == e || s.isText) return n.cut(0, e).append(t).append(n.cut(e));
  let l = Ll(s.content, e - o - 1, t);
  return l && n.replaceChild(i, s.copy(l));
}
function bu(n, e, t) {
  if (t.openStart > n.depth)
    throw new Gn("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new Gn("Inconsistent open depths");
  return Fl(n, e, t, 0);
}
function Fl(n, e, t, r) {
  let i = n.index(r),
    o = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let s = Fl(n, e, t, r + 1);
    return o.copy(o.content.replaceChild(i, s));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let s = n.parent,
        l = s.content;
      return vt(
        s,
        l.cut(0, n.parentOffset).append(t.content).append(l.cut(e.parentOffset))
      );
    } else {
      let { start: s, end: l } = xu(t, n);
      return vt(o, Vl(n, s, l, e, r));
    }
  else return vt(o, Yn(n, e, r));
}
function $l(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new Gn("Cannot join " + e.type.name + " onto " + n.type.name);
}
function ai(n, e, t) {
  let r = n.node(t);
  return $l(r, e.node(t)), r;
}
function _t(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t])
    ? (e[t] = n.withText(e[t].text + n.text))
    : e.push(n);
}
function un(n, e, t, r) {
  let i = (e || n).node(t),
    o = 0,
    s = e ? e.index(t) : i.childCount;
  n &&
    ((o = n.index(t)),
    n.depth > t ? o++ : n.textOffset && (_t(n.nodeAfter, r), o++));
  for (let l = o; l < s; l++) _t(i.child(l), r);
  e && e.depth == t && e.textOffset && _t(e.nodeBefore, r);
}
function vt(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function Vl(n, e, t, r, i) {
  let o = n.depth > i && ai(n, e, i + 1),
    s = r.depth > i && ai(t, r, i + 1),
    l = [];
  return (
    un(null, n, i, l),
    o && s && e.index(i) == t.index(i)
      ? ($l(o, s), _t(vt(o, Vl(n, e, t, r, i + 1)), l))
      : (o && _t(vt(o, Yn(n, e, i + 1)), l),
        un(e, t, i, l),
        s && _t(vt(s, Yn(t, r, i + 1)), l)),
    un(r, null, i, l),
    new _(l)
  );
}
function Yn(n, e, t) {
  let r = [];
  if ((un(null, n, t, r), n.depth > t)) {
    let i = ai(n, e, t + 1);
    _t(vt(i, Yn(n, e, t + 1)), r);
  }
  return un(e, null, t, r), new _(r);
}
function xu(n, e) {
  let t = e.depth - n.openStart,
    i = e.node(t).copy(n.content);
  for (let o = t - 1; o >= 0; o--) i = e.node(o).copy(_.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t),
  };
}
class yn {
  constructor(e, t, r) {
    (this.pos = e),
      (this.path = t),
      (this.parentOffset = r),
      (this.depth = t.length / 3 - 1);
  }
  resolveDepth(e) {
    return e == null ? this.depth : e < 0 ? this.depth + e : e;
  }
  get parent() {
    return this.node(this.depth);
  }
  get doc() {
    return this.node(0);
  }
  node(e) {
    return this.path[this.resolveDepth(e) * 3];
  }
  index(e) {
    return this.path[this.resolveDepth(e) * 3 + 1];
  }
  indexAfter(e) {
    return (
      (e = this.resolveDepth(e)),
      this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1)
    );
  }
  start(e) {
    return (e = this.resolveDepth(e)), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
  }
  end(e) {
    return (
      (e = this.resolveDepth(e)), this.start(e) + this.node(e).content.size
    );
  }
  before(e) {
    if (((e = this.resolveDepth(e)), !e))
      throw new RangeError("There is no position before the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
  }
  after(e) {
    if (((e = this.resolveDepth(e)), !e))
      throw new RangeError("There is no position after the top-level node");
    return e == this.depth + 1
      ? this.pos
      : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
  }
  get textOffset() {
    return this.pos - this.path[this.path.length - 1];
  }
  get nodeAfter() {
    let e = this.parent,
      t = this.index(this.depth);
    if (t == e.childCount) return null;
    let r = this.pos - this.path[this.path.length - 1],
      i = e.child(t);
    return r ? e.child(t).cut(r) : i;
  }
  get nodeBefore() {
    let e = this.index(this.depth),
      t = this.pos - this.path[this.path.length - 1];
    return t
      ? this.parent.child(e).cut(0, t)
      : e == 0
      ? null
      : this.parent.child(e - 1);
  }
  posAtIndex(e, t) {
    t = this.resolveDepth(t);
    let r = this.path[t * 3],
      i = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
    for (let o = 0; o < e; o++) i += r.child(o).nodeSize;
    return i;
  }
  marks() {
    let e = this.parent,
      t = this.index();
    if (e.content.size == 0) return L.none;
    if (this.textOffset) return e.child(t).marks;
    let r = e.maybeChild(t - 1),
      i = e.maybeChild(t);
    if (!r) {
      let l = r;
      (r = i), (i = l);
    }
    let o = r.marks;
    for (var s = 0; s < o.length; s++)
      o[s].type.spec.inclusive === !1 &&
        (!i || !o[s].isInSet(i.marks)) &&
        (o = o[s--].removeFromSet(o));
    return o;
  }
  marksAcross(e) {
    let t = this.parent.maybeChild(this.index());
    if (!t || !t.isInline) return null;
    let r = t.marks,
      i = e.parent.maybeChild(e.index());
    for (var o = 0; o < r.length; o++)
      r[o].type.spec.inclusive === !1 &&
        (!i || !r[o].isInSet(i.marks)) &&
        (r = r[o--].removeFromSet(r));
    return r;
  }
  sharedDepth(e) {
    for (let t = this.depth; t > 0; t--)
      if (this.start(t) <= e && this.end(t) >= e) return t;
    return 0;
  }
  blockRange(e = this, t) {
    if (e.pos < this.pos) return e.blockRange(this);
    for (
      let r =
        this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0);
      r >= 0;
      r--
    )
      if (e.pos <= this.end(r) && (!t || t(this.node(r))))
        return new Xn(this, e, r);
    return null;
  }
  sameParent(e) {
    return this.pos - this.parentOffset == e.pos - e.parentOffset;
  }
  max(e) {
    return e.pos > this.pos ? e : this;
  }
  min(e) {
    return e.pos < this.pos ? e : this;
  }
  toString() {
    let e = "";
    for (let t = 1; t <= this.depth; t++)
      e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
    return e + ":" + this.parentOffset;
  }
  static resolve(e, t) {
    if (!(t >= 0 && t <= e.content.size))
      throw new RangeError("Position " + t + " out of range");
    let r = [],
      i = 0,
      o = t;
    for (let s = e; ; ) {
      let { index: l, offset: a } = s.content.findIndex(o),
        c = o - a;
      if ((r.push(s, l, i + a), !c || ((s = s.child(l)), s.isText))) break;
      (o = c - 1), (i += a + 1);
    }
    return new yn(t, r, o);
  }
  static resolveCached(e, t) {
    let r = Bo.get(e);
    if (r)
      for (let o = 0; o < r.elts.length; o++) {
        let s = r.elts[o];
        if (s.pos == t) return s;
      }
    else Bo.set(e, (r = new yu()));
    let i = (r.elts[r.i] = yn.resolve(e, t));
    return (r.i = (r.i + 1) % ku), i;
  }
}
class yu {
  constructor() {
    (this.elts = []), (this.i = 0);
  }
}
const ku = 12,
  Bo = new WeakMap();
class Xn {
  constructor(e, t, r) {
    (this.$from = e), (this.$to = t), (this.depth = r);
  }
  get start() {
    return this.$from.before(this.depth + 1);
  }
  get end() {
    return this.$to.after(this.depth + 1);
  }
  get parent() {
    return this.$from.node(this.depth);
  }
  get startIndex() {
    return this.$from.index(this.depth);
  }
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
const _u = Object.create(null);
class Ee {
  constructor(e, t, r, i = L.none) {
    (this.type = e),
      (this.attrs = t),
      (this.marks = i),
      (this.content = r || _.empty);
  }
  get nodeSize() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  }
  get childCount() {
    return this.content.childCount;
  }
  child(e) {
    return this.content.child(e);
  }
  maybeChild(e) {
    return this.content.maybeChild(e);
  }
  forEach(e) {
    this.content.forEach(e);
  }
  nodesBetween(e, t, r, i = 0) {
    this.content.nodesBetween(e, t, r, i, this);
  }
  descendants(e) {
    this.nodesBetween(0, this.content.size, e);
  }
  get textContent() {
    return this.isLeaf && this.type.spec.leafText
      ? this.type.spec.leafText(this)
      : this.textBetween(0, this.content.size, "");
  }
  textBetween(e, t, r, i) {
    return this.content.textBetween(e, t, r, i);
  }
  get firstChild() {
    return this.content.firstChild;
  }
  get lastChild() {
    return this.content.lastChild;
  }
  eq(e) {
    return this == e || (this.sameMarkup(e) && this.content.eq(e.content));
  }
  sameMarkup(e) {
    return this.hasMarkup(e.type, e.attrs, e.marks);
  }
  hasMarkup(e, t, r) {
    return (
      this.type == e &&
      Kn(this.attrs, t || e.defaultAttrs || _u) &&
      L.sameSet(this.marks, r || L.none)
    );
  }
  copy(e = null) {
    return e == this.content
      ? this
      : new Ee(this.type, this.attrs, e, this.marks);
  }
  mark(e) {
    return e == this.marks
      ? this
      : new Ee(this.type, this.attrs, this.content, e);
  }
  cut(e, t = this.content.size) {
    return e == 0 && t == this.content.size
      ? this
      : this.copy(this.content.cut(e, t));
  }
  slice(e, t = this.content.size, r = !1) {
    if (e == t) return S.empty;
    let i = this.resolve(e),
      o = this.resolve(t),
      s = r ? 0 : i.sharedDepth(t),
      l = i.start(s),
      c = i.node(s).content.cut(i.pos - l, o.pos - l);
    return new S(c, i.depth - s, o.depth - s);
  }
  replace(e, t, r) {
    return bu(this.resolve(e), this.resolve(t), r);
  }
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: r, offset: i } = t.content.findIndex(e);
      if (((t = t.maybeChild(r)), !t)) return null;
      if (i == e || t.isText) return t;
      e -= i + 1;
    }
  }
  childAfter(e) {
    let { index: t, offset: r } = this.content.findIndex(e);
    return { node: this.content.maybeChild(t), index: t, offset: r };
  }
  childBefore(e) {
    if (e == 0) return { node: null, index: 0, offset: 0 };
    let { index: t, offset: r } = this.content.findIndex(e);
    if (r < e) return { node: this.content.child(t), index: t, offset: r };
    let i = this.content.child(t - 1);
    return { node: i, index: t - 1, offset: r - i.nodeSize };
  }
  resolve(e) {
    return yn.resolveCached(this, e);
  }
  resolveNoCache(e) {
    return yn.resolve(this, e);
  }
  rangeHasMark(e, t, r) {
    let i = !1;
    return (
      t > e &&
        this.nodesBetween(e, t, (o) => (r.isInSet(o.marks) && (i = !0), !i)),
      i
    );
  }
  get isBlock() {
    return this.type.isBlock;
  }
  get isTextblock() {
    return this.type.isTextblock;
  }
  get inlineContent() {
    return this.type.inlineContent;
  }
  get isInline() {
    return this.type.isInline;
  }
  get isText() {
    return this.type.isText;
  }
  get isLeaf() {
    return this.type.isLeaf;
  }
  get isAtom() {
    return this.type.isAtom;
  }
  toString() {
    if (this.type.spec.toDebugString) return this.type.spec.toDebugString(this);
    let e = this.type.name;
    return (
      this.content.size && (e += "(" + this.content.toStringInner() + ")"),
      Ul(this.marks, e)
    );
  }
  contentMatchAt(e) {
    let t = this.type.contentMatch.matchFragment(this.content, 0, e);
    if (!t)
      throw new Error("Called contentMatchAt on a node with invalid content");
    return t;
  }
  canReplace(e, t, r = _.empty, i = 0, o = r.childCount) {
    let s = this.contentMatchAt(e).matchFragment(r, i, o),
      l = s && s.matchFragment(this.content, t);
    if (!l || !l.validEnd) return !1;
    for (let a = i; a < o; a++)
      if (!this.type.allowsMarks(r.child(a).marks)) return !1;
    return !0;
  }
  canReplaceWith(e, t, r, i) {
    if (i && !this.type.allowsMarks(i)) return !1;
    let o = this.contentMatchAt(e).matchType(r),
      s = o && o.matchFragment(this.content, t);
    return s ? s.validEnd : !1;
  }
  canAppend(e) {
    return e.content.size
      ? this.canReplace(this.childCount, this.childCount, e.content)
      : this.type.compatibleContent(e.type);
  }
  check() {
    this.type.checkContent(this.content), this.type.checkAttrs(this.attrs);
    let e = L.none;
    for (let t = 0; t < this.marks.length; t++) {
      let r = this.marks[t];
      r.type.checkAttrs(r.attrs), (e = r.addToSet(e));
    }
    if (!L.sameSet(e, this.marks))
      throw new RangeError(
        `Invalid collection of marks for node ${
          this.type.name
        }: ${this.marks.map((t) => t.type.name)}`
      );
    this.content.forEach((t) => t.check());
  }
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return (
      this.content.size && (e.content = this.content.toJSON()),
      this.marks.length && (e.marks = this.marks.map((t) => t.toJSON())),
      e
    );
  }
  static fromJSON(e, t) {
    if (!t) throw new RangeError("Invalid input for Node.fromJSON");
    let r;
    if (t.marks) {
      if (!Array.isArray(t.marks))
        throw new RangeError("Invalid mark data for Node.fromJSON");
      r = t.marks.map(e.markFromJSON);
    }
    if (t.type == "text") {
      if (typeof t.text != "string")
        throw new RangeError("Invalid text node in JSON");
      return e.text(t.text, r);
    }
    let i = _.fromJSON(e, t.content),
      o = e.nodeType(t.type).create(t.attrs, i, r);
    return o.type.checkAttrs(o.attrs), o;
  }
}
Ee.prototype.text = void 0;
class Qn extends Ee {
  constructor(e, t, r, i) {
    if ((super(e, t, null, i), !r))
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString
      ? this.type.spec.toDebugString(this)
      : Ul(this.marks, JSON.stringify(this.text));
  }
  get textContent() {
    return this.text;
  }
  textBetween(e, t) {
    return this.text.slice(e, t);
  }
  get nodeSize() {
    return this.text.length;
  }
  mark(e) {
    return e == this.marks ? this : new Qn(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new Qn(this.type, this.attrs, e, this.marks);
  }
  cut(e = 0, t = this.text.length) {
    return e == 0 && t == this.text.length
      ? this
      : this.withText(this.text.slice(e, t));
  }
  eq(e) {
    return this.sameMarkup(e) && this.text == e.text;
  }
  toJSON() {
    let e = super.toJSON();
    return (e.text = this.text), e;
  }
}
function Ul(n, e) {
  for (let t = n.length - 1; t >= 0; t--) e = n[t].type.name + "(" + e + ")";
  return e;
}
class Nt {
  constructor(e) {
    (this.validEnd = e), (this.next = []), (this.wrapCache = []);
  }
  static parse(e, t) {
    let r = new vu(e, t);
    if (r.next == null) return Nt.empty;
    let i = jl(r);
    r.next && r.err("Unexpected trailing text");
    let o = Eu(Nu(i));
    return Tu(o, r), o;
  }
  matchType(e) {
    for (let t = 0; t < this.next.length; t++)
      if (this.next[t].type == e) return this.next[t].next;
    return null;
  }
  matchFragment(e, t = 0, r = e.childCount) {
    let i = this;
    for (let o = t; i && o < r; o++) i = i.matchType(e.child(o).type);
    return i;
  }
  get inlineContent() {
    return this.next.length != 0 && this.next[0].type.isInline;
  }
  get defaultType() {
    for (let e = 0; e < this.next.length; e++) {
      let { type: t } = this.next[e];
      if (!(t.isText || t.hasRequiredAttrs())) return t;
    }
    return null;
  }
  compatible(e) {
    for (let t = 0; t < this.next.length; t++)
      for (let r = 0; r < e.next.length; r++)
        if (this.next[t].type == e.next[r].type) return !0;
    return !1;
  }
  fillBefore(e, t = !1, r = 0) {
    let i = [this];
    function o(s, l) {
      let a = s.matchFragment(e, r);
      if (a && (!t || a.validEnd))
        return _.from(l.map((c) => c.createAndFill()));
      for (let c = 0; c < s.next.length; c++) {
        let { type: d, next: f } = s.next[c];
        if (!(d.isText || d.hasRequiredAttrs()) && i.indexOf(f) == -1) {
          i.push(f);
          let h = o(f, l.concat(d));
          if (h) return h;
        }
      }
      return null;
    }
    return o(this, []);
  }
  findWrapping(e) {
    for (let r = 0; r < this.wrapCache.length; r += 2)
      if (this.wrapCache[r] == e) return this.wrapCache[r + 1];
    let t = this.computeWrapping(e);
    return this.wrapCache.push(e, t), t;
  }
  computeWrapping(e) {
    let t = Object.create(null),
      r = [{ match: this, type: null, via: null }];
    for (; r.length; ) {
      let i = r.shift(),
        o = i.match;
      if (o.matchType(e)) {
        let s = [];
        for (let l = i; l.type; l = l.via) s.push(l.type);
        return s.reverse();
      }
      for (let s = 0; s < o.next.length; s++) {
        let { type: l, next: a } = o.next[s];
        !l.isLeaf &&
          !l.hasRequiredAttrs() &&
          !(l.name in t) &&
          (!i.type || a.validEnd) &&
          (r.push({ match: l.contentMatch, type: l, via: i }),
          (t[l.name] = !0));
      }
    }
    return null;
  }
  get edgeCount() {
    return this.next.length;
  }
  edge(e) {
    if (e >= this.next.length)
      throw new RangeError(`There's no ${e}th edge in this content match`);
    return this.next[e];
  }
  toString() {
    let e = [];
    function t(r) {
      e.push(r);
      for (let i = 0; i < r.next.length; i++)
        e.indexOf(r.next[i].next) == -1 && t(r.next[i].next);
    }
    return (
      t(this),
      e.map((r, i) => {
        let o = i + (r.validEnd ? "*" : " ") + " ";
        for (let s = 0; s < r.next.length; s++)
          o +=
            (s ? ", " : "") +
            r.next[s].type.name +
            "->" +
            e.indexOf(r.next[s].next);
        return o;
      }).join(`
`)
    );
  }
}
Nt.empty = new Nt(!0);
class vu {
  constructor(e, t) {
    (this.string = e),
      (this.nodeTypes = t),
      (this.inline = null),
      (this.pos = 0),
      (this.tokens = e.split(/\s*(?=\b|\W|$)/)),
      this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(),
      this.tokens[0] == "" && this.tokens.shift();
  }
  get next() {
    return this.tokens[this.pos];
  }
  eat(e) {
    return this.next == e && (this.pos++ || !0);
  }
  err(e) {
    throw new SyntaxError(e + " (in content expression '" + this.string + "')");
  }
}
function jl(n) {
  let e = [];
  do e.push(wu(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function wu(n) {
  let e = [];
  do e.push(Su(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function Su(n) {
  let e = Ou(n);
  for (;;)
    if (n.eat("+")) e = { type: "plus", expr: e };
    else if (n.eat("*")) e = { type: "star", expr: e };
    else if (n.eat("?")) e = { type: "opt", expr: e };
    else if (n.eat("{")) e = Cu(n, e);
    else break;
  return e;
}
function Lo(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function Cu(n, e) {
  let t = Lo(n),
    r = t;
  return (
    n.eat(",") && (n.next != "}" ? (r = Lo(n)) : (r = -1)),
    n.eat("}") || n.err("Unclosed braced range"),
    { type: "range", min: t, max: r, expr: e }
  );
}
function Mu(n, e) {
  let t = n.nodeTypes,
    r = t[e];
  if (r) return [r];
  let i = [];
  for (let o in t) {
    let s = t[o];
    s.groups.indexOf(e) > -1 && i.push(s);
  }
  return i.length == 0 && n.err("No node type or group '" + e + "' found"), i;
}
function Ou(n) {
  if (n.eat("(")) {
    let e = jl(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next)) n.err("Unexpected token '" + n.next + "'");
  else {
    let e = Mu(n, n.next).map(
      (t) => (
        n.inline == null
          ? (n.inline = t.isInline)
          : n.inline != t.isInline && n.err("Mixing inline and block content"),
        { type: "name", value: t }
      )
    );
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function Nu(n) {
  let e = [[]];
  return i(o(n, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function r(s, l, a) {
    let c = { term: a, to: l };
    return e[s].push(c), c;
  }
  function i(s, l) {
    s.forEach((a) => (a.to = l));
  }
  function o(s, l) {
    if (s.type == "choice")
      return s.exprs.reduce((a, c) => a.concat(o(c, l)), []);
    if (s.type == "seq")
      for (let a = 0; ; a++) {
        let c = o(s.exprs[a], l);
        if (a == s.exprs.length - 1) return c;
        i(c, (l = t()));
      }
    else if (s.type == "star") {
      let a = t();
      return r(l, a), i(o(s.expr, a), a), [r(a)];
    } else if (s.type == "plus") {
      let a = t();
      return i(o(s.expr, l), a), i(o(s.expr, a), a), [r(a)];
    } else {
      if (s.type == "opt") return [r(l)].concat(o(s.expr, l));
      if (s.type == "range") {
        let a = l;
        for (let c = 0; c < s.min; c++) {
          let d = t();
          i(o(s.expr, a), d), (a = d);
        }
        if (s.max == -1) i(o(s.expr, a), a);
        else
          for (let c = s.min; c < s.max; c++) {
            let d = t();
            r(a, d), i(o(s.expr, a), d), (a = d);
          }
        return [r(a)];
      } else {
        if (s.type == "name") return [r(l, void 0, s.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function Hl(n, e) {
  return e - n;
}
function Fo(n, e) {
  let t = [];
  return r(e), t.sort(Hl);
  function r(i) {
    let o = n[i];
    if (o.length == 1 && !o[0].term) return r(o[0].to);
    t.push(i);
    for (let s = 0; s < o.length; s++) {
      let { term: l, to: a } = o[s];
      !l && t.indexOf(a) == -1 && r(a);
    }
  }
}
function Eu(n) {
  let e = Object.create(null);
  return t(Fo(n, 0));
  function t(r) {
    let i = [];
    r.forEach((s) => {
      n[s].forEach(({ term: l, to: a }) => {
        if (!l) return;
        let c;
        for (let d = 0; d < i.length; d++) i[d][0] == l && (c = i[d][1]);
        Fo(n, a).forEach((d) => {
          c || i.push([l, (c = [])]), c.indexOf(d) == -1 && c.push(d);
        });
      });
    });
    let o = (e[r.join(",")] = new Nt(r.indexOf(n.length - 1) > -1));
    for (let s = 0; s < i.length; s++) {
      let l = i[s][1].sort(Hl);
      o.next.push({ type: i[s][0], next: e[l.join(",")] || t(l) });
    }
    return o;
  }
}
function Tu(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t],
      o = !i.validEnd,
      s = [];
    for (let l = 0; l < i.next.length; l++) {
      let { type: a, next: c } = i.next[l];
      s.push(a.name),
        o && !(a.isText || a.hasRequiredAttrs()) && (o = !1),
        r.indexOf(c) == -1 && r.push(c);
    }
    o &&
      e.err(
        "Only non-generatable nodes (" +
          s.join(", ") +
          ") in a required position (see https://prosemirror.net/docs/guide/#generatable)"
      );
  }
}
function ql(n) {
  let e = Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault) return null;
    e[t] = r.default;
  }
  return e;
}
function Wl(n, e) {
  let t = Object.create(null);
  for (let r in n) {
    let i = e && e[r];
    if (i === void 0) {
      let o = n[r];
      if (o.hasDefault) i = o.default;
      else throw new RangeError("No value supplied for attribute " + r);
    }
    t[r] = i;
  }
  return t;
}
function Jl(n, e, t, r) {
  for (let i in e)
    if (!(i in n))
      throw new RangeError(`Unsupported attribute ${i} for ${t} of type ${i}`);
  for (let i in n) {
    let o = n[i];
    o.validate && o.validate(e[i]);
  }
}
function Kl(n, e) {
  let t = Object.create(null);
  if (e) for (let r in e) t[r] = new Du(n, r, e[r]);
  return t;
}
let $o = class Gl {
  constructor(e, t, r) {
    (this.name = e),
      (this.schema = t),
      (this.spec = r),
      (this.markSet = null),
      (this.groups = r.group ? r.group.split(" ") : []),
      (this.attrs = Kl(e, r.attrs)),
      (this.defaultAttrs = ql(this.attrs)),
      (this.contentMatch = null),
      (this.inlineContent = null),
      (this.isBlock = !(r.inline || e == "text")),
      (this.isText = e == "text");
  }
  get isInline() {
    return !this.isBlock;
  }
  get isTextblock() {
    return this.isBlock && this.inlineContent;
  }
  get isLeaf() {
    return this.contentMatch == Nt.empty;
  }
  get isAtom() {
    return this.isLeaf || !!this.spec.atom;
  }
  get whitespace() {
    return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
  }
  hasRequiredAttrs() {
    for (let e in this.attrs) if (this.attrs[e].isRequired) return !0;
    return !1;
  }
  compatibleContent(e) {
    return this == e || this.contentMatch.compatible(e.contentMatch);
  }
  computeAttrs(e) {
    return !e && this.defaultAttrs ? this.defaultAttrs : Wl(this.attrs, e);
  }
  create(e = null, t, r) {
    if (this.isText)
      throw new Error("NodeType.create can't construct text nodes");
    return new Ee(this, this.computeAttrs(e), _.from(t), L.setFrom(r));
  }
  createChecked(e = null, t, r) {
    return (
      (t = _.from(t)),
      this.checkContent(t),
      new Ee(this, this.computeAttrs(e), t, L.setFrom(r))
    );
  }
  createAndFill(e = null, t, r) {
    if (((e = this.computeAttrs(e)), (t = _.from(t)), t.size)) {
      let s = this.contentMatch.fillBefore(t);
      if (!s) return null;
      t = s.append(t);
    }
    let i = this.contentMatch.matchFragment(t),
      o = i && i.fillBefore(_.empty, !0);
    return o ? new Ee(this, e, t.append(o), L.setFrom(r)) : null;
  }
  validContent(e) {
    let t = this.contentMatch.matchFragment(e);
    if (!t || !t.validEnd) return !1;
    for (let r = 0; r < e.childCount; r++)
      if (!this.allowsMarks(e.child(r).marks)) return !1;
    return !0;
  }
  checkContent(e) {
    if (!this.validContent(e))
      throw new RangeError(
        `Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`
      );
  }
  checkAttrs(e) {
    Jl(this.attrs, e, "node", this.name);
  }
  allowsMarkType(e) {
    return this.markSet == null || this.markSet.indexOf(e) > -1;
  }
  allowsMarks(e) {
    if (this.markSet == null) return !0;
    for (let t = 0; t < e.length; t++)
      if (!this.allowsMarkType(e[t].type)) return !1;
    return !0;
  }
  allowedMarks(e) {
    if (this.markSet == null) return e;
    let t;
    for (let r = 0; r < e.length; r++)
      this.allowsMarkType(e[r].type)
        ? t && t.push(e[r])
        : t || (t = e.slice(0, r));
    return t ? (t.length ? t : L.none) : e;
  }
  static compile(e, t) {
    let r = Object.create(null);
    e.forEach((o, s) => (r[o] = new Gl(o, t, s)));
    let i = t.spec.topNode || "doc";
    if (!r[i])
      throw new RangeError("Schema is missing its top node type ('" + i + "')");
    if (!r.text) throw new RangeError("Every schema needs a 'text' type");
    for (let o in r.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return r;
  }
};
function Iu(n, e, t) {
  let r = t.split("|");
  return (i) => {
    let o = i === null ? "null" : typeof i;
    if (r.indexOf(o) < 0)
      throw new RangeError(
        `Expected value of type ${r} for attribute ${e} on type ${n}, got ${o}`
      );
  };
}
class Du {
  constructor(e, t, r) {
    (this.hasDefault = Object.prototype.hasOwnProperty.call(r, "default")),
      (this.default = r.default),
      (this.validate =
        typeof r.validate == "string" ? Iu(e, t, r.validate) : r.validate);
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class mr {
  constructor(e, t, r, i) {
    (this.name = e),
      (this.rank = t),
      (this.schema = r),
      (this.spec = i),
      (this.attrs = Kl(e, i.attrs)),
      (this.excluded = null);
    let o = ql(this.attrs);
    this.instance = o ? new L(this, o) : null;
  }
  create(e = null) {
    return !e && this.instance ? this.instance : new L(this, Wl(this.attrs, e));
  }
  static compile(e, t) {
    let r = Object.create(null),
      i = 0;
    return e.forEach((o, s) => (r[o] = new mr(o, i++, t, s))), r;
  }
  removeFromSet(e) {
    for (var t = 0; t < e.length; t++)
      e[t].type == this && ((e = e.slice(0, t).concat(e.slice(t + 1))), t--);
    return e;
  }
  isInSet(e) {
    for (let t = 0; t < e.length; t++) if (e[t].type == this) return e[t];
  }
  checkAttrs(e) {
    Jl(this.attrs, e, "mark", this.name);
  }
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class Yl {
  constructor(e) {
    (this.linebreakReplacement = null), (this.cached = Object.create(null));
    let t = (this.spec = {});
    for (let i in e) t[i] = e[i];
    (t.nodes = re.from(e.nodes)),
      (t.marks = re.from(e.marks || {})),
      (this.nodes = $o.compile(this.spec.nodes, this)),
      (this.marks = mr.compile(this.spec.marks, this));
    let r = Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let o = this.nodes[i],
        s = o.spec.content || "",
        l = o.spec.marks;
      if (
        ((o.contentMatch = r[s] || (r[s] = Nt.parse(s, this.nodes))),
        (o.inlineContent = o.contentMatch.inlineContent),
        o.spec.linebreakReplacement)
      ) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!o.isInline || !o.isLeaf)
          throw new RangeError(
            "Linebreak replacement nodes must be inline leaf nodes"
          );
        this.linebreakReplacement = o;
      }
      o.markSet =
        l == "_"
          ? null
          : l
          ? Vo(this, l.split(" "))
          : l == "" || !o.inlineContent
          ? []
          : null;
    }
    for (let i in this.marks) {
      let o = this.marks[i],
        s = o.spec.excludes;
      o.excluded = s == null ? [o] : s == "" ? [] : Vo(this, s.split(" "));
    }
    (this.nodeFromJSON = this.nodeFromJSON.bind(this)),
      (this.markFromJSON = this.markFromJSON.bind(this)),
      (this.topNodeType = this.nodes[this.spec.topNode || "doc"]),
      (this.cached.wrappings = Object.create(null));
  }
  node(e, t = null, r, i) {
    if (typeof e == "string") e = this.nodeType(e);
    else if (e instanceof $o) {
      if (e.schema != this)
        throw new RangeError(
          "Node type from different schema used (" + e.name + ")"
        );
    } else throw new RangeError("Invalid node type: " + e);
    return e.createChecked(t, r, i);
  }
  text(e, t) {
    let r = this.nodes.text;
    return new Qn(r, r.defaultAttrs, e, L.setFrom(t));
  }
  mark(e, t) {
    return typeof e == "string" && (e = this.marks[e]), e.create(t);
  }
  nodeFromJSON(e) {
    return Ee.fromJSON(this, e);
  }
  markFromJSON(e) {
    return L.fromJSON(this, e);
  }
  nodeType(e) {
    let t = this.nodes[e];
    if (!t) throw new RangeError("Unknown node type: " + e);
    return t;
  }
}
function Vo(n, e) {
  let t = [];
  for (let r = 0; r < e.length; r++) {
    let i = e[r],
      o = n.marks[i],
      s = o;
    if (o) t.push(o);
    else
      for (let l in n.marks) {
        let a = n.marks[l];
        (i == "_" ||
          (a.spec.group && a.spec.group.split(" ").indexOf(i) > -1)) &&
          t.push((s = a));
      }
    if (!s) throw new SyntaxError("Unknown mark type: '" + e[r] + "'");
  }
  return t;
}
function Au(n) {
  return n.tag != null;
}
function Ru(n) {
  return n.style != null;
}
class kn {
  constructor(e, t) {
    (this.schema = e), (this.rules = t), (this.tags = []), (this.styles = []);
    let r = (this.matchedStyles = []);
    t.forEach((i) => {
      if (Au(i)) this.tags.push(i);
      else if (Ru(i)) {
        let o = /[^=]*/.exec(i.style)[0];
        r.indexOf(o) < 0 && r.push(o), this.styles.push(i);
      }
    }),
      (this.normalizeLists = !this.tags.some((i) => {
        if (!/^(ul|ol)\b/.test(i.tag) || !i.node) return !1;
        let o = e.nodes[i.node];
        return o.contentMatch.matchType(o);
      }));
  }
  parse(e, t = {}) {
    let r = new jo(this, t, !1);
    return r.addAll(e, t.from, t.to), r.finish();
  }
  parseSlice(e, t = {}) {
    let r = new jo(this, t, !0);
    return r.addAll(e, t.from, t.to), S.maxOpen(r.finish());
  }
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let o = this.tags[i];
      if (
        Bu(e, o.tag) &&
        (o.namespace === void 0 || e.namespaceURI == o.namespace) &&
        (!o.context || t.matchesContext(o.context))
      ) {
        if (o.getAttrs) {
          let s = o.getAttrs(e);
          if (s === !1) continue;
          o.attrs = s || void 0;
        }
        return o;
      }
    }
  }
  matchStyle(e, t, r, i) {
    for (
      let o = i ? this.styles.indexOf(i) + 1 : 0;
      o < this.styles.length;
      o++
    ) {
      let s = this.styles[o],
        l = s.style;
      if (
        !(
          l.indexOf(e) != 0 ||
          (s.context && !r.matchesContext(s.context)) ||
          (l.length > e.length &&
            (l.charCodeAt(e.length) != 61 || l.slice(e.length + 1) != t))
        )
      ) {
        if (s.getAttrs) {
          let a = s.getAttrs(t);
          if (a === !1) continue;
          s.attrs = a || void 0;
        }
        return s;
      }
    }
  }
  static schemaRules(e) {
    let t = [];
    function r(i) {
      let o = i.priority == null ? 50 : i.priority,
        s = 0;
      for (; s < t.length; s++) {
        let l = t[s];
        if ((l.priority == null ? 50 : l.priority) < o) break;
      }
      t.splice(s, 0, i);
    }
    for (let i in e.marks) {
      let o = e.marks[i].spec.parseDOM;
      o &&
        o.forEach((s) => {
          r((s = Ho(s))), s.mark || s.ignore || s.clearMark || (s.mark = i);
        });
    }
    for (let i in e.nodes) {
      let o = e.nodes[i].spec.parseDOM;
      o &&
        o.forEach((s) => {
          r((s = Ho(s))), s.node || s.ignore || s.mark || (s.node = i);
        });
    }
    return t;
  }
  static fromSchema(e) {
    return (
      e.cached.domParser || (e.cached.domParser = new kn(e, kn.schemaRules(e)))
    );
  }
}
const Xl = {
    address: !0,
    article: !0,
    aside: !0,
    blockquote: !0,
    canvas: !0,
    dd: !0,
    div: !0,
    dl: !0,
    fieldset: !0,
    figcaption: !0,
    figure: !0,
    footer: !0,
    form: !0,
    h1: !0,
    h2: !0,
    h3: !0,
    h4: !0,
    h5: !0,
    h6: !0,
    header: !0,
    hgroup: !0,
    hr: !0,
    li: !0,
    noscript: !0,
    ol: !0,
    output: !0,
    p: !0,
    pre: !0,
    section: !0,
    table: !0,
    tfoot: !0,
    ul: !0,
  },
  Pu = { head: !0, noscript: !0, object: !0, script: !0, style: !0, title: !0 },
  Ql = { ol: !0, ul: !0 },
  Zn = 1,
  er = 2,
  fn = 4;
function Uo(n, e, t) {
  return e != null
    ? (e ? Zn : 0) | (e === "full" ? er : 0)
    : n && n.whitespace == "pre"
    ? Zn | er
    : t & ~fn;
}
class Ln {
  constructor(e, t, r, i, o, s, l) {
    (this.type = e),
      (this.attrs = t),
      (this.marks = r),
      (this.pendingMarks = i),
      (this.solid = o),
      (this.options = l),
      (this.content = []),
      (this.activeMarks = L.none),
      (this.stashMarks = []),
      (this.match = s || (l & fn ? null : e.contentMatch));
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type) return [];
      let t = this.type.contentMatch.fillBefore(_.from(e));
      if (t) this.match = this.type.contentMatch.matchFragment(t);
      else {
        let r = this.type.contentMatch,
          i;
        return (i = r.findWrapping(e.type)) ? ((this.match = r), i) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & Zn)) {
      let r = this.content[this.content.length - 1],
        i;
      if (r && r.isText && (i = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let o = r;
        r.text.length == i[0].length
          ? this.content.pop()
          : (this.content[this.content.length - 1] = o.withText(
              o.text.slice(0, o.text.length - i[0].length)
            ));
      }
    }
    let t = _.from(this.content);
    return (
      !e && this.match && (t = t.append(this.match.fillBefore(_.empty, !0))),
      this.type ? this.type.create(this.attrs, t, this.marks) : t
    );
  }
  popFromStashMark(e) {
    for (let t = this.stashMarks.length - 1; t >= 0; t--)
      if (e.eq(this.stashMarks[t])) return this.stashMarks.splice(t, 1)[0];
  }
  applyPending(e) {
    for (let t = 0, r = this.pendingMarks; t < r.length; t++) {
      let i = r[t];
      (this.type ? this.type.allowsMarkType(i.type) : Lu(i.type, e)) &&
        !i.isInSet(this.activeMarks) &&
        ((this.activeMarks = i.addToSet(this.activeMarks)),
        (this.pendingMarks = i.removeFromSet(this.pendingMarks)));
    }
  }
  inlineContext(e) {
    return this.type
      ? this.type.inlineContent
      : this.content.length
      ? this.content[0].isInline
      : e.parentNode && !Xl.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class jo {
  constructor(e, t, r) {
    (this.parser = e), (this.options = t), (this.isOpen = r), (this.open = 0);
    let i = t.topNode,
      o,
      s = Uo(null, t.preserveWhitespace, 0) | (r ? fn : 0);
    i
      ? (o = new Ln(
          i.type,
          i.attrs,
          L.none,
          L.none,
          !0,
          t.topMatch || i.type.contentMatch,
          s
        ))
      : r
      ? (o = new Ln(null, null, L.none, L.none, !0, null, s))
      : (o = new Ln(e.schema.topNodeType, null, L.none, L.none, !0, null, s)),
      (this.nodes = [o]),
      (this.find = t.findPositions),
      (this.needsBlock = !1);
  }
  get top() {
    return this.nodes[this.open];
  }
  addDOM(e) {
    e.nodeType == 3
      ? this.addTextNode(e)
      : e.nodeType == 1 && this.addElement(e);
  }
  withStyleRules(e, t) {
    let r = e.style;
    if (!r || !r.length) return t();
    let i = this.readStyles(e.style);
    if (!i) return;
    let [o, s] = i,
      l = this.top;
    for (let a = 0; a < s.length; a++) this.removePendingMark(s[a], l);
    for (let a = 0; a < o.length; a++) this.addPendingMark(o[a]);
    t();
    for (let a = 0; a < o.length; a++) this.removePendingMark(o[a], l);
    for (let a = 0; a < s.length; a++) this.addPendingMark(s[a]);
  }
  addTextNode(e) {
    let t = e.nodeValue,
      r = this.top;
    if (r.options & er || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(t)) {
      if (r.options & Zn)
        r.options & er
          ? (t = t.replace(
              /\r\n?/g,
              `
`
            ))
          : (t = t.replace(/\r?\n|\r/g, " "));
      else if (
        ((t = t.replace(/[ \t\r\n\u000c]+/g, " ")),
        /^[ \t\r\n\u000c]/.test(t) && this.open == this.nodes.length - 1)
      ) {
        let i = r.content[r.content.length - 1],
          o = e.previousSibling;
        (!i ||
          (o && o.nodeName == "BR") ||
          (i.isText && /[ \t\r\n\u000c]$/.test(i.text))) &&
          (t = t.slice(1));
      }
      t && this.insertNode(this.parser.schema.text(t)), this.findInText(e);
    } else this.findInside(e);
  }
  addElement(e, t) {
    let r = e.nodeName.toLowerCase(),
      i;
    Ql.hasOwnProperty(r) && this.parser.normalizeLists && zu(e);
    let o =
      (this.options.ruleFromNode && this.options.ruleFromNode(e)) ||
      (i = this.parser.matchTag(e, this, t));
    if (o ? o.ignore : Pu.hasOwnProperty(r))
      this.findInside(e), this.ignoreFallback(e);
    else if (!o || o.skip || o.closeParent) {
      o && o.closeParent
        ? (this.open = Math.max(0, this.open - 1))
        : o && o.skip.nodeType && (e = o.skip);
      let s,
        l = this.top,
        a = this.needsBlock;
      if (Xl.hasOwnProperty(r))
        l.content.length &&
          l.content[0].isInline &&
          this.open &&
          (this.open--, (l = this.top)),
          (s = !0),
          l.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e);
        return;
      }
      o && o.skip
        ? this.addAll(e)
        : this.withStyleRules(e, () => this.addAll(e)),
        s && this.sync(l),
        (this.needsBlock = a);
    } else
      this.withStyleRules(e, () => {
        this.addElementByRule(e, o, o.consuming === !1 ? i : void 0);
      });
  }
  leafFallback(e) {
    e.nodeName == "BR" &&
      this.top.type &&
      this.top.type.inlineContent &&
      this.addTextNode(
        e.ownerDocument.createTextNode(`
`)
      );
  }
  ignoreFallback(e) {
    e.nodeName == "BR" &&
      (!this.top.type || !this.top.type.inlineContent) &&
      this.findPlace(this.parser.schema.text("-"));
  }
  readStyles(e) {
    let t = L.none,
      r = L.none;
    if (e.length)
      for (let i = 0; i < this.parser.matchedStyles.length; i++) {
        let o = this.parser.matchedStyles[i],
          s = e.getPropertyValue(o);
        if (s)
          for (let l = void 0; ; ) {
            let a = this.parser.matchStyle(o, s, this, l);
            if (!a) break;
            if (a.ignore) return null;
            if (
              (a.clearMark
                ? this.top.pendingMarks
                    .concat(this.top.activeMarks)
                    .forEach((c) => {
                      a.clearMark(c) && (r = c.addToSet(r));
                    })
                : (t = this.parser.schema.marks[a.mark]
                    .create(a.attrs)
                    .addToSet(t)),
              a.consuming === !1)
            )
              l = a;
            else break;
          }
      }
    return [t, r];
  }
  addElementByRule(e, t, r) {
    let i, o, s;
    t.node
      ? ((o = this.parser.schema.nodes[t.node]),
        o.isLeaf
          ? this.insertNode(o.create(t.attrs)) || this.leafFallback(e)
          : (i = this.enter(o, t.attrs || null, t.preserveWhitespace)))
      : ((s = this.parser.schema.marks[t.mark].create(t.attrs)),
        this.addPendingMark(s));
    let l = this.top;
    if (o && o.isLeaf) this.findInside(e);
    else if (r) this.addElement(e, r);
    else if (t.getContent)
      this.findInside(e),
        t.getContent(e, this.parser.schema).forEach((a) => this.insertNode(a));
    else {
      let a = e;
      typeof t.contentElement == "string"
        ? (a = e.querySelector(t.contentElement))
        : typeof t.contentElement == "function"
        ? (a = t.contentElement(e))
        : t.contentElement && (a = t.contentElement),
        this.findAround(e, a, !0),
        this.addAll(a);
    }
    i && this.sync(l) && this.open--, s && this.removePendingMark(s, l);
  }
  addAll(e, t, r) {
    let i = t || 0;
    for (
      let o = t ? e.childNodes[t] : e.firstChild,
        s = r == null ? null : e.childNodes[r];
      o != s;
      o = o.nextSibling, ++i
    )
      this.findAtPoint(e, i), this.addDOM(o);
    this.findAtPoint(e, i);
  }
  findPlace(e) {
    let t, r;
    for (let i = this.open; i >= 0; i--) {
      let o = this.nodes[i],
        s = o.findWrapping(e);
      if (
        (s && (!t || t.length > s.length) && ((t = s), (r = o), !s.length)) ||
        o.solid
      )
        break;
    }
    if (!t) return !1;
    this.sync(r);
    for (let i = 0; i < t.length; i++) this.enterInner(t[i], null, !1);
    return !0;
  }
  insertNode(e) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let t = this.textblockFromContext();
      t && this.enterInner(t);
    }
    if (this.findPlace(e)) {
      this.closeExtra();
      let t = this.top;
      t.applyPending(e.type), t.match && (t.match = t.match.matchType(e.type));
      let r = t.activeMarks;
      for (let i = 0; i < e.marks.length; i++)
        (!t.type || t.type.allowsMarkType(e.marks[i].type)) &&
          (r = e.marks[i].addToSet(r));
      return t.content.push(e.mark(r)), !0;
    }
    return !1;
  }
  enter(e, t, r) {
    let i = this.findPlace(e.create(t));
    return i && this.enterInner(e, t, !0, r), i;
  }
  enterInner(e, t = null, r = !1, i) {
    this.closeExtra();
    let o = this.top;
    o.applyPending(e), (o.match = o.match && o.match.matchType(e));
    let s = Uo(e, i, o.options);
    o.options & fn && o.content.length == 0 && (s |= fn),
      this.nodes.push(new Ln(e, t, o.activeMarks, o.pendingMarks, r, null, s)),
      this.open++;
  }
  closeExtra(e = !1) {
    let t = this.nodes.length - 1;
    if (t > this.open) {
      for (; t > this.open; t--)
        this.nodes[t - 1].content.push(this.nodes[t].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return (
      (this.open = 0),
      this.closeExtra(this.isOpen),
      this.nodes[0].finish(this.isOpen || this.options.topOpen)
    );
  }
  sync(e) {
    for (let t = this.open; t >= 0; t--)
      if (this.nodes[t] == e) return (this.open = t), !0;
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let r = this.nodes[t].content;
      for (let i = r.length - 1; i >= 0; i--) e += r[i].nodeSize;
      t && e++;
    }
    return e;
  }
  findAtPoint(e, t) {
    if (this.find)
      for (let r = 0; r < this.find.length; r++)
        this.find[r].node == e &&
          this.find[r].offset == t &&
          (this.find[r].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].pos == null &&
          e.nodeType == 1 &&
          e.contains(this.find[t].node) &&
          (this.find[t].pos = this.currentPos);
  }
  findAround(e, t, r) {
    if (e != t && this.find)
      for (let i = 0; i < this.find.length; i++)
        this.find[i].pos == null &&
          e.nodeType == 1 &&
          e.contains(this.find[i].node) &&
          t.compareDocumentPosition(this.find[i].node) & (r ? 2 : 4) &&
          (this.find[i].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].node == e &&
          (this.find[t].pos =
            this.currentPos - (e.nodeValue.length - this.find[t].offset));
  }
  matchesContext(e) {
    if (e.indexOf("|") > -1)
      return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let t = e.split("/"),
      r = this.options.context,
      i = !this.isOpen && (!r || r.parent.type == this.nodes[0].type),
      o = -(r ? r.depth + 1 : 0) + (i ? 0 : 1),
      s = (l, a) => {
        for (; l >= 0; l--) {
          let c = t[l];
          if (c == "") {
            if (l == t.length - 1 || l == 0) continue;
            for (; a >= o; a--) if (s(l - 1, a)) return !0;
            return !1;
          } else {
            let d =
              a > 0 || (a == 0 && i)
                ? this.nodes[a].type
                : r && a >= o
                ? r.node(a - o).type
                : null;
            if (!d || (d.name != c && d.groups.indexOf(c) == -1)) return !1;
            a--;
          }
        }
        return !0;
      };
    return s(t.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let t = e.depth; t >= 0; t--) {
        let r = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
        if (r && r.isTextblock && r.defaultAttrs) return r;
      }
    for (let t in this.parser.schema.nodes) {
      let r = this.parser.schema.nodes[t];
      if (r.isTextblock && r.defaultAttrs) return r;
    }
  }
  addPendingMark(e) {
    let t = Fu(e, this.top.pendingMarks);
    t && this.top.stashMarks.push(t),
      (this.top.pendingMarks = e.addToSet(this.top.pendingMarks));
  }
  removePendingMark(e, t) {
    for (let r = this.open; r >= 0; r--) {
      let i = this.nodes[r];
      if (i.pendingMarks.lastIndexOf(e) > -1)
        i.pendingMarks = e.removeFromSet(i.pendingMarks);
      else {
        i.activeMarks = e.removeFromSet(i.activeMarks);
        let s = i.popFromStashMark(e);
        s &&
          i.type &&
          i.type.allowsMarkType(s.type) &&
          (i.activeMarks = s.addToSet(i.activeMarks));
      }
      if (i == t) break;
    }
  }
}
function zu(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && Ql.hasOwnProperty(r) && t
      ? (t.appendChild(e), (e = t))
      : r == "li"
      ? (t = e)
      : r && (t = null);
  }
}
function Bu(n, e) {
  return (
    n.matches ||
    n.msMatchesSelector ||
    n.webkitMatchesSelector ||
    n.mozMatchesSelector
  ).call(n, e);
}
function Ho(n) {
  let e = {};
  for (let t in n) e[t] = n[t];
  return e;
}
function Lu(n, e) {
  let t = e.schema.nodes;
  for (let r in t) {
    let i = t[r];
    if (!i.allowsMarkType(n)) continue;
    let o = [],
      s = (l) => {
        o.push(l);
        for (let a = 0; a < l.edgeCount; a++) {
          let { type: c, next: d } = l.edge(a);
          if (c == e || (o.indexOf(d) < 0 && s(d))) return !0;
        }
      };
    if (s(i.contentMatch)) return !0;
  }
}
function Fu(n, e) {
  for (let t = 0; t < e.length; t++) if (n.eq(e[t])) return e[t];
}
class tn {
  constructor(e, t) {
    (this.nodes = e), (this.marks = t);
  }
  serializeFragment(e, t = {}, r) {
    r || (r = Dr(t).createDocumentFragment());
    let i = r,
      o = [];
    return (
      e.forEach((s) => {
        if (o.length || s.marks.length) {
          let l = 0,
            a = 0;
          for (; l < o.length && a < s.marks.length; ) {
            let c = s.marks[a];
            if (!this.marks[c.type.name]) {
              a++;
              continue;
            }
            if (!c.eq(o[l][0]) || c.type.spec.spanning === !1) break;
            l++, a++;
          }
          for (; l < o.length; ) i = o.pop()[1];
          for (; a < s.marks.length; ) {
            let c = s.marks[a++],
              d = this.serializeMark(c, s.isInline, t);
            d &&
              (o.push([c, i]),
              i.appendChild(d.dom),
              (i = d.contentDOM || d.dom));
          }
        }
        i.appendChild(this.serializeNodeInner(s, t));
      }),
      r
    );
  }
  serializeNodeInner(e, t) {
    let { dom: r, contentDOM: i } = jn(
      Dr(t),
      this.nodes[e.type.name](e),
      null,
      e.attrs
    );
    if (i) {
      if (e.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, t, i);
    }
    return r;
  }
  serializeNode(e, t = {}) {
    let r = this.serializeNodeInner(e, t);
    for (let i = e.marks.length - 1; i >= 0; i--) {
      let o = this.serializeMark(e.marks[i], e.isInline, t);
      o && ((o.contentDOM || o.dom).appendChild(r), (r = o.dom));
    }
    return r;
  }
  serializeMark(e, t, r = {}) {
    let i = this.marks[e.type.name];
    return i && jn(Dr(r), i(e, t), null, e.attrs);
  }
  static renderSpec(e, t, r = null, i) {
    return jn(e, t, r, i);
  }
  static fromSchema(e) {
    return (
      e.cached.domSerializer ||
      (e.cached.domSerializer = new tn(
        this.nodesFromSchema(e),
        this.marksFromSchema(e)
      ))
    );
  }
  static nodesFromSchema(e) {
    let t = qo(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  static marksFromSchema(e) {
    return qo(e.marks);
  }
}
function qo(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function Dr(n) {
  return n.document || window.document;
}
const Wo = new WeakMap();
function $u(n) {
  let e = Wo.get(n);
  return e === void 0 && Wo.set(n, (e = Vu(n))), e;
}
function Vu(n) {
  let e = null;
  function t(r) {
    if (r && typeof r == "object")
      if (Array.isArray(r))
        if (typeof r[0] == "string") e || (e = []), e.push(r);
        else for (let i = 0; i < r.length; i++) t(r[i]);
      else for (let i in r) t(r[i]);
  }
  return t(n), e;
}
function jn(n, e, t, r) {
  if (typeof e == "string") return { dom: n.createTextNode(e) };
  if (e.nodeType != null) return { dom: e };
  if (e.dom && e.dom.nodeType != null) return e;
  let i = e[0],
    o;
  if (typeof i != "string")
    throw new RangeError("Invalid array passed to renderSpec");
  if (r && (o = $u(r)) && o.indexOf(e) > -1)
    throw new RangeError(
      "Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack."
    );
  let s = i.indexOf(" ");
  s > 0 && ((t = i.slice(0, s)), (i = i.slice(s + 1)));
  let l,
    a = t ? n.createElementNS(t, i) : n.createElement(i),
    c = e[1],
    d = 1;
  if (c && typeof c == "object" && c.nodeType == null && !Array.isArray(c)) {
    d = 2;
    for (let f in c)
      if (c[f] != null) {
        let h = f.indexOf(" ");
        h > 0
          ? a.setAttributeNS(f.slice(0, h), f.slice(h + 1), c[f])
          : a.setAttribute(f, c[f]);
      }
  }
  for (let f = d; f < e.length; f++) {
    let h = e[f];
    if (h === 0) {
      if (f < e.length - 1 || f > d)
        throw new RangeError(
          "Content hole must be the only child of its parent node"
        );
      return { dom: a, contentDOM: a };
    } else {
      let { dom: p, contentDOM: m } = jn(n, h, t, r);
      if ((a.appendChild(p), m)) {
        if (l) throw new RangeError("Multiple content holes");
        l = m;
      }
    }
  }
  return { dom: a, contentDOM: l };
}
const Zl = 65535,
  ea = Math.pow(2, 16);
function Uu(n, e) {
  return n + e * ea;
}
function Jo(n) {
  return n & Zl;
}
function ju(n) {
  return (n - (n & Zl)) / ea;
}
const ta = 1,
  na = 2,
  Hn = 4,
  ra = 8;
class ci {
  constructor(e, t, r) {
    (this.pos = e), (this.delInfo = t), (this.recover = r);
  }
  get deleted() {
    return (this.delInfo & ra) > 0;
  }
  get deletedBefore() {
    return (this.delInfo & (ta | Hn)) > 0;
  }
  get deletedAfter() {
    return (this.delInfo & (na | Hn)) > 0;
  }
  get deletedAcross() {
    return (this.delInfo & Hn) > 0;
  }
}
class ye {
  constructor(e, t = !1) {
    if (((this.ranges = e), (this.inverted = t), !e.length && ye.empty))
      return ye.empty;
  }
  recover(e) {
    let t = 0,
      r = Jo(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + ju(e);
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  map(e, t = 1) {
    return this._map(e, t, !0);
  }
  _map(e, t, r) {
    let i = 0,
      o = this.inverted ? 2 : 1,
      s = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? i : 0);
      if (a > e) break;
      let c = this.ranges[l + o],
        d = this.ranges[l + s],
        f = a + c;
      if (e <= f) {
        let h = c ? (e == a ? -1 : e == f ? 1 : t) : t,
          p = a + i + (h < 0 ? 0 : d);
        if (r) return p;
        let m = e == (t < 0 ? a : f) ? null : Uu(l / 3, e - a),
          g = e == a ? na : e == f ? ta : Hn;
        return (t < 0 ? e != a : e != f) && (g |= ra), new ci(p, g, m);
      }
      i += d - c;
    }
    return r ? e + i : new ci(e + i, 0, null);
  }
  touches(e, t) {
    let r = 0,
      i = Jo(t),
      o = this.inverted ? 2 : 1,
      s = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? r : 0);
      if (a > e) break;
      let c = this.ranges[l + o],
        d = a + c;
      if (e <= d && l == i * 3) return !0;
      r += this.ranges[l + s] - c;
    }
    return !1;
  }
  forEach(e) {
    let t = this.inverted ? 2 : 1,
      r = this.inverted ? 1 : 2;
    for (let i = 0, o = 0; i < this.ranges.length; i += 3) {
      let s = this.ranges[i],
        l = s - (this.inverted ? o : 0),
        a = s + (this.inverted ? 0 : o),
        c = this.ranges[i + t],
        d = this.ranges[i + r];
      e(l, l + c, a, a + d), (o += d - c);
    }
  }
  invert() {
    return new ye(this.ranges, !this.inverted);
  }
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  static offset(e) {
    return e == 0 ? ye.empty : new ye(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
ye.empty = new ye([]);
class Ut {
  constructor(e = [], t, r = 0, i = e.length) {
    (this.maps = e), (this.mirror = t), (this.from = r), (this.to = i);
  }
  slice(e = 0, t = this.maps.length) {
    return new Ut(this.maps, this.mirror, e, t);
  }
  copy() {
    return new Ut(
      this.maps.slice(),
      this.mirror && this.mirror.slice(),
      this.from,
      this.to
    );
  }
  appendMap(e, t) {
    (this.to = this.maps.push(e)),
      t != null && this.setMirror(this.maps.length - 1, t);
  }
  appendMapping(e) {
    for (let t = 0, r = this.maps.length; t < e.maps.length; t++) {
      let i = e.getMirror(t);
      this.appendMap(e.maps[t], i != null && i < t ? r + i : void 0);
    }
  }
  getMirror(e) {
    if (this.mirror) {
      for (let t = 0; t < this.mirror.length; t++)
        if (this.mirror[t] == e) return this.mirror[t + (t % 2 ? -1 : 1)];
    }
  }
  setMirror(e, t) {
    this.mirror || (this.mirror = []), this.mirror.push(e, t);
  }
  appendMappingInverted(e) {
    for (
      let t = e.maps.length - 1, r = this.maps.length + e.maps.length;
      t >= 0;
      t--
    ) {
      let i = e.getMirror(t);
      this.appendMap(
        e.maps[t].invert(),
        i != null && i > t ? r - i - 1 : void 0
      );
    }
  }
  invert() {
    let e = new Ut();
    return e.appendMappingInverted(this), e;
  }
  map(e, t = 1) {
    if (this.mirror) return this._map(e, t, !0);
    for (let r = this.from; r < this.to; r++) e = this.maps[r].map(e, t);
    return e;
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  _map(e, t, r) {
    let i = 0;
    for (let o = this.from; o < this.to; o++) {
      let s = this.maps[o],
        l = s.mapResult(e, t);
      if (l.recover != null) {
        let a = this.getMirror(o);
        if (a != null && a > o && a < this.to) {
          (o = a), (e = this.maps[a].recover(l.recover));
          continue;
        }
      }
      (i |= l.delInfo), (e = l.pos);
    }
    return r ? e : new ci(e, i, null);
  }
}
const Ar = Object.create(null);
class fe {
  getMap() {
    return ye.empty;
  }
  merge(e) {
    return null;
  }
  static fromJSON(e, t) {
    if (!t || !t.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let r = Ar[t.stepType];
    if (!r) throw new RangeError(`No step type ${t.stepType} defined`);
    return r.fromJSON(e, t);
  }
  static jsonID(e, t) {
    if (e in Ar) throw new RangeError("Duplicate use of step JSON ID " + e);
    return (Ar[e] = t), (t.prototype.jsonID = e), t;
  }
}
class Q {
  constructor(e, t) {
    (this.doc = e), (this.failed = t);
  }
  static ok(e) {
    return new Q(e, null);
  }
  static fail(e) {
    return new Q(null, e);
  }
  static fromReplace(e, t, r, i) {
    try {
      return Q.ok(e.replace(t, r, i));
    } catch (o) {
      if (o instanceof Gn) return Q.fail(o.message);
      throw o;
    }
  }
}
function $i(n, e, t) {
  let r = [];
  for (let i = 0; i < n.childCount; i++) {
    let o = n.child(i);
    o.content.size && (o = o.copy($i(o.content, e, o))),
      o.isInline && (o = e(o, t, i)),
      r.push(o);
  }
  return _.fromArray(r);
}
class nt extends fe {
  constructor(e, t, r) {
    super(), (this.from = e), (this.to = t), (this.mark = r);
  }
  apply(e) {
    let t = e.slice(this.from, this.to),
      r = e.resolve(this.from),
      i = r.node(r.sharedDepth(this.to)),
      o = new S(
        $i(
          t.content,
          (s, l) =>
            !s.isAtom || !l.type.allowsMarkType(this.mark.type)
              ? s
              : s.mark(this.mark.addToSet(s.marks)),
          i
        ),
        t.openStart,
        t.openEnd
      );
    return Q.fromReplace(e, this.from, this.to, o);
  }
  invert() {
    return new ze(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      r = e.mapResult(this.to, -1);
    return (t.deleted && r.deleted) || t.pos >= r.pos
      ? null
      : new nt(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof nt &&
      e.mark.eq(this.mark) &&
      this.from <= e.to &&
      this.to >= e.from
      ? new nt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark)
      : null;
  }
  toJSON() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to,
    };
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new nt(t.from, t.to, e.markFromJSON(t.mark));
  }
}
fe.jsonID("addMark", nt);
class ze extends fe {
  constructor(e, t, r) {
    super(), (this.from = e), (this.to = t), (this.mark = r);
  }
  apply(e) {
    let t = e.slice(this.from, this.to),
      r = new S(
        $i(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e),
        t.openStart,
        t.openEnd
      );
    return Q.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new nt(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      r = e.mapResult(this.to, -1);
    return (t.deleted && r.deleted) || t.pos >= r.pos
      ? null
      : new ze(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof ze &&
      e.mark.eq(this.mark) &&
      this.from <= e.to &&
      this.to >= e.from
      ? new ze(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark)
      : null;
  }
  toJSON() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to,
    };
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new ze(t.from, t.to, e.markFromJSON(t.mark));
  }
}
fe.jsonID("removeMark", ze);
class rt extends fe {
  constructor(e, t) {
    super(), (this.pos = e), (this.mark = t);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return Q.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return Q.fromReplace(
      e,
      this.pos,
      this.pos + 1,
      new S(_.from(r), 0, t.isLeaf ? 0 : 1)
    );
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(r)) return new rt(this.pos, t.marks[i]);
        return new rt(this.pos, this.mark);
      }
    }
    return new Kt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new rt(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new rt(t.pos, e.markFromJSON(t.mark));
  }
}
fe.jsonID("addNodeMark", rt);
class Kt extends fe {
  constructor(e, t) {
    super(), (this.pos = e), (this.mark = t);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return Q.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return Q.fromReplace(
      e,
      this.pos,
      this.pos + 1,
      new S(_.from(r), 0, t.isLeaf ? 0 : 1)
    );
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks)
      ? this
      : new rt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Kt(t.pos, this.mark);
  }
  toJSON() {
    return {
      stepType: "removeNodeMark",
      pos: this.pos,
      mark: this.mark.toJSON(),
    };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new Kt(t.pos, e.markFromJSON(t.mark));
  }
}
fe.jsonID("removeNodeMark", Kt);
class ce extends fe {
  constructor(e, t, r, i = !1) {
    super(),
      (this.from = e),
      (this.to = t),
      (this.slice = r),
      (this.structure = i);
  }
  apply(e) {
    return this.structure && di(e, this.from, this.to)
      ? Q.fail("Structure replace would overwrite content")
      : Q.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new ye([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new ce(
      this.from,
      this.from + this.slice.size,
      e.slice(this.from, this.to)
    );
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      r = e.mapResult(this.to, -1);
    return t.deletedAcross && r.deletedAcross
      ? null
      : new ce(t.pos, Math.max(t.pos, r.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof ce) || e.structure || this.structure) return null;
    if (
      this.from + this.slice.size == e.from &&
      !this.slice.openEnd &&
      !e.slice.openStart
    ) {
      let t =
        this.slice.size + e.slice.size == 0
          ? S.empty
          : new S(
              this.slice.content.append(e.slice.content),
              this.slice.openStart,
              e.slice.openEnd
            );
      return new ce(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t =
        this.slice.size + e.slice.size == 0
          ? S.empty
          : new S(
              e.slice.content.append(this.slice.content),
              e.slice.openStart,
              this.slice.openEnd
            );
      return new ce(e.from, this.to, t, this.structure);
    } else return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return (
      this.slice.size && (e.slice = this.slice.toJSON()),
      this.structure && (e.structure = !0),
      e
    );
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new ce(t.from, t.to, S.fromJSON(e, t.slice), !!t.structure);
  }
}
fe.jsonID("replace", ce);
class le extends fe {
  constructor(e, t, r, i, o, s, l = !1) {
    super(),
      (this.from = e),
      (this.to = t),
      (this.gapFrom = r),
      (this.gapTo = i),
      (this.slice = o),
      (this.insert = s),
      (this.structure = l);
  }
  apply(e) {
    if (
      this.structure &&
      (di(e, this.from, this.gapFrom) || di(e, this.gapTo, this.to))
    )
      return Q.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd) return Q.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r
      ? Q.fromReplace(e, this.from, this.to, r)
      : Q.fail("Content does not fit in gap");
  }
  getMap() {
    return new ye([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert,
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new le(
      this.from,
      this.from + this.slice.size + t,
      this.from + this.insert,
      this.from + this.insert + t,
      e
        .slice(this.from, this.to)
        .removeBetween(this.gapFrom - this.from, this.gapTo - this.from),
      this.gapFrom - this.from,
      this.structure
    );
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      r = e.mapResult(this.to, -1),
      i = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1),
      o = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return (t.deletedAcross && r.deletedAcross) || i < t.pos || o > r.pos
      ? null
      : new le(t.pos, r.pos, i, o, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert,
    };
    return (
      this.slice.size && (e.slice = this.slice.toJSON()),
      this.structure && (e.structure = !0),
      e
    );
  }
  static fromJSON(e, t) {
    if (
      typeof t.from != "number" ||
      typeof t.to != "number" ||
      typeof t.gapFrom != "number" ||
      typeof t.gapTo != "number" ||
      typeof t.insert != "number"
    )
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new le(
      t.from,
      t.to,
      t.gapFrom,
      t.gapTo,
      S.fromJSON(e, t.slice),
      t.insert,
      !!t.structure
    );
  }
}
fe.jsonID("replaceAround", le);
function di(n, e, t) {
  let r = n.resolve(e),
    i = t - e,
    o = r.depth;
  for (; i > 0 && o > 0 && r.indexAfter(o) == r.node(o).childCount; ) o--, i--;
  if (i > 0) {
    let s = r.node(o).maybeChild(r.indexAfter(o));
    for (; i > 0; ) {
      if (!s || s.isLeaf) return !0;
      (s = s.firstChild), i--;
    }
  }
  return !1;
}
function Hu(n, e, t, r) {
  let i = [],
    o = [],
    s,
    l;
  n.doc.nodesBetween(e, t, (a, c, d) => {
    if (!a.isInline) return;
    let f = a.marks;
    if (!r.isInSet(f) && d.type.allowsMarkType(r.type)) {
      let h = Math.max(c, e),
        p = Math.min(c + a.nodeSize, t),
        m = r.addToSet(f);
      for (let g = 0; g < f.length; g++)
        f[g].isInSet(m) ||
          (s && s.to == h && s.mark.eq(f[g])
            ? (s.to = p)
            : i.push((s = new ze(h, p, f[g]))));
      l && l.to == h ? (l.to = p) : o.push((l = new nt(h, p, r)));
    }
  }),
    i.forEach((a) => n.step(a)),
    o.forEach((a) => n.step(a));
}
function qu(n, e, t, r) {
  let i = [],
    o = 0;
  n.doc.nodesBetween(e, t, (s, l) => {
    if (!s.isInline) return;
    o++;
    let a = null;
    if (r instanceof mr) {
      let c = s.marks,
        d;
      for (; (d = r.isInSet(c)); )
        (a || (a = [])).push(d), (c = d.removeFromSet(c));
    } else r ? r.isInSet(s.marks) && (a = [r]) : (a = s.marks);
    if (a && a.length) {
      let c = Math.min(l + s.nodeSize, t);
      for (let d = 0; d < a.length; d++) {
        let f = a[d],
          h;
        for (let p = 0; p < i.length; p++) {
          let m = i[p];
          m.step == o - 1 && f.eq(i[p].style) && (h = m);
        }
        h
          ? ((h.to = c), (h.step = o))
          : i.push({ style: f, from: Math.max(l, e), to: c, step: o });
      }
    }
  }),
    i.forEach((s) => n.step(new ze(s.from, s.to, s.style)));
}
function ia(n, e, t, r = t.contentMatch, i = !0) {
  let o = n.doc.nodeAt(e),
    s = [],
    l = e + 1;
  for (let a = 0; a < o.childCount; a++) {
    let c = o.child(a),
      d = l + c.nodeSize,
      f = r.matchType(c.type);
    if (!f) s.push(new ce(l, d, S.empty));
    else {
      r = f;
      for (let h = 0; h < c.marks.length; h++)
        t.allowsMarkType(c.marks[h].type) || n.step(new ze(l, d, c.marks[h]));
      if (i && c.isText && t.whitespace != "pre") {
        let h,
          p = /\r?\n|\r/g,
          m;
        for (; (h = p.exec(c.text)); )
          m ||
            (m = new S(
              _.from(t.schema.text(" ", t.allowedMarks(c.marks))),
              0,
              0
            )),
            s.push(new ce(l + h.index, l + h.index + h[0].length, m));
      }
    }
    l = d;
  }
  if (!r.validEnd) {
    let a = r.fillBefore(_.empty, !0);
    n.replace(l, l, new S(a, 0, 0));
  }
  for (let a = s.length - 1; a >= 0; a--) n.step(s[a]);
}
function Wu(n, e, t) {
  return (
    (e == 0 || n.canReplace(e, n.childCount)) &&
    (t == n.childCount || n.canReplace(0, t))
  );
}
function Nn(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth; ; --r) {
    let i = n.$from.node(r),
      o = n.$from.index(r),
      s = n.$to.indexAfter(r);
    if (r < n.depth && i.canReplace(o, s, t)) return r;
    if (r == 0 || i.type.spec.isolating || !Wu(i, o, s)) break;
  }
  return null;
}
function Ju(n, e, t) {
  let { $from: r, $to: i, depth: o } = e,
    s = r.before(o + 1),
    l = i.after(o + 1),
    a = s,
    c = l,
    d = _.empty,
    f = 0;
  for (let m = o, g = !1; m > t; m--)
    g || r.index(m) > 0
      ? ((g = !0), (d = _.from(r.node(m).copy(d))), f++)
      : a--;
  let h = _.empty,
    p = 0;
  for (let m = o, g = !1; m > t; m--)
    g || i.after(m + 1) < i.end(m)
      ? ((g = !0), (h = _.from(i.node(m).copy(h))), p++)
      : c++;
  n.step(new le(a, c, s, l, new S(d.append(h), f, p), d.size - f, !0));
}
function Vi(n, e, t = null, r = n) {
  let i = Ku(n, e),
    o = i && Gu(r, e);
  return o ? i.map(Ko).concat({ type: e, attrs: t }).concat(o.map(Ko)) : null;
}
function Ko(n) {
  return { type: n, attrs: null };
}
function Ku(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n,
    o = t.contentMatchAt(r).findWrapping(e);
  if (!o) return null;
  let s = o.length ? o[0] : e;
  return t.canReplaceWith(r, i, s) ? o : null;
}
function Gu(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n,
    o = t.child(r),
    s = e.contentMatch.findWrapping(o.type);
  if (!s) return null;
  let a = (s.length ? s[s.length - 1] : e).contentMatch;
  for (let c = r; a && c < i; c++) a = a.matchType(t.child(c).type);
  return !a || !a.validEnd ? null : s;
}
function Yu(n, e, t) {
  let r = _.empty;
  for (let s = t.length - 1; s >= 0; s--) {
    if (r.size) {
      let l = t[s].type.contentMatch.matchFragment(r);
      if (!l || !l.validEnd)
        throw new RangeError(
          "Wrapper type given to Transform.wrap does not form valid content of its parent wrapper"
        );
    }
    r = _.from(t[s].type.create(t[s].attrs, r));
  }
  let i = e.start,
    o = e.end;
  n.step(new le(i, o, i, o, new S(r, 0, 0), t.length, !0));
}
function Xu(n, e, t, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let o = n.steps.length;
  n.doc.nodesBetween(e, t, (s, l) => {
    if (
      s.isTextblock &&
      !s.hasMarkup(r, i) &&
      ef(n.doc, n.mapping.slice(o).map(l), r)
    ) {
      let a = null;
      if (r.schema.linebreakReplacement) {
        let h = r.whitespace == "pre",
          p = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        h && !p ? (a = !1) : !h && p && (a = !0);
      }
      a === !1 && Zu(n, s, l, o),
        ia(n, n.mapping.slice(o).map(l, 1), r, void 0, a === null);
      let c = n.mapping.slice(o),
        d = c.map(l, 1),
        f = c.map(l + s.nodeSize, 1);
      return (
        n.step(
          new le(
            d,
            f,
            d + 1,
            f - 1,
            new S(_.from(r.create(i, null, s.marks)), 0, 0),
            1,
            !0
          )
        ),
        a === !0 && Qu(n, s, l, o),
        !1
      );
    }
  });
}
function Qu(n, e, t, r) {
  e.forEach((i, o) => {
    if (i.isText) {
      let s,
        l = /\r?\n|\r/g;
      for (; (s = l.exec(i.text)); ) {
        let a = n.mapping.slice(r).map(t + 1 + o + s.index);
        n.replaceWith(a, a + 1, e.type.schema.linebreakReplacement.create());
      }
    }
  });
}
function Zu(n, e, t, r) {
  e.forEach((i, o) => {
    if (i.type == i.type.schema.linebreakReplacement) {
      let s = n.mapping.slice(r).map(t + 1 + o);
      n.replaceWith(
        s,
        s + 1,
        e.type.schema.text(`
`)
      );
    }
  });
}
function ef(n, e, t) {
  let r = n.resolve(e),
    i = r.index();
  return r.parent.canReplaceWith(i, i + 1, t);
}
function tf(n, e, t, r, i) {
  let o = n.doc.nodeAt(e);
  if (!o) throw new RangeError("No node at given position");
  t || (t = o.type);
  let s = t.create(r, null, i || o.marks);
  if (o.isLeaf) return n.replaceWith(e, e + o.nodeSize, s);
  if (!t.validContent(o.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(
    new le(
      e,
      e + o.nodeSize,
      e + 1,
      e + o.nodeSize - 1,
      new S(_.from(s), 0, 0),
      1,
      !0
    )
  );
}
function jt(n, e, t = 1, r) {
  let i = n.resolve(e),
    o = i.depth - t,
    s = (r && r[r.length - 1]) || i.parent;
  if (
    o < 0 ||
    i.parent.type.spec.isolating ||
    !i.parent.canReplace(i.index(), i.parent.childCount) ||
    !s.type.validContent(
      i.parent.content.cutByIndex(i.index(), i.parent.childCount)
    )
  )
    return !1;
  for (let c = i.depth - 1, d = t - 2; c > o; c--, d--) {
    let f = i.node(c),
      h = i.index(c);
    if (f.type.spec.isolating) return !1;
    let p = f.content.cutByIndex(h, f.childCount),
      m = r && r[d + 1];
    m && (p = p.replaceChild(0, m.type.create(m.attrs)));
    let g = (r && r[d]) || f;
    if (!f.canReplace(h + 1, f.childCount) || !g.type.validContent(p))
      return !1;
  }
  let l = i.indexAfter(o),
    a = r && r[0];
  return i.node(o).canReplaceWith(l, l, a ? a.type : i.node(o + 1).type);
}
function nf(n, e, t = 1, r) {
  let i = n.doc.resolve(e),
    o = _.empty,
    s = _.empty;
  for (let l = i.depth, a = i.depth - t, c = t - 1; l > a; l--, c--) {
    o = _.from(i.node(l).copy(o));
    let d = r && r[c];
    s = _.from(d ? d.type.create(d.attrs, s) : i.node(l).copy(s));
  }
  n.step(new ce(e, e, new S(o.append(s), t, t), !0));
}
function nn(n, e) {
  let t = n.resolve(e),
    r = t.index();
  return oa(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function oa(n, e) {
  return !!(n && e && !n.isLeaf && n.canAppend(e));
}
function sa(n, e, t = -1) {
  let r = n.resolve(e);
  for (let i = r.depth; ; i--) {
    let o,
      s,
      l = r.index(i);
    if (
      (i == r.depth
        ? ((o = r.nodeBefore), (s = r.nodeAfter))
        : t > 0
        ? ((o = r.node(i + 1)), l++, (s = r.node(i).maybeChild(l)))
        : ((o = r.node(i).maybeChild(l - 1)), (s = r.node(i + 1))),
      o && !o.isTextblock && oa(o, s) && r.node(i).canReplace(l, l + 1))
    )
      return e;
    if (i == 0) break;
    e = t < 0 ? r.before(i) : r.after(i);
  }
}
function rf(n, e, t) {
  let r = new ce(e - t, e + t, S.empty, !0);
  n.step(r);
}
function of(n, e, t) {
  let r = n.resolve(e);
  if (r.parent.canReplaceWith(r.index(), r.index(), t)) return e;
  if (r.parentOffset == 0)
    for (let i = r.depth - 1; i >= 0; i--) {
      let o = r.index(i);
      if (r.node(i).canReplaceWith(o, o, t)) return r.before(i + 1);
      if (o > 0) return null;
    }
  if (r.parentOffset == r.parent.content.size)
    for (let i = r.depth - 1; i >= 0; i--) {
      let o = r.indexAfter(i);
      if (r.node(i).canReplaceWith(o, o, t)) return r.after(i + 1);
      if (o < r.node(i).childCount) return null;
    }
  return null;
}
function sf(n, e, t) {
  let r = n.resolve(e);
  if (!t.content.size) return e;
  let i = t.content;
  for (let o = 0; o < t.openStart; o++) i = i.firstChild.content;
  for (let o = 1; o <= (t.openStart == 0 && t.size ? 2 : 1); o++)
    for (let s = r.depth; s >= 0; s--) {
      let l =
          s == r.depth
            ? 0
            : r.pos <= (r.start(s + 1) + r.end(s + 1)) / 2
            ? -1
            : 1,
        a = r.index(s) + (l > 0 ? 1 : 0),
        c = r.node(s),
        d = !1;
      if (o == 1) d = c.canReplace(a, a, i);
      else {
        let f = c.contentMatchAt(a).findWrapping(i.firstChild.type);
        d = f && c.canReplaceWith(a, a, f[0]);
      }
      if (d) return l == 0 ? r.pos : l < 0 ? r.before(s + 1) : r.after(s + 1);
    }
  return null;
}
function Ui(n, e, t = e, r = S.empty) {
  if (e == t && !r.size) return null;
  let i = n.resolve(e),
    o = n.resolve(t);
  return la(i, o, r) ? new ce(e, t, r) : new lf(i, o, r).fit();
}
function la(n, e, t) {
  return (
    !t.openStart &&
    !t.openEnd &&
    n.start() == e.start() &&
    n.parent.canReplace(n.index(), e.index(), t.content)
  );
}
class lf {
  constructor(e, t, r) {
    (this.$from = e),
      (this.$to = t),
      (this.unplaced = r),
      (this.frontier = []),
      (this.placed = _.empty);
    for (let i = 0; i <= e.depth; i++) {
      let o = e.node(i);
      this.frontier.push({
        type: o.type,
        match: o.contentMatchAt(e.indexAfter(i)),
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = _.from(e.node(i).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(),
      t = this.placed.size - this.depth - this.$from.depth,
      r = this.$from,
      i = this.close(e < 0 ? this.$to : r.doc.resolve(e));
    if (!i) return null;
    let o = this.placed,
      s = r.depth,
      l = i.depth;
    for (; s && l && o.childCount == 1; ) (o = o.firstChild.content), s--, l--;
    let a = new S(o, s, l);
    return e > -1
      ? new le(r.pos, e, this.$to.pos, this.$to.end(), a, t)
      : a.size || r.pos != this.$to.pos
      ? new ce(r.pos, i.pos, a)
      : null;
  }
  findFittable() {
    let e = this.unplaced.openStart;
    for (
      let t = this.unplaced.content, r = 0, i = this.unplaced.openEnd;
      r < e;
      r++
    ) {
      let o = t.firstChild;
      if ((t.childCount > 1 && (i = 0), o.type.spec.isolating && i <= r)) {
        e = r;
        break;
      }
      t = o.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let r = t == 1 ? e : this.unplaced.openStart; r >= 0; r--) {
        let i,
          o = null;
        r
          ? ((o = Rr(this.unplaced.content, r - 1).firstChild), (i = o.content))
          : (i = this.unplaced.content);
        let s = i.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: a, match: c } = this.frontier[l],
            d,
            f = null;
          if (
            t == 1 &&
            (s
              ? c.matchType(s.type) || (f = c.fillBefore(_.from(s), !1))
              : o && a.compatibleContent(o.type))
          )
            return { sliceDepth: r, frontierDepth: l, parent: o, inject: f };
          if (t == 2 && s && (d = c.findWrapping(s.type)))
            return { sliceDepth: r, frontierDepth: l, parent: o, wrap: d };
          if (o && c.matchType(o.type)) break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced,
      i = Rr(e, t);
    return !i.childCount || i.firstChild.isLeaf
      ? !1
      : ((this.unplaced = new S(
          e,
          t + 1,
          Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)
        )),
        !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced,
      i = Rr(e, t);
    if (i.childCount <= 1 && t > 0) {
      let o = e.size - t <= t + i.size;
      this.unplaced = new S(ln(e, t - 1, 1), t - 1, o ? t - 1 : r);
    } else this.unplaced = new S(ln(e, t, 1), t, r);
  }
  placeNodes({
    sliceDepth: e,
    frontierDepth: t,
    parent: r,
    inject: i,
    wrap: o,
  }) {
    for (; this.depth > t; ) this.closeFrontierNode();
    if (o) for (let g = 0; g < o.length; g++) this.openFrontierNode(o[g]);
    let s = this.unplaced,
      l = r ? r.content : s.content,
      a = s.openStart - e,
      c = 0,
      d = [],
      { match: f, type: h } = this.frontier[t];
    if (i) {
      for (let g = 0; g < i.childCount; g++) d.push(i.child(g));
      f = f.matchFragment(i);
    }
    let p = l.size + e - (s.content.size - s.openEnd);
    for (; c < l.childCount; ) {
      let g = l.child(c),
        x = f.matchType(g.type);
      if (!x) break;
      c++,
        (c > 1 || a == 0 || g.content.size) &&
          ((f = x),
          d.push(
            aa(
              g.mark(h.allowedMarks(g.marks)),
              c == 1 ? a : 0,
              c == l.childCount ? p : -1
            )
          ));
    }
    let m = c == l.childCount;
    m || (p = -1),
      (this.placed = an(this.placed, t, _.from(d))),
      (this.frontier[t].match = f),
      m &&
        p < 0 &&
        r &&
        r.type == this.frontier[this.depth].type &&
        this.frontier.length > 1 &&
        this.closeFrontierNode();
    for (let g = 0, x = l; g < p; g++) {
      let y = x.lastChild;
      this.frontier.push({
        type: y.type,
        match: y.contentMatchAt(y.childCount),
      }),
        (x = y.content);
    }
    this.unplaced = m
      ? e == 0
        ? S.empty
        : new S(ln(s.content, e - 1, 1), e - 1, p < 0 ? s.openEnd : e - 1)
      : new S(ln(s.content, e, c), s.openStart, s.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock) return -1;
    let e = this.frontier[this.depth],
      t;
    if (
      !e.type.isTextblock ||
      !Pr(this.$to, this.$to.depth, e.type, e.match, !1) ||
      (this.$to.depth == this.depth &&
        (t = this.findCloseLevel(this.$to)) &&
        t.depth == this.depth)
    )
      return -1;
    let { depth: r } = this.$to,
      i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); ) ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: i } = this.frontier[t],
        o = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)),
        s = Pr(e, t, i, r, o);
      if (s) {
        for (let l = t - 1; l >= 0; l--) {
          let { match: a, type: c } = this.frontier[l],
            d = Pr(e, l, c, a, !0);
          if (!d || d.childCount) continue e;
        }
        return {
          depth: t,
          fit: s,
          move: o ? e.doc.resolve(e.after(t + 1)) : e,
        };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t) return null;
    for (; this.depth > t.depth; ) this.closeFrontierNode();
    t.fit.childCount && (this.placed = an(this.placed, t.depth, t.fit)),
      (e = t.move);
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let i = e.node(r),
        o = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, o);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let i = this.frontier[this.depth];
    (i.match = i.match.matchType(e)),
      (this.placed = an(this.placed, this.depth, _.from(e.create(t, r)))),
      this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(_.empty, !0);
    t.childCount && (this.placed = an(this.placed, this.frontier.length, t));
  }
}
function ln(n, e, t) {
  return e == 0
    ? n.cutByIndex(t, n.childCount)
    : n.replaceChild(0, n.firstChild.copy(ln(n.firstChild.content, e - 1, t)));
}
function an(n, e, t) {
  return e == 0
    ? n.append(t)
    : n.replaceChild(
        n.childCount - 1,
        n.lastChild.copy(an(n.lastChild.content, e - 1, t))
      );
}
function Rr(n, e) {
  for (let t = 0; t < e; t++) n = n.firstChild.content;
  return n;
}
function aa(n, e, t) {
  if (e <= 0) return n;
  let r = n.content;
  return (
    e > 1 &&
      (r = r.replaceChild(
        0,
        aa(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0)
      )),
    e > 0 &&
      ((r = n.type.contentMatch.fillBefore(r).append(r)),
      t <= 0 &&
        (r = r.append(
          n.type.contentMatch.matchFragment(r).fillBefore(_.empty, !0)
        ))),
    n.copy(r)
  );
}
function Pr(n, e, t, r, i) {
  let o = n.node(e),
    s = i ? n.indexAfter(e) : n.index(e);
  if (s == o.childCount && !t.compatibleContent(o.type)) return null;
  let l = r.fillBefore(o.content, !0, s);
  return l && !af(t, o.content, s) ? l : null;
}
function af(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks)) return !0;
  return !1;
}
function cf(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function df(n, e, t, r) {
  if (!r.size) return n.deleteRange(e, t);
  let i = n.doc.resolve(e),
    o = n.doc.resolve(t);
  if (la(i, o, r)) return n.step(new ce(e, t, r));
  let s = da(i, n.doc.resolve(t));
  s[s.length - 1] == 0 && s.pop();
  let l = -(i.depth + 1);
  s.unshift(l);
  for (let h = i.depth, p = i.pos - 1; h > 0; h--, p--) {
    let m = i.node(h).type.spec;
    if (m.defining || m.definingAsContext || m.isolating) break;
    s.indexOf(h) > -1 ? (l = h) : i.before(h) == p && s.splice(1, 0, -h);
  }
  let a = s.indexOf(l),
    c = [],
    d = r.openStart;
  for (let h = r.content, p = 0; ; p++) {
    let m = h.firstChild;
    if ((c.push(m), p == r.openStart)) break;
    h = m.content;
  }
  for (let h = d - 1; h >= 0; h--) {
    let p = c[h],
      m = cf(p.type);
    if (m && !p.sameMarkup(i.node(Math.abs(l) - 1))) d = h;
    else if (m || !p.type.isTextblock) break;
  }
  for (let h = r.openStart; h >= 0; h--) {
    let p = (h + d + 1) % (r.openStart + 1),
      m = c[p];
    if (m)
      for (let g = 0; g < s.length; g++) {
        let x = s[(g + a) % s.length],
          y = !0;
        x < 0 && ((y = !1), (x = -x));
        let v = i.node(x - 1),
          N = i.index(x - 1);
        if (v.canReplaceWith(N, N, m.type, m.marks))
          return n.replace(
            i.before(x),
            y ? o.after(x) : t,
            new S(ca(r.content, 0, r.openStart, p), p, r.openEnd)
          );
      }
  }
  let f = n.steps.length;
  for (
    let h = s.length - 1;
    h >= 0 && (n.replace(e, t, r), !(n.steps.length > f));
    h--
  ) {
    let p = s[h];
    p < 0 || ((e = i.before(p)), (t = o.after(p)));
  }
}
function ca(n, e, t, r, i) {
  if (e < t) {
    let o = n.firstChild;
    n = n.replaceChild(0, o.copy(ca(o.content, e + 1, t, r, o)));
  }
  if (e > r) {
    let o = i.contentMatchAt(0),
      s = o.fillBefore(n).append(n);
    n = s.append(o.matchFragment(s).fillBefore(_.empty, !0));
  }
  return n;
}
function uf(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let i = of(n.doc, e, r.type);
    i != null && (e = t = i);
  }
  n.replaceRange(e, t, new S(_.from(r), 0, 0));
}
function ff(n, e, t) {
  let r = n.doc.resolve(e),
    i = n.doc.resolve(t),
    o = da(r, i);
  for (let s = 0; s < o.length; s++) {
    let l = o[s],
      a = s == o.length - 1;
    if ((a && l == 0) || r.node(l).type.contentMatch.validEnd)
      return n.delete(r.start(l), i.end(l));
    if (
      l > 0 &&
      (a || r.node(l - 1).canReplace(r.index(l - 1), i.indexAfter(l - 1)))
    )
      return n.delete(r.before(l), i.after(l));
  }
  for (let s = 1; s <= r.depth && s <= i.depth; s++)
    if (
      e - r.start(s) == r.depth - s &&
      t > r.end(s) &&
      i.end(s) - t != i.depth - s
    )
      return n.delete(r.before(s), t);
  n.delete(e, t);
}
function da(n, e) {
  let t = [],
    r = Math.min(n.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let o = n.start(i);
    if (
      o < n.pos - (n.depth - i) ||
      e.end(i) > e.pos + (e.depth - i) ||
      n.node(i).type.spec.isolating ||
      e.node(i).type.spec.isolating
    )
      break;
    (o == e.start(i) ||
      (i == n.depth &&
        i == e.depth &&
        n.parent.inlineContent &&
        e.parent.inlineContent &&
        i &&
        e.start(i - 1) == o - 1)) &&
      t.push(i);
  }
  return t;
}
class Ht extends fe {
  constructor(e, t, r) {
    super(), (this.pos = e), (this.attr = t), (this.value = r);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return Q.fail("No node at attribute step's position");
    let r = Object.create(null);
    for (let o in t.attrs) r[o] = t.attrs[o];
    r[this.attr] = this.value;
    let i = t.type.create(r, null, t.marks);
    return Q.fromReplace(
      e,
      this.pos,
      this.pos + 1,
      new S(_.from(i), 0, t.isLeaf ? 0 : 1)
    );
  }
  getMap() {
    return ye.empty;
  }
  invert(e) {
    return new Ht(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Ht(t.pos, this.attr, this.value);
  }
  toJSON() {
    return {
      stepType: "attr",
      pos: this.pos,
      attr: this.attr,
      value: this.value,
    };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Ht(t.pos, t.attr, t.value);
  }
}
fe.jsonID("attr", Ht);
class _n extends fe {
  constructor(e, t) {
    super(), (this.attr = e), (this.value = t);
  }
  apply(e) {
    let t = Object.create(null);
    for (let i in e.attrs) t[i] = e.attrs[i];
    t[this.attr] = this.value;
    let r = e.type.create(t, e.content, e.marks);
    return Q.ok(r);
  }
  getMap() {
    return ye.empty;
  }
  invert(e) {
    return new _n(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.attr != "string")
      throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new _n(t.attr, t.value);
  }
}
fe.jsonID("docAttr", _n);
let Gt = class extends Error {};
Gt = function n(e) {
  let t = Error.call(this, e);
  return (t.__proto__ = n.prototype), t;
};
Gt.prototype = Object.create(Error.prototype);
Gt.prototype.constructor = Gt;
Gt.prototype.name = "TransformError";
class hf {
  constructor(e) {
    (this.doc = e),
      (this.steps = []),
      (this.docs = []),
      (this.mapping = new Ut());
  }
  get before() {
    return this.docs.length ? this.docs[0] : this.doc;
  }
  step(e) {
    let t = this.maybeStep(e);
    if (t.failed) throw new Gt(t.failed);
    return this;
  }
  maybeStep(e) {
    let t = e.apply(this.doc);
    return t.failed || this.addStep(e, t.doc), t;
  }
  get docChanged() {
    return this.steps.length > 0;
  }
  addStep(e, t) {
    this.docs.push(this.doc),
      this.steps.push(e),
      this.mapping.appendMap(e.getMap()),
      (this.doc = t);
  }
  replace(e, t = e, r = S.empty) {
    let i = Ui(this.doc, e, t, r);
    return i && this.step(i), this;
  }
  replaceWith(e, t, r) {
    return this.replace(e, t, new S(_.from(r), 0, 0));
  }
  delete(e, t) {
    return this.replace(e, t, S.empty);
  }
  insert(e, t) {
    return this.replaceWith(e, e, t);
  }
  replaceRange(e, t, r) {
    return df(this, e, t, r), this;
  }
  replaceRangeWith(e, t, r) {
    return uf(this, e, t, r), this;
  }
  deleteRange(e, t) {
    return ff(this, e, t), this;
  }
  lift(e, t) {
    return Ju(this, e, t), this;
  }
  join(e, t = 1) {
    return rf(this, e, t), this;
  }
  wrap(e, t) {
    return Yu(this, e, t), this;
  }
  setBlockType(e, t = e, r, i = null) {
    return Xu(this, e, t, r, i), this;
  }
  setNodeMarkup(e, t, r = null, i) {
    return tf(this, e, t, r, i), this;
  }
  setNodeAttribute(e, t, r) {
    return this.step(new Ht(e, t, r)), this;
  }
  setDocAttribute(e, t) {
    return this.step(new _n(e, t)), this;
  }
  addNodeMark(e, t) {
    return this.step(new rt(e, t)), this;
  }
  removeNodeMark(e, t) {
    if (!(t instanceof L)) {
      let r = this.doc.nodeAt(e);
      if (!r) throw new RangeError("No node at position " + e);
      if (((t = t.isInSet(r.marks)), !t)) return this;
    }
    return this.step(new Kt(e, t)), this;
  }
  split(e, t = 1, r) {
    return nf(this, e, t, r), this;
  }
  addMark(e, t, r) {
    return Hu(this, e, t, r), this;
  }
  removeMark(e, t, r) {
    return qu(this, e, t, r), this;
  }
  clearIncompatible(e, t, r) {
    return ia(this, e, t, r), this;
  }
}
const zr = Object.create(null);
class F {
  constructor(e, t, r) {
    (this.$anchor = e),
      (this.$head = t),
      (this.ranges = r || [new pf(e.min(t), e.max(t))]);
  }
  get anchor() {
    return this.$anchor.pos;
  }
  get head() {
    return this.$head.pos;
  }
  get from() {
    return this.$from.pos;
  }
  get to() {
    return this.$to.pos;
  }
  get $from() {
    return this.ranges[0].$from;
  }
  get $to() {
    return this.ranges[0].$to;
  }
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++)
      if (e[t].$from.pos != e[t].$to.pos) return !1;
    return !0;
  }
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  replace(e, t = S.empty) {
    let r = t.content.lastChild,
      i = null;
    for (let l = 0; l < t.openEnd; l++) (i = r), (r = r.lastChild);
    let o = e.steps.length,
      s = this.ranges;
    for (let l = 0; l < s.length; l++) {
      let { $from: a, $to: c } = s[l],
        d = e.mapping.slice(o);
      e.replaceRange(d.map(a.pos), d.map(c.pos), l ? S.empty : t),
        l == 0 && Xo(e, o, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
    }
  }
  replaceWith(e, t) {
    let r = e.steps.length,
      i = this.ranges;
    for (let o = 0; o < i.length; o++) {
      let { $from: s, $to: l } = i[o],
        a = e.mapping.slice(r),
        c = a.map(s.pos),
        d = a.map(l.pos);
      o
        ? e.deleteRange(c, d)
        : (e.replaceRangeWith(c, d, t), Xo(e, r, t.isInline ? -1 : 1));
    }
  }
  static findFrom(e, t, r = !1) {
    let i = e.parent.inlineContent
      ? new I(e)
      : Lt(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (i) return i;
    for (let o = e.depth - 1; o >= 0; o--) {
      let s =
        t < 0
          ? Lt(e.node(0), e.node(o), e.before(o + 1), e.index(o), t, r)
          : Lt(e.node(0), e.node(o), e.after(o + 1), e.index(o) + 1, t, r);
      if (s) return s;
    }
    return null;
  }
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new _e(e.node(0));
  }
  static atStart(e) {
    return Lt(e, e, 0, 0, 1) || new _e(e);
  }
  static atEnd(e) {
    return Lt(e, e, e.content.size, e.childCount, -1) || new _e(e);
  }
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = zr[t.type];
    if (!r) throw new RangeError(`No selection type ${t.type} defined`);
    return r.fromJSON(e, t);
  }
  static jsonID(e, t) {
    if (e in zr)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return (zr[e] = t), (t.prototype.jsonID = e), t;
  }
  getBookmark() {
    return I.between(this.$anchor, this.$head).getBookmark();
  }
}
F.prototype.visible = !0;
class pf {
  constructor(e, t) {
    (this.$from = e), (this.$to = t);
  }
}
let Go = !1;
function Yo(n) {
  !Go &&
    !n.parent.inlineContent &&
    ((Go = !0),
    console.warn(
      "TextSelection endpoint not pointing into a node with inline content (" +
        n.parent.type.name +
        ")"
    ));
}
class I extends F {
  constructor(e, t = e) {
    Yo(e), Yo(t), super(e, t);
  }
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    if (!r.parent.inlineContent) return F.near(r);
    let i = e.resolve(t.map(this.anchor));
    return new I(i.parent.inlineContent ? i : r, r);
  }
  replace(e, t = S.empty) {
    if ((super.replace(e, t), t == S.empty)) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof I && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new gr(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new I(e.resolve(t.anchor), e.resolve(t.head));
  }
  static create(e, t, r = t) {
    let i = e.resolve(t);
    return new this(i, r == t ? i : e.resolve(r));
  }
  static between(e, t, r) {
    let i = e.pos - t.pos;
    if (((!r || i) && (r = i >= 0 ? 1 : -1), !t.parent.inlineContent)) {
      let o = F.findFrom(t, r, !0) || F.findFrom(t, -r, !0);
      if (o) t = o.$head;
      else return F.near(t, r);
    }
    return (
      e.parent.inlineContent ||
        (i == 0
          ? (e = t)
          : ((e = (F.findFrom(e, -r, !0) || F.findFrom(e, r, !0)).$anchor),
            e.pos < t.pos != i < 0 && (e = t))),
      new I(e, t)
    );
  }
}
F.jsonID("text", I);
class gr {
  constructor(e, t) {
    (this.anchor = e), (this.head = t);
  }
  map(e) {
    return new gr(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return I.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class E extends F {
  constructor(e) {
    let t = e.nodeAfter,
      r = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, r), (this.node = t);
  }
  map(e, t) {
    let { deleted: r, pos: i } = t.mapResult(this.anchor),
      o = e.resolve(i);
    return r ? F.near(o) : new E(o);
  }
  content() {
    return new S(_.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof E && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new ji(this.anchor);
  }
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new E(e.resolve(t.anchor));
  }
  static create(e, t) {
    return new E(e.resolve(t));
  }
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
E.prototype.visible = !1;
F.jsonID("node", E);
class ji {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new gr(r, r) : new ji(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor),
      r = t.nodeAfter;
    return r && E.isSelectable(r) ? new E(t) : F.near(t);
  }
}
class _e extends F {
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = S.empty) {
    if (t == S.empty) {
      e.delete(0, e.doc.content.size);
      let r = F.atStart(e.doc);
      r.eq(e.selection) || e.setSelection(r);
    } else super.replace(e, t);
  }
  toJSON() {
    return { type: "all" };
  }
  static fromJSON(e) {
    return new _e(e);
  }
  map(e) {
    return new _e(e);
  }
  eq(e) {
    return e instanceof _e;
  }
  getBookmark() {
    return mf;
  }
}
F.jsonID("all", _e);
const mf = {
  map() {
    return this;
  },
  resolve(n) {
    return new _e(n);
  },
};
function Lt(n, e, t, r, i, o = !1) {
  if (e.inlineContent) return I.create(n, t);
  for (let s = r - (i > 0 ? 0 : 1); i > 0 ? s < e.childCount : s >= 0; s += i) {
    let l = e.child(s);
    if (l.isAtom) {
      if (!o && E.isSelectable(l))
        return E.create(n, t - (i < 0 ? l.nodeSize : 0));
    } else {
      let a = Lt(n, l, t + i, i < 0 ? l.childCount : 0, i, o);
      if (a) return a;
    }
    t += l.nodeSize * i;
  }
  return null;
}
function Xo(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e) return;
  let i = n.steps[r];
  if (!(i instanceof ce || i instanceof le)) return;
  let o = n.mapping.maps[r],
    s;
  o.forEach((l, a, c, d) => {
    s == null && (s = d);
  }),
    n.setSelection(F.near(n.doc.resolve(s), t));
}
const Qo = 1,
  Fn = 2,
  Zo = 4;
class gf extends hf {
  constructor(e) {
    super(e.doc),
      (this.curSelectionFor = 0),
      (this.updated = 0),
      (this.meta = Object.create(null)),
      (this.time = Date.now()),
      (this.curSelection = e.selection),
      (this.storedMarks = e.storedMarks);
  }
  get selection() {
    return (
      this.curSelectionFor < this.steps.length &&
        ((this.curSelection = this.curSelection.map(
          this.doc,
          this.mapping.slice(this.curSelectionFor)
        )),
        (this.curSelectionFor = this.steps.length)),
      this.curSelection
    );
  }
  setSelection(e) {
    if (e.$from.doc != this.doc)
      throw new RangeError(
        "Selection passed to setSelection must point at the current document"
      );
    return (
      (this.curSelection = e),
      (this.curSelectionFor = this.steps.length),
      (this.updated = (this.updated | Qo) & ~Fn),
      (this.storedMarks = null),
      this
    );
  }
  get selectionSet() {
    return (this.updated & Qo) > 0;
  }
  setStoredMarks(e) {
    return (this.storedMarks = e), (this.updated |= Fn), this;
  }
  ensureMarks(e) {
    return (
      L.sameSet(this.storedMarks || this.selection.$from.marks(), e) ||
        this.setStoredMarks(e),
      this
    );
  }
  addStoredMark(e) {
    return this.ensureMarks(
      e.addToSet(this.storedMarks || this.selection.$head.marks())
    );
  }
  removeStoredMark(e) {
    return this.ensureMarks(
      e.removeFromSet(this.storedMarks || this.selection.$head.marks())
    );
  }
  get storedMarksSet() {
    return (this.updated & Fn) > 0;
  }
  addStep(e, t) {
    super.addStep(e, t),
      (this.updated = this.updated & ~Fn),
      (this.storedMarks = null);
  }
  setTime(e) {
    return (this.time = e), this;
  }
  replaceSelection(e) {
    return this.selection.replace(this, e), this;
  }
  replaceSelectionWith(e, t = !0) {
    let r = this.selection;
    return (
      t &&
        (e = e.mark(
          this.storedMarks ||
            (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || L.none)
        )),
      r.replaceWith(this, e),
      this
    );
  }
  deleteSelection() {
    return this.selection.replace(this), this;
  }
  insertText(e, t, r) {
    let i = this.doc.type.schema;
    if (t == null)
      return e
        ? this.replaceSelectionWith(i.text(e), !0)
        : this.deleteSelection();
    {
      if ((r == null && (r = t), (r = r ?? t), !e))
        return this.deleteRange(t, r);
      let o = this.storedMarks;
      if (!o) {
        let s = this.doc.resolve(t);
        o = r == t ? s.marks() : s.marksAcross(this.doc.resolve(r));
      }
      return (
        this.replaceRangeWith(t, r, i.text(e, o)),
        this.selection.empty || this.setSelection(F.near(this.selection.$to)),
        this
      );
    }
  }
  setMeta(e, t) {
    return (this.meta[typeof e == "string" ? e : e.key] = t), this;
  }
  getMeta(e) {
    return this.meta[typeof e == "string" ? e : e.key];
  }
  get isGeneric() {
    for (let e in this.meta) return !1;
    return !0;
  }
  scrollIntoView() {
    return (this.updated |= Zo), this;
  }
  get scrolledIntoView() {
    return (this.updated & Zo) > 0;
  }
}
function es(n, e) {
  return !e || !n ? n : n.bind(e);
}
class cn {
  constructor(e, t, r) {
    (this.name = e), (this.init = es(t.init, r)), (this.apply = es(t.apply, r));
  }
}
const bf = [
  new cn("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    },
  }),
  new cn("selection", {
    init(n, e) {
      return n.selection || F.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    },
  }),
  new cn("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    },
  }),
  new cn("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    },
  }),
];
class Br {
  constructor(e, t) {
    (this.schema = e),
      (this.plugins = []),
      (this.pluginsByKey = Object.create(null)),
      (this.fields = bf.slice()),
      t &&
        t.forEach((r) => {
          if (this.pluginsByKey[r.key])
            throw new RangeError(
              "Adding different instances of a keyed plugin (" + r.key + ")"
            );
          this.plugins.push(r),
            (this.pluginsByKey[r.key] = r),
            r.spec.state && this.fields.push(new cn(r.key, r.spec.state, r));
        });
  }
}
class Vt {
  constructor(e) {
    this.config = e;
  }
  get schema() {
    return this.config.schema;
  }
  get plugins() {
    return this.config.plugins;
  }
  apply(e) {
    return this.applyTransaction(e).state;
  }
  filterTransaction(e, t = -1) {
    for (let r = 0; r < this.config.plugins.length; r++)
      if (r != t) {
        let i = this.config.plugins[r];
        if (
          i.spec.filterTransaction &&
          !i.spec.filterTransaction.call(i, e, this)
        )
          return !1;
      }
    return !0;
  }
  applyTransaction(e) {
    if (!this.filterTransaction(e)) return { state: this, transactions: [] };
    let t = [e],
      r = this.applyInner(e),
      i = null;
    for (;;) {
      let o = !1;
      for (let s = 0; s < this.config.plugins.length; s++) {
        let l = this.config.plugins[s];
        if (l.spec.appendTransaction) {
          let a = i ? i[s].n : 0,
            c = i ? i[s].state : this,
            d =
              a < t.length &&
              l.spec.appendTransaction.call(l, a ? t.slice(a) : t, c, r);
          if (d && r.filterTransaction(d, s)) {
            if ((d.setMeta("appendedTransaction", e), !i)) {
              i = [];
              for (let f = 0; f < this.config.plugins.length; f++)
                i.push(
                  f < s ? { state: r, n: t.length } : { state: this, n: 0 }
                );
            }
            t.push(d), (r = r.applyInner(d)), (o = !0);
          }
          i && (i[s] = { state: r, n: t.length });
        }
      }
      if (!o) return { state: r, transactions: t };
    }
  }
  applyInner(e) {
    if (!e.before.eq(this.doc))
      throw new RangeError("Applying a mismatched transaction");
    let t = new Vt(this.config),
      r = this.config.fields;
    for (let i = 0; i < r.length; i++) {
      let o = r[i];
      t[o.name] = o.apply(e, this[o.name], this, t);
    }
    return t;
  }
  get tr() {
    return new gf(this);
  }
  static create(e) {
    let t = new Br(e.doc ? e.doc.type.schema : e.schema, e.plugins),
      r = new Vt(t);
    for (let i = 0; i < t.fields.length; i++)
      r[t.fields[i].name] = t.fields[i].init(e, r);
    return r;
  }
  reconfigure(e) {
    let t = new Br(this.schema, e.plugins),
      r = t.fields,
      i = new Vt(t);
    for (let o = 0; o < r.length; o++) {
      let s = r[o].name;
      i[s] = this.hasOwnProperty(s) ? this[s] : r[o].init(e, i);
    }
    return i;
  }
  toJSON(e) {
    let t = { doc: this.doc.toJSON(), selection: this.selection.toJSON() };
    if (
      (this.storedMarks &&
        (t.storedMarks = this.storedMarks.map((r) => r.toJSON())),
      e && typeof e == "object")
    )
      for (let r in e) {
        if (r == "doc" || r == "selection")
          throw new RangeError(
            "The JSON fields `doc` and `selection` are reserved"
          );
        let i = e[r],
          o = i.spec.state;
        o && o.toJSON && (t[r] = o.toJSON.call(i, this[i.key]));
      }
    return t;
  }
  static fromJSON(e, t, r) {
    if (!t) throw new RangeError("Invalid input for EditorState.fromJSON");
    if (!e.schema)
      throw new RangeError("Required config field 'schema' missing");
    let i = new Br(e.schema, e.plugins),
      o = new Vt(i);
    return (
      i.fields.forEach((s) => {
        if (s.name == "doc") o.doc = Ee.fromJSON(e.schema, t.doc);
        else if (s.name == "selection")
          o.selection = F.fromJSON(o.doc, t.selection);
        else if (s.name == "storedMarks")
          t.storedMarks &&
            (o.storedMarks = t.storedMarks.map(e.schema.markFromJSON));
        else {
          if (r)
            for (let l in r) {
              let a = r[l],
                c = a.spec.state;
              if (
                a.key == s.name &&
                c &&
                c.fromJSON &&
                Object.prototype.hasOwnProperty.call(t, l)
              ) {
                o[s.name] = c.fromJSON.call(a, e, t[l], o);
                return;
              }
            }
          o[s.name] = s.init(e, o);
        }
      }),
      o
    );
  }
}
function ua(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function
      ? (i = i.bind(e))
      : r == "handleDOMEvents" && (i = ua(i, e, {})),
      (t[r] = i);
  }
  return t;
}
class Ge {
  constructor(e) {
    (this.spec = e),
      (this.props = {}),
      e.props && ua(e.props, this, this.props),
      (this.key = e.key ? e.key.key : fa("plugin"));
  }
  getState(e) {
    return e[this.key];
  }
}
const Lr = Object.create(null);
function fa(n) {
  return n in Lr ? n + "$" + ++Lr[n] : ((Lr[n] = 0), n + "$");
}
class br {
  constructor(e = "key") {
    this.key = fa(e);
  }
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  getState(e) {
    return e[this.key];
  }
}
const ie = function (n) {
    for (var e = 0; ; e++) if (((n = n.previousSibling), !n)) return e;
  },
  vn = function (n) {
    let e = n.assignedSlot || n.parentNode;
    return e && e.nodeType == 11 ? e.host : e;
  };
let ui = null;
const je = function (n, e, t) {
    let r = ui || (ui = document.createRange());
    return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
  },
  xf = function () {
    ui = null;
  },
  Et = function (n, e, t, r) {
    return t && (ts(n, e, t, r, -1) || ts(n, e, t, r, 1));
  },
  yf = /^(img|br|input|textarea|hr)$/i;
function ts(n, e, t, r, i) {
  for (;;) {
    if (n == t && e == r) return !0;
    if (e == (i < 0 ? 0 : Pe(n))) {
      let o = n.parentNode;
      if (
        !o ||
        o.nodeType != 1 ||
        En(n) ||
        yf.test(n.nodeName) ||
        n.contentEditable == "false"
      )
        return !1;
      (e = ie(n) + (i < 0 ? 0 : 1)), (n = o);
    } else if (n.nodeType == 1) {
      if (
        ((n = n.childNodes[e + (i < 0 ? -1 : 0)]), n.contentEditable == "false")
      )
        return !1;
      e = i < 0 ? Pe(n) : 0;
    } else return !1;
  }
}
function Pe(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function kf(n, e) {
  for (;;) {
    if (n.nodeType == 3 && e) return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false") return null;
      (n = n.childNodes[e - 1]), (e = Pe(n));
    } else if (n.parentNode && !En(n)) (e = ie(n)), (n = n.parentNode);
    else return null;
  }
}
function _f(n, e) {
  for (;;) {
    if (n.nodeType == 3 && e < n.nodeValue.length) return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false") return null;
      (n = n.childNodes[e]), (e = 0);
    } else if (n.parentNode && !En(n)) (e = ie(n) + 1), (n = n.parentNode);
    else return null;
  }
}
function vf(n, e, t) {
  for (let r = e == 0, i = e == Pe(n); r || i; ) {
    if (n == t) return !0;
    let o = ie(n);
    if (((n = n.parentNode), !n)) return !1;
    (r = r && o == 0), (i = i && o == Pe(n));
  }
}
function En(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode);
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const xr = function (n) {
  return (
    n.focusNode && Et(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset)
  );
};
function gt(n, e) {
  let t = document.createEvent("Event");
  return (
    t.initEvent("keydown", !0, !0), (t.keyCode = n), (t.key = t.code = e), t
  );
}
function wf(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; ) e = e.shadowRoot.activeElement;
  return e;
}
function Sf(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let r = n.caretPositionFromPoint(e, t);
      if (r) return { node: r.offsetNode, offset: r.offset };
    } catch {}
  if (n.caretRangeFromPoint) {
    let r = n.caretRangeFromPoint(e, t);
    if (r) return { node: r.startContainer, offset: r.startOffset };
  }
}
const Be = typeof navigator < "u" ? navigator : null,
  ns = typeof document < "u" ? document : null,
  ut = (Be && Be.userAgent) || "",
  fi = /Edge\/(\d+)/.exec(ut),
  ha = /MSIE \d/.exec(ut),
  hi = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(ut),
  xe = !!(ha || hi || fi),
  ot = ha ? document.documentMode : hi ? +hi[1] : fi ? +fi[1] : 0,
  Te = !xe && /gecko\/(\d+)/i.test(ut);
Te && +(/Firefox\/(\d+)/.exec(ut) || [0, 0])[1];
const pi = !xe && /Chrome\/(\d+)/.exec(ut),
  de = !!pi,
  pa = pi ? +pi[1] : 0,
  he = !xe && !!Be && /Apple Computer/.test(Be.vendor),
  Yt = he && (/Mobile\/\w+/.test(ut) || (!!Be && Be.maxTouchPoints > 2)),
  we = Yt || (Be ? /Mac/.test(Be.platform) : !1),
  Cf = Be ? /Win/.test(Be.platform) : !1,
  Me = /Android \d/.test(ut),
  Tn = !!ns && "webkitFontSmoothing" in ns.documentElement.style,
  Mf = Tn
    ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1]
    : 0;
function Of(n) {
  let e = n.defaultView && n.defaultView.visualViewport;
  return e
    ? { left: 0, right: e.width, top: 0, bottom: e.height }
    : {
        left: 0,
        right: n.documentElement.clientWidth,
        top: 0,
        bottom: n.documentElement.clientHeight,
      };
}
function Ue(n, e) {
  return typeof n == "number" ? n : n[e];
}
function Nf(n) {
  let e = n.getBoundingClientRect(),
    t = e.width / n.offsetWidth || 1,
    r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r,
  };
}
function rs(n, e, t) {
  let r = n.someProp("scrollThreshold") || 0,
    i = n.someProp("scrollMargin") || 5,
    o = n.dom.ownerDocument;
  for (let s = t || n.dom; s; s = vn(s)) {
    if (s.nodeType != 1) continue;
    let l = s,
      a = l == o.body,
      c = a ? Of(o) : Nf(l),
      d = 0,
      f = 0;
    if (
      (e.top < c.top + Ue(r, "top")
        ? (f = -(c.top - e.top + Ue(i, "top")))
        : e.bottom > c.bottom - Ue(r, "bottom") &&
          (f =
            e.bottom - e.top > c.bottom - c.top
              ? e.top + Ue(i, "top") - c.top
              : e.bottom - c.bottom + Ue(i, "bottom")),
      e.left < c.left + Ue(r, "left")
        ? (d = -(c.left - e.left + Ue(i, "left")))
        : e.right > c.right - Ue(r, "right") &&
          (d = e.right - c.right + Ue(i, "right")),
      d || f)
    )
      if (a) o.defaultView.scrollBy(d, f);
      else {
        let h = l.scrollLeft,
          p = l.scrollTop;
        f && (l.scrollTop += f), d && (l.scrollLeft += d);
        let m = l.scrollLeft - h,
          g = l.scrollTop - p;
        e = {
          left: e.left - m,
          top: e.top - g,
          right: e.right - m,
          bottom: e.bottom - g,
        };
      }
    if (a || /^(fixed|sticky)$/.test(getComputedStyle(s).position)) break;
  }
}
function Ef(n) {
  let e = n.dom.getBoundingClientRect(),
    t = Math.max(0, e.top),
    r,
    i;
  for (
    let o = (e.left + e.right) / 2, s = t + 1;
    s < Math.min(innerHeight, e.bottom);
    s += 5
  ) {
    let l = n.root.elementFromPoint(o, s);
    if (!l || l == n.dom || !n.dom.contains(l)) continue;
    let a = l.getBoundingClientRect();
    if (a.top >= t - 20) {
      (r = l), (i = a.top);
      break;
    }
  }
  return { refDOM: r, refTop: i, stack: ma(n.dom) };
}
function ma(n) {
  let e = [],
    t = n.ownerDocument;
  for (
    let r = n;
    r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t);
    r = vn(r)
  );
  return e;
}
function Tf({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  ga(t, r == 0 ? 0 : r - e);
}
function ga(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: i, left: o } = n[t];
    r.scrollTop != i + e && (r.scrollTop = i + e),
      r.scrollLeft != o && (r.scrollLeft = o);
  }
}
let zt = null;
function If(n) {
  if (n.setActive) return n.setActive();
  if (zt) return n.focus(zt);
  let e = ma(n);
  n.focus(
    zt == null
      ? {
          get preventScroll() {
            return (zt = { preventScroll: !0 }), !0;
          },
        }
      : void 0
  ),
    zt || ((zt = !1), ga(e, 0));
}
function ba(n, e) {
  let t,
    r = 2e8,
    i,
    o = 0,
    s = e.top,
    l = e.top,
    a,
    c;
  for (let d = n.firstChild, f = 0; d; d = d.nextSibling, f++) {
    let h;
    if (d.nodeType == 1) h = d.getClientRects();
    else if (d.nodeType == 3) h = je(d).getClientRects();
    else continue;
    for (let p = 0; p < h.length; p++) {
      let m = h[p];
      if (m.top <= s && m.bottom >= l) {
        (s = Math.max(m.bottom, s)), (l = Math.min(m.top, l));
        let g =
          m.left > e.left
            ? m.left - e.left
            : m.right < e.left
            ? e.left - m.right
            : 0;
        if (g < r) {
          (t = d),
            (r = g),
            (i =
              g && t.nodeType == 3
                ? { left: m.right < e.left ? m.right : m.left, top: e.top }
                : e),
            d.nodeType == 1 &&
              g &&
              (o = f + (e.left >= (m.left + m.right) / 2 ? 1 : 0));
          continue;
        }
      } else
        m.top > e.top &&
          !a &&
          m.left <= e.left &&
          m.right >= e.left &&
          ((a = d),
          (c = {
            left: Math.max(m.left, Math.min(m.right, e.left)),
            top: m.top,
          }));
      !t &&
        ((e.left >= m.right && e.top >= m.top) ||
          (e.left >= m.left && e.top >= m.bottom)) &&
        (o = f + 1);
    }
  }
  return (
    !t && a && ((t = a), (i = c), (r = 0)),
    t && t.nodeType == 3
      ? Df(t, i)
      : !t || (r && t.nodeType == 1)
      ? { node: n, offset: o }
      : ba(t, i)
  );
}
function Df(n, e) {
  let t = n.nodeValue.length,
    r = document.createRange();
  for (let i = 0; i < t; i++) {
    r.setEnd(n, i + 1), r.setStart(n, i);
    let o = Ye(r, 1);
    if (o.top != o.bottom && Hi(e, o))
      return {
        node: n,
        offset: i + (e.left >= (o.left + o.right) / 2 ? 1 : 0),
      };
  }
  return { node: n, offset: 0 };
}
function Hi(n, e) {
  return (
    n.left >= e.left - 1 &&
    n.left <= e.right + 1 &&
    n.top >= e.top - 1 &&
    n.top <= e.bottom + 1
  );
}
function Af(n, e) {
  let t = n.parentNode;
  return t &&
    /^li$/i.test(t.nodeName) &&
    e.left < n.getBoundingClientRect().left
    ? t
    : n;
}
function Rf(n, e, t) {
  let { node: r, offset: i } = ba(e, t),
    o = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let s = r.getBoundingClientRect();
    o = s.left != s.right && t.left > (s.left + s.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, i, o);
}
function Pf(n, e, t, r) {
  let i = -1;
  for (let o = e, s = !1; o != n.dom; ) {
    let l = n.docView.nearestDesc(o, !0);
    if (!l) return null;
    if (
      l.dom.nodeType == 1 &&
      ((l.node.isBlock && l.parent) || !l.contentDOM)
    ) {
      let a = l.dom.getBoundingClientRect();
      if (
        (l.node.isBlock &&
          l.parent &&
          ((!s && a.left > r.left) || a.top > r.top
            ? (i = l.posBefore)
            : ((!s && a.right < r.left) || a.bottom < r.top) &&
              (i = l.posAfter),
          (s = !0)),
        !l.contentDOM && i < 0 && !l.node.isText)
      )
        return (
          l.node.isBlock
            ? r.top < (a.top + a.bottom) / 2
            : r.left < (a.left + a.right) / 2
        )
          ? l.posBefore
          : l.posAfter;
    }
    o = l.dom.parentNode;
  }
  return i > -1 ? i : n.docView.posFromDOM(e, t, -1);
}
function xa(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (
      let i = Math.max(
          0,
          Math.min(
            r - 1,
            Math.floor((r * (e.top - t.top)) / (t.bottom - t.top)) - 2
          )
        ),
        o = i;
      ;

    ) {
      let s = n.childNodes[o];
      if (s.nodeType == 1) {
        let l = s.getClientRects();
        for (let a = 0; a < l.length; a++) {
          let c = l[a];
          if (Hi(e, c)) return xa(s, e, c);
        }
      }
      if ((o = (o + 1) % r) == i) break;
    }
  return n;
}
function zf(n, e) {
  let t = n.dom.ownerDocument,
    r,
    i = 0,
    o = Sf(t, e.left, e.top);
  o && ({ node: r, offset: i } = o);
  let s = (n.root.elementFromPoint ? n.root : t).elementFromPoint(
      e.left,
      e.top
    ),
    l;
  if (!s || !n.dom.contains(s.nodeType != 1 ? s.parentNode : s)) {
    let c = n.dom.getBoundingClientRect();
    if (!Hi(e, c) || ((s = xa(n.dom, e, c)), !s)) return null;
  }
  if (he) for (let c = s; r && c; c = vn(c)) c.draggable && (r = void 0);
  if (((s = Af(s, e)), r)) {
    if (
      Te &&
      r.nodeType == 1 &&
      ((i = Math.min(i, r.childNodes.length)), i < r.childNodes.length)
    ) {
      let d = r.childNodes[i],
        f;
      d.nodeName == "IMG" &&
        (f = d.getBoundingClientRect()).right <= e.left &&
        f.bottom > e.top &&
        i++;
    }
    let c;
    Tn &&
      i &&
      r.nodeType == 1 &&
      (c = r.childNodes[i - 1]).nodeType == 1 &&
      c.contentEditable == "false" &&
      c.getBoundingClientRect().top >= e.top &&
      i--,
      r == n.dom &&
      i == r.childNodes.length - 1 &&
      r.lastChild.nodeType == 1 &&
      e.top > r.lastChild.getBoundingClientRect().bottom
        ? (l = n.state.doc.content.size)
        : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") &&
          (l = Pf(n, r, i, e));
  }
  l == null && (l = Rf(n, s, e));
  let a = n.docView.nearestDesc(s, !0);
  return { pos: l, inside: a ? a.posAtStart - a.border : -1 };
}
function is(n) {
  return n.top < n.bottom || n.left < n.right;
}
function Ye(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (is(r)) return r;
  }
  return Array.prototype.find.call(t, is) || n.getBoundingClientRect();
}
const Bf = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function ya(n, e, t) {
  let { node: r, offset: i, atom: o } = n.docView.domFromPos(e, t < 0 ? -1 : 1),
    s = Tn || Te;
  if (r.nodeType == 3)
    if (s && (Bf.test(r.nodeValue) || (t < 0 ? !i : i == r.nodeValue.length))) {
      let a = Ye(je(r, i, i), t);
      if (Te && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
        let c = Ye(je(r, i - 1, i - 1), -1);
        if (c.top == a.top) {
          let d = Ye(je(r, i, i + 1), -1);
          if (d.top != a.top) return on(d, d.left < c.left);
        }
      }
      return a;
    } else {
      let a = i,
        c = i,
        d = t < 0 ? 1 : -1;
      return (
        t < 0 && !i
          ? (c++, (d = -1))
          : t >= 0 && i == r.nodeValue.length
          ? (a--, (d = 1))
          : t < 0
          ? a--
          : c++,
        on(Ye(je(r, a, c), d), d < 0)
      );
    }
  if (!n.state.doc.resolve(e - (o || 0)).parent.inlineContent) {
    if (o == null && i && (t < 0 || i == Pe(r))) {
      let a = r.childNodes[i - 1];
      if (a.nodeType == 1) return Fr(a.getBoundingClientRect(), !1);
    }
    if (o == null && i < Pe(r)) {
      let a = r.childNodes[i];
      if (a.nodeType == 1) return Fr(a.getBoundingClientRect(), !0);
    }
    return Fr(r.getBoundingClientRect(), t >= 0);
  }
  if (o == null && i && (t < 0 || i == Pe(r))) {
    let a = r.childNodes[i - 1],
      c =
        a.nodeType == 3
          ? je(a, Pe(a) - (s ? 0 : 1))
          : a.nodeType == 1 && (a.nodeName != "BR" || !a.nextSibling)
          ? a
          : null;
    if (c) return on(Ye(c, 1), !1);
  }
  if (o == null && i < Pe(r)) {
    let a = r.childNodes[i];
    for (; a.pmViewDesc && a.pmViewDesc.ignoreForCoords; ) a = a.nextSibling;
    let c = a
      ? a.nodeType == 3
        ? je(a, 0, s ? 0 : 1)
        : a.nodeType == 1
        ? a
        : null
      : null;
    if (c) return on(Ye(c, -1), !0);
  }
  return on(Ye(r.nodeType == 3 ? je(r) : r, -t), t >= 0);
}
function on(n, e) {
  if (n.width == 0) return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function Fr(n, e) {
  if (n.height == 0) return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function ka(n, e, t) {
  let r = n.state,
    i = n.root.activeElement;
  r != e && n.updateState(e), i != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), i != n.dom && i && i.focus();
  }
}
function Lf(n, e, t) {
  let r = e.selection,
    i = t == "up" ? r.$from : r.$to;
  return ka(n, e, () => {
    let { node: o } = n.docView.domFromPos(i.pos, t == "up" ? -1 : 1);
    for (;;) {
      let l = n.docView.nearestDesc(o, !0);
      if (!l) break;
      if (l.node.isBlock) {
        o = l.contentDOM || l.dom;
        break;
      }
      o = l.dom.parentNode;
    }
    let s = ya(n, i.pos, 1);
    for (let l = o.firstChild; l; l = l.nextSibling) {
      let a;
      if (l.nodeType == 1) a = l.getClientRects();
      else if (l.nodeType == 3)
        a = je(l, 0, l.nodeValue.length).getClientRects();
      else continue;
      for (let c = 0; c < a.length; c++) {
        let d = a[c];
        if (
          d.bottom > d.top + 1 &&
          (t == "up"
            ? s.top - d.top > (d.bottom - s.top) * 2
            : d.bottom - s.bottom > (s.bottom - d.top) * 2)
        )
          return !1;
      }
    }
    return !0;
  });
}
const Ff = /[\u0590-\u08ac]/;
function $f(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock) return !1;
  let i = r.parentOffset,
    o = !i,
    s = i == r.parent.content.size,
    l = n.domSelection();
  return !Ff.test(r.parent.textContent) || !l.modify
    ? t == "left" || t == "backward"
      ? o
      : s
    : ka(n, e, () => {
        let {
            focusNode: a,
            focusOffset: c,
            anchorNode: d,
            anchorOffset: f,
          } = n.domSelectionRange(),
          h = l.caretBidiLevel;
        l.modify("move", t, "character");
        let p = r.depth ? n.docView.domAfterPos(r.before()) : n.dom,
          { focusNode: m, focusOffset: g } = n.domSelectionRange(),
          x =
            (m && !p.contains(m.nodeType == 1 ? m : m.parentNode)) ||
            (a == m && c == g);
        try {
          l.collapse(d, f),
            a && (a != d || c != f) && l.extend && l.extend(a, c);
        } catch {}
        return h != null && (l.caretBidiLevel = h), x;
      });
}
let ss = null,
  ls = null,
  as = !1;
function Vf(n, e, t) {
  return ss == e && ls == t
    ? as
    : ((ss = e),
      (ls = t),
      (as = t == "up" || t == "down" ? Lf(n, e, t) : $f(n, e, t)));
}
const Se = 0,
  cs = 1,
  xt = 2,
  Le = 3;
class In {
  constructor(e, t, r, i) {
    (this.parent = e),
      (this.children = t),
      (this.dom = r),
      (this.contentDOM = i),
      (this.dirty = Se),
      (r.pmViewDesc = this);
  }
  matchesWidget(e) {
    return !1;
  }
  matchesMark(e) {
    return !1;
  }
  matchesNode(e, t, r) {
    return !1;
  }
  matchesHack(e) {
    return !1;
  }
  parseRule() {
    return null;
  }
  stopEvent(e) {
    return !1;
  }
  get size() {
    let e = 0;
    for (let t = 0; t < this.children.length; t++) e += this.children[t].size;
    return e;
  }
  get border() {
    return 0;
  }
  destroy() {
    (this.parent = void 0),
      this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
    for (let e = 0; e < this.children.length; e++) this.children[e].destroy();
  }
  posBeforeChild(e) {
    for (let t = 0, r = this.posAtStart; ; t++) {
      let i = this.children[t];
      if (i == e) return r;
      r += i.size;
    }
  }
  get posBefore() {
    return this.parent.posBeforeChild(this);
  }
  get posAtStart() {
    return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
  }
  get posAfter() {
    return this.posBefore + this.size;
  }
  get posAtEnd() {
    return this.posAtStart + this.size - 2 * this.border;
  }
  localPosFromDOM(e, t, r) {
    if (
      this.contentDOM &&
      this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode)
    )
      if (r < 0) {
        let o, s;
        if (e == this.contentDOM) o = e.childNodes[t - 1];
        else {
          for (; e.parentNode != this.contentDOM; ) e = e.parentNode;
          o = e.previousSibling;
        }
        for (; o && !((s = o.pmViewDesc) && s.parent == this); )
          o = o.previousSibling;
        return o ? this.posBeforeChild(s) + s.size : this.posAtStart;
      } else {
        let o, s;
        if (e == this.contentDOM) o = e.childNodes[t];
        else {
          for (; e.parentNode != this.contentDOM; ) e = e.parentNode;
          o = e.nextSibling;
        }
        for (; o && !((s = o.pmViewDesc) && s.parent == this); )
          o = o.nextSibling;
        return o ? this.posBeforeChild(s) : this.posAtEnd;
      }
    let i;
    if (e == this.dom && this.contentDOM) i = t > ie(this.contentDOM);
    else if (
      this.contentDOM &&
      this.contentDOM != this.dom &&
      this.dom.contains(this.contentDOM)
    )
      i = e.compareDocumentPosition(this.contentDOM) & 2;
    else if (this.dom.firstChild) {
      if (t == 0)
        for (let o = e; ; o = o.parentNode) {
          if (o == this.dom) {
            i = !1;
            break;
          }
          if (o.previousSibling) break;
        }
      if (i == null && t == e.childNodes.length)
        for (let o = e; ; o = o.parentNode) {
          if (o == this.dom) {
            i = !0;
            break;
          }
          if (o.nextSibling) break;
        }
    }
    return i ?? r > 0 ? this.posAtEnd : this.posAtStart;
  }
  nearestDesc(e, t = !1) {
    for (let r = !0, i = e; i; i = i.parentNode) {
      let o = this.getDesc(i),
        s;
      if (o && (!t || o.node))
        if (
          r &&
          (s = o.nodeDOM) &&
          !(s.nodeType == 1
            ? s.contains(e.nodeType == 1 ? e : e.parentNode)
            : s == e)
        )
          r = !1;
        else return o;
    }
  }
  getDesc(e) {
    let t = e.pmViewDesc;
    for (let r = t; r; r = r.parent) if (r == this) return t;
  }
  posFromDOM(e, t, r) {
    for (let i = e; i; i = i.parentNode) {
      let o = this.getDesc(i);
      if (o) return o.localPosFromDOM(e, t, r);
    }
    return -1;
  }
  descAt(e) {
    for (let t = 0, r = 0; t < this.children.length; t++) {
      let i = this.children[t],
        o = r + i.size;
      if (r == e && o != r) {
        for (; !i.border && i.children.length; ) i = i.children[0];
        return i;
      }
      if (e < o) return i.descAt(e - r - i.border);
      r = o;
    }
  }
  domFromPos(e, t) {
    if (!this.contentDOM) return { node: this.dom, offset: 0, atom: e + 1 };
    let r = 0,
      i = 0;
    for (let o = 0; r < this.children.length; r++) {
      let s = this.children[r],
        l = o + s.size;
      if (l > e || s instanceof va) {
        i = e - o;
        break;
      }
      o = l;
    }
    if (i) return this.children[r].domFromPos(i - this.children[r].border, t);
    for (
      let o;
      r && !(o = this.children[r - 1]).size && o instanceof _a && o.side >= 0;
      r--
    );
    if (t <= 0) {
      let o,
        s = !0;
      for (
        ;
        (o = r ? this.children[r - 1] : null),
          !(!o || o.dom.parentNode == this.contentDOM);
        r--, s = !1
      );
      return o && t && s && !o.border && !o.domAtom
        ? o.domFromPos(o.size, t)
        : { node: this.contentDOM, offset: o ? ie(o.dom) + 1 : 0 };
    } else {
      let o,
        s = !0;
      for (
        ;
        (o = r < this.children.length ? this.children[r] : null),
          !(!o || o.dom.parentNode == this.contentDOM);
        r++, s = !1
      );
      return o && s && !o.border && !o.domAtom
        ? o.domFromPos(0, t)
        : {
            node: this.contentDOM,
            offset: o ? ie(o.dom) : this.contentDOM.childNodes.length,
          };
    }
  }
  parseRange(e, t, r = 0) {
    if (this.children.length == 0)
      return {
        node: this.contentDOM,
        from: e,
        to: t,
        fromOffset: 0,
        toOffset: this.contentDOM.childNodes.length,
      };
    let i = -1,
      o = -1;
    for (let s = r, l = 0; ; l++) {
      let a = this.children[l],
        c = s + a.size;
      if (i == -1 && e <= c) {
        let d = s + a.border;
        if (
          e >= d &&
          t <= c - a.border &&
          a.node &&
          a.contentDOM &&
          this.contentDOM.contains(a.contentDOM)
        )
          return a.parseRange(e, t, d);
        e = s;
        for (let f = l; f > 0; f--) {
          let h = this.children[f - 1];
          if (
            h.size &&
            h.dom.parentNode == this.contentDOM &&
            !h.emptyChildAt(1)
          ) {
            i = ie(h.dom) + 1;
            break;
          }
          e -= h.size;
        }
        i == -1 && (i = 0);
      }
      if (i > -1 && (c > t || l == this.children.length - 1)) {
        t = c;
        for (let d = l + 1; d < this.children.length; d++) {
          let f = this.children[d];
          if (
            f.size &&
            f.dom.parentNode == this.contentDOM &&
            !f.emptyChildAt(-1)
          ) {
            o = ie(f.dom);
            break;
          }
          t += f.size;
        }
        o == -1 && (o = this.contentDOM.childNodes.length);
        break;
      }
      s = c;
    }
    return {
      node: this.contentDOM,
      from: e,
      to: t,
      fromOffset: i,
      toOffset: o,
    };
  }
  emptyChildAt(e) {
    if (this.border || !this.contentDOM || !this.children.length) return !1;
    let t = this.children[e < 0 ? 0 : this.children.length - 1];
    return t.size == 0 || t.emptyChildAt(e);
  }
  domAfterPos(e) {
    let { node: t, offset: r } = this.domFromPos(e, 0);
    if (t.nodeType != 1 || r == t.childNodes.length)
      throw new RangeError("No node after pos " + e);
    return t.childNodes[r];
  }
  setSelection(e, t, r, i = !1) {
    let o = Math.min(e, t),
      s = Math.max(e, t);
    for (let h = 0, p = 0; h < this.children.length; h++) {
      let m = this.children[h],
        g = p + m.size;
      if (o > p && s < g)
        return m.setSelection(e - p - m.border, t - p - m.border, r, i);
      p = g;
    }
    let l = this.domFromPos(e, e ? -1 : 1),
      a = t == e ? l : this.domFromPos(t, t ? -1 : 1),
      c = r.getSelection(),
      d = !1;
    if ((Te || he) && e == t) {
      let { node: h, offset: p } = l;
      if (h.nodeType == 3) {
        if (
          ((d = !!(
            p &&
            h.nodeValue[p - 1] ==
              `
`
          )),
          d && p == h.nodeValue.length)
        )
          for (let m = h, g; m; m = m.parentNode) {
            if ((g = m.nextSibling)) {
              g.nodeName == "BR" &&
                (l = a = { node: g.parentNode, offset: ie(g) + 1 });
              break;
            }
            let x = m.pmViewDesc;
            if (x && x.node && x.node.isBlock) break;
          }
      } else {
        let m = h.childNodes[p - 1];
        d = m && (m.nodeName == "BR" || m.contentEditable == "false");
      }
    }
    if (
      Te &&
      c.focusNode &&
      c.focusNode != a.node &&
      c.focusNode.nodeType == 1
    ) {
      let h = c.focusNode.childNodes[c.focusOffset];
      h && h.contentEditable == "false" && (i = !0);
    }
    if (
      !(i || (d && he)) &&
      Et(l.node, l.offset, c.anchorNode, c.anchorOffset) &&
      Et(a.node, a.offset, c.focusNode, c.focusOffset)
    )
      return;
    let f = !1;
    if ((c.extend || e == t) && !d) {
      c.collapse(l.node, l.offset);
      try {
        e != t && c.extend(a.node, a.offset), (f = !0);
      } catch {}
    }
    if (!f) {
      if (e > t) {
        let p = l;
        (l = a), (a = p);
      }
      let h = document.createRange();
      h.setEnd(a.node, a.offset),
        h.setStart(l.node, l.offset),
        c.removeAllRanges(),
        c.addRange(h);
    }
  }
  ignoreMutation(e) {
    return !this.contentDOM && e.type != "selection";
  }
  get contentLost() {
    return (
      this.contentDOM &&
      this.contentDOM != this.dom &&
      !this.dom.contains(this.contentDOM)
    );
  }
  markDirty(e, t) {
    for (let r = 0, i = 0; i < this.children.length; i++) {
      let o = this.children[i],
        s = r + o.size;
      if (r == s ? e <= s && t >= r : e < s && t > r) {
        let l = r + o.border,
          a = s - o.border;
        if (e >= l && t <= a) {
          (this.dirty = e == r || t == s ? xt : cs),
            e == l &&
            t == a &&
            (o.contentLost || o.dom.parentNode != this.contentDOM)
              ? (o.dirty = Le)
              : o.markDirty(e - l, t - l);
          return;
        } else
          o.dirty =
            o.dom == o.contentDOM &&
            o.dom.parentNode == this.contentDOM &&
            !o.children.length
              ? xt
              : Le;
      }
      r = s;
    }
    this.dirty = xt;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? xt : cs;
      t.dirty < r && (t.dirty = r);
    }
  }
  get domAtom() {
    return !1;
  }
  get ignoreForCoords() {
    return !1;
  }
  isText(e) {
    return !1;
  }
}
class _a extends In {
  constructor(e, t, r, i) {
    let o,
      s = t.type.toDOM;
    if (
      (typeof s == "function" &&
        (s = s(r, () => {
          if (!o) return i;
          if (o.parent) return o.parent.posBeforeChild(o);
        })),
      !t.type.spec.raw)
    ) {
      if (s.nodeType != 1) {
        let l = document.createElement("span");
        l.appendChild(s), (s = l);
      }
      (s.contentEditable = "false"), s.classList.add("ProseMirror-widget");
    }
    super(e, [], s, null), (this.widget = t), (this.widget = t), (o = this);
  }
  matchesWidget(e) {
    return this.dirty == Se && e.type.eq(this.widget.type);
  }
  parseRule() {
    return { ignore: !0 };
  }
  stopEvent(e) {
    let t = this.widget.spec.stopEvent;
    return t ? t(e) : !1;
  }
  ignoreMutation(e) {
    return e.type != "selection" || this.widget.spec.ignoreSelection;
  }
  destroy() {
    this.widget.type.destroy(this.dom), super.destroy();
  }
  get domAtom() {
    return !0;
  }
  get side() {
    return this.widget.type.side;
  }
}
class Uf extends In {
  constructor(e, t, r, i) {
    super(e, [], t, null), (this.textDOM = r), (this.text = i);
  }
  get size() {
    return this.text.length;
  }
  localPosFromDOM(e, t) {
    return e != this.textDOM
      ? this.posAtStart + (t ? this.size : 0)
      : this.posAtStart + t;
  }
  domFromPos(e) {
    return { node: this.textDOM, offset: e };
  }
  ignoreMutation(e) {
    return e.type === "characterData" && e.target.nodeValue == e.oldValue;
  }
}
class Tt extends In {
  constructor(e, t, r, i) {
    super(e, [], r, i), (this.mark = t);
  }
  static create(e, t, r, i) {
    let o = i.nodeViews[t.type.name],
      s = o && o(t, i, r);
    return (
      (!s || !s.dom) &&
        (s = tn.renderSpec(document, t.type.spec.toDOM(t, r), null, t.attrs)),
      new Tt(e, t, s.dom, s.contentDOM || s.dom)
    );
  }
  parseRule() {
    return this.dirty & Le || this.mark.type.spec.reparseInView
      ? null
      : {
          mark: this.mark.type.name,
          attrs: this.mark.attrs,
          contentElement: this.contentDOM,
        };
  }
  matchesMark(e) {
    return this.dirty != Le && this.mark.eq(e);
  }
  markDirty(e, t) {
    if ((super.markDirty(e, t), this.dirty != Se)) {
      let r = this.parent;
      for (; !r.node; ) r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), (this.dirty = Se);
    }
  }
  slice(e, t, r) {
    let i = Tt.create(this.parent, this.mark, !0, r),
      o = this.children,
      s = this.size;
    t < s && (o = bi(o, t, s, r)), e > 0 && (o = bi(o, 0, e, r));
    for (let l = 0; l < o.length; l++) o[l].parent = i;
    return (i.children = o), i;
  }
}
class st extends In {
  constructor(e, t, r, i, o, s, l, a, c) {
    super(e, [], o, s),
      (this.node = t),
      (this.outerDeco = r),
      (this.innerDeco = i),
      (this.nodeDOM = l);
  }
  static create(e, t, r, i, o, s) {
    let l = o.nodeViews[t.type.name],
      a,
      c =
        l &&
        l(
          t,
          o,
          () => {
            if (!a) return s;
            if (a.parent) return a.parent.posBeforeChild(a);
          },
          r,
          i
        ),
      d = c && c.dom,
      f = c && c.contentDOM;
    if (t.isText) {
      if (!d) d = document.createTextNode(t.text);
      else if (d.nodeType != 3)
        throw new RangeError("Text must be rendered as a DOM text node");
    } else
      d ||
        ({ dom: d, contentDOM: f } = tn.renderSpec(
          document,
          t.type.spec.toDOM(t),
          null,
          t.attrs
        ));
    !f &&
      !t.isText &&
      d.nodeName != "BR" &&
      (d.hasAttribute("contenteditable") || (d.contentEditable = "false"),
      t.type.spec.draggable && (d.draggable = !0));
    let h = d;
    return (
      (d = Ca(d, r, t)),
      c
        ? (a = new jf(e, t, r, i, d, f || null, h, c, o, s + 1))
        : t.isText
        ? new yr(e, t, r, i, d, h, o)
        : new st(e, t, r, i, d, f || null, h, o, s + 1)
    );
  }
  parseRule() {
    if (this.node.type.spec.reparseInView) return null;
    let e = { node: this.node.type.name, attrs: this.node.attrs };
    if (
      (this.node.type.whitespace == "pre" && (e.preserveWhitespace = "full"),
      !this.contentDOM)
    )
      e.getContent = () => this.node.content;
    else if (!this.contentLost) e.contentElement = this.contentDOM;
    else {
      for (let t = this.children.length - 1; t >= 0; t--) {
        let r = this.children[t];
        if (this.dom.contains(r.dom.parentNode)) {
          e.contentElement = r.dom.parentNode;
          break;
        }
      }
      e.contentElement || (e.getContent = () => _.empty);
    }
    return e;
  }
  matchesNode(e, t, r) {
    return (
      this.dirty == Se &&
      e.eq(this.node) &&
      gi(t, this.outerDeco) &&
      r.eq(this.innerDeco)
    );
  }
  get size() {
    return this.node.nodeSize;
  }
  get border() {
    return this.node.isLeaf ? 0 : 1;
  }
  updateChildren(e, t) {
    let r = this.node.inlineContent,
      i = t,
      o = e.composing ? this.localCompositionInfo(e, t) : null,
      s = o && o.pos > -1 ? o : null,
      l = o && o.pos < 0,
      a = new qf(this, s && s.node, e);
    Kf(
      this.node,
      this.innerDeco,
      (c, d, f) => {
        c.spec.marks
          ? a.syncToMarks(c.spec.marks, r, e)
          : c.type.side >= 0 &&
            !f &&
            a.syncToMarks(
              d == this.node.childCount ? L.none : this.node.child(d).marks,
              r,
              e
            ),
          a.placeWidget(c, e, i);
      },
      (c, d, f, h) => {
        a.syncToMarks(c.marks, r, e);
        let p;
        a.findNodeMatch(c, d, f, h) ||
          (l &&
            e.state.selection.from > i &&
            e.state.selection.to < i + c.nodeSize &&
            (p = a.findIndexWithChild(o.node)) > -1 &&
            a.updateNodeAt(c, d, f, p, e)) ||
          a.updateNextNode(c, d, f, e, h, i) ||
          a.addNode(c, d, f, e, i),
          (i += c.nodeSize);
      }
    ),
      a.syncToMarks([], r, e),
      this.node.isTextblock && a.addTextblockHacks(),
      a.destroyRest(),
      (a.changed || this.dirty == xt) &&
        (s && this.protectLocalComposition(e, s),
        wa(this.contentDOM, this.children, e),
        Yt && Gf(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: i } = e.state.selection;
    if (
      !(e.state.selection instanceof I) ||
      r < t ||
      i > t + this.node.content.size
    )
      return null;
    let o = e.input.compositionNode;
    if (!o || !this.dom.contains(o.parentNode)) return null;
    if (this.node.inlineContent) {
      let s = o.nodeValue,
        l = Yf(this.node.content, s, r - t, i - t);
      return l < 0 ? null : { node: o, pos: l, text: s };
    } else return { node: o, pos: -1, text: "" };
  }
  protectLocalComposition(e, { node: t, pos: r, text: i }) {
    if (this.getDesc(t)) return;
    let o = t;
    for (; o.parentNode != this.contentDOM; o = o.parentNode) {
      for (; o.previousSibling; ) o.parentNode.removeChild(o.previousSibling);
      for (; o.nextSibling; ) o.parentNode.removeChild(o.nextSibling);
      o.pmViewDesc && (o.pmViewDesc = void 0);
    }
    let s = new Uf(this, o, t, i);
    e.input.compositionNodes.push(s),
      (this.children = bi(this.children, r, r + i.length, e, s));
  }
  update(e, t, r, i) {
    return this.dirty == Le || !e.sameMarkup(this.node)
      ? !1
      : (this.updateInner(e, t, r, i), !0);
  }
  updateInner(e, t, r, i) {
    this.updateOuterDeco(t),
      (this.node = e),
      (this.innerDeco = r),
      this.contentDOM && this.updateChildren(i, this.posAtStart),
      (this.dirty = Se);
  }
  updateOuterDeco(e) {
    if (gi(e, this.outerDeco)) return;
    let t = this.nodeDOM.nodeType != 1,
      r = this.dom;
    (this.dom = Sa(
      this.dom,
      this.nodeDOM,
      mi(this.outerDeco, this.node, t),
      mi(e, this.node, t)
    )),
      this.dom != r && ((r.pmViewDesc = void 0), (this.dom.pmViewDesc = this)),
      (this.outerDeco = e);
  }
  selectNode() {
    this.nodeDOM.nodeType == 1 &&
      this.nodeDOM.classList.add("ProseMirror-selectednode"),
      (this.contentDOM || !this.node.type.spec.draggable) &&
        (this.dom.draggable = !0);
  }
  deselectNode() {
    this.nodeDOM.nodeType == 1 &&
      (this.nodeDOM.classList.remove("ProseMirror-selectednode"),
      (this.contentDOM || !this.node.type.spec.draggable) &&
        this.dom.removeAttribute("draggable"));
  }
  get domAtom() {
    return this.node.isAtom;
  }
}
function ds(n, e, t, r, i) {
  Ca(r, e, n);
  let o = new st(void 0, n, e, t, r, r, r, i, 0);
  return o.contentDOM && o.updateChildren(i, 0), o;
}
class yr extends st {
  constructor(e, t, r, i, o, s, l) {
    super(e, t, r, i, o, null, s, l, 0);
  }
  parseRule() {
    let e = this.nodeDOM.parentNode;
    for (; e && e != this.dom && !e.pmIsDeco; ) e = e.parentNode;
    return { skip: e || !0 };
  }
  update(e, t, r, i) {
    return this.dirty == Le ||
      (this.dirty != Se && !this.inParent()) ||
      !e.sameMarkup(this.node)
      ? !1
      : (this.updateOuterDeco(t),
        (this.dirty != Se || e.text != this.node.text) &&
          e.text != this.nodeDOM.nodeValue &&
          ((this.nodeDOM.nodeValue = e.text),
          i.trackWrites == this.nodeDOM && (i.trackWrites = null)),
        (this.node = e),
        (this.dirty = Se),
        !0);
  }
  inParent() {
    let e = this.parent.contentDOM;
    for (let t = this.nodeDOM; t; t = t.parentNode) if (t == e) return !0;
    return !1;
  }
  domFromPos(e) {
    return { node: this.nodeDOM, offset: e };
  }
  localPosFromDOM(e, t, r) {
    return e == this.nodeDOM
      ? this.posAtStart + Math.min(t, this.node.text.length)
      : super.localPosFromDOM(e, t, r);
  }
  ignoreMutation(e) {
    return e.type != "characterData" && e.type != "selection";
  }
  slice(e, t, r) {
    let i = this.node.cut(e, t),
      o = document.createTextNode(i.text);
    return new yr(this.parent, i, this.outerDeco, this.innerDeco, o, o, r);
  }
  markDirty(e, t) {
    super.markDirty(e, t),
      this.dom != this.nodeDOM &&
        (e == 0 || t == this.nodeDOM.nodeValue.length) &&
        (this.dirty = Le);
  }
  get domAtom() {
    return !1;
  }
  isText(e) {
    return this.node.text == e;
  }
}
class va extends In {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == Se && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class jf extends st {
  constructor(e, t, r, i, o, s, l, a, c, d) {
    super(e, t, r, i, o, s, l, c, d), (this.spec = a);
  }
  update(e, t, r, i) {
    if (this.dirty == Le) return !1;
    if (this.spec.update) {
      let o = this.spec.update(e, t, r);
      return o && this.updateInner(e, t, r, i), o;
    } else return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, t, r, i);
  }
  selectNode() {
    this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
  }
  deselectNode() {
    this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
  }
  setSelection(e, t, r, i) {
    this.spec.setSelection
      ? this.spec.setSelection(e, t, r)
      : super.setSelection(e, t, r, i);
  }
  destroy() {
    this.spec.destroy && this.spec.destroy(), super.destroy();
  }
  stopEvent(e) {
    return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
  }
  ignoreMutation(e) {
    return this.spec.ignoreMutation
      ? this.spec.ignoreMutation(e)
      : super.ignoreMutation(e);
  }
}
function wa(n, e, t) {
  let r = n.firstChild,
    i = !1;
  for (let o = 0; o < e.length; o++) {
    let s = e[o],
      l = s.dom;
    if (l.parentNode == n) {
      for (; l != r; ) (r = us(r)), (i = !0);
      r = r.nextSibling;
    } else (i = !0), n.insertBefore(l, r);
    if (s instanceof Tt) {
      let a = r ? r.previousSibling : n.lastChild;
      wa(s.contentDOM, s.children, t), (r = a ? a.nextSibling : n.firstChild);
    }
  }
  for (; r; ) (r = us(r)), (i = !0);
  i && t.trackWrites == n && (t.trackWrites = null);
}
const hn = function (n) {
  n && (this.nodeName = n);
};
hn.prototype = Object.create(null);
const yt = [new hn()];
function mi(n, e, t) {
  if (n.length == 0) return yt;
  let r = t ? yt[0] : new hn(),
    i = [r];
  for (let o = 0; o < n.length; o++) {
    let s = n[o].type.attrs;
    if (s) {
      s.nodeName && i.push((r = new hn(s.nodeName)));
      for (let l in s) {
        let a = s[l];
        a != null &&
          (t &&
            i.length == 1 &&
            i.push((r = new hn(e.isInline ? "span" : "div"))),
          l == "class"
            ? (r.class = (r.class ? r.class + " " : "") + a)
            : l == "style"
            ? (r.style = (r.style ? r.style + ";" : "") + a)
            : l != "nodeName" && (r[l] = a));
      }
    }
  }
  return i;
}
function Sa(n, e, t, r) {
  if (t == yt && r == yt) return e;
  let i = e;
  for (let o = 0; o < r.length; o++) {
    let s = r[o],
      l = t[o];
    if (o) {
      let a;
      (l &&
        l.nodeName == s.nodeName &&
        i != n &&
        (a = i.parentNode) &&
        a.nodeName.toLowerCase() == s.nodeName) ||
        ((a = document.createElement(s.nodeName)),
        (a.pmIsDeco = !0),
        a.appendChild(i),
        (l = yt[0])),
        (i = a);
    }
    Hf(i, l || yt[0], s);
  }
  return i;
}
function Hf(n, e, t) {
  for (let r in e)
    r != "class" &&
      r != "style" &&
      r != "nodeName" &&
      !(r in t) &&
      n.removeAttribute(r);
  for (let r in t)
    r != "class" &&
      r != "style" &&
      r != "nodeName" &&
      t[r] != e[r] &&
      n.setAttribute(r, t[r]);
  if (e.class != t.class) {
    let r = e.class ? e.class.split(" ").filter(Boolean) : [],
      i = t.class ? t.class.split(" ").filter(Boolean) : [];
    for (let o = 0; o < r.length; o++)
      i.indexOf(r[o]) == -1 && n.classList.remove(r[o]);
    for (let o = 0; o < i.length; o++)
      r.indexOf(i[o]) == -1 && n.classList.add(i[o]);
    n.classList.length == 0 && n.removeAttribute("class");
  }
  if (e.style != t.style) {
    if (e.style) {
      let r =
          /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g,
        i;
      for (; (i = r.exec(e.style)); ) n.style.removeProperty(i[1]);
    }
    t.style && (n.style.cssText += t.style);
  }
}
function Ca(n, e, t) {
  return Sa(n, n, yt, mi(e, t, n.nodeType != 1));
}
function gi(n, e) {
  if (n.length != e.length) return !1;
  for (let t = 0; t < n.length; t++) if (!n[t].type.eq(e[t].type)) return !1;
  return !0;
}
function us(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class qf {
  constructor(e, t, r) {
    (this.lock = t),
      (this.view = r),
      (this.index = 0),
      (this.stack = []),
      (this.changed = !1),
      (this.top = e),
      (this.preMatch = Wf(e.node.content, e));
  }
  destroyBetween(e, t) {
    if (e != t) {
      for (let r = e; r < t; r++) this.top.children[r].destroy();
      this.top.children.splice(e, t - e), (this.changed = !0);
    }
  }
  destroyRest() {
    this.destroyBetween(this.index, this.top.children.length);
  }
  syncToMarks(e, t, r) {
    let i = 0,
      o = this.stack.length >> 1,
      s = Math.min(o, e.length);
    for (
      ;
      i < s &&
      (i == o - 1 ? this.top : this.stack[(i + 1) << 1]).matchesMark(e[i]) &&
      e[i].type.spec.spanning !== !1;

    )
      i++;
    for (; i < o; )
      this.destroyRest(),
        (this.top.dirty = Se),
        (this.index = this.stack.pop()),
        (this.top = this.stack.pop()),
        o--;
    for (; o < e.length; ) {
      this.stack.push(this.top, this.index + 1);
      let l = -1;
      for (
        let a = this.index;
        a < Math.min(this.index + 3, this.top.children.length);
        a++
      ) {
        let c = this.top.children[a];
        if (c.matchesMark(e[o]) && !this.isLocked(c.dom)) {
          l = a;
          break;
        }
      }
      if (l > -1)
        l > this.index &&
          ((this.changed = !0), this.destroyBetween(this.index, l)),
          (this.top = this.top.children[this.index]);
      else {
        let a = Tt.create(this.top, e[o], t, r);
        this.top.children.splice(this.index, 0, a),
          (this.top = a),
          (this.changed = !0);
      }
      (this.index = 0), o++;
    }
  }
  findNodeMatch(e, t, r, i) {
    let o = -1,
      s;
    if (
      i >= this.preMatch.index &&
      (s = this.preMatch.matches[i - this.preMatch.index]).parent == this.top &&
      s.matchesNode(e, t, r)
    )
      o = this.top.children.indexOf(s, this.index);
    else
      for (
        let l = this.index, a = Math.min(this.top.children.length, l + 5);
        l < a;
        l++
      ) {
        let c = this.top.children[l];
        if (c.matchesNode(e, t, r) && !this.preMatch.matched.has(c)) {
          o = l;
          break;
        }
      }
    return o < 0 ? !1 : (this.destroyBetween(this.index, o), this.index++, !0);
  }
  updateNodeAt(e, t, r, i, o) {
    let s = this.top.children[i];
    return (
      s.dirty == Le && s.dom == s.contentDOM && (s.dirty = xt),
      s.update(e, t, r, o)
        ? (this.destroyBetween(this.index, i), this.index++, !0)
        : !1
    );
  }
  findIndexWithChild(e) {
    for (;;) {
      let t = e.parentNode;
      if (!t) return -1;
      if (t == this.top.contentDOM) {
        let r = e.pmViewDesc;
        if (r) {
          for (let i = this.index; i < this.top.children.length; i++)
            if (this.top.children[i] == r) return i;
        }
        return -1;
      }
      e = t;
    }
  }
  updateNextNode(e, t, r, i, o, s) {
    for (let l = this.index; l < this.top.children.length; l++) {
      let a = this.top.children[l];
      if (a instanceof st) {
        let c = this.preMatch.matched.get(a);
        if (c != null && c != o) return !1;
        let d = a.dom,
          f,
          h =
            this.isLocked(d) &&
            !(
              e.isText &&
              a.node &&
              a.node.isText &&
              a.nodeDOM.nodeValue == e.text &&
              a.dirty != Le &&
              gi(t, a.outerDeco)
            );
        if (!h && a.update(e, t, r, i))
          return (
            this.destroyBetween(this.index, l),
            a.dom != d && (this.changed = !0),
            this.index++,
            !0
          );
        if (!h && (f = this.recreateWrapper(a, e, t, r, i, s)))
          return (
            (this.top.children[this.index] = f),
            f.contentDOM &&
              ((f.dirty = xt), f.updateChildren(i, s + 1), (f.dirty = Se)),
            (this.changed = !0),
            this.index++,
            !0
          );
        break;
      }
    }
    return !1;
  }
  recreateWrapper(e, t, r, i, o, s) {
    if (
      e.dirty ||
      t.isAtom ||
      !e.children.length ||
      !e.node.content.eq(t.content)
    )
      return null;
    let l = st.create(this.top, t, r, i, o, s);
    if (l.contentDOM) {
      (l.children = e.children), (e.children = []);
      for (let a of l.children) a.parent = l;
    }
    return e.destroy(), l;
  }
  addNode(e, t, r, i, o) {
    let s = st.create(this.top, e, t, r, i, o);
    s.contentDOM && s.updateChildren(i, o + 1),
      this.top.children.splice(this.index++, 0, s),
      (this.changed = !0);
  }
  placeWidget(e, t, r) {
    let i =
      this.index < this.top.children.length
        ? this.top.children[this.index]
        : null;
    if (
      i &&
      i.matchesWidget(e) &&
      (e == i.widget || !i.widget.type.toDOM.parentNode)
    )
      this.index++;
    else {
      let o = new _a(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, o), (this.changed = !0);
    }
  }
  addTextblockHacks() {
    let e = this.top.children[this.index - 1],
      t = this.top;
    for (; e instanceof Tt; ) (t = e), (e = t.children[t.children.length - 1]);
    (!e ||
      !(e instanceof yr) ||
      /\n$/.test(e.node.text) ||
      (this.view.requiresGeckoHackNode && /\s$/.test(e.node.text))) &&
      ((he || de) &&
        e &&
        e.dom.contentEditable == "false" &&
        this.addHackNode("IMG", t),
      this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (
      t == this.top &&
      this.index < t.children.length &&
      t.children[this.index].matchesHack(e)
    )
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && ((r.className = "ProseMirror-separator"), (r.alt = "")),
        e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let i = new va(this.top, [], r, null);
      t != this.top
        ? t.children.push(i)
        : t.children.splice(this.index++, 0, i),
        (this.changed = !0);
    }
  }
  isLocked(e) {
    return (
      this.lock &&
      (e == this.lock || (e.nodeType == 1 && e.contains(this.lock.parentNode)))
    );
  }
}
function Wf(n, e) {
  let t = e,
    r = t.children.length,
    i = n.childCount,
    o = new Map(),
    s = [];
  e: for (; i > 0; ) {
    let l;
    for (;;)
      if (r) {
        let c = t.children[r - 1];
        if (c instanceof Tt) (t = c), (r = c.children.length);
        else {
          (l = c), r--;
          break;
        }
      } else {
        if (t == e) break e;
        (r = t.parent.children.indexOf(t)), (t = t.parent);
      }
    let a = l.node;
    if (a) {
      if (a != n.child(i - 1)) break;
      --i, o.set(l, i), s.push(l);
    }
  }
  return { index: i, matched: o, matches: s.reverse() };
}
function Jf(n, e) {
  return n.type.side - e.type.side;
}
function Kf(n, e, t, r) {
  let i = e.locals(n),
    o = 0;
  if (i.length == 0) {
    for (let c = 0; c < n.childCount; c++) {
      let d = n.child(c);
      r(d, i, e.forChild(o, d), c), (o += d.nodeSize);
    }
    return;
  }
  let s = 0,
    l = [],
    a = null;
  for (let c = 0; ; ) {
    let d, f;
    for (; s < i.length && i[s].to == o; ) {
      let x = i[s++];
      x.widget && (d ? (f || (f = [d])).push(x) : (d = x));
    }
    if (d)
      if (f) {
        f.sort(Jf);
        for (let x = 0; x < f.length; x++) t(f[x], c, !!a);
      } else t(d, c, !!a);
    let h, p;
    if (a) (p = -1), (h = a), (a = null);
    else if (c < n.childCount) (p = c), (h = n.child(c++));
    else break;
    for (let x = 0; x < l.length; x++) l[x].to <= o && l.splice(x--, 1);
    for (; s < i.length && i[s].from <= o && i[s].to > o; ) l.push(i[s++]);
    let m = o + h.nodeSize;
    if (h.isText) {
      let x = m;
      s < i.length && i[s].from < x && (x = i[s].from);
      for (let y = 0; y < l.length; y++) l[y].to < x && (x = l[y].to);
      x < m && ((a = h.cut(x - o)), (h = h.cut(0, x - o)), (m = x), (p = -1));
    } else for (; s < i.length && i[s].to < m; ) s++;
    let g = h.isInline && !h.isLeaf ? l.filter((x) => !x.inline) : l.slice();
    r(h, g, e.forChild(o, h), p), (o = m);
  }
}
function Gf(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    (n.style.cssText = e + "; list-style: square !important"),
      window.getComputedStyle(n).listStyle,
      (n.style.cssText = e);
  }
}
function Yf(n, e, t, r) {
  for (let i = 0, o = 0; i < n.childCount && o <= r; ) {
    let s = n.child(i++),
      l = o;
    if (((o += s.nodeSize), !s.isText)) continue;
    let a = s.text;
    for (; i < n.childCount; ) {
      let c = n.child(i++);
      if (((o += c.nodeSize), !c.isText)) break;
      a += c.text;
    }
    if (o >= t) {
      if (o >= r && a.slice(r - e.length - l, r - l) == e) return r - e.length;
      let c = l < r ? a.lastIndexOf(e, r - l - 1) : -1;
      if (c >= 0 && c + e.length + l >= t) return l + c;
      if (
        t == r &&
        a.length >= r + e.length - l &&
        a.slice(r - l, r - l + e.length) == e
      )
        return r;
    }
  }
  return -1;
}
function bi(n, e, t, r, i) {
  let o = [];
  for (let s = 0, l = 0; s < n.length; s++) {
    let a = n[s],
      c = l,
      d = (l += a.size);
    c >= t || d <= e
      ? o.push(a)
      : (c < e && o.push(a.slice(0, e - c, r)),
        i && (o.push(i), (i = void 0)),
        d > t && o.push(a.slice(t - c, a.size, r)));
  }
  return o;
}
function qi(n, e = null) {
  let t = n.domSelectionRange(),
    r = n.state.doc;
  if (!t.focusNode) return null;
  let i = n.docView.nearestDesc(t.focusNode),
    o = i && i.size == 0,
    s = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (s < 0) return null;
  let l = r.resolve(s),
    a,
    c;
  if (xr(t)) {
    for (a = l; i && !i.node; ) i = i.parent;
    let d = i.node;
    if (
      i &&
      d.isAtom &&
      E.isSelectable(d) &&
      i.parent &&
      !(d.isInline && vf(t.focusNode, t.focusOffset, i.dom))
    ) {
      let f = i.posBefore;
      c = new E(s == f ? l : r.resolve(f));
    }
  } else {
    let d = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (d < 0) return null;
    a = r.resolve(d);
  }
  if (!c) {
    let d = e == "pointer" || (n.state.selection.head < l.pos && !o) ? 1 : -1;
    c = Wi(n, a, l, d);
  }
  return c;
}
function Ma(n) {
  return n.editable
    ? n.hasFocus()
    : Na(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function We(n, e = !1) {
  let t = n.state.selection;
  if ((Oa(n, t), !!Ma(n))) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && de) {
      let r = n.domSelectionRange(),
        i = n.domObserver.currentSelection;
      if (
        r.anchorNode &&
        i.anchorNode &&
        Et(r.anchorNode, r.anchorOffset, i.anchorNode, i.anchorOffset)
      ) {
        (n.input.mouseDown.delayedSelectionSync = !0),
          n.domObserver.setCurSelection();
        return;
      }
    }
    if ((n.domObserver.disconnectSelection(), n.cursorWrapper)) Qf(n);
    else {
      let { anchor: r, head: i } = t,
        o,
        s;
      fs &&
        !(t instanceof I) &&
        (t.$from.parent.inlineContent || (o = hs(n, t.from)),
        !t.empty && !t.$from.parent.inlineContent && (s = hs(n, t.to))),
        n.docView.setSelection(r, i, n.root, e),
        fs && (o && ps(o), s && ps(s)),
        t.visible
          ? n.dom.classList.remove("ProseMirror-hideselection")
          : (n.dom.classList.add("ProseMirror-hideselection"),
            "onselectionchange" in document && Xf(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const fs = he || (de && pa < 63);
function hs(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0),
    i = r < t.childNodes.length ? t.childNodes[r] : null,
    o = r ? t.childNodes[r - 1] : null;
  if (he && i && i.contentEditable == "false") return $r(i);
  if (
    (!i || i.contentEditable == "false") &&
    (!o || o.contentEditable == "false")
  ) {
    if (i) return $r(i);
    if (o) return $r(o);
  }
}
function $r(n) {
  return (
    (n.contentEditable = "true"),
    he && n.draggable && ((n.draggable = !1), (n.wasDraggable = !0)),
    n
  );
}
function ps(n) {
  (n.contentEditable = "false"),
    n.wasDraggable && ((n.draggable = !0), (n.wasDraggable = null));
}
function Xf(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(),
    r = t.anchorNode,
    i = t.anchorOffset;
  e.addEventListener(
    "selectionchange",
    (n.input.hideSelectionGuard = () => {
      (t.anchorNode != r || t.anchorOffset != i) &&
        (e.removeEventListener("selectionchange", n.input.hideSelectionGuard),
        setTimeout(() => {
          (!Ma(n) || n.state.selection.visible) &&
            n.dom.classList.remove("ProseMirror-hideselection");
        }, 20));
    })
  );
}
function Qf(n) {
  let e = n.domSelection(),
    t = document.createRange(),
    r = n.cursorWrapper.dom,
    i = r.nodeName == "IMG";
  i ? t.setEnd(r.parentNode, ie(r) + 1) : t.setEnd(r, 0),
    t.collapse(!1),
    e.removeAllRanges(),
    e.addRange(t),
    !i &&
      !n.state.selection.visible &&
      xe &&
      ot <= 11 &&
      ((r.disabled = !0), (r.disabled = !1));
}
function Oa(n, e) {
  if (e instanceof E) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc &&
      (ms(n), t && t.selectNode(), (n.lastSelectedViewDesc = t));
  } else ms(n);
}
function ms(n) {
  n.lastSelectedViewDesc &&
    (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(),
    (n.lastSelectedViewDesc = void 0));
}
function Wi(n, e, t, r) {
  return (
    n.someProp("createSelectionBetween", (i) => i(n, e, t)) ||
    I.between(e, t, r)
  );
}
function gs(n) {
  return n.editable && !n.hasFocus() ? !1 : Na(n);
}
function Na(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode) return !1;
  try {
    return (
      n.dom.contains(
        e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode
      ) &&
      (n.editable ||
        n.dom.contains(
          e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode
        ))
    );
  } catch {
    return !1;
  }
}
function Zf(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0),
    t = n.domSelectionRange();
  return Et(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function xi(n, e) {
  let { $anchor: t, $head: r } = n.selection,
    i = e > 0 ? t.max(r) : t.min(r),
    o = i.parent.inlineContent
      ? i.depth
        ? n.doc.resolve(e > 0 ? i.after() : i.before())
        : null
      : i;
  return o && F.findFrom(o, e);
}
function Qe(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function bs(n, e, t) {
  let r = n.state.selection;
  if (r instanceof I)
    if (t.indexOf("s") > -1) {
      let { $head: i } = r,
        o = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter;
      if (!o || o.isText || !o.isLeaf) return !1;
      let s = n.state.doc.resolve(i.pos + o.nodeSize * (e < 0 ? -1 : 1));
      return Qe(n, new I(r.$anchor, s));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let i = xi(n.state, e);
        return i && i instanceof E ? Qe(n, i) : !1;
      } else if (!(we && t.indexOf("m") > -1)) {
        let i = r.$head,
          o = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter,
          s;
        if (!o || o.isText) return !1;
        let l = e < 0 ? i.pos - o.nodeSize : i.pos;
        return o.isAtom || ((s = n.docView.descAt(l)) && !s.contentDOM)
          ? E.isSelectable(o)
            ? Qe(n, new E(e < 0 ? n.state.doc.resolve(i.pos - o.nodeSize) : i))
            : Tn
            ? Qe(n, new I(n.state.doc.resolve(e < 0 ? l : l + o.nodeSize)))
            : !1
          : !1;
      }
    } else return !1;
  else {
    if (r instanceof E && r.node.isInline)
      return Qe(n, new I(e > 0 ? r.$to : r.$from));
    {
      let i = xi(n.state, e);
      return i ? Qe(n, i) : !1;
    }
  }
}
function tr(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function pn(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function Bt(n, e) {
  return e < 0 ? eh(n) : th(n);
}
function eh(n) {
  let e = n.domSelectionRange(),
    t = e.focusNode,
    r = e.focusOffset;
  if (!t) return;
  let i,
    o,
    s = !1;
  for (
    Te && t.nodeType == 1 && r < tr(t) && pn(t.childNodes[r], -1) && (s = !0);
    ;

  )
    if (r > 0) {
      if (t.nodeType != 1) break;
      {
        let l = t.childNodes[r - 1];
        if (pn(l, -1)) (i = t), (o = --r);
        else if (l.nodeType == 3) (t = l), (r = t.nodeValue.length);
        else break;
      }
    } else {
      if (Ea(t)) break;
      {
        let l = t.previousSibling;
        for (; l && pn(l, -1); )
          (i = t.parentNode), (o = ie(l)), (l = l.previousSibling);
        if (l) (t = l), (r = tr(t));
        else {
          if (((t = t.parentNode), t == n.dom)) break;
          r = 0;
        }
      }
    }
  s ? yi(n, t, r) : i && yi(n, i, o);
}
function th(n) {
  let e = n.domSelectionRange(),
    t = e.focusNode,
    r = e.focusOffset;
  if (!t) return;
  let i = tr(t),
    o,
    s;
  for (;;)
    if (r < i) {
      if (t.nodeType != 1) break;
      let l = t.childNodes[r];
      if (pn(l, 1)) (o = t), (s = ++r);
      else break;
    } else {
      if (Ea(t)) break;
      {
        let l = t.nextSibling;
        for (; l && pn(l, 1); )
          (o = l.parentNode), (s = ie(l) + 1), (l = l.nextSibling);
        if (l) (t = l), (r = 0), (i = tr(t));
        else {
          if (((t = t.parentNode), t == n.dom)) break;
          r = i = 0;
        }
      }
    }
  o && yi(n, o, s);
}
function Ea(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function nh(n, e) {
  for (; n && e == n.childNodes.length && !En(n); )
    (e = ie(n) + 1), (n = n.parentNode);
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3) return t;
    if (t.nodeType == 1 && t.contentEditable == "false") break;
    (n = t), (e = 0);
  }
}
function rh(n, e) {
  for (; n && !e && !En(n); ) (e = ie(n)), (n = n.parentNode);
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3) return t;
    if (t.nodeType == 1 && t.contentEditable == "false") break;
    (n = t), (e = n.childNodes.length);
  }
}
function yi(n, e, t) {
  if (e.nodeType != 3) {
    let o, s;
    (s = nh(e, t))
      ? ((e = s), (t = 0))
      : (o = rh(e, t)) && ((e = o), (t = o.nodeValue.length));
  }
  let r = n.domSelection();
  if (xr(r)) {
    let o = document.createRange();
    o.setEnd(e, t), o.setStart(e, t), r.removeAllRanges(), r.addRange(o);
  } else r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: i } = n;
  setTimeout(() => {
    n.state == i && We(n);
  }, 50);
}
function xs(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(de || Cf) && t.parent.inlineContent) {
    let i = n.coordsAtPos(e);
    if (e > t.start()) {
      let o = n.coordsAtPos(e - 1),
        s = (o.top + o.bottom) / 2;
      if (s > i.top && s < i.bottom && Math.abs(o.left - i.left) > 1)
        return o.left < i.left ? "ltr" : "rtl";
    }
    if (e < t.end()) {
      let o = n.coordsAtPos(e + 1),
        s = (o.top + o.bottom) / 2;
      if (s > i.top && s < i.bottom && Math.abs(o.left - i.left) > 1)
        return o.left > i.left ? "ltr" : "rtl";
    }
  }
  return getComputedStyle(n.dom).direction == "rtl" ? "rtl" : "ltr";
}
function ys(n, e, t) {
  let r = n.state.selection;
  if (
    (r instanceof I && !r.empty) ||
    t.indexOf("s") > -1 ||
    (we && t.indexOf("m") > -1)
  )
    return !1;
  let { $from: i, $to: o } = r;
  if (!i.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let s = xi(n.state, e);
    if (s && s instanceof E) return Qe(n, s);
  }
  if (!i.parent.inlineContent) {
    let s = e < 0 ? i : o,
      l = r instanceof _e ? F.near(s, e) : F.findFrom(s, e);
    return l ? Qe(n, l) : !1;
  }
  return !1;
}
function ks(n, e) {
  if (!(n.state.selection instanceof I)) return !0;
  let { $head: t, $anchor: r, empty: i } = n.state.selection;
  if (!t.sameParent(r)) return !0;
  if (!i) return !1;
  if (n.endOfTextblock(e > 0 ? "forward" : "backward")) return !0;
  let o = !t.textOffset && (e < 0 ? t.nodeBefore : t.nodeAfter);
  if (o && !o.isText) {
    let s = n.state.tr;
    return (
      e < 0
        ? s.delete(t.pos - o.nodeSize, t.pos)
        : s.delete(t.pos, t.pos + o.nodeSize),
      n.dispatch(s),
      !0
    );
  }
  return !1;
}
function _s(n, e, t) {
  n.domObserver.stop(), (e.contentEditable = t), n.domObserver.start();
}
function ih(n) {
  if (!he || n.state.selection.$head.parentOffset > 0) return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (
    e &&
    e.nodeType == 1 &&
    t == 0 &&
    e.firstChild &&
    e.firstChild.contentEditable == "false"
  ) {
    let r = e.firstChild;
    _s(n, r, "true"), setTimeout(() => _s(n, r, "false"), 20);
  }
  return !1;
}
function oh(n) {
  let e = "";
  return (
    n.ctrlKey && (e += "c"),
    n.metaKey && (e += "m"),
    n.altKey && (e += "a"),
    n.shiftKey && (e += "s"),
    e
  );
}
function sh(n, e) {
  let t = e.keyCode,
    r = oh(e);
  if (t == 8 || (we && t == 72 && r == "c")) return ks(n, -1) || Bt(n, -1);
  if ((t == 46 && !e.shiftKey) || (we && t == 68 && r == "c"))
    return ks(n, 1) || Bt(n, 1);
  if (t == 13 || t == 27) return !0;
  if (t == 37 || (we && t == 66 && r == "c")) {
    let i = t == 37 ? (xs(n, n.state.selection.from) == "ltr" ? -1 : 1) : -1;
    return bs(n, i, r) || Bt(n, i);
  } else if (t == 39 || (we && t == 70 && r == "c")) {
    let i = t == 39 ? (xs(n, n.state.selection.from) == "ltr" ? 1 : -1) : 1;
    return bs(n, i, r) || Bt(n, i);
  } else {
    if (t == 38 || (we && t == 80 && r == "c"))
      return ys(n, -1, r) || Bt(n, -1);
    if (t == 40 || (we && t == 78 && r == "c"))
      return ih(n) || ys(n, 1, r) || Bt(n, 1);
    if (r == (we ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function Ta(n, e) {
  n.someProp("transformCopied", (p) => {
    e = p(e, n);
  });
  let t = [],
    { content: r, openStart: i, openEnd: o } = e;
  for (
    ;
    i > 1 && o > 1 && r.childCount == 1 && r.firstChild.childCount == 1;

  ) {
    i--, o--;
    let p = r.firstChild;
    t.push(p.type.name, p.attrs != p.type.defaultAttrs ? p.attrs : null),
      (r = p.content);
  }
  let s = n.someProp("clipboardSerializer") || tn.fromSchema(n.state.schema),
    l = za(),
    a = l.createElement("div");
  a.appendChild(s.serializeFragment(r, { document: l }));
  let c = a.firstChild,
    d,
    f = 0;
  for (; c && c.nodeType == 1 && (d = Pa[c.nodeName.toLowerCase()]); ) {
    for (let p = d.length - 1; p >= 0; p--) {
      let m = l.createElement(d[p]);
      for (; a.firstChild; ) m.appendChild(a.firstChild);
      a.appendChild(m), f++;
    }
    c = a.firstChild;
  }
  c &&
    c.nodeType == 1 &&
    c.setAttribute(
      "data-pm-slice",
      `${i} ${o}${f ? ` -${f}` : ""} ${JSON.stringify(t)}`
    );
  let h =
    n.someProp("clipboardTextSerializer", (p) => p(e, n)) ||
    e.content.textBetween(
      0,
      e.content.size,
      `

`
    );
  return { dom: a, text: h, slice: e };
}
function Ia(n, e, t, r, i) {
  let o = i.parent.type.spec.code,
    s,
    l;
  if (!t && !e) return null;
  let a = e && (r || o || !t);
  if (a) {
    if (
      (n.someProp("transformPastedText", (h) => {
        e = h(e, o || r, n);
      }),
      o)
    )
      return e
        ? new S(
            _.from(
              n.state.schema.text(
                e.replace(
                  /\r\n?/g,
                  `
`
                )
              )
            ),
            0,
            0
          )
        : S.empty;
    let f = n.someProp("clipboardTextParser", (h) => h(e, i, r, n));
    if (f) l = f;
    else {
      let h = i.marks(),
        { schema: p } = n.state,
        m = tn.fromSchema(p);
      (s = document.createElement("div")),
        e.split(/(?:\r\n?|\n)+/).forEach((g) => {
          let x = s.appendChild(document.createElement("p"));
          g && x.appendChild(m.serializeNode(p.text(g, h)));
        });
    }
  } else
    n.someProp("transformPastedHTML", (f) => {
      t = f(t, n);
    }),
      (s = ch(t)),
      Tn && dh(s);
  let c = s && s.querySelector("[data-pm-slice]"),
    d =
      c &&
      /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(
        c.getAttribute("data-pm-slice") || ""
      );
  if (d && d[3])
    for (let f = +d[3]; f > 0; f--) {
      let h = s.firstChild;
      for (; h && h.nodeType != 1; ) h = h.nextSibling;
      if (!h) break;
      s = h;
    }
  if (
    (l ||
      (l = (
        n.someProp("clipboardParser") ||
        n.someProp("domParser") ||
        kn.fromSchema(n.state.schema)
      ).parseSlice(s, {
        preserveWhitespace: !!(a || d),
        context: i,
        ruleFromNode(h) {
          return h.nodeName == "BR" &&
            !h.nextSibling &&
            h.parentNode &&
            !lh.test(h.parentNode.nodeName)
            ? { ignore: !0 }
            : null;
        },
      })),
    d)
  )
    l = uh(vs(l, +d[1], +d[2]), d[4]);
  else if (((l = S.maxOpen(ah(l.content, i), !0)), l.openStart || l.openEnd)) {
    let f = 0,
      h = 0;
    for (
      let p = l.content.firstChild;
      f < l.openStart && !p.type.spec.isolating;
      f++, p = p.firstChild
    );
    for (
      let p = l.content.lastChild;
      h < l.openEnd && !p.type.spec.isolating;
      h++, p = p.lastChild
    );
    l = vs(l, f, h);
  }
  return (
    n.someProp("transformPasted", (f) => {
      l = f(l, n);
    }),
    l
  );
}
const lh =
  /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function ah(n, e) {
  if (n.childCount < 2) return n;
  for (let t = e.depth; t >= 0; t--) {
    let i = e.node(t).contentMatchAt(e.index(t)),
      o,
      s = [];
    if (
      (n.forEach((l) => {
        if (!s) return;
        let a = i.findWrapping(l.type),
          c;
        if (!a) return (s = null);
        if ((c = s.length && o.length && Aa(a, o, l, s[s.length - 1], 0)))
          s[s.length - 1] = c;
        else {
          s.length && (s[s.length - 1] = Ra(s[s.length - 1], o.length));
          let d = Da(l, a);
          s.push(d), (i = i.matchType(d.type)), (o = a);
        }
      }),
      s)
    )
      return _.from(s);
  }
  return n;
}
function Da(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--) n = e[r].create(null, _.from(n));
  return n;
}
function Aa(n, e, t, r, i) {
  if (i < n.length && i < e.length && n[i] == e[i]) {
    let o = Aa(n, e, t, r.lastChild, i + 1);
    if (o) return r.copy(r.content.replaceChild(r.childCount - 1, o));
    if (
      r
        .contentMatchAt(r.childCount)
        .matchType(i == n.length - 1 ? t.type : n[i + 1])
    )
      return r.copy(r.content.append(_.from(Da(t, n, i + 1))));
  }
}
function Ra(n, e) {
  if (e == 0) return n;
  let t = n.content.replaceChild(n.childCount - 1, Ra(n.lastChild, e - 1)),
    r = n.contentMatchAt(n.childCount).fillBefore(_.empty, !0);
  return n.copy(t.append(r));
}
function ki(n, e, t, r, i, o) {
  let s = e < 0 ? n.firstChild : n.lastChild,
    l = s.content;
  return (
    n.childCount > 1 && (o = 0),
    i < r - 1 && (l = ki(l, e, t, r, i + 1, o)),
    i >= t &&
      (l =
        e < 0
          ? s
              .contentMatchAt(0)
              .fillBefore(l, o <= i)
              .append(l)
          : l.append(s.contentMatchAt(s.childCount).fillBefore(_.empty, !0))),
    n.replaceChild(e < 0 ? 0 : n.childCount - 1, s.copy(l))
  );
}
function vs(n, e, t) {
  return (
    e < n.openStart &&
      (n = new S(
        ki(n.content, -1, e, n.openStart, 0, n.openEnd),
        e,
        n.openEnd
      )),
    t < n.openEnd &&
      (n = new S(ki(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)),
    n
  );
}
const Pa = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"],
};
let ws = null;
function za() {
  return ws || (ws = document.implementation.createHTMLDocument("title"));
}
function ch(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = za().createElement("div"),
    r = /<([a-z][^>\s]+)/i.exec(n),
    i;
  if (
    ((i = r && Pa[r[1].toLowerCase()]) &&
      (n =
        i.map((o) => "<" + o + ">").join("") +
        n +
        i
          .map((o) => "</" + o + ">")
          .reverse()
          .join("")),
    (t.innerHTML = n),
    i)
  )
    for (let o = 0; o < i.length; o++) t = t.querySelector(i[o]) || t;
  return t;
}
function dh(n) {
  let e = n.querySelectorAll(
    de ? "span:not([class]):not([style])" : "span.Apple-converted-space"
  );
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 &&
      r.textContent == " " &&
      r.parentNode &&
      r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function uh(n, e) {
  if (!n.size) return n;
  let t = n.content.firstChild.type.schema,
    r;
  try {
    r = JSON.parse(e);
  } catch {
    return n;
  }
  let { content: i, openStart: o, openEnd: s } = n;
  for (let l = r.length - 2; l >= 0; l -= 2) {
    let a = t.nodes[r[l]];
    if (!a || a.hasRequiredAttrs()) break;
    (i = _.from(a.create(r[l + 1], i))), o++, s++;
  }
  return new S(i, o, s);
}
const pe = {},
  me = {},
  fh = { touchstart: !0, touchmove: !0 };
class hh {
  constructor() {
    (this.shiftKey = !1),
      (this.mouseDown = null),
      (this.lastKeyCode = null),
      (this.lastKeyCodeTime = 0),
      (this.lastClick = { time: 0, x: 0, y: 0, type: "" }),
      (this.lastSelectionOrigin = null),
      (this.lastSelectionTime = 0),
      (this.lastIOSEnter = 0),
      (this.lastIOSEnterFallbackTimeout = -1),
      (this.lastFocus = 0),
      (this.lastTouch = 0),
      (this.lastAndroidDelete = 0),
      (this.composing = !1),
      (this.compositionNode = null),
      (this.composingTimeout = -1),
      (this.compositionNodes = []),
      (this.compositionEndedAt = -2e8),
      (this.compositionID = 1),
      (this.compositionPendingChanges = 0),
      (this.domChangeCount = 0),
      (this.eventHandlers = Object.create(null)),
      (this.hideSelectionGuard = null);
  }
}
function ph(n) {
  for (let e in pe) {
    let t = pe[e];
    n.dom.addEventListener(
      e,
      (n.input.eventHandlers[e] = (r) => {
        gh(n, r) && !Ji(n, r) && (n.editable || !(r.type in me)) && t(n, r);
      }),
      fh[e] ? { passive: !0 } : void 0
    );
  }
  he && n.dom.addEventListener("input", () => null), _i(n);
}
function it(n, e) {
  (n.input.lastSelectionOrigin = e), (n.input.lastSelectionTime = Date.now());
}
function mh(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout),
    clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function _i(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] ||
        n.dom.addEventListener(t, (n.input.eventHandlers[t] = (r) => Ji(n, r)));
  });
}
function Ji(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function gh(n, e) {
  if (!e.bubbles) return !0;
  if (e.defaultPrevented) return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || (t.pmViewDesc && t.pmViewDesc.stopEvent(e)))
      return !1;
  return !0;
}
function bh(n, e) {
  !Ji(n, e) &&
    pe[e.type] &&
    (n.editable || !(e.type in me)) &&
    pe[e.type](n, e);
}
me.keydown = (n, e) => {
  let t = e;
  if (
    ((n.input.shiftKey = t.keyCode == 16 || t.shiftKey),
    !La(n, t) &&
      ((n.input.lastKeyCode = t.keyCode),
      (n.input.lastKeyCodeTime = Date.now()),
      !(Me && de && t.keyCode == 13)))
  )
    if (
      (t.keyCode != 229 && n.domObserver.forceFlush(),
      Yt && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey)
    ) {
      let r = Date.now();
      (n.input.lastIOSEnter = r),
        (n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
          n.input.lastIOSEnter == r &&
            (n.someProp("handleKeyDown", (i) => i(n, gt(13, "Enter"))),
            (n.input.lastIOSEnter = 0));
        }, 200));
    } else
      n.someProp("handleKeyDown", (r) => r(n, t)) || sh(n, t)
        ? t.preventDefault()
        : it(n, "key");
};
me.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
me.keypress = (n, e) => {
  let t = e;
  if (La(n, t) || !t.charCode || (t.ctrlKey && !t.altKey) || (we && t.metaKey))
    return;
  if (n.someProp("handleKeyPress", (i) => i(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof I) || !r.$from.sameParent(r.$to)) {
    let i = String.fromCharCode(t.charCode);
    !/[\r\n]/.test(i) &&
      !n.someProp("handleTextInput", (o) => o(n, r.$from.pos, r.$to.pos, i)) &&
      n.dispatch(n.state.tr.insertText(i).scrollIntoView()),
      t.preventDefault();
  }
};
function kr(n) {
  return { left: n.clientX, top: n.clientY };
}
function xh(n, e) {
  let t = e.x - n.clientX,
    r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function Ki(n, e, t, r, i) {
  if (r == -1) return !1;
  let o = n.state.doc.resolve(r);
  for (let s = o.depth + 1; s > 0; s--)
    if (
      n.someProp(e, (l) =>
        s > o.depth
          ? l(n, t, o.nodeAfter, o.before(s), i, !0)
          : l(n, t, o.node(s), o.before(s), i, !1)
      )
    )
      return !0;
  return !1;
}
function qt(n, e, t) {
  n.focused || n.focus();
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function yh(n, e) {
  if (e == -1) return !1;
  let t = n.state.doc.resolve(e),
    r = t.nodeAfter;
  return r && r.isAtom && E.isSelectable(r) ? (qt(n, new E(t)), !0) : !1;
}
function kh(n, e) {
  if (e == -1) return !1;
  let t = n.state.selection,
    r,
    i;
  t instanceof E && (r = t.node);
  let o = n.state.doc.resolve(e);
  for (let s = o.depth + 1; s > 0; s--) {
    let l = s > o.depth ? o.nodeAfter : o.node(s);
    if (E.isSelectable(l)) {
      r &&
      t.$from.depth > 0 &&
      s >= t.$from.depth &&
      o.before(t.$from.depth + 1) == t.$from.pos
        ? (i = o.before(t.$from.depth))
        : (i = o.before(s));
      break;
    }
  }
  return i != null ? (qt(n, E.create(n.state.doc, i)), !0) : !1;
}
function _h(n, e, t, r, i) {
  return (
    Ki(n, "handleClickOn", e, t, r) ||
    n.someProp("handleClick", (o) => o(n, e, r)) ||
    (i ? kh(n, t) : yh(n, t))
  );
}
function vh(n, e, t, r) {
  return (
    Ki(n, "handleDoubleClickOn", e, t, r) ||
    n.someProp("handleDoubleClick", (i) => i(n, e, r))
  );
}
function wh(n, e, t, r) {
  return (
    Ki(n, "handleTripleClickOn", e, t, r) ||
    n.someProp("handleTripleClick", (i) => i(n, e, r)) ||
    Sh(n, t, r)
  );
}
function Sh(n, e, t) {
  if (t.button != 0) return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (qt(n, I.create(r, 0, r.content.size)), !0) : !1;
  let i = r.resolve(e);
  for (let o = i.depth + 1; o > 0; o--) {
    let s = o > i.depth ? i.nodeAfter : i.node(o),
      l = i.before(o);
    if (s.inlineContent) qt(n, I.create(r, l + 1, l + 1 + s.content.size));
    else if (E.isSelectable(s)) qt(n, E.create(r, l));
    else continue;
    return !0;
  }
}
function Gi(n) {
  return nr(n);
}
const Ba = we ? "metaKey" : "ctrlKey";
pe.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = Gi(n),
    i = Date.now(),
    o = "singleClick";
  i - n.input.lastClick.time < 500 &&
    xh(t, n.input.lastClick) &&
    !t[Ba] &&
    (n.input.lastClick.type == "singleClick"
      ? (o = "doubleClick")
      : n.input.lastClick.type == "doubleClick" && (o = "tripleClick")),
    (n.input.lastClick = { time: i, x: t.clientX, y: t.clientY, type: o });
  let s = n.posAtCoords(kr(t));
  s &&
    (o == "singleClick"
      ? (n.input.mouseDown && n.input.mouseDown.done(),
        (n.input.mouseDown = new Ch(n, s, t, !!r)))
      : (o == "doubleClick" ? vh : wh)(n, s.pos, s.inside, t)
      ? t.preventDefault()
      : it(n, "pointer"));
};
class Ch {
  constructor(e, t, r, i) {
    (this.view = e),
      (this.pos = t),
      (this.event = r),
      (this.flushed = i),
      (this.delayedSelectionSync = !1),
      (this.mightDrag = null),
      (this.startDoc = e.state.doc),
      (this.selectNode = !!r[Ba]),
      (this.allowDefault = r.shiftKey);
    let o, s;
    if (t.inside > -1) (o = e.state.doc.nodeAt(t.inside)), (s = t.inside);
    else {
      let d = e.state.doc.resolve(t.pos);
      (o = d.parent), (s = d.depth ? d.before() : 0);
    }
    const l = i ? null : r.target,
      a = l ? e.docView.nearestDesc(l, !0) : null;
    this.target = a && a.dom.nodeType == 1 ? a.dom : null;
    let { selection: c } = e.state;
    ((r.button == 0 &&
      o.type.spec.draggable &&
      o.type.spec.selectable !== !1) ||
      (c instanceof E && c.from <= s && c.to > s)) &&
      (this.mightDrag = {
        node: o,
        pos: s,
        addAttr: !!(this.target && !this.target.draggable),
        setUneditable: !!(
          this.target &&
          Te &&
          !this.target.hasAttribute("contentEditable")
        ),
      }),
      this.target &&
        this.mightDrag &&
        (this.mightDrag.addAttr || this.mightDrag.setUneditable) &&
        (this.view.domObserver.stop(),
        this.mightDrag.addAttr && (this.target.draggable = !0),
        this.mightDrag.setUneditable &&
          setTimeout(() => {
            this.view.input.mouseDown == this &&
              this.target.setAttribute("contentEditable", "false");
          }, 20),
        this.view.domObserver.start()),
      e.root.addEventListener("mouseup", (this.up = this.up.bind(this))),
      e.root.addEventListener("mousemove", (this.move = this.move.bind(this))),
      it(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up),
      this.view.root.removeEventListener("mousemove", this.move),
      this.mightDrag &&
        this.target &&
        (this.view.domObserver.stop(),
        this.mightDrag.addAttr && this.target.removeAttribute("draggable"),
        this.mightDrag.setUneditable &&
          this.target.removeAttribute("contentEditable"),
        this.view.domObserver.start()),
      this.delayedSelectionSync && setTimeout(() => We(this.view)),
      (this.view.input.mouseDown = null);
  }
  up(e) {
    if ((this.done(), !this.view.dom.contains(e.target))) return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(kr(e))),
      this.updateAllowDefault(e),
      this.allowDefault || !t
        ? it(this.view, "pointer")
        : _h(this.view, t.pos, t.inside, e, this.selectNode)
        ? e.preventDefault()
        : e.button == 0 &&
          (this.flushed ||
            (he && this.mightDrag && !this.mightDrag.node.isAtom) ||
            (de &&
              !this.view.state.selection.visible &&
              Math.min(
                Math.abs(t.pos - this.view.state.selection.from),
                Math.abs(t.pos - this.view.state.selection.to)
              ) <= 2))
        ? (qt(this.view, F.near(this.view.state.doc.resolve(t.pos))),
          e.preventDefault())
        : it(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e),
      it(this.view, "pointer"),
      e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault &&
      (Math.abs(this.event.x - e.clientX) > 4 ||
        Math.abs(this.event.y - e.clientY) > 4) &&
      (this.allowDefault = !0);
  }
}
pe.touchstart = (n) => {
  (n.input.lastTouch = Date.now()), Gi(n), it(n, "pointer");
};
pe.touchmove = (n) => {
  (n.input.lastTouch = Date.now()), it(n, "pointer");
};
pe.contextmenu = (n) => Gi(n);
function La(n, e) {
  return n.composing
    ? !0
    : he && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500
    ? ((n.input.compositionEndedAt = -2e8), !0)
    : !1;
}
const Mh = Me ? 5e3 : -1;
me.compositionstart = me.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n,
      t = e.selection.$from;
    if (
      e.selection.empty &&
      (e.storedMarks ||
        (!t.textOffset &&
          t.parentOffset &&
          t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1)))
    )
      (n.markCursor = n.state.storedMarks || t.marks()),
        nr(n, !0),
        (n.markCursor = null);
    else if (
      (nr(n),
      Te &&
        e.selection.empty &&
        t.parentOffset &&
        !t.textOffset &&
        t.nodeBefore.marks.length)
    ) {
      let r = n.domSelectionRange();
      for (
        let i = r.focusNode, o = r.focusOffset;
        i && i.nodeType == 1 && o != 0;

      ) {
        let s = o < 0 ? i.lastChild : i.childNodes[o - 1];
        if (!s) break;
        if (s.nodeType == 3) {
          n.domSelection().collapse(s, s.nodeValue.length);
          break;
        } else (i = s), (o = -1);
      }
    }
    n.input.composing = !0;
  }
  Fa(n, Mh);
};
me.compositionend = (n, e) => {
  n.composing &&
    ((n.input.composing = !1),
    (n.input.compositionEndedAt = e.timeStamp),
    (n.input.compositionPendingChanges = n.domObserver.pendingRecords().length
      ? n.input.compositionID
      : 0),
    (n.input.compositionNode = null),
    n.input.compositionPendingChanges &&
      Promise.resolve().then(() => n.domObserver.flush()),
    n.input.compositionID++,
    Fa(n, 20));
};
function Fa(n, e) {
  clearTimeout(n.input.composingTimeout),
    e > -1 && (n.input.composingTimeout = setTimeout(() => nr(n), e));
}
function $a(n) {
  for (
    n.composing &&
    ((n.input.composing = !1), (n.input.compositionEndedAt = Nh()));
    n.input.compositionNodes.length > 0;

  )
    n.input.compositionNodes.pop().markParentsDirty();
}
function Oh(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode) return null;
  let t = kf(e.focusNode, e.focusOffset),
    r = _f(e.focusNode, e.focusOffset);
  if (t && r && t != r) {
    let i = r.pmViewDesc,
      o = n.domObserver.lastChangedTextNode;
    if (t == o || r == o) return o;
    if (!i || !i.isText(r.nodeValue)) return r;
    if (n.input.compositionNode == r) {
      let s = t.pmViewDesc;
      if (!(!s || !s.isText(t.nodeValue))) return r;
    }
  }
  return t || r;
}
function Nh() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function nr(n, e = !1) {
  if (!(Me && n.domObserver.flushingSoon >= 0)) {
    if (
      (n.domObserver.forceFlush(), $a(n), e || (n.docView && n.docView.dirty))
    ) {
      let t = qi(n);
      return (
        t && !t.eq(n.state.selection)
          ? n.dispatch(n.state.tr.setSelection(t))
          : n.updateState(n.state),
        !0
      );
    }
    return !1;
  }
}
function Eh(n, e) {
  if (!n.dom.parentNode) return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e),
    (t.style.cssText = "position: fixed; left: -10000px; top: 10px");
  let r = getSelection(),
    i = document.createRange();
  i.selectNodeContents(e),
    n.dom.blur(),
    r.removeAllRanges(),
    r.addRange(i),
    setTimeout(() => {
      t.parentNode && t.parentNode.removeChild(t), n.focus();
    }, 50);
}
const wn = (xe && ot < 15) || (Yt && Mf < 604);
pe.copy = me.cut = (n, e) => {
  let t = e,
    r = n.state.selection,
    i = t.type == "cut";
  if (r.empty) return;
  let o = wn ? null : t.clipboardData,
    s = r.content(),
    { dom: l, text: a } = Ta(n, s);
  o
    ? (t.preventDefault(),
      o.clearData(),
      o.setData("text/html", l.innerHTML),
      o.setData("text/plain", a))
    : Eh(n, l),
    i &&
      n.dispatch(
        n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut")
      );
};
function Th(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1
    ? n.content.firstChild
    : null;
}
function Ih(n, e) {
  if (!n.dom.parentNode) return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code,
    r = n.dom.parentNode.appendChild(
      document.createElement(t ? "textarea" : "div")
    );
  t || (r.contentEditable = "true"),
    (r.style.cssText = "position: fixed; left: -10000px; top: 10px"),
    r.focus();
  let i = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(),
      r.parentNode && r.parentNode.removeChild(r),
      t ? Sn(n, r.value, null, i, e) : Sn(n, r.textContent, r.innerHTML, i, e);
  }, 50);
}
function Sn(n, e, t, r, i) {
  let o = Ia(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (a) => a(n, i, o || S.empty))) return !0;
  if (!o) return !1;
  let s = Th(o),
    l = s
      ? n.state.tr.replaceSelectionWith(s, r)
      : n.state.tr.replaceSelection(o);
  return (
    n.dispatch(
      l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")
    ),
    !0
  );
}
function Va(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e) return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
me.paste = (n, e) => {
  let t = e;
  if (n.composing && !Me) return;
  let r = wn ? null : t.clipboardData,
    i = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && Sn(n, Va(r), r.getData("text/html"), i, t)
    ? t.preventDefault()
    : Ih(n, t);
};
class Ua {
  constructor(e, t, r) {
    (this.slice = e), (this.move = t), (this.node = r);
  }
}
const ja = we ? "altKey" : "ctrlKey";
pe.dragstart = (n, e) => {
  let t = e,
    r = n.input.mouseDown;
  if ((r && r.done(), !t.dataTransfer)) return;
  let i = n.state.selection,
    o = i.empty ? null : n.posAtCoords(kr(t)),
    s;
  if (!(o && o.pos >= i.from && o.pos <= (i instanceof E ? i.to - 1 : i.to))) {
    if (r && r.mightDrag) s = E.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let f = n.docView.nearestDesc(t.target, !0);
      f &&
        f.node.type.spec.draggable &&
        f != n.docView &&
        (s = E.create(n.state.doc, f.posBefore));
    }
  }
  let l = (s || n.state.selection).content(),
    { dom: a, text: c, slice: d } = Ta(n, l);
  (!t.dataTransfer.files.length || !de || pa > 120) &&
    t.dataTransfer.clearData(),
    t.dataTransfer.setData(wn ? "Text" : "text/html", a.innerHTML),
    (t.dataTransfer.effectAllowed = "copyMove"),
    wn || t.dataTransfer.setData("text/plain", c),
    (n.dragging = new Ua(d, !t[ja], s));
};
pe.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
me.dragover = me.dragenter = (n, e) => e.preventDefault();
me.drop = (n, e) => {
  let t = e,
    r = n.dragging;
  if (((n.dragging = null), !t.dataTransfer)) return;
  let i = n.posAtCoords(kr(t));
  if (!i) return;
  let o = n.state.doc.resolve(i.pos),
    s = r && r.slice;
  s
    ? n.someProp("transformPasted", (m) => {
        s = m(s, n);
      })
    : (s = Ia(
        n,
        Va(t.dataTransfer),
        wn ? null : t.dataTransfer.getData("text/html"),
        !1,
        o
      ));
  let l = !!(r && !t[ja]);
  if (n.someProp("handleDrop", (m) => m(n, t, s || S.empty, l))) {
    t.preventDefault();
    return;
  }
  if (!s) return;
  t.preventDefault();
  let a = s ? sf(n.state.doc, o.pos, s) : o.pos;
  a == null && (a = o.pos);
  let c = n.state.tr;
  if (l) {
    let { node: m } = r;
    m ? m.replace(c) : c.deleteSelection();
  }
  let d = c.mapping.map(a),
    f = s.openStart == 0 && s.openEnd == 0 && s.content.childCount == 1,
    h = c.doc;
  if (
    (f
      ? c.replaceRangeWith(d, d, s.content.firstChild)
      : c.replaceRange(d, d, s),
    c.doc.eq(h))
  )
    return;
  let p = c.doc.resolve(d);
  if (
    f &&
    E.isSelectable(s.content.firstChild) &&
    p.nodeAfter &&
    p.nodeAfter.sameMarkup(s.content.firstChild)
  )
    c.setSelection(new E(p));
  else {
    let m = c.mapping.map(a);
    c.mapping.maps[c.mapping.maps.length - 1].forEach((g, x, y, v) => (m = v)),
      c.setSelection(Wi(n, p, c.doc.resolve(m)));
  }
  n.focus(), n.dispatch(c.setMeta("uiEvent", "drop"));
};
pe.focus = (n) => {
  (n.input.lastFocus = Date.now()),
    n.focused ||
      (n.domObserver.stop(),
      n.dom.classList.add("ProseMirror-focused"),
      n.domObserver.start(),
      (n.focused = !0),
      setTimeout(() => {
        n.docView &&
          n.hasFocus() &&
          !n.domObserver.currentSelection.eq(n.domSelectionRange()) &&
          We(n);
      }, 20));
};
pe.blur = (n, e) => {
  let t = e;
  n.focused &&
    (n.domObserver.stop(),
    n.dom.classList.remove("ProseMirror-focused"),
    n.domObserver.start(),
    t.relatedTarget &&
      n.dom.contains(t.relatedTarget) &&
      n.domObserver.currentSelection.clear(),
    (n.focused = !1));
};
pe.beforeinput = (n, e) => {
  if (de && Me && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (
        n.input.domChangeCount != r ||
        (n.dom.blur(),
        n.focus(),
        n.someProp("handleKeyDown", (o) => o(n, gt(8, "Backspace"))))
      )
        return;
      let { $cursor: i } = n.state.selection;
      i &&
        i.pos > 0 &&
        n.dispatch(n.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in me) pe[n] = me[n];
function Cn(n, e) {
  if (n == e) return !0;
  for (let t in n) if (n[t] !== e[t]) return !1;
  for (let t in e) if (!(t in n)) return !1;
  return !0;
}
class rr {
  constructor(e, t) {
    (this.toDOM = e), (this.spec = t || wt), (this.side = this.spec.side || 0);
  }
  map(e, t, r, i) {
    let { pos: o, deleted: s } = e.mapResult(
      t.from + i,
      this.side < 0 ? -1 : 1
    );
    return s ? null : new ke(o - r, o - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return (
      this == e ||
      (e instanceof rr &&
        ((this.spec.key && this.spec.key == e.spec.key) ||
          (this.toDOM == e.toDOM && Cn(this.spec, e.spec))))
    );
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class lt {
  constructor(e, t) {
    (this.attrs = e), (this.spec = t || wt);
  }
  map(e, t, r, i) {
    let o = e.map(t.from + i, this.spec.inclusiveStart ? -1 : 1) - r,
      s = e.map(t.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return o >= s ? null : new ke(o, s, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return (
      this == e ||
      (e instanceof lt && Cn(this.attrs, e.attrs) && Cn(this.spec, e.spec))
    );
  }
  static is(e) {
    return e.type instanceof lt;
  }
  destroy() {}
}
class Yi {
  constructor(e, t) {
    (this.attrs = e), (this.spec = t || wt);
  }
  map(e, t, r, i) {
    let o = e.mapResult(t.from + i, 1);
    if (o.deleted) return null;
    let s = e.mapResult(t.to + i, -1);
    return s.deleted || s.pos <= o.pos
      ? null
      : new ke(o.pos - r, s.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: i } = e.content.findIndex(t.from),
      o;
    return i == t.from && !(o = e.child(r)).isText && i + o.nodeSize == t.to;
  }
  eq(e) {
    return (
      this == e ||
      (e instanceof Yi && Cn(this.attrs, e.attrs) && Cn(this.spec, e.spec))
    );
  }
  destroy() {}
}
class ke {
  constructor(e, t, r) {
    (this.from = e), (this.to = t), (this.type = r);
  }
  copy(e, t) {
    return new ke(e, t, this.type);
  }
  eq(e, t = 0) {
    return (
      this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to
    );
  }
  map(e, t, r) {
    return this.type.map(e, this, t, r);
  }
  static widget(e, t, r) {
    return new ke(e, e, new rr(t, r));
  }
  static inline(e, t, r, i) {
    return new ke(e, t, new lt(r, i));
  }
  static node(e, t, r, i) {
    return new ke(e, t, new Yi(r, i));
  }
  get spec() {
    return this.type.spec;
  }
  get inline() {
    return this.type instanceof lt;
  }
  get widget() {
    return this.type instanceof rr;
  }
}
const Ft = [],
  wt = {};
class H {
  constructor(e, t) {
    (this.local = e.length ? e : Ft), (this.children = t.length ? t : Ft);
  }
  static create(e, t) {
    return t.length ? ir(t, e, 0, wt) : ae;
  }
  find(e, t, r) {
    let i = [];
    return this.findInner(e ?? 0, t ?? 1e9, i, 0, r), i;
  }
  findInner(e, t, r, i, o) {
    for (let s = 0; s < this.local.length; s++) {
      let l = this.local[s];
      l.from <= t &&
        l.to >= e &&
        (!o || o(l.spec)) &&
        r.push(l.copy(l.from + i, l.to + i));
    }
    for (let s = 0; s < this.children.length; s += 3)
      if (this.children[s] < t && this.children[s + 1] > e) {
        let l = this.children[s] + 1;
        this.children[s + 2].findInner(e - l, t - l, r, i + l, o);
      }
  }
  map(e, t, r) {
    return this == ae || e.maps.length == 0
      ? this
      : this.mapInner(e, t, 0, 0, r || wt);
  }
  mapInner(e, t, r, i, o) {
    let s;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l].map(e, r, i);
      a && a.type.valid(t, a)
        ? (s || (s = [])).push(a)
        : o.onRemove && o.onRemove(this.local[l].spec);
    }
    return this.children.length
      ? Dh(this.children, s || [], e, t, r, i, o)
      : s
      ? new H(s.sort(St), Ft)
      : ae;
  }
  add(e, t) {
    return t.length
      ? this == ae
        ? H.create(e, t)
        : this.addInner(e, t, 0)
      : this;
  }
  addInner(e, t, r) {
    let i,
      o = 0;
    e.forEach((l, a) => {
      let c = a + r,
        d;
      if ((d = qa(t, l, c))) {
        for (i || (i = this.children.slice()); o < i.length && i[o] < a; )
          o += 3;
        i[o] == a
          ? (i[o + 2] = i[o + 2].addInner(l, d, c + 1))
          : i.splice(o, 0, a, a + l.nodeSize, ir(d, l, c + 1, wt)),
          (o += 3);
      }
    });
    let s = Ha(o ? Wa(t) : t, -r);
    for (let l = 0; l < s.length; l++)
      s[l].type.valid(e, s[l]) || s.splice(l--, 1);
    return new H(
      s.length ? this.local.concat(s).sort(St) : this.local,
      i || this.children
    );
  }
  remove(e) {
    return e.length == 0 || this == ae ? this : this.removeInner(e, 0);
  }
  removeInner(e, t) {
    let r = this.children,
      i = this.local;
    for (let o = 0; o < r.length; o += 3) {
      let s,
        l = r[o] + t,
        a = r[o + 1] + t;
      for (let d = 0, f; d < e.length; d++)
        (f = e[d]) &&
          f.from > l &&
          f.to < a &&
          ((e[d] = null), (s || (s = [])).push(f));
      if (!s) continue;
      r == this.children && (r = this.children.slice());
      let c = r[o + 2].removeInner(s, l + 1);
      c != ae ? (r[o + 2] = c) : (r.splice(o, 3), (o -= 3));
    }
    if (i.length) {
      for (let o = 0, s; o < e.length; o++)
        if ((s = e[o]))
          for (let l = 0; l < i.length; l++)
            i[l].eq(s, t) &&
              (i == this.local && (i = this.local.slice()), i.splice(l--, 1));
    }
    return r == this.children && i == this.local
      ? this
      : i.length || r.length
      ? new H(i, r)
      : ae;
  }
  forChild(e, t) {
    if (this == ae) return this;
    if (t.isLeaf) return H.empty;
    let r, i;
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (r = this.children[l + 2]);
        break;
      }
    let o = e + 1,
      s = o + t.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l];
      if (a.from < s && a.to > o && a.type instanceof lt) {
        let c = Math.max(o, a.from) - o,
          d = Math.min(s, a.to) - o;
        c < d && (i || (i = [])).push(a.copy(c, d));
      }
    }
    if (i) {
      let l = new H(i.sort(St), Ft);
      return r ? new et([l, r]) : l;
    }
    return r || ae;
  }
  eq(e) {
    if (this == e) return !0;
    if (
      !(e instanceof H) ||
      this.local.length != e.local.length ||
      this.children.length != e.children.length
    )
      return !1;
    for (let t = 0; t < this.local.length; t++)
      if (!this.local[t].eq(e.local[t])) return !1;
    for (let t = 0; t < this.children.length; t += 3)
      if (
        this.children[t] != e.children[t] ||
        this.children[t + 1] != e.children[t + 1] ||
        !this.children[t + 2].eq(e.children[t + 2])
      )
        return !1;
    return !0;
  }
  locals(e) {
    return Xi(this.localsInner(e));
  }
  localsInner(e) {
    if (this == ae) return Ft;
    if (e.inlineContent || !this.local.some(lt.is)) return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof lt || t.push(this.local[r]);
    return t;
  }
}
H.empty = new H([], []);
H.removeOverlap = Xi;
const ae = H.empty;
class et {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((i) => i.map(e, t, wt));
    return et.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf) return H.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let o = this.members[i].forChild(e, t);
      o != ae && (o instanceof et ? (r = r.concat(o.members)) : r.push(o));
    }
    return et.from(r);
  }
  eq(e) {
    if (!(e instanceof et) || e.members.length != this.members.length)
      return !1;
    for (let t = 0; t < this.members.length; t++)
      if (!this.members[t].eq(e.members[t])) return !1;
    return !0;
  }
  locals(e) {
    let t,
      r = !0;
    for (let i = 0; i < this.members.length; i++) {
      let o = this.members[i].localsInner(e);
      if (o.length)
        if (!t) t = o;
        else {
          r && ((t = t.slice()), (r = !1));
          for (let s = 0; s < o.length; s++) t.push(o[s]);
        }
    }
    return t ? Xi(r ? t : t.sort(St)) : Ft;
  }
  static from(e) {
    switch (e.length) {
      case 0:
        return ae;
      case 1:
        return e[0];
      default:
        return new et(
          e.every((t) => t instanceof H)
            ? e
            : e.reduce((t, r) => t.concat(r instanceof H ? r : r.members), [])
        );
    }
  }
}
function Dh(n, e, t, r, i, o, s) {
  let l = n.slice();
  for (let c = 0, d = o; c < t.maps.length; c++) {
    let f = 0;
    t.maps[c].forEach((h, p, m, g) => {
      let x = g - m - (p - h);
      for (let y = 0; y < l.length; y += 3) {
        let v = l[y + 1];
        if (v < 0 || h > v + d - f) continue;
        let N = l[y] + d - f;
        p >= N
          ? (l[y + 1] = h <= N ? -2 : -1)
          : h >= d && x && ((l[y] += x), (l[y + 1] += x));
      }
      f += x;
    }),
      (d = t.maps[c].map(d, -1));
  }
  let a = !1;
  for (let c = 0; c < l.length; c += 3)
    if (l[c + 1] < 0) {
      if (l[c + 1] == -2) {
        (a = !0), (l[c + 1] = -1);
        continue;
      }
      let d = t.map(n[c] + o),
        f = d - i;
      if (f < 0 || f >= r.content.size) {
        a = !0;
        continue;
      }
      let h = t.map(n[c + 1] + o, -1),
        p = h - i,
        { index: m, offset: g } = r.content.findIndex(f),
        x = r.maybeChild(m);
      if (x && g == f && g + x.nodeSize == p) {
        let y = l[c + 2].mapInner(t, x, d + 1, n[c] + o + 1, s);
        y != ae
          ? ((l[c] = f), (l[c + 1] = p), (l[c + 2] = y))
          : ((l[c + 1] = -2), (a = !0));
      } else a = !0;
    }
  if (a) {
    let c = Ah(l, n, e, t, i, o, s),
      d = ir(c, r, 0, s);
    e = d.local;
    for (let f = 0; f < l.length; f += 3)
      l[f + 1] < 0 && (l.splice(f, 3), (f -= 3));
    for (let f = 0, h = 0; f < d.children.length; f += 3) {
      let p = d.children[f];
      for (; h < l.length && l[h] < p; ) h += 3;
      l.splice(h, 0, d.children[f], d.children[f + 1], d.children[f + 2]);
    }
  }
  return new H(e.sort(St), l);
}
function Ha(n, e) {
  if (!e || !n.length) return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let i = n[r];
    t.push(new ke(i.from + e, i.to + e, i.type));
  }
  return t;
}
function Ah(n, e, t, r, i, o, s) {
  function l(a, c) {
    for (let d = 0; d < a.local.length; d++) {
      let f = a.local[d].map(r, i, c);
      f ? t.push(f) : s.onRemove && s.onRemove(a.local[d].spec);
    }
    for (let d = 0; d < a.children.length; d += 3)
      l(a.children[d + 2], a.children[d] + c + 1);
  }
  for (let a = 0; a < n.length; a += 3)
    n[a + 1] == -1 && l(n[a + 2], e[a] + o + 1);
  return t;
}
function qa(n, e, t) {
  if (e.isLeaf) return null;
  let r = t + e.nodeSize,
    i = null;
  for (let o = 0, s; o < n.length; o++)
    (s = n[o]) &&
      s.from > t &&
      s.to < r &&
      ((i || (i = [])).push(s), (n[o] = null));
  return i;
}
function Wa(n) {
  let e = [];
  for (let t = 0; t < n.length; t++) n[t] != null && e.push(n[t]);
  return e;
}
function ir(n, e, t, r) {
  let i = [],
    o = !1;
  e.forEach((l, a) => {
    let c = qa(n, l, a + t);
    if (c) {
      o = !0;
      let d = ir(c, l, t + a + 1, r);
      d != ae && i.push(a, a + l.nodeSize, d);
    }
  });
  let s = Ha(o ? Wa(n) : n, -t).sort(St);
  for (let l = 0; l < s.length; l++)
    s[l].type.valid(e, s[l]) ||
      (r.onRemove && r.onRemove(s[l].spec), s.splice(l--, 1));
  return s.length || i.length ? new H(s, i) : ae;
}
function St(n, e) {
  return n.from - e.from || n.to - e.to;
}
function Xi(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let i = t + 1; i < e.length; i++) {
        let o = e[i];
        if (o.from == r.from) {
          o.to != r.to &&
            (e == n && (e = n.slice()),
            (e[i] = o.copy(o.from, r.to)),
            Ss(e, i + 1, o.copy(r.to, o.to)));
          continue;
        } else {
          o.from < r.to &&
            (e == n && (e = n.slice()),
            (e[t] = r.copy(r.from, o.from)),
            Ss(e, i, r.copy(o.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function Ss(n, e, t) {
  for (; e < n.length && St(t, n[e]) > 0; ) e++;
  n.splice(e, 0, t);
}
function Vr(n) {
  let e = [];
  return (
    n.someProp("decorations", (t) => {
      let r = t(n.state);
      r && r != ae && e.push(r);
    }),
    n.cursorWrapper && e.push(H.create(n.state.doc, [n.cursorWrapper.deco])),
    et.from(e)
  );
}
const Rh = {
    childList: !0,
    characterData: !0,
    characterDataOldValue: !0,
    attributes: !0,
    attributeOldValue: !0,
    subtree: !0,
  },
  Ph = xe && ot <= 11;
class zh {
  constructor() {
    (this.anchorNode = null),
      (this.anchorOffset = 0),
      (this.focusNode = null),
      (this.focusOffset = 0);
  }
  set(e) {
    (this.anchorNode = e.anchorNode),
      (this.anchorOffset = e.anchorOffset),
      (this.focusNode = e.focusNode),
      (this.focusOffset = e.focusOffset);
  }
  clear() {
    this.anchorNode = this.focusNode = null;
  }
  eq(e) {
    return (
      e.anchorNode == this.anchorNode &&
      e.anchorOffset == this.anchorOffset &&
      e.focusNode == this.focusNode &&
      e.focusOffset == this.focusOffset
    );
  }
}
class Bh {
  constructor(e, t) {
    (this.view = e),
      (this.handleDOMChange = t),
      (this.queue = []),
      (this.flushingSoon = -1),
      (this.observer = null),
      (this.currentSelection = new zh()),
      (this.onCharData = null),
      (this.suppressingSelectionUpdates = !1),
      (this.lastChangedTextNode = null),
      (this.observer =
        window.MutationObserver &&
        new window.MutationObserver((r) => {
          for (let i = 0; i < r.length; i++) this.queue.push(r[i]);
          xe &&
          ot <= 11 &&
          r.some(
            (i) =>
              (i.type == "childList" && i.removedNodes.length) ||
              (i.type == "characterData" &&
                i.oldValue.length > i.target.nodeValue.length)
          )
            ? this.flushSoon()
            : this.flush();
        })),
      Ph &&
        (this.onCharData = (r) => {
          this.queue.push({
            target: r.target,
            type: "characterData",
            oldValue: r.prevValue,
          }),
            this.flushSoon();
        }),
      (this.onSelectionChange = this.onSelectionChange.bind(this));
  }
  flushSoon() {
    this.flushingSoon < 0 &&
      (this.flushingSoon = window.setTimeout(() => {
        (this.flushingSoon = -1), this.flush();
      }, 20));
  }
  forceFlush() {
    this.flushingSoon > -1 &&
      (window.clearTimeout(this.flushingSoon),
      (this.flushingSoon = -1),
      this.flush());
  }
  start() {
    this.observer &&
      (this.observer.takeRecords(), this.observer.observe(this.view.dom, Rh)),
      this.onCharData &&
        this.view.dom.addEventListener(
          "DOMCharacterDataModified",
          this.onCharData
        ),
      this.connectSelection();
  }
  stop() {
    if (this.observer) {
      let e = this.observer.takeRecords();
      if (e.length) {
        for (let t = 0; t < e.length; t++) this.queue.push(e[t]);
        window.setTimeout(() => this.flush(), 20);
      }
      this.observer.disconnect();
    }
    this.onCharData &&
      this.view.dom.removeEventListener(
        "DOMCharacterDataModified",
        this.onCharData
      ),
      this.disconnectSelection();
  }
  connectSelection() {
    this.view.dom.ownerDocument.addEventListener(
      "selectionchange",
      this.onSelectionChange
    );
  }
  disconnectSelection() {
    this.view.dom.ownerDocument.removeEventListener(
      "selectionchange",
      this.onSelectionChange
    );
  }
  suppressSelectionUpdates() {
    (this.suppressingSelectionUpdates = !0),
      setTimeout(() => (this.suppressingSelectionUpdates = !1), 50);
  }
  onSelectionChange() {
    if (gs(this.view)) {
      if (this.suppressingSelectionUpdates) return We(this.view);
      if (xe && ot <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (
          e.focusNode &&
          Et(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset)
        )
          return this.flushSoon();
      }
      this.flush();
    }
  }
  setCurSelection() {
    this.currentSelection.set(this.view.domSelectionRange());
  }
  ignoreSelectionChange(e) {
    if (!e.focusNode) return !0;
    let t = new Set(),
      r;
    for (let o = e.focusNode; o; o = vn(o)) t.add(o);
    for (let o = e.anchorNode; o; o = vn(o))
      if (t.has(o)) {
        r = o;
        break;
      }
    let i = r && this.view.docView.nearestDesc(r);
    if (
      i &&
      i.ignoreMutation({
        type: "selection",
        target: r.nodeType == 3 ? r.parentNode : r,
      })
    )
      return this.setCurSelection(), !0;
  }
  pendingRecords() {
    if (this.observer)
      for (let e of this.observer.takeRecords()) this.queue.push(e);
    return this.queue;
  }
  flush() {
    let { view: e } = this;
    if (!e.docView || this.flushingSoon > -1) return;
    let t = this.pendingRecords();
    t.length && (this.queue = []);
    let r = e.domSelectionRange(),
      i =
        !this.suppressingSelectionUpdates &&
        !this.currentSelection.eq(r) &&
        gs(e) &&
        !this.ignoreSelectionChange(r),
      o = -1,
      s = -1,
      l = !1,
      a = [];
    if (e.editable)
      for (let d = 0; d < t.length; d++) {
        let f = this.registerMutation(t[d], a);
        f &&
          ((o = o < 0 ? f.from : Math.min(f.from, o)),
          (s = s < 0 ? f.to : Math.max(f.to, s)),
          f.typeOver && (l = !0));
      }
    if (Te && a.length) {
      let d = a.filter((f) => f.nodeName == "BR");
      if (d.length == 2) {
        let [f, h] = d;
        f.parentNode && f.parentNode.parentNode == h.parentNode
          ? h.remove()
          : f.remove();
      } else {
        let { focusNode: f } = this.currentSelection;
        for (let h of d) {
          let p = h.parentNode;
          p && p.nodeName == "LI" && (!f || $h(e, f) != p) && h.remove();
        }
      }
    }
    let c = null;
    o < 0 &&
    i &&
    e.input.lastFocus > Date.now() - 200 &&
    Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 &&
    xr(r) &&
    (c = qi(e)) &&
    c.eq(F.near(e.state.doc.resolve(0), 1))
      ? ((e.input.lastFocus = 0),
        We(e),
        this.currentSelection.set(r),
        e.scrollToSelection())
      : (o > -1 || i) &&
        (o > -1 && (e.docView.markDirty(o, s), Lh(e)),
        this.handleDOMChange(o, s, l, a),
        e.docView && e.docView.dirty
          ? e.updateState(e.state)
          : this.currentSelection.eq(r) || We(e),
        this.currentSelection.set(r));
  }
  registerMutation(e, t) {
    if (t.indexOf(e.target) > -1) return null;
    let r = this.view.docView.nearestDesc(e.target);
    if (
      (e.type == "attributes" &&
        (r == this.view.docView ||
          e.attributeName == "contenteditable" ||
          (e.attributeName == "style" &&
            !e.oldValue &&
            !e.target.getAttribute("style")))) ||
      !r ||
      r.ignoreMutation(e)
    )
      return null;
    if (e.type == "childList") {
      for (let d = 0; d < e.addedNodes.length; d++) {
        let f = e.addedNodes[d];
        t.push(f), f.nodeType == 3 && (this.lastChangedTextNode = f);
      }
      if (
        r.contentDOM &&
        r.contentDOM != r.dom &&
        !r.contentDOM.contains(e.target)
      )
        return { from: r.posBefore, to: r.posAfter };
      let i = e.previousSibling,
        o = e.nextSibling;
      if (xe && ot <= 11 && e.addedNodes.length)
        for (let d = 0; d < e.addedNodes.length; d++) {
          let { previousSibling: f, nextSibling: h } = e.addedNodes[d];
          (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (i = f),
            (!h || Array.prototype.indexOf.call(e.addedNodes, h) < 0) &&
              (o = h);
        }
      let s = i && i.parentNode == e.target ? ie(i) + 1 : 0,
        l = r.localPosFromDOM(e.target, s, -1),
        a = o && o.parentNode == e.target ? ie(o) : e.target.childNodes.length,
        c = r.localPosFromDOM(e.target, a, 1);
      return { from: l, to: c };
    } else
      return e.type == "attributes"
        ? { from: r.posAtStart - r.border, to: r.posAtEnd + r.border }
        : ((this.lastChangedTextNode = e.target),
          {
            from: r.posAtStart,
            to: r.posAtEnd,
            typeOver: e.target.nodeValue == e.oldValue,
          });
  }
}
let Cs = new WeakMap(),
  Ms = !1;
function Lh(n) {
  if (
    !Cs.has(n) &&
    (Cs.set(n, null),
    ["normal", "nowrap", "pre-line"].indexOf(
      getComputedStyle(n.dom).whiteSpace
    ) !== -1)
  ) {
    if (((n.requiresGeckoHackNode = Te), Ms)) return;
    console.warn(
      "ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."
    ),
      (Ms = !0);
  }
}
function Os(n, e) {
  let t = e.startContainer,
    r = e.startOffset,
    i = e.endContainer,
    o = e.endOffset,
    s = n.domAtPos(n.state.selection.anchor);
  return (
    Et(s.node, s.offset, i, o) && ([t, r, i, o] = [i, o, t, r]),
    { anchorNode: t, anchorOffset: r, focusNode: i, focusOffset: o }
  );
}
function Fh(n, e) {
  if (e.getComposedRanges) {
    let i = e.getComposedRanges(n.root)[0];
    if (i) return Os(n, i);
  }
  let t;
  function r(i) {
    i.preventDefault(),
      i.stopImmediatePropagation(),
      (t = i.getTargetRanges()[0]);
  }
  return (
    n.dom.addEventListener("beforeinput", r, !0),
    document.execCommand("indent"),
    n.dom.removeEventListener("beforeinput", r, !0),
    t ? Os(n, t) : null
  );
}
function $h(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock) return t;
  }
  return null;
}
function Vh(n, e, t) {
  let {
      node: r,
      fromOffset: i,
      toOffset: o,
      from: s,
      to: l,
    } = n.docView.parseRange(e, t),
    a = n.domSelectionRange(),
    c,
    d = a.anchorNode;
  if (
    (d &&
      n.dom.contains(d.nodeType == 1 ? d : d.parentNode) &&
      ((c = [{ node: d, offset: a.anchorOffset }]),
      xr(a) || c.push({ node: a.focusNode, offset: a.focusOffset })),
    de && n.input.lastKeyCode === 8)
  )
    for (let x = o; x > i; x--) {
      let y = r.childNodes[x - 1],
        v = y.pmViewDesc;
      if (y.nodeName == "BR" && !v) {
        o = x;
        break;
      }
      if (!v || v.size) break;
    }
  let f = n.state.doc,
    h = n.someProp("domParser") || kn.fromSchema(n.state.schema),
    p = f.resolve(s),
    m = null,
    g = h.parse(r, {
      topNode: p.parent,
      topMatch: p.parent.contentMatchAt(p.index()),
      topOpen: !0,
      from: i,
      to: o,
      preserveWhitespace: p.parent.type.whitespace == "pre" ? "full" : !0,
      findPositions: c,
      ruleFromNode: Uh,
      context: p,
    });
  if (c && c[0].pos != null) {
    let x = c[0].pos,
      y = c[1] && c[1].pos;
    y == null && (y = x), (m = { anchor: x + s, head: y + s });
  }
  return { doc: g, sel: m, from: s, to: l };
}
function Uh(n) {
  let e = n.pmViewDesc;
  if (e) return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (he && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (
      n.parentNode.lastChild == n ||
      (he && /^(tr|table)$/i.test(n.parentNode.nodeName))
    )
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
const jh =
  /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Hh(n, e, t, r, i) {
  let o =
    n.input.compositionPendingChanges ||
    (n.composing ? n.input.compositionID : 0);
  if (((n.input.compositionPendingChanges = 0), e < 0)) {
    let T =
        n.input.lastSelectionTime > Date.now() - 50
          ? n.input.lastSelectionOrigin
          : null,
      V = qi(n, T);
    if (V && !n.state.selection.eq(V)) {
      if (
        de &&
        Me &&
        n.input.lastKeyCode === 13 &&
        Date.now() - 100 < n.input.lastKeyCodeTime &&
        n.someProp("handleKeyDown", (Rt) => Rt(n, gt(13, "Enter")))
      )
        return;
      let be = n.state.tr.setSelection(V);
      T == "pointer"
        ? be.setMeta("pointer", !0)
        : T == "key" && be.scrollIntoView(),
        o && be.setMeta("composition", o),
        n.dispatch(be);
    }
    return;
  }
  let s = n.state.doc.resolve(e),
    l = s.sharedDepth(t);
  (e = s.before(l + 1)), (t = n.state.doc.resolve(t).after(l + 1));
  let a = n.state.selection,
    c = Vh(n, e, t),
    d = n.state.doc,
    f = d.slice(c.from, c.to),
    h,
    p;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime
    ? ((h = n.state.selection.to), (p = "end"))
    : ((h = n.state.selection.from), (p = "start")),
    (n.input.lastKeyCode = null);
  let m = Jh(f.content, c.doc.content, c.from, h, p);
  if (
    ((Yt && n.input.lastIOSEnter > Date.now() - 225) || Me) &&
    i.some((T) => T.nodeType == 1 && !jh.test(T.nodeName)) &&
    (!m || m.endA >= m.endB) &&
    n.someProp("handleKeyDown", (T) => T(n, gt(13, "Enter")))
  ) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!m)
    if (
      r &&
      a instanceof I &&
      !a.empty &&
      a.$head.sameParent(a.$anchor) &&
      !n.composing &&
      !(c.sel && c.sel.anchor != c.sel.head)
    )
      m = { start: a.from, endA: a.to, endB: a.to };
    else {
      if (c.sel) {
        let T = Ns(n, n.state.doc, c.sel);
        if (T && !T.eq(n.state.selection)) {
          let V = n.state.tr.setSelection(T);
          o && V.setMeta("composition", o), n.dispatch(V);
        }
      }
      return;
    }
  n.input.domChangeCount++,
    n.state.selection.from < n.state.selection.to &&
      m.start == m.endB &&
      n.state.selection instanceof I &&
      (m.start > n.state.selection.from &&
      m.start <= n.state.selection.from + 2 &&
      n.state.selection.from >= c.from
        ? (m.start = n.state.selection.from)
        : m.endA < n.state.selection.to &&
          m.endA >= n.state.selection.to - 2 &&
          n.state.selection.to <= c.to &&
          ((m.endB += n.state.selection.to - m.endA),
          (m.endA = n.state.selection.to))),
    xe &&
      ot <= 11 &&
      m.endB == m.start + 1 &&
      m.endA == m.start &&
      m.start > c.from &&
      c.doc.textBetween(m.start - c.from - 1, m.start - c.from + 1) == "  " &&
      (m.start--, m.endA--, m.endB--);
  let g = c.doc.resolveNoCache(m.start - c.from),
    x = c.doc.resolveNoCache(m.endB - c.from),
    y = d.resolve(m.start),
    v = g.sameParent(x) && g.parent.inlineContent && y.end() >= m.endA,
    N;
  if (
    ((Yt &&
      n.input.lastIOSEnter > Date.now() - 225 &&
      (!v || i.some((T) => T.nodeName == "DIV" || T.nodeName == "P"))) ||
      (!v &&
        g.pos < c.doc.content.size &&
        !g.sameParent(x) &&
        (N = F.findFrom(c.doc.resolve(g.pos + 1), 1, !0)) &&
        N.head == x.pos)) &&
    n.someProp("handleKeyDown", (T) => T(n, gt(13, "Enter")))
  ) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (
    n.state.selection.anchor > m.start &&
    Wh(d, m.start, m.endA, g, x) &&
    n.someProp("handleKeyDown", (T) => T(n, gt(8, "Backspace")))
  ) {
    Me && de && n.domObserver.suppressSelectionUpdates();
    return;
  }
  de && Me && m.endB == m.start && (n.input.lastAndroidDelete = Date.now()),
    Me &&
      !v &&
      g.start() != x.start() &&
      x.parentOffset == 0 &&
      g.depth == x.depth &&
      c.sel &&
      c.sel.anchor == c.sel.head &&
      c.sel.head == m.endA &&
      ((m.endB -= 2),
      (x = c.doc.resolveNoCache(m.endB - c.from)),
      setTimeout(() => {
        n.someProp("handleKeyDown", function (T) {
          return T(n, gt(13, "Enter"));
        });
      }, 20));
  let R = m.start,
    J = m.endA,
    $,
    ge,
    ne;
  if (v) {
    if (g.pos == x.pos)
      xe &&
        ot <= 11 &&
        g.parentOffset == 0 &&
        (n.domObserver.suppressSelectionUpdates(), setTimeout(() => We(n), 20)),
        ($ = n.state.tr.delete(R, J)),
        (ge = d.resolve(m.start).marksAcross(d.resolve(m.endA)));
    else if (
      m.endA == m.endB &&
      (ne = qh(
        g.parent.content.cut(g.parentOffset, x.parentOffset),
        y.parent.content.cut(y.parentOffset, m.endA - y.start())
      ))
    )
      ($ = n.state.tr),
        ne.type == "add"
          ? $.addMark(R, J, ne.mark)
          : $.removeMark(R, J, ne.mark);
    else if (
      g.parent.child(g.index()).isText &&
      g.index() == x.index() - (x.textOffset ? 0 : 1)
    ) {
      let T = g.parent.textBetween(g.parentOffset, x.parentOffset);
      if (n.someProp("handleTextInput", (V) => V(n, R, J, T))) return;
      $ = n.state.tr.insertText(T, R, J);
    }
  }
  if (
    ($ ||
      ($ = n.state.tr.replace(
        R,
        J,
        c.doc.slice(m.start - c.from, m.endB - c.from)
      )),
    c.sel)
  ) {
    let T = Ns(n, $.doc, c.sel);
    T &&
      !(
        (de &&
          Me &&
          n.composing &&
          T.empty &&
          (m.start != m.endB || n.input.lastAndroidDelete < Date.now() - 100) &&
          (T.head == R || T.head == $.mapping.map(J) - 1)) ||
        (xe && T.empty && T.head == R)
      ) &&
      $.setSelection(T);
  }
  ge && $.ensureMarks(ge),
    o && $.setMeta("composition", o),
    n.dispatch($.scrollIntoView());
}
function Ns(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size
    ? null
    : Wi(n, e.resolve(t.anchor), e.resolve(t.head));
}
function qh(n, e) {
  let t = n.firstChild.marks,
    r = e.firstChild.marks,
    i = t,
    o = r,
    s,
    l,
    a;
  for (let d = 0; d < r.length; d++) i = r[d].removeFromSet(i);
  for (let d = 0; d < t.length; d++) o = t[d].removeFromSet(o);
  if (i.length == 1 && o.length == 0)
    (l = i[0]), (s = "add"), (a = (d) => d.mark(l.addToSet(d.marks)));
  else if (i.length == 0 && o.length == 1)
    (l = o[0]), (s = "remove"), (a = (d) => d.mark(l.removeFromSet(d.marks)));
  else return null;
  let c = [];
  for (let d = 0; d < e.childCount; d++) c.push(a(e.child(d)));
  if (_.from(c).eq(n)) return { mark: l, type: s };
}
function Wh(n, e, t, r, i) {
  if (t - e <= i.pos - r.pos || Ur(r, !0, !1) < i.pos) return !1;
  let o = n.resolve(e);
  if (!r.parent.isTextblock) {
    let l = o.nodeAfter;
    return l != null && t == e + l.nodeSize;
  }
  if (o.parentOffset < o.parent.content.size || !o.parent.isTextblock)
    return !1;
  let s = n.resolve(Ur(o, !0, !0));
  return !s.parent.isTextblock || s.pos > t || Ur(s, !0, !1) < t
    ? !1
    : r.parent.content.cut(r.parentOffset).eq(s.parent.content);
}
function Ur(n, e, t) {
  let r = n.depth,
    i = e ? n.end() : n.pos;
  for (; r > 0 && (e || n.indexAfter(r) == n.node(r).childCount); )
    r--, i++, (e = !1);
  if (t) {
    let o = n.node(r).maybeChild(n.indexAfter(r));
    for (; o && !o.isLeaf; ) (o = o.firstChild), i++;
  }
  return i;
}
function Jh(n, e, t, r, i) {
  let o = n.findDiffStart(e, t);
  if (o == null) return null;
  let { a: s, b: l } = n.findDiffEnd(e, t + n.size, t + e.size);
  if (i == "end") {
    let a = Math.max(0, o - Math.min(s, l));
    r -= s + a - o;
  }
  if (s < o && n.size < e.size) {
    let a = r <= o && r >= s ? o - r : 0;
    (o -= a),
      o && o < e.size && Es(e.textBetween(o - 1, o + 1)) && (o += a ? 1 : -1),
      (l = o + (l - s)),
      (s = o);
  } else if (l < o) {
    let a = r <= o && r >= l ? o - r : 0;
    (o -= a),
      o && o < n.size && Es(n.textBetween(o - 1, o + 1)) && (o += a ? 1 : -1),
      (s = o + (s - l)),
      (l = o);
  }
  return { start: o, endA: s, endB: l };
}
function Es(n) {
  if (n.length != 2) return !1;
  let e = n.charCodeAt(0),
    t = n.charCodeAt(1);
  return e >= 56320 && e <= 57343 && t >= 55296 && t <= 56319;
}
class Kh {
  constructor(e, t) {
    (this._root = null),
      (this.focused = !1),
      (this.trackWrites = null),
      (this.mounted = !1),
      (this.markCursor = null),
      (this.cursorWrapper = null),
      (this.lastSelectedViewDesc = void 0),
      (this.input = new hh()),
      (this.prevDirectPlugins = []),
      (this.pluginViews = []),
      (this.requiresGeckoHackNode = !1),
      (this.dragging = null),
      (this._props = t),
      (this.state = t.state),
      (this.directPlugins = t.plugins || []),
      this.directPlugins.forEach(Rs),
      (this.dispatch = this.dispatch.bind(this)),
      (this.dom = (e && e.mount) || document.createElement("div")),
      e &&
        (e.appendChild
          ? e.appendChild(this.dom)
          : typeof e == "function"
          ? e(this.dom)
          : e.mount && (this.mounted = !0)),
      (this.editable = Ds(this)),
      Is(this),
      (this.nodeViews = As(this)),
      (this.docView = ds(this.state.doc, Ts(this), Vr(this), this.dom, this)),
      (this.domObserver = new Bh(this, (r, i, o, s) => Hh(this, r, i, o, s))),
      this.domObserver.start(),
      ph(this),
      this.updatePluginViews();
  }
  get composing() {
    return this.input.composing;
  }
  get props() {
    if (this._props.state != this.state) {
      let e = this._props;
      this._props = {};
      for (let t in e) this._props[t] = e[t];
      this._props.state = this.state;
    }
    return this._props;
  }
  update(e) {
    e.handleDOMEvents != this._props.handleDOMEvents && _i(this);
    let t = this._props;
    (this._props = e),
      e.plugins && (e.plugins.forEach(Rs), (this.directPlugins = e.plugins)),
      this.updateStateInner(e.state, t);
  }
  setProps(e) {
    let t = {};
    for (let r in this._props) t[r] = this._props[r];
    t.state = this.state;
    for (let r in e) t[r] = e[r];
    this.update(t);
  }
  updateState(e) {
    this.updateStateInner(e, this._props);
  }
  updateStateInner(e, t) {
    var r;
    let i = this.state,
      o = !1,
      s = !1;
    e.storedMarks && this.composing && ($a(this), (s = !0)), (this.state = e);
    let l = i.plugins != e.plugins || this._props.plugins != t.plugins;
    if (
      l ||
      this._props.plugins != t.plugins ||
      this._props.nodeViews != t.nodeViews
    ) {
      let p = As(this);
      Yh(p, this.nodeViews) && ((this.nodeViews = p), (o = !0));
    }
    (l || t.handleDOMEvents != this._props.handleDOMEvents) && _i(this),
      (this.editable = Ds(this)),
      Is(this);
    let a = Vr(this),
      c = Ts(this),
      d =
        i.plugins != e.plugins && !i.doc.eq(e.doc)
          ? "reset"
          : e.scrollToSelection > i.scrollToSelection
          ? "to selection"
          : "preserve",
      f = o || !this.docView.matchesNode(e.doc, c, a);
    (f || !e.selection.eq(i.selection)) && (s = !0);
    let h =
      d == "preserve" && s && this.dom.style.overflowAnchor == null && Ef(this);
    if (s) {
      this.domObserver.stop();
      let p =
        f &&
        (xe || de) &&
        !this.composing &&
        !i.selection.empty &&
        !e.selection.empty &&
        Gh(i.selection, e.selection);
      if (f) {
        let m = de
          ? (this.trackWrites = this.domSelectionRange().focusNode)
          : null;
        this.composing && (this.input.compositionNode = Oh(this)),
          (o || !this.docView.update(e.doc, c, a, this)) &&
            (this.docView.updateOuterDeco(c),
            this.docView.destroy(),
            (this.docView = ds(e.doc, c, a, this.dom, this))),
          m && !this.trackWrites && (p = !0);
      }
      p ||
      !(
        this.input.mouseDown &&
        this.domObserver.currentSelection.eq(this.domSelectionRange()) &&
        Zf(this)
      )
        ? We(this, p)
        : (Oa(this, e.selection), this.domObserver.setCurSelection()),
        this.domObserver.start();
    }
    this.updatePluginViews(i),
      !((r = this.dragging) === null || r === void 0) &&
        r.node &&
        !i.doc.eq(e.doc) &&
        this.updateDraggedNode(this.dragging, i),
      d == "reset"
        ? (this.dom.scrollTop = 0)
        : d == "to selection"
        ? this.scrollToSelection()
        : h && Tf(h);
  }
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!this.someProp("handleScrollToSelection", (t) => t(this)))
      if (this.state.selection instanceof E) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && rs(this, t.getBoundingClientRect(), e);
      } else rs(this, this.coordsAtPos(this.state.selection.head, 1), e);
  }
  destroyPluginViews() {
    let e;
    for (; (e = this.pluginViews.pop()); ) e.destroy && e.destroy();
  }
  updatePluginViews(e) {
    if (
      !e ||
      e.plugins != this.state.plugins ||
      this.directPlugins != this.prevDirectPlugins
    ) {
      (this.prevDirectPlugins = this.directPlugins), this.destroyPluginViews();
      for (let t = 0; t < this.directPlugins.length; t++) {
        let r = this.directPlugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
      for (let t = 0; t < this.state.plugins.length; t++) {
        let r = this.state.plugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
    } else
      for (let t = 0; t < this.pluginViews.length; t++) {
        let r = this.pluginViews[t];
        r.update && r.update(this, e);
      }
  }
  updateDraggedNode(e, t) {
    let r = e.node,
      i = -1;
    if (this.state.doc.nodeAt(r.from) == r.node) i = r.from;
    else {
      let o = r.from + (this.state.doc.content.size - t.doc.content.size);
      (o > 0 && this.state.doc.nodeAt(o)) == r.node && (i = o);
    }
    this.dragging = new Ua(
      e.slice,
      e.move,
      i < 0 ? void 0 : E.create(this.state.doc, i)
    );
  }
  someProp(e, t) {
    let r = this._props && this._props[e],
      i;
    if (r != null && (i = t ? t(r) : r)) return i;
    for (let s = 0; s < this.directPlugins.length; s++) {
      let l = this.directPlugins[s].props[e];
      if (l != null && (i = t ? t(l) : l)) return i;
    }
    let o = this.state.plugins;
    if (o)
      for (let s = 0; s < o.length; s++) {
        let l = o[s].props[e];
        if (l != null && (i = t ? t(l) : l)) return i;
      }
  }
  hasFocus() {
    if (xe) {
      let e = this.root.activeElement;
      if (e == this.dom) return !0;
      if (!e || !this.dom.contains(e)) return !1;
      for (; e && this.dom != e && this.dom.contains(e); ) {
        if (e.contentEditable == "false") return !1;
        e = e.parentElement;
      }
      return !0;
    }
    return this.root.activeElement == this.dom;
  }
  focus() {
    this.domObserver.stop(),
      this.editable && If(this.dom),
      We(this),
      this.domObserver.start();
  }
  get root() {
    let e = this._root;
    if (e == null) {
      for (let t = this.dom.parentNode; t; t = t.parentNode)
        if (t.nodeType == 9 || (t.nodeType == 11 && t.host))
          return (
            t.getSelection ||
              (Object.getPrototypeOf(t).getSelection = () =>
                t.ownerDocument.getSelection()),
            (this._root = t)
          );
    }
    return e || document;
  }
  updateRoot() {
    this._root = null;
  }
  posAtCoords(e) {
    return zf(this, e);
  }
  coordsAtPos(e, t = 1) {
    return ya(this, e, t);
  }
  domAtPos(e, t = 0) {
    return this.docView.domFromPos(e, t);
  }
  nodeDOM(e) {
    let t = this.docView.descAt(e);
    return t ? t.nodeDOM : null;
  }
  posAtDOM(e, t, r = -1) {
    let i = this.docView.posFromDOM(e, t, r);
    if (i == null) throw new RangeError("DOM position not inside the editor");
    return i;
  }
  endOfTextblock(e, t) {
    return Vf(this, t || this.state, e);
  }
  pasteHTML(e, t) {
    return Sn(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  pasteText(e, t) {
    return Sn(this, e, null, !0, t || new ClipboardEvent("paste"));
  }
  destroy() {
    this.docView &&
      (mh(this),
      this.destroyPluginViews(),
      this.mounted
        ? (this.docView.update(this.state.doc, [], Vr(this), this),
          (this.dom.textContent = ""))
        : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom),
      this.docView.destroy(),
      (this.docView = null),
      xf());
  }
  get isDestroyed() {
    return this.docView == null;
  }
  dispatchEvent(e) {
    return bh(this, e);
  }
  dispatch(e) {
    let t = this._props.dispatchTransaction;
    t ? t.call(this, e) : this.updateState(this.state.apply(e));
  }
  domSelectionRange() {
    let e = this.domSelection();
    return (
      (he &&
        this.root.nodeType === 11 &&
        wf(this.dom.ownerDocument) == this.dom &&
        Fh(this, e)) ||
      e
    );
  }
  domSelection() {
    return this.root.getSelection();
  }
}
function Ts(n) {
  let e = Object.create(null);
  return (
    (e.class = "ProseMirror"),
    (e.contenteditable = String(n.editable)),
    n.someProp("attributes", (t) => {
      if ((typeof t == "function" && (t = t(n.state)), t))
        for (let r in t)
          r == "class"
            ? (e.class += " " + t[r])
            : r == "style"
            ? (e.style = (e.style ? e.style + ";" : "") + t[r])
            : !e[r] &&
              r != "contenteditable" &&
              r != "nodeName" &&
              (e[r] = String(t[r]));
    }),
    e.translate || (e.translate = "no"),
    [ke.node(0, n.state.doc.content.size, e)]
  );
}
function Is(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    (e.className = "ProseMirror-separator"),
      e.setAttribute("mark-placeholder", "true"),
      e.setAttribute("alt", ""),
      (n.cursorWrapper = {
        dom: e,
        deco: ke.widget(n.state.selection.head, e, {
          raw: !0,
          marks: n.markCursor,
        }),
      });
  } else n.cursorWrapper = null;
}
function Ds(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function Gh(n, e) {
  let t = Math.min(
    n.$anchor.sharedDepth(n.head),
    e.$anchor.sharedDepth(e.head)
  );
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function As(n) {
  let e = Object.create(null);
  function t(r) {
    for (let i in r)
      Object.prototype.hasOwnProperty.call(e, i) || (e[i] = r[i]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function Yh(n, e) {
  let t = 0,
    r = 0;
  for (let i in n) {
    if (n[i] != e[i]) return !0;
    t++;
  }
  for (let i in e) r++;
  return t != r;
}
function Rs(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError(
      "Plugins passed directly to the view must not have a state component"
    );
}
const Ja = (n, e) =>
  n.selection.empty
    ? !1
    : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function Xh(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0)
    ? null
    : t;
}
const Qh = (n, e, t) => {
  let r = Xh(n, t);
  if (!r) return !1;
  let i = Ka(r);
  if (!i) {
    let s = r.blockRange(),
      l = s && Nn(s);
    return l == null ? !1 : (e && e(n.tr.lift(s, l).scrollIntoView()), !0);
  }
  let o = i.nodeBefore;
  if (!o.type.spec.isolating && Qa(n, i, e)) return !0;
  if (r.parent.content.size == 0 && (Xt(o, "end") || E.isSelectable(o))) {
    let s = Ui(n.doc, r.before(), r.after(), S.empty);
    if (s && s.slice.size < s.to - s.from) {
      if (e) {
        let l = n.tr.step(s);
        l.setSelection(
          Xt(o, "end")
            ? F.findFrom(l.doc.resolve(l.mapping.map(i.pos, -1)), -1)
            : E.create(l.doc, i.pos - o.nodeSize)
        ),
          e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return o.isAtom && i.depth == r.depth - 1
    ? (e && e(n.tr.delete(i.pos - o.nodeSize, i.pos).scrollIntoView()), !0)
    : !1;
};
function Xt(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock) return !0;
    if (t && r.childCount != 1) return !1;
  }
  return !1;
}
const Zh = (n, e, t) => {
  let { $head: r, empty: i } = n.selection,
    o = r;
  if (!i) return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0) return !1;
    o = Ka(r);
  }
  let s = o && o.nodeBefore;
  return !s || !E.isSelectable(s)
    ? !1
    : (e &&
        e(
          n.tr
            .setSelection(E.create(n.doc, o.pos - s.nodeSize))
            .scrollIntoView()
        ),
      !0);
};
function Ka(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0) return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating) break;
    }
  return null;
}
function ep(n, e) {
  let { $cursor: t } = n.selection;
  return !t ||
    (e
      ? !e.endOfTextblock("forward", n)
      : t.parentOffset < t.parent.content.size)
    ? null
    : t;
}
const tp = (n, e, t) => {
    let r = ep(n, t);
    if (!r) return !1;
    let i = Ga(r);
    if (!i) return !1;
    let o = i.nodeAfter;
    if (Qa(n, i, e)) return !0;
    if (r.parent.content.size == 0 && (Xt(o, "start") || E.isSelectable(o))) {
      let s = Ui(n.doc, r.before(), r.after(), S.empty);
      if (s && s.slice.size < s.to - s.from) {
        if (e) {
          let l = n.tr.step(s);
          l.setSelection(
            Xt(o, "start")
              ? F.findFrom(l.doc.resolve(l.mapping.map(i.pos)), 1)
              : E.create(l.doc, l.mapping.map(i.pos))
          ),
            e(l.scrollIntoView());
        }
        return !0;
      }
    }
    return o.isAtom && i.depth == r.depth - 1
      ? (e && e(n.tr.delete(i.pos, i.pos + o.nodeSize).scrollIntoView()), !0)
      : !1;
  },
  np = (n, e, t) => {
    let { $head: r, empty: i } = n.selection,
      o = r;
    if (!i) return !1;
    if (r.parent.isTextblock) {
      if (
        t
          ? !t.endOfTextblock("forward", n)
          : r.parentOffset < r.parent.content.size
      )
        return !1;
      o = Ga(r);
    }
    let s = o && o.nodeAfter;
    return !s || !E.isSelectable(s)
      ? !1
      : (e && e(n.tr.setSelection(E.create(n.doc, o.pos)).scrollIntoView()),
        !0);
  };
function Ga(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      let t = n.node(e);
      if (n.index(e) + 1 < t.childCount) return n.doc.resolve(n.after(e + 1));
      if (t.type.spec.isolating) break;
    }
  return null;
}
const rp = (n, e) => {
    let t = n.selection,
      r = t instanceof E,
      i;
    if (r) {
      if (t.node.isTextblock || !nn(n.doc, t.from)) return !1;
      i = t.from;
    } else if (((i = sa(n.doc, t.from, -1)), i == null)) return !1;
    if (e) {
      let o = n.tr.join(i);
      r &&
        o.setSelection(
          E.create(o.doc, i - n.doc.resolve(i).nodeBefore.nodeSize)
        ),
        e(o.scrollIntoView());
    }
    return !0;
  },
  ip = (n, e) => {
    let t = n.selection,
      r;
    if (t instanceof E) {
      if (t.node.isTextblock || !nn(n.doc, t.to)) return !1;
      r = t.to;
    } else if (((r = sa(n.doc, t.to, 1)), r == null)) return !1;
    return e && e(n.tr.join(r).scrollIntoView()), !0;
  },
  Ya = (n, e) => {
    let { $from: t, $to: r } = n.selection,
      i = t.blockRange(r),
      o = i && Nn(i);
    return o == null ? !1 : (e && e(n.tr.lift(i, o).scrollIntoView()), !0);
  },
  op = (n, e) => {
    let { $head: t, $anchor: r } = n.selection;
    return !t.parent.type.spec.code || !t.sameParent(r)
      ? !1
      : (e &&
          e(
            n.tr
              .insertText(
                `
`
              )
              .scrollIntoView()
          ),
        !0);
  };
function Qi(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs()) return t;
  }
  return null;
}
const Xa = (n, e) => {
    let { $head: t, $anchor: r } = n.selection;
    if (!t.parent.type.spec.code || !t.sameParent(r)) return !1;
    let i = t.node(-1),
      o = t.indexAfter(-1),
      s = Qi(i.contentMatchAt(o));
    if (!s || !i.canReplaceWith(o, o, s)) return !1;
    if (e) {
      let l = t.after(),
        a = n.tr.replaceWith(l, l, s.createAndFill());
      a.setSelection(F.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
    }
    return !0;
  },
  sp = (n, e) => {
    let t = n.selection,
      { $from: r, $to: i } = t;
    if (t instanceof _e || r.parent.inlineContent || i.parent.inlineContent)
      return !1;
    let o = Qi(i.parent.contentMatchAt(i.indexAfter()));
    if (!o || !o.isTextblock) return !1;
    if (e) {
      let s = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos,
        l = n.tr.insert(s, o.createAndFill());
      l.setSelection(I.create(l.doc, s + 1)), e(l.scrollIntoView());
    }
    return !0;
  },
  lp = (n, e) => {
    let { $cursor: t } = n.selection;
    if (!t || t.parent.content.size) return !1;
    if (t.depth > 1 && t.after() != t.end(-1)) {
      let o = t.before();
      if (jt(n.doc, o)) return e && e(n.tr.split(o).scrollIntoView()), !0;
    }
    let r = t.blockRange(),
      i = r && Nn(r);
    return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
  };
function ap(n) {
  return (e, t) => {
    let { $from: r, $to: i } = e.selection;
    if (e.selection instanceof E && e.selection.node.isBlock)
      return !r.parentOffset || !jt(e.doc, r.pos)
        ? !1
        : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.parent.isBlock) return !1;
    if (t) {
      let o = i.parentOffset == i.parent.content.size,
        s = e.tr;
      (e.selection instanceof I || e.selection instanceof _e) &&
        s.deleteSelection();
      let l =
          r.depth == 0 ? null : Qi(r.node(-1).contentMatchAt(r.indexAfter(-1))),
        a = o && l ? [{ type: l }] : void 0,
        c = jt(s.doc, s.mapping.map(r.pos), 1, a);
      if (
        (!a &&
          !c &&
          jt(s.doc, s.mapping.map(r.pos), 1, l ? [{ type: l }] : void 0) &&
          (l && (a = [{ type: l }]), (c = !0)),
        c &&
          (s.split(s.mapping.map(r.pos), 1, a),
          !o && !r.parentOffset && r.parent.type != l))
      ) {
        let d = s.mapping.map(r.before()),
          f = s.doc.resolve(d);
        l &&
          r.node(-1).canReplaceWith(f.index(), f.index() + 1, l) &&
          s.setNodeMarkup(s.mapping.map(r.before()), l);
      }
      t(s.scrollIntoView());
    }
    return !0;
  };
}
const cp = ap(),
  dp = (n, e) => {
    let { $from: t, to: r } = n.selection,
      i,
      o = t.sharedDepth(r);
    return o == 0
      ? !1
      : ((i = t.before(o)), e && e(n.tr.setSelection(E.create(n.doc, i))), !0);
  },
  up = (n, e) => (e && e(n.tr.setSelection(new _e(n.doc))), !0);
function fp(n, e, t) {
  let r = e.nodeBefore,
    i = e.nodeAfter,
    o = e.index();
  return !r || !i || !r.type.compatibleContent(i.type)
    ? !1
    : !r.content.size && e.parent.canReplace(o - 1, o)
    ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0)
    : !e.parent.canReplace(o, o + 1) || !(i.isTextblock || nn(n.doc, e.pos))
    ? !1
    : (t &&
        t(
          n.tr
            .clearIncompatible(e.pos, r.type, r.contentMatchAt(r.childCount))
            .join(e.pos)
            .scrollIntoView()
        ),
      !0);
}
function Qa(n, e, t) {
  let r = e.nodeBefore,
    i = e.nodeAfter,
    o,
    s;
  if (r.type.spec.isolating || i.type.spec.isolating) return !1;
  if (fp(n, e, t)) return !0;
  let l = e.parent.canReplace(e.index(), e.index() + 1);
  if (
    l &&
    (o = (s = r.contentMatchAt(r.childCount)).findWrapping(i.type)) &&
    s.matchType(o[0] || i.type).validEnd
  ) {
    if (t) {
      let f = e.pos + i.nodeSize,
        h = _.empty;
      for (let g = o.length - 1; g >= 0; g--) h = _.from(o[g].create(null, h));
      h = _.from(r.copy(h));
      let p = n.tr.step(
          new le(e.pos - 1, f, e.pos, f, new S(h, 1, 0), o.length, !0)
        ),
        m = f + 2 * o.length;
      nn(p.doc, m) && p.join(m), t(p.scrollIntoView());
    }
    return !0;
  }
  let a = F.findFrom(e, 1),
    c = a && a.$from.blockRange(a.$to),
    d = c && Nn(c);
  if (d != null && d >= e.depth)
    return t && t(n.tr.lift(c, d).scrollIntoView()), !0;
  if (l && Xt(i, "start", !0) && Xt(r, "end")) {
    let f = r,
      h = [];
    for (; h.push(f), !f.isTextblock; ) f = f.lastChild;
    let p = i,
      m = 1;
    for (; !p.isTextblock; p = p.firstChild) m++;
    if (f.canReplace(f.childCount, f.childCount, p.content)) {
      if (t) {
        let g = _.empty;
        for (let y = h.length - 1; y >= 0; y--) g = _.from(h[y].copy(g));
        let x = n.tr.step(
          new le(
            e.pos - h.length,
            e.pos + i.nodeSize,
            e.pos + m,
            e.pos + i.nodeSize - m,
            new S(g, h.length, 0),
            0,
            !0
          )
        );
        t(x.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Za(n) {
  return function (e, t) {
    let r = e.selection,
      i = n < 0 ? r.$from : r.$to,
      o = i.depth;
    for (; i.node(o).isInline; ) {
      if (!o) return !1;
      o--;
    }
    return i.node(o).isTextblock
      ? (t &&
          t(e.tr.setSelection(I.create(e.doc, n < 0 ? i.start(o) : i.end(o)))),
        !0)
      : !1;
  };
}
const hp = Za(-1),
  pp = Za(1);
function ec(n, e = null) {
  return function (t, r) {
    let { $from: i, $to: o } = t.selection,
      s = i.blockRange(o),
      l = s && Vi(s, n, e);
    return l ? (r && r(t.tr.wrap(s, l).scrollIntoView()), !0) : !1;
  };
}
function jr(n, e = null) {
  return function (t, r) {
    let i = !1;
    for (let o = 0; o < t.selection.ranges.length && !i; o++) {
      let {
        $from: { pos: s },
        $to: { pos: l },
      } = t.selection.ranges[o];
      t.doc.nodesBetween(s, l, (a, c) => {
        if (i) return !1;
        if (!(!a.isTextblock || a.hasMarkup(n, e)))
          if (a.type == n) i = !0;
          else {
            let d = t.doc.resolve(c),
              f = d.index();
            i = d.parent.canReplaceWith(f, f + 1, n);
          }
      });
    }
    if (!i) return !1;
    if (r) {
      let o = t.tr;
      for (let s = 0; s < t.selection.ranges.length; s++) {
        let {
          $from: { pos: l },
          $to: { pos: a },
        } = t.selection.ranges[s];
        o.setBlockType(l, a, n, e);
      }
      r(o.scrollIntoView());
    }
    return !0;
  };
}
function mp(n, e, t) {
  for (let r = 0; r < e.length; r++) {
    let { $from: i, $to: o } = e[r],
      s = i.depth == 0 ? n.inlineContent && n.type.allowsMarkType(t) : !1;
    if (
      (n.nodesBetween(i.pos, o.pos, (l) => {
        if (s) return !1;
        s = l.inlineContent && l.type.allowsMarkType(t);
      }),
      s)
    )
      return !0;
  }
  return !1;
}
function bt(n, e = null) {
  return function (t, r) {
    let { empty: i, $cursor: o, ranges: s } = t.selection;
    if ((i && !o) || !mp(t.doc, s, n)) return !1;
    if (r)
      if (o)
        n.isInSet(t.storedMarks || o.marks())
          ? r(t.tr.removeStoredMark(n))
          : r(t.tr.addStoredMark(n.create(e)));
      else {
        let l = !1,
          a = t.tr;
        for (let c = 0; !l && c < s.length; c++) {
          let { $from: d, $to: f } = s[c];
          l = t.doc.rangeHasMark(d.pos, f.pos, n);
        }
        for (let c = 0; c < s.length; c++) {
          let { $from: d, $to: f } = s[c];
          if (l) a.removeMark(d.pos, f.pos, n);
          else {
            let h = d.pos,
              p = f.pos,
              m = d.nodeAfter,
              g = f.nodeBefore,
              x = m && m.isText ? /^\s*/.exec(m.text)[0].length : 0,
              y = g && g.isText ? /\s*$/.exec(g.text)[0].length : 0;
            h + x < p && ((h += x), (p -= y)), a.addMark(h, p, n.create(e));
          }
        }
        r(a.scrollIntoView());
      }
    return !0;
  };
}
function _r(...n) {
  return function (e, t, r) {
    for (let i = 0; i < n.length; i++) if (n[i](e, t, r)) return !0;
    return !1;
  };
}
let Hr = _r(Ja, Qh, Zh),
  Ps = _r(Ja, tp, np);
const He = {
    Enter: _r(op, sp, lp, cp),
    "Mod-Enter": Xa,
    Backspace: Hr,
    "Mod-Backspace": Hr,
    "Shift-Backspace": Hr,
    Delete: Ps,
    "Mod-Delete": Ps,
    "Mod-a": up,
  },
  tc = {
    "Ctrl-h": He.Backspace,
    "Alt-Backspace": He["Mod-Backspace"],
    "Ctrl-d": He.Delete,
    "Ctrl-Alt-Backspace": He["Mod-Delete"],
    "Alt-Delete": He["Mod-Delete"],
    "Alt-d": He["Mod-Delete"],
    "Ctrl-a": hp,
    "Ctrl-e": pp,
  };
for (let n in He) tc[n] = He[n];
const gp =
    typeof navigator < "u"
      ? /Mac|iP(hone|[oa]d)/.test(navigator.platform)
      : typeof os < "u" && os.platform
      ? os.platform() == "darwin"
      : !1,
  bp = gp ? tc : He,
  or = ad((n, e, t, r) => {
    n.setKey("type", t),
      n.setKey("commentId", r || null),
      n.setKey("view", null),
      n.setKey("guestName", sessionStorage.getItem("ht-guest-name") || ""),
      n.setKey("guestEmail", sessionStorage.getItem("ht-guest-email") || ""),
      n.setKey("hasFocused", t !== "comment"),
      n.setKey("mention", { search: null, index: null, range: null });
  });
function xp(n, e) {
  const r = C() + "-" + (n === "comment" ? "comment" : `${e}-${n}`),
    i = or(r, n, e || null);
  return Zt(i);
}
function Y(n, e, t) {
  const r = or(n.id);
  r.set({ ...r.get(), [e]: t }),
    e === "guestName" && sessionStorage.setItem("ht-guest-name", t),
    e === "guestEmail" && sessionStorage.setItem("ht-guest-email", t);
}
const yp = ["p", 0],
  kp = ["blockquote", 0],
  _p = ["pre", ["code", 0]],
  De = {
    doc: { content: "block+" },
    paragraph: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM() {
        return yp;
      },
    },
    blockquote: {
      content: "block+",
      group: "block",
      defining: !0,
      parseDOM: [{ tag: "blockquote" }],
      toDOM() {
        return kp;
      },
    },
    code_block: {
      content: "text*",
      attrs: { language: { default: null } },
      marks: "",
      group: "block",
      code: !0,
      defining: !0,
      parseDOM: [{ tag: "pre", preserveWhitespace: "full" }],
      toDOM() {
        return _p;
      },
    },
    math: {
      content: "text*",
      group: "inline",
      marks: "",
      inline: !0,
      selectable: !1,
      parseDOM: [{ tag: "x-math", preserveWhitespace: "full" }],
      toDOM: () => ["x-math", 0],
    },
    text: { group: "inline" },
    image: {
      attrs: { src: {}, alt: { default: null } },
      group: "block",
      draggable: !0,
      selectable: !0,
      parseDOM: [
        {
          tag: "img[src]",
          getAttrs(n) {
            return { src: n.getAttribute("src"), alt: n.getAttribute("alt") };
          },
        },
      ],
      toDOM(n) {
        const { src: e, alt: t } = n.attrs;
        return ["img", { src: e, alt: t }];
      },
    },
    mention: {
      attrs: { user: {}, name: {} },
      group: "inline",
      inline: !0,
      atom: !0,
      selectable: !0,
      parseDOM: [
        {
          tag: "x-mention",
          getAttrs(n) {
            return {
              user: n.getAttribute("data-user"),
              name: n.getAttribute("data-name"),
            };
          },
        },
      ],
      toDOM: (n) => [
        "x-mention",
        { "data-user": n.attrs.user, "data-name": n.attrs.name },
        "@" + n.attrs.name,
      ],
    },
    embed: {
      attrs: { url: {} },
      group: "block",
      selectable: !0,
      draggable: !0,
      atom: !0,
      parseDOM: [
        {
          tag: "x-embed[data-url]",
          getAttrs(n) {
            return { url: n.dataset.url };
          },
        },
      ],
      toDOM(n) {
        return ["x-embed", { "data-url": n.attrs.url }];
      },
    },
  },
  vp = ["em", 0],
  wp = ["strong", 0],
  Sp = ["code", 0],
  pt = {
    code: {
      parseDOM: [{ tag: "code" }],
      toDOM() {
        return Sp;
      },
    },
    link: {
      attrs: { href: {} },
      inclusive: !1,
      parseDOM: [
        {
          tag: "a[href]",
          getAttrs(n) {
            return { href: n.getAttribute("href") };
          },
        },
      ],
      toDOM(n) {
        const { href: e } = n.attrs;
        return ["a", { href: e }, 0];
      },
    },
    em: {
      parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
      toDOM() {
        return vp;
      },
    },
    strong: {
      parseDOM: [
        { tag: "strong" },
        { tag: "b", getAttrs: (n) => n.style.fontWeight != "normal" && null },
        {
          style: "font-weight",
          getAttrs: (n) => /^(bold(er)?|[5-9]\d{2,})$/.test(n) && null,
        },
      ],
      toDOM() {
        return wp;
      },
    },
    strike: {
      parseDOM: [{ tag: "s" }, { tag: "strike" }, { tag: "del" }],
      toDOM() {
        return ["s", 0];
      },
    },
    spoiler: {
      parseDOM: [{ tag: "x-spoiler" }],
      toDOM() {
        return ["x-spoiler", 0];
      },
    },
  };
new Yl({ nodes: De, marks: pt });
var ct = {
    8: "Backspace",
    9: "Tab",
    10: "Enter",
    12: "NumLock",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    44: "PrintScreen",
    45: "Insert",
    46: "Delete",
    59: ";",
    61: "=",
    91: "Meta",
    92: "Meta",
    106: "*",
    107: "+",
    108: ",",
    109: "-",
    110: ".",
    111: "/",
    144: "NumLock",
    145: "ScrollLock",
    160: "Shift",
    161: "Shift",
    162: "Control",
    163: "Control",
    164: "Alt",
    165: "Alt",
    173: "-",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'",
  },
  sr = {
    48: ")",
    49: "!",
    50: "@",
    51: "#",
    52: "$",
    53: "%",
    54: "^",
    55: "&",
    56: "*",
    57: "(",
    59: ":",
    61: "+",
    173: "_",
    186: ":",
    187: "+",
    188: "<",
    189: "_",
    190: ">",
    191: "?",
    192: "~",
    219: "{",
    220: "|",
    221: "}",
    222: '"',
  },
  Cp = typeof navigator < "u" && /Mac/.test(navigator.platform),
  Mp =
    typeof navigator < "u" &&
    /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var oe = 0; oe < 10; oe++) ct[48 + oe] = ct[96 + oe] = String(oe);
for (var oe = 1; oe <= 24; oe++) ct[oe + 111] = "F" + oe;
for (var oe = 65; oe <= 90; oe++)
  (ct[oe] = String.fromCharCode(oe + 32)), (sr[oe] = String.fromCharCode(oe));
for (var qr in ct) sr.hasOwnProperty(qr) || (sr[qr] = ct[qr]);
function Op(n) {
  var e =
      (Cp && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey) ||
      (Mp && n.shiftKey && n.key && n.key.length == 1) ||
      n.key == "Unidentified",
    t =
      (!e && n.key) ||
      (n.shiftKey ? sr : ct)[n.keyCode] ||
      n.key ||
      "Unidentified";
  return (
    t == "Esc" && (t = "Escape"),
    t == "Del" && (t = "Delete"),
    t == "Left" && (t = "ArrowLeft"),
    t == "Up" && (t = "ArrowUp"),
    t == "Right" && (t = "ArrowRight"),
    t == "Down" && (t = "ArrowDown"),
    t
  );
}
const Np =
  typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function Ep(n) {
  let e = n.split(/-(?!$)/),
    t = e[e.length - 1];
  t == "Space" && (t = " ");
  let r, i, o, s;
  for (let l = 0; l < e.length - 1; l++) {
    let a = e[l];
    if (/^(cmd|meta|m)$/i.test(a)) s = !0;
    else if (/^a(lt)?$/i.test(a)) r = !0;
    else if (/^(c|ctrl|control)$/i.test(a)) i = !0;
    else if (/^s(hift)?$/i.test(a)) o = !0;
    else if (/^mod$/i.test(a)) Np ? (s = !0) : (i = !0);
    else throw new Error("Unrecognized modifier name: " + a);
  }
  return (
    r && (t = "Alt-" + t),
    i && (t = "Ctrl-" + t),
    s && (t = "Meta-" + t),
    o && (t = "Shift-" + t),
    t
  );
}
function Tp(n) {
  let e = Object.create(null);
  for (let t in n) e[Ep(t)] = n[t];
  return e;
}
function Wr(n, e, t = !0) {
  return (
    e.altKey && (n = "Alt-" + n),
    e.ctrlKey && (n = "Ctrl-" + n),
    e.metaKey && (n = "Meta-" + n),
    t && e.shiftKey && (n = "Shift-" + n),
    n
  );
}
function zs(n) {
  return new Ge({ props: { handleKeyDown: Ip(n) } });
}
function Ip(n) {
  let e = Tp(n);
  return function (t, r) {
    let i = Op(r),
      o,
      s = e[Wr(i, r)];
    if (s && s(t.state, t.dispatch, t)) return !0;
    if (i.length == 1 && i != " ") {
      if (r.shiftKey) {
        let l = e[Wr(i, r, !1)];
        if (l && l(t.state, t.dispatch, t)) return !0;
      }
      if (
        (r.shiftKey || r.altKey || r.metaKey || i.charCodeAt(0) > 127) &&
        (o = ct[r.keyCode]) &&
        o != i
      ) {
        let l = e[Wr(o, r)];
        if (l && l(t.state, t.dispatch, t)) return !0;
      }
    }
    return !1;
  };
}
var lr = 200,
  ee = function () {};
ee.prototype.append = function (e) {
  return e.length
    ? ((e = ee.from(e)),
      (!this.length && e) ||
        (e.length < lr && this.leafAppend(e)) ||
        (this.length < lr && e.leafPrepend(this)) ||
        this.appendInner(e))
    : this;
};
ee.prototype.prepend = function (e) {
  return e.length ? ee.from(e).append(this) : this;
};
ee.prototype.appendInner = function (e) {
  return new Dp(this, e);
};
ee.prototype.slice = function (e, t) {
  return (
    e === void 0 && (e = 0),
    t === void 0 && (t = this.length),
    e >= t
      ? ee.empty
      : this.sliceInner(Math.max(0, e), Math.min(this.length, t))
  );
};
ee.prototype.get = function (e) {
  if (!(e < 0 || e >= this.length)) return this.getInner(e);
};
ee.prototype.forEach = function (e, t, r) {
  t === void 0 && (t = 0),
    r === void 0 && (r = this.length),
    t <= r
      ? this.forEachInner(e, t, r, 0)
      : this.forEachInvertedInner(e, t, r, 0);
};
ee.prototype.map = function (e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length);
  var i = [];
  return (
    this.forEach(
      function (o, s) {
        return i.push(e(o, s));
      },
      t,
      r
    ),
    i
  );
};
ee.from = function (e) {
  return e instanceof ee ? e : e && e.length ? new nc(e) : ee.empty;
};
var nc = (function (n) {
  function e(r) {
    n.call(this), (this.values = r);
  }
  n && (e.__proto__ = n),
    (e.prototype = Object.create(n && n.prototype)),
    (e.prototype.constructor = e);
  var t = { length: { configurable: !0 }, depth: { configurable: !0 } };
  return (
    (e.prototype.flatten = function () {
      return this.values;
    }),
    (e.prototype.sliceInner = function (i, o) {
      return i == 0 && o == this.length ? this : new e(this.values.slice(i, o));
    }),
    (e.prototype.getInner = function (i) {
      return this.values[i];
    }),
    (e.prototype.forEachInner = function (i, o, s, l) {
      for (var a = o; a < s; a++)
        if (i(this.values[a], l + a) === !1) return !1;
    }),
    (e.prototype.forEachInvertedInner = function (i, o, s, l) {
      for (var a = o - 1; a >= s; a--)
        if (i(this.values[a], l + a) === !1) return !1;
    }),
    (e.prototype.leafAppend = function (i) {
      if (this.length + i.length <= lr)
        return new e(this.values.concat(i.flatten()));
    }),
    (e.prototype.leafPrepend = function (i) {
      if (this.length + i.length <= lr)
        return new e(i.flatten().concat(this.values));
    }),
    (t.length.get = function () {
      return this.values.length;
    }),
    (t.depth.get = function () {
      return 0;
    }),
    Object.defineProperties(e.prototype, t),
    e
  );
})(ee);
ee.empty = new nc([]);
var Dp = (function (n) {
  function e(t, r) {
    n.call(this),
      (this.left = t),
      (this.right = r),
      (this.length = t.length + r.length),
      (this.depth = Math.max(t.depth, r.depth) + 1);
  }
  return (
    n && (e.__proto__ = n),
    (e.prototype = Object.create(n && n.prototype)),
    (e.prototype.constructor = e),
    (e.prototype.flatten = function () {
      return this.left.flatten().concat(this.right.flatten());
    }),
    (e.prototype.getInner = function (r) {
      return r < this.left.length
        ? this.left.get(r)
        : this.right.get(r - this.left.length);
    }),
    (e.prototype.forEachInner = function (r, i, o, s) {
      var l = this.left.length;
      if (
        (i < l && this.left.forEachInner(r, i, Math.min(o, l), s) === !1) ||
        (o > l &&
          this.right.forEachInner(
            r,
            Math.max(i - l, 0),
            Math.min(this.length, o) - l,
            s + l
          ) === !1)
      )
        return !1;
    }),
    (e.prototype.forEachInvertedInner = function (r, i, o, s) {
      var l = this.left.length;
      if (
        (i > l &&
          this.right.forEachInvertedInner(
            r,
            i - l,
            Math.max(o, l) - l,
            s + l
          ) === !1) ||
        (o < l &&
          this.left.forEachInvertedInner(r, Math.min(i, l), o, s) === !1)
      )
        return !1;
    }),
    (e.prototype.sliceInner = function (r, i) {
      if (r == 0 && i == this.length) return this;
      var o = this.left.length;
      return i <= o
        ? this.left.slice(r, i)
        : r >= o
        ? this.right.slice(r - o, i - o)
        : this.left.slice(r, o).append(this.right.slice(0, i - o));
    }),
    (e.prototype.leafAppend = function (r) {
      var i = this.right.leafAppend(r);
      if (i) return new e(this.left, i);
    }),
    (e.prototype.leafPrepend = function (r) {
      var i = this.left.leafPrepend(r);
      if (i) return new e(i, this.right);
    }),
    (e.prototype.appendInner = function (r) {
      return this.left.depth >= Math.max(this.right.depth, r.depth) + 1
        ? new e(this.left, new e(this.right, r))
        : new e(this, r);
    }),
    e
  );
})(ee);
const Ap = 500;
class Ne {
  constructor(e, t) {
    (this.items = e), (this.eventCount = t);
  }
  popEvent(e, t) {
    if (this.eventCount == 0) return null;
    let r = this.items.length;
    for (; ; r--)
      if (this.items.get(r - 1).selection) {
        --r;
        break;
      }
    let i, o;
    t && ((i = this.remapping(r, this.items.length)), (o = i.maps.length));
    let s = e.tr,
      l,
      a,
      c = [],
      d = [];
    return (
      this.items.forEach(
        (f, h) => {
          if (!f.step) {
            i || ((i = this.remapping(r, h + 1)), (o = i.maps.length)),
              o--,
              d.push(f);
            return;
          }
          if (i) {
            d.push(new Ae(f.map));
            let p = f.step.map(i.slice(o)),
              m;
            p &&
              s.maybeStep(p).doc &&
              ((m = s.mapping.maps[s.mapping.maps.length - 1]),
              c.push(new Ae(m, void 0, void 0, c.length + d.length))),
              o--,
              m && i.appendMap(m, o);
          } else s.maybeStep(f.step);
          if (f.selection)
            return (
              (l = i ? f.selection.map(i.slice(o)) : f.selection),
              (a = new Ne(
                this.items.slice(0, r).append(d.reverse().concat(c)),
                this.eventCount - 1
              )),
              !1
            );
        },
        this.items.length,
        0
      ),
      { remaining: a, transform: s, selection: l }
    );
  }
  addTransform(e, t, r, i) {
    let o = [],
      s = this.eventCount,
      l = this.items,
      a = !i && l.length ? l.get(l.length - 1) : null;
    for (let d = 0; d < e.steps.length; d++) {
      let f = e.steps[d].invert(e.docs[d]),
        h = new Ae(e.mapping.maps[d], f, t),
        p;
      (p = a && a.merge(h)) &&
        ((h = p), d ? o.pop() : (l = l.slice(0, l.length - 1))),
        o.push(h),
        t && (s++, (t = void 0)),
        i || (a = h);
    }
    let c = s - r.depth;
    return c > Pp && ((l = Rp(l, c)), (s -= c)), new Ne(l.append(o), s);
  }
  remapping(e, t) {
    let r = new Ut();
    return (
      this.items.forEach(
        (i, o) => {
          let s =
            i.mirrorOffset != null && o - i.mirrorOffset >= e
              ? r.maps.length - i.mirrorOffset
              : void 0;
          r.appendMap(i.map, s);
        },
        e,
        t
      ),
      r
    );
  }
  addMaps(e) {
    return this.eventCount == 0
      ? this
      : new Ne(this.items.append(e.map((t) => new Ae(t))), this.eventCount);
  }
  rebased(e, t) {
    if (!this.eventCount) return this;
    let r = [],
      i = Math.max(0, this.items.length - t),
      o = e.mapping,
      s = e.steps.length,
      l = this.eventCount;
    this.items.forEach((h) => {
      h.selection && l--;
    }, i);
    let a = t;
    this.items.forEach((h) => {
      let p = o.getMirror(--a);
      if (p == null) return;
      s = Math.min(s, p);
      let m = o.maps[p];
      if (h.step) {
        let g = e.steps[p].invert(e.docs[p]),
          x = h.selection && h.selection.map(o.slice(a + 1, p));
        x && l++, r.push(new Ae(m, g, x));
      } else r.push(new Ae(m));
    }, i);
    let c = [];
    for (let h = t; h < s; h++) c.push(new Ae(o.maps[h]));
    let d = this.items.slice(0, i).append(c).append(r),
      f = new Ne(d, l);
    return (
      f.emptyItemCount() > Ap && (f = f.compress(this.items.length - r.length)),
      f
    );
  }
  emptyItemCount() {
    let e = 0;
    return (
      this.items.forEach((t) => {
        t.step || e++;
      }),
      e
    );
  }
  compress(e = this.items.length) {
    let t = this.remapping(0, e),
      r = t.maps.length,
      i = [],
      o = 0;
    return (
      this.items.forEach(
        (s, l) => {
          if (l >= e) i.push(s), s.selection && o++;
          else if (s.step) {
            let a = s.step.map(t.slice(r)),
              c = a && a.getMap();
            if ((r--, c && t.appendMap(c, r), a)) {
              let d = s.selection && s.selection.map(t.slice(r));
              d && o++;
              let f = new Ae(c.invert(), a, d),
                h,
                p = i.length - 1;
              (h = i.length && i[p].merge(f)) ? (i[p] = h) : i.push(f);
            }
          } else s.map && r--;
        },
        this.items.length,
        0
      ),
      new Ne(ee.from(i.reverse()), o)
    );
  }
}
Ne.empty = new Ne(ee.empty, 0);
function Rp(n, e) {
  let t;
  return (
    n.forEach((r, i) => {
      if (r.selection && e-- == 0) return (t = i), !1;
    }),
    n.slice(t)
  );
}
class Ae {
  constructor(e, t, r, i) {
    (this.map = e),
      (this.step = t),
      (this.selection = r),
      (this.mirrorOffset = i);
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let t = e.step.merge(this.step);
      if (t) return new Ae(t.getMap().invert(), t, this.selection);
    }
  }
}
class Ze {
  constructor(e, t, r, i, o) {
    (this.done = e),
      (this.undone = t),
      (this.prevRanges = r),
      (this.prevTime = i),
      (this.prevComposition = o);
  }
}
const Pp = 20;
function zp(n, e, t, r) {
  let i = t.getMeta(Ct),
    o;
  if (i) return i.historyState;
  t.getMeta(Fp) && (n = new Ze(n.done, n.undone, null, 0, -1));
  let s = t.getMeta("appendedTransaction");
  if (t.steps.length == 0) return n;
  if (s && s.getMeta(Ct))
    return s.getMeta(Ct).redo
      ? new Ze(
          n.done.addTransform(t, void 0, r, qn(e)),
          n.undone,
          Bs(t.mapping.maps),
          n.prevTime,
          n.prevComposition
        )
      : new Ze(
          n.done,
          n.undone.addTransform(t, void 0, r, qn(e)),
          null,
          n.prevTime,
          n.prevComposition
        );
  if (
    t.getMeta("addToHistory") !== !1 &&
    !(s && s.getMeta("addToHistory") === !1)
  ) {
    let l = t.getMeta("composition"),
      a =
        n.prevTime == 0 ||
        (!s &&
          n.prevComposition != l &&
          (n.prevTime < (t.time || 0) - r.newGroupDelay ||
            !Bp(t, n.prevRanges))),
      c = s ? Jr(n.prevRanges, t.mapping) : Bs(t.mapping.maps);
    return new Ze(
      n.done.addTransform(t, a ? e.selection.getBookmark() : void 0, r, qn(e)),
      Ne.empty,
      c,
      t.time,
      l ?? n.prevComposition
    );
  } else
    return (o = t.getMeta("rebased"))
      ? new Ze(
          n.done.rebased(t, o),
          n.undone.rebased(t, o),
          Jr(n.prevRanges, t.mapping),
          n.prevTime,
          n.prevComposition
        )
      : new Ze(
          n.done.addMaps(t.mapping.maps),
          n.undone.addMaps(t.mapping.maps),
          Jr(n.prevRanges, t.mapping),
          n.prevTime,
          n.prevComposition
        );
}
function Bp(n, e) {
  if (!e) return !1;
  if (!n.docChanged) return !0;
  let t = !1;
  return (
    n.mapping.maps[0].forEach((r, i) => {
      for (let o = 0; o < e.length; o += 2)
        r <= e[o + 1] && i >= e[o] && (t = !0);
    }),
    t
  );
}
function Bs(n) {
  let e = [];
  for (let t = n.length - 1; t >= 0 && e.length == 0; t--)
    n[t].forEach((r, i, o, s) => e.push(o, s));
  return e;
}
function Jr(n, e) {
  if (!n) return null;
  let t = [];
  for (let r = 0; r < n.length; r += 2) {
    let i = e.map(n[r], 1),
      o = e.map(n[r + 1], -1);
    i <= o && t.push(i, o);
  }
  return t;
}
function Lp(n, e, t) {
  let r = qn(e),
    i = Ct.get(e).spec.config,
    o = (t ? n.undone : n.done).popEvent(e, r);
  if (!o) return null;
  let s = o.selection.resolve(o.transform.doc),
    l = (t ? n.done : n.undone).addTransform(
      o.transform,
      e.selection.getBookmark(),
      i,
      r
    ),
    a = new Ze(t ? l : o.remaining, t ? o.remaining : l, null, 0, -1);
  return o.transform.setSelection(s).setMeta(Ct, { redo: t, historyState: a });
}
let Kr = !1,
  Ls = null;
function qn(n) {
  let e = n.plugins;
  if (Ls != e) {
    (Kr = !1), (Ls = e);
    for (let t = 0; t < e.length; t++)
      if (e[t].spec.historyPreserveItems) {
        Kr = !0;
        break;
      }
  }
  return Kr;
}
const Ct = new br("history"),
  Fp = new br("closeHistory");
function $p(n = {}) {
  return (
    (n = { depth: n.depth || 100, newGroupDelay: n.newGroupDelay || 500 }),
    new Ge({
      key: Ct,
      state: {
        init() {
          return new Ze(Ne.empty, Ne.empty, null, 0, -1);
        },
        apply(e, t, r) {
          return zp(t, r, e, n);
        },
      },
      config: n,
      props: {
        handleDOMEvents: {
          beforeinput(e, t) {
            let r = t.inputType,
              i = r == "historyUndo" ? ic : r == "historyRedo" ? vi : null;
            return i ? (t.preventDefault(), i(e.state, e.dispatch)) : !1;
          },
        },
      },
    })
  );
}
function rc(n, e) {
  return (t, r) => {
    let i = Ct.getState(t);
    if (!i || (n ? i.undone : i.done).eventCount == 0) return !1;
    if (r) {
      let o = Lp(i, t, n);
      o && r(e ? o.scrollIntoView() : o);
    }
    return !0;
  };
}
const ic = rc(!1, !0),
  vi = rc(!0, !0);
function Fs(n, e = null) {
  return function (t, r) {
    let { $from: i, $to: o } = t.selection,
      s = i.blockRange(o),
      l = !1,
      a = s;
    if (!s) return !1;
    if (
      s.depth >= 2 &&
      i.node(s.depth - 1).type.compatibleContent(n) &&
      s.startIndex == 0
    ) {
      if (i.index(s.depth - 1) == 0) return !1;
      let d = t.doc.resolve(s.start - 2);
      (a = new Xn(d, d, s.depth)),
        s.endIndex < s.parent.childCount &&
          (s = new Xn(i, t.doc.resolve(o.end(s.depth)), s.depth)),
        (l = !0);
    }
    let c = Vi(a, n, e, s);
    return c ? (r && r(Vp(t.tr, s, c, l, n).scrollIntoView()), !0) : !1;
  };
}
function Vp(n, e, t, r, i) {
  let o = _.empty;
  for (let d = t.length - 1; d >= 0; d--)
    o = _.from(t[d].type.create(t[d].attrs, o));
  n.step(
    new le(
      e.start - (r ? 2 : 0),
      e.end,
      e.start,
      e.end,
      new S(o, 0, 0),
      t.length,
      !0
    )
  );
  let s = 0;
  for (let d = 0; d < t.length; d++) t[d].type == i && (s = d + 1);
  let l = t.length - s,
    a = e.start + t.length - (r ? 2 : 0),
    c = e.parent;
  for (let d = e.startIndex, f = e.endIndex, h = !0; d < f; d++, h = !1)
    !h && jt(n.doc, a, l) && (n.split(a, l), (a += 2 * l)),
      (a += c.child(d).nodeSize);
  return n;
}
function Up(n, e) {
  return function (t, r) {
    let { $from: i, $to: o, node: s } = t.selection;
    if ((s && s.isBlock) || i.depth < 2 || !i.sameParent(o)) return !1;
    let l = i.node(-1);
    if (l.type != n) return !1;
    if (
      i.parent.content.size == 0 &&
      i.node(-1).childCount == i.indexAfter(-1)
    ) {
      if (
        i.depth == 3 ||
        i.node(-3).type != n ||
        i.index(-2) != i.node(-2).childCount - 1
      )
        return !1;
      if (r) {
        let f = _.empty,
          h = i.index(-1) ? 1 : i.index(-2) ? 2 : 3;
        for (let y = i.depth - h; y >= i.depth - 3; y--)
          f = _.from(i.node(y).copy(f));
        let p =
          i.indexAfter(-1) < i.node(-2).childCount
            ? 1
            : i.indexAfter(-2) < i.node(-3).childCount
            ? 2
            : 3;
        f = f.append(_.from(n.createAndFill()));
        let m = i.before(i.depth - (h - 1)),
          g = t.tr.replace(m, i.after(-p), new S(f, 4 - h, 0)),
          x = -1;
        g.doc.nodesBetween(m, g.doc.content.size, (y, v) => {
          if (x > -1) return !1;
          y.isTextblock && y.content.size == 0 && (x = v + 1);
        }),
          x > -1 && g.setSelection(F.near(g.doc.resolve(x))),
          r(g.scrollIntoView());
      }
      return !0;
    }
    let a = o.pos == i.end() ? l.contentMatchAt(0).defaultType : null,
      c = t.tr.delete(i.pos, o.pos),
      d = a ? [null, { type: a }] : void 0;
    return jt(c.doc, i.pos, 2, d)
      ? (r && r(c.split(i.pos, 2, d).scrollIntoView()), !0)
      : !1;
  };
}
function jp(n) {
  return function (e, t) {
    let { $from: r, $to: i } = e.selection,
      o = r.blockRange(i, (s) => s.childCount > 0 && s.firstChild.type == n);
    return o
      ? t
        ? r.node(o.depth - 1).type == n
          ? Hp(e, t, n, o)
          : qp(e, t, o)
        : !0
      : !1;
  };
}
function Hp(n, e, t, r) {
  let i = n.tr,
    o = r.end,
    s = r.$to.end(r.depth);
  o < s &&
    (i.step(
      new le(
        o - 1,
        s,
        o,
        s,
        new S(_.from(t.create(null, r.parent.copy())), 1, 0),
        1,
        !0
      )
    ),
    (r = new Xn(i.doc.resolve(r.$from.pos), i.doc.resolve(s), r.depth)));
  const l = Nn(r);
  if (l == null) return !1;
  i.lift(r, l);
  let a = i.mapping.map(o, -1) - 1;
  return nn(i.doc, a) && i.join(a), e(i.scrollIntoView()), !0;
}
function qp(n, e, t) {
  let r = n.tr,
    i = t.parent;
  for (let p = t.end, m = t.endIndex - 1, g = t.startIndex; m > g; m--)
    (p -= i.child(m).nodeSize), r.delete(p - 1, p + 1);
  let o = r.doc.resolve(t.start),
    s = o.nodeAfter;
  if (r.mapping.map(t.end) != t.start + o.nodeAfter.nodeSize) return !1;
  let l = t.startIndex == 0,
    a = t.endIndex == i.childCount,
    c = o.node(-1),
    d = o.index(-1);
  if (
    !c.canReplace(
      d + (l ? 0 : 1),
      d + 1,
      s.content.append(a ? _.empty : _.from(i))
    )
  )
    return !1;
  let f = o.pos,
    h = f + s.nodeSize;
  return (
    r.step(
      new le(
        f - (l ? 1 : 0),
        h + (a ? 1 : 0),
        f + 1,
        h - 1,
        new S(
          (l ? _.empty : _.from(i.copy(_.empty))).append(
            a ? _.empty : _.from(i.copy(_.empty))
          ),
          l ? 0 : 1,
          a ? 0 : 1
        ),
        l ? 0 : 1
      )
    ),
    e(r.scrollIntoView()),
    !0
  );
}
function Wp(n) {
  return function (e, t) {
    let { $from: r, $to: i } = e.selection,
      o = r.blockRange(i, (c) => c.childCount > 0 && c.firstChild.type == n);
    if (!o) return !1;
    let s = o.startIndex;
    if (s == 0) return !1;
    let l = o.parent,
      a = l.child(s - 1);
    if (a.type != n) return !1;
    if (t) {
      let c = a.lastChild && a.lastChild.type == l.type,
        d = _.from(c ? n.create() : null),
        f = new S(
          _.from(n.create(null, _.from(l.type.create(null, d)))),
          c ? 3 : 1,
          0
        ),
        h = o.start,
        p = o.end;
      t(e.tr.step(new le(h - (c ? 3 : 1), p, h, p, f, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
class Ie {
  constructor(e, t, r = {}) {
    (this.match = e),
      (this.match = e),
      (this.handler = typeof t == "string" ? Jp(t) : t),
      (this.undoable = r.undoable !== !1),
      (this.inCode = r.inCode || !1);
  }
}
function Jp(n) {
  return function (e, t, r, i) {
    let o = n;
    if (t[1]) {
      let s = t[0].lastIndexOf(t[1]);
      (o += t[0].slice(s + t[1].length)), (r += s);
      let l = r - i;
      l > 0 && ((o = t[0].slice(s - l, s) + o), (r = i));
    }
    return e.tr.insertText(o, r, i);
  };
}
const Kp = 500;
function Zi({ rules: n }) {
  let e = new Ge({
    state: {
      init() {
        return null;
      },
      apply(t, r) {
        let i = t.getMeta(this);
        return i || (t.selectionSet || t.docChanged ? null : r);
      },
    },
    props: {
      handleTextInput(t, r, i, o) {
        return $s(t, r, i, o, n, e);
      },
      handleDOMEvents: {
        compositionend: (t) => {
          setTimeout(() => {
            let { $cursor: r } = t.state.selection;
            r && $s(t, r.pos, r.pos, "", n, e);
          });
        },
      },
    },
    isInputRules: !0,
  });
  return e;
}
function $s(n, e, t, r, i, o) {
  if (n.composing) return !1;
  let s = n.state,
    l = s.doc.resolve(e),
    a =
      l.parent.textBetween(
        Math.max(0, l.parentOffset - Kp),
        l.parentOffset,
        null,
        "￼"
      ) + r;
  for (let c = 0; c < i.length; c++) {
    let d = i[c];
    if (l.parent.type.spec.code) {
      if (!d.inCode) continue;
    } else if (d.inCode === "only") continue;
    let f = d.match.exec(a),
      h = f && d.handler(s, f, e - (f[0].length - r.length), t);
    if (h)
      return (
        d.undoable && h.setMeta(o, { transform: h, from: e, to: t, text: r }),
        n.dispatch(h),
        !0
      );
  }
  return !1;
}
const oc = (n, e) => {
    let t = n.plugins;
    for (let r = 0; r < t.length; r++) {
      let i = t[r],
        o;
      if (i.spec.isInputRules && (o = i.getState(n))) {
        if (e) {
          let s = n.tr,
            l = o.transform;
          for (let a = l.steps.length - 1; a >= 0; a--)
            s.step(l.steps[a].invert(l.docs[a]));
          if (o.text) {
            let a = s.doc.resolve(o.from).marks();
            s.replaceWith(o.from, o.to, n.schema.text(o.text, a));
          } else s.delete(o.from, o.to);
          e(s);
        }
        return !0;
      }
    }
    return !1;
  },
  Gp = new Ie(/--$/, "—"),
  Yp = new Ie(/\.\.\.$/, "…"),
  Xp = new Ie(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(")$/, "“"),
  Qp = new Ie(/"$/, "”"),
  Zp = new Ie(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(')$/, "‘"),
  em = new Ie(/'$/, "’"),
  tm = [Xp, Qp, Zp, em];
function vr(n, e, t = null, r) {
  return new Ie(n, (i, o, s, l) => {
    let a = t instanceof Function ? t(o) : t,
      c = i.tr.delete(s, l),
      d = c.doc.resolve(s),
      f = d.blockRange(),
      h = f && Vi(f, e, a);
    if (!h) return null;
    c.wrap(f, h);
    let p = c.doc.resolve(s - 1).nodeBefore;
    return (
      p && p.type == e && nn(c.doc, s - 1) && (!r || r(o, p)) && c.join(s - 1),
      c
    );
  });
}
function eo(n, e, t = null) {
  return new Ie(n, (r, i, o, s) => {
    let l = r.doc.resolve(o),
      a = t instanceof Function ? t(i) : t;
    return l.node(-1).canReplaceWith(l.index(-1), l.indexAfter(-1), e)
      ? r.tr.delete(o, s).setBlockType(o, o, e, a)
      : null;
  });
}
const Vs =
  typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function nm(n, e) {
  let t = {},
    r;
  function i(o, s) {
    t[o] = s;
  }
  if (
    (i("Mod-z", ic),
    i("Shift-Mod-z", vi),
    i("Backspace", oc),
    Vs || i("Mod-y", vi),
    i("Alt-ArrowUp", rp),
    i("Alt-ArrowDown", ip),
    i("Mod-BracketLeft", Ya),
    i("Escape", dp),
    (r = n.marks.strong) && (i("Mod-b", bt(r)), i("Mod-B", bt(r))),
    (r = n.marks.em) && (i("Mod-i", bt(r)), i("Mod-I", bt(r))),
    (r = n.marks.code) && i("Mod-`", bt(r)),
    (r = n.nodes.bullet_list) && i("Shift-Ctrl-8", Fs(r)),
    (r = n.nodes.ordered_list) && i("Shift-Ctrl-9", Fs(r)),
    (r = n.nodes.blockquote) && i("Ctrl->", ec(r)),
    (r = n.nodes.hard_break))
  ) {
    let o = r,
      s = _r(
        Xa,
        (l, a) => (
          a && a(l.tr.replaceSelectionWith(o.create()).scrollIntoView()), !0
        )
      );
    i("Mod-Enter", s), i("Shift-Enter", s), Vs && i("Ctrl-Enter", s);
  }
  if (
    ((r = n.nodes.list_item) &&
      (i("Enter", Up(r)), i("Mod-[", jp(r)), i("Mod-]", Wp(r))),
    (r = n.nodes.paragraph) && i("Shift-Ctrl-0", jr(r)),
    (r = n.nodes.code_block) && i("Shift-Ctrl-\\", jr(r)),
    (r = n.nodes.heading))
  )
    for (let o = 1; o <= 6; o++) i("Shift-Ctrl-" + o, jr(r, { level: o }));
  if ((r = n.nodes.horizontal_rule)) {
    let o = r;
    i(
      "Mod-_",
      (s, l) => (
        l && l(s.tr.replaceSelectionWith(o.create()).scrollIntoView()), !0
      )
    );
  }
  return t;
}
function rm(n) {
  return vr(/^\s*>\s$/, n);
}
function im(n) {
  return vr(
    /^(\d+)\.\s$/,
    n,
    (e) => ({ order: +e[1] }),
    (e, t) => t.childCount + t.attrs.order == +e[1]
  );
}
function om(n) {
  return vr(/^\s*([-+*])\s$/, n);
}
function sm(n) {
  return eo(/^```$/, n);
}
function lm(n, e) {
  return eo(new RegExp("^(#{1," + e + "})\\s$"), n, (t) => ({
    level: t[1].length,
  }));
}
function am(n) {
  let e = tm.concat(Yp, Gp),
    t;
  return (
    (t = n.nodes.blockquote) && e.push(rm(t)),
    (t = n.nodes.ordered_list) && e.push(im(t)),
    (t = n.nodes.bullet_list) && e.push(om(t)),
    (t = n.nodes.code_block) && e.push(sm(t)),
    (t = n.nodes.heading) && e.push(lm(t, 6)),
    Zi({ rules: e })
  );
}
function cm(n) {
  const e = (t) => {
    t.state.doc.toString() !== "doc(paragraph)"
      ? t.dom.removeAttribute("data-placeholder")
      : t.dom.setAttribute("data-placeholder", n),
      t.dom.setAttribute("aria-label", n),
      t.dom.setAttribute("role", "textbox"),
      t.dom.setAttribute("aria-multiline", "true");
  };
  return new Ge({
    view(t) {
      return e(t), { update: e };
    },
  });
}
const dm = "codemark",
  wi = 100,
  um = new br(dm);
function Xe(n, e) {
  var t, r;
  return "schema" in n
    ? (t = e == null ? void 0 : e.markType) !== null && t !== void 0
      ? t
      : n.schema.marks.code
    : (r = e == null ? void 0 : e.markType) !== null && r !== void 0
    ? r
    : n.state.schema.marks.code;
}
function It(n, e) {
  return n.resolve(Math.min(Math.max(1, e), n.nodeSize - 2));
}
function sc(n, e, t, r) {
  var i;
  const o = n.isInSet(
      (i = e.state.storedMarks) !== null && i !== void 0
        ? i
        : e.state.doc.resolve(t).marks()
    ),
    s = e.state.doc.rangeHasMark(t, r, n);
  return !!(o || s);
}
const Us = {
    match: /`((?:[^`\w]|[\w])+)`$/,
    handler: (n, e, t, r, i, o, s) => {
      if (sc(n, e, i, o)) return !1;
      const l = r[1],
        a = n.create(),
        c = i + l.length,
        d = e.state.tr.delete(i, o).insertText(l).addMark(i, c, a),
        f = d.setSelection(I.create(d.doc, c)).removeStoredMark(n),
        h = f.setMeta(s.input, {
          transform: f,
          from: i,
          to: o,
          text: `\`${l}${t}`,
        });
      return e.dispatch(h), !0;
    },
  },
  js = {
    match: /^`((?:[^`\w]|[\w])+)`/,
    handler: (n, e, t, r, i, o, s) => {
      if (sc(n, e, i, o)) return !1;
      const l = n.create(),
        a = r[1],
        c = i,
        d = e.state.tr
          .delete(i, o)
          .insertText(a)
          .addMark(i, i + a.length, l),
        f = d.setSelection(I.create(d.doc, c)).addStoredMark(n.create()),
        h = f.setMeta(s.input, {
          transform: f,
          from: i,
          to: o,
          text: `\`${a}${t}`,
        });
      return e.dispatch(h), !0;
    },
  };
function fm(n, e, t, r, i, o) {
  if (e.composing) return !1;
  const { state: s } = e,
    l = s.doc.resolve(t);
  if (l.parent.type.spec.code) return !1;
  const a = "￼",
    c =
      l.parent.textBetween(
        Math.max(0, l.parentOffset - wi),
        l.parentOffset,
        void 0,
        a
      ) + i,
    d =
      i +
      l.parent.textBetween(
        l.parentOffset,
        Math.min(l.parent.nodeSize - 2, l.parentOffset + wi),
        void 0,
        a
      ),
    f = Us.match.exec(c),
    h = js.match.exec(d);
  if (f) {
    const p = Us.handler(n, e, i, f, t - f[0].length + i.length, r, o);
    if (p) return p;
  }
  return h ? js.handler(n, e, i, h, t, r + h[0].length - i.length, o) : !1;
}
function hm(n, e) {
  const t = new Ge({
    isInputRules: !0,
    state: {
      init: () => null,
      apply(r, i) {
        const o = r.getMeta(t);
        return o || (r.selectionSet || r.docChanged ? null : i);
      },
    },
    props: {
      handleTextInput(r, i, o, s) {
        const l = Xe(r, e);
        return fm(l, r, i, o, s, { input: t, cursor: n });
      },
    },
  });
  return t;
}
function Je(n, e, t = "next") {
  const r = { action: t };
  return n.dispatch(n.state.tr.setMeta(e, r)), !1;
}
function pm(n, e, t, r) {
  if (
    n.state.selection.empty ||
    t.metaKey ||
    t.shiftKey ||
    t.altKey ||
    t.ctrlKey
  )
    return !1;
  const { from: i, to: o } = n.state.selection;
  if (o - i >= wi || n.state.doc.rangeHasMark(i, o, r)) return !1;
  const s = n.state.tr.addMark(i, o, r.create()),
    l = s.setSelection(I.create(s.doc, o)).removeStoredMark(r);
  return n.dispatch(l), !0;
}
function mm(n, e, t, r) {
  var i;
  if (t.metaKey) return Je(n, e);
  if (t.shiftKey || t.altKey || t.ctrlKey) return !1;
  const { selection: o, doc: s } = n.state;
  if (!o.empty) return !1;
  const l = e.getState(n.state),
    a = o.$from,
    c = !!r.isInSet(a.marks()),
    d = !!r.isInSet(
      (i = a.marksAcross(It(s, o.from + 1))) !== null && i !== void 0 ? i : []
    );
  return a.pos === n.state.doc.nodeSize - 3 &&
    a.parentOffset === a.parent.nodeSize - 2 &&
    l != null &&
    l.active
    ? (n.dispatch(n.state.tr.removeStoredMark(r)), !0)
    : c === d && a.parentOffset !== 0
    ? !1
    : c && (!(l != null && l.active) || l.side === -1) && a.parentOffset !== 0
    ? (n.dispatch(n.state.tr.removeStoredMark(r)), !0)
    : d && (l == null ? void 0 : l.side) === -1
    ? (n.dispatch(n.state.tr.addStoredMark(r.create())), !0)
    : !1;
}
function gm(n, e, t, r) {
  if (mm(n, e, t, r)) return !0;
  const { selection: o } = n.state,
    s = o.$from;
  return o.empty && s.parentOffset === s.parent.nodeSize - 2 ? Je(n, e) : !1;
}
function bm(n, e, t, r) {
  var i;
  if (t.metaKey) return Je(n, e);
  if (t.shiftKey || t.altKey || t.ctrlKey) return !1;
  const { selection: o, doc: s } = n.state,
    l = e.getState(n.state),
    a = !!r.isInSet(o.$from.marks()),
    c = !!r.isInSet(
      (i = It(s, o.empty ? o.from - 1 : o.from + 1).marks()) !== null &&
        i !== void 0
        ? i
        : []
    );
  if (a && (l == null ? void 0 : l.side) === -1 && o.$from.parentOffset === 0)
    return !1;
  if ((l == null ? void 0 : l.side) === 0 && o.$from.parentOffset === 0)
    return n.dispatch(n.state.tr.removeStoredMark(r)), !0;
  if (a && c && (l == null ? void 0 : l.side) === 0)
    return n.dispatch(n.state.tr.addStoredMark(r.create())), !0;
  if (
    (a && !c && l != null && l.active && o.$from.parentOffset === 0) ||
    (!a && l != null && l.active && (l == null ? void 0 : l.side) === 0)
  )
    return n.dispatch(n.state.tr.removeStoredMark(r)), !0;
  if (a === c) return !1;
  if (c || (!o.empty && a)) {
    const d = o.empty ? o.from - 1 : o.from,
      f = n.state.tr.setSelection(I.create(s, d));
    return (
      !o.empty && c
        ? n.dispatch(f.addStoredMark(r.create()))
        : n.dispatch(f.removeStoredMark(r)),
      !0
    );
  }
  if ((c || (!o.empty && a)) && !(l != null && l.active)) {
    const d = o.empty ? o.from - 1 : o.from;
    return (
      n.dispatch(n.state.tr.setSelection(I.create(s, d)).removeStoredMark(r)),
      !0
    );
  }
  if (a && !(l != null && l.active) && o.$from.parentOffset > 0)
    return (
      n.dispatch(
        n.state.tr
          .setSelection(I.create(s, o.from - 1))
          .addStoredMark(r.create())
      ),
      !0
    );
  if (a && !c && l != null && l.active && l.side !== -1)
    return n.dispatch(n.state.tr.addStoredMark(r.create())), !0;
  if (a && !c && l != null && l.active) {
    const d = o.from - 1;
    return (
      n.dispatch(
        n.state.tr.setSelection(I.create(s, d)).addStoredMark(r.create())
      ),
      !0
    );
  }
  return !1;
}
function xm(n, e, t, r) {
  if (bm(n, e, t, r)) return !0;
  const { selection: o } = n.state,
    s = o.$from,
    l = e.getState(n.state);
  return s.pos === 1 &&
    s.parentOffset === 0 &&
    (l == null ? void 0 : l.side) === -1
    ? !0
    : o.empty && s.parentOffset === 0
    ? Je(n, e)
    : !1;
}
function ym(n, e, t, r) {
  if (t.metaKey || t.shiftKey || t.altKey || t.ctrlKey) return !1;
  const { selection: i, doc: o } = n.state,
    s = It(o, i.from - 1),
    l = !!r.isInSet(s.marks()),
    a = s.parentOffset === 0,
    c = !!r.isInSet(It(o, i.to + 1).marks());
  if ((!l || a) && !c) return Je(n, e);
  const d = e.getState(n.state);
  if (i.empty && (d == null ? void 0 : d.side) === -1) {
    const f = n.state.tr.delete(i.from - 1, i.from);
    return n.dispatch(f), !0;
  }
  return !1;
}
function km(n, e, t, r) {
  if (t.metaKey || t.shiftKey || t.altKey || t.ctrlKey) return !1;
  const { selection: i, doc: o } = n.state,
    s = !!r.isInSet(i.$from.marks()),
    l = i.$from.parentOffset === 0,
    a = !!r.isInSet(It(o, i.to + 2).marks());
  return (!s || l) && !a ? Je(n, e) : !1;
}
function _m(n, e) {
  var t, r;
  if (!n) return null;
  const { selection: i, doc: o } = n;
  if (!i.empty) return null;
  const s = !!e.isInSet((t = n.storedMarks) !== null && t !== void 0 ? t : []),
    l = !!e.isInSet(i.$from.marks()),
    a = !!e.isInSet(
      (r = It(o, i.from + 1).marks()) !== null && r !== void 0 ? r : []
    ),
    c = i.$from.parentOffset === 0;
  return l !== a || (!l && s !== l) || (l && c)
    ? n.tr.removeStoredMark(e)
    : null;
}
function vm() {
  const n = document.createElement("span");
  return n.classList.add("fake-cursor"), n;
}
function wm(n) {
  const e = new Ge({
    key: um,
    appendTransaction: (t, r, i) => {
      var o;
      const s = e.getState(r),
        l = (o = t[0]) === null || o === void 0 ? void 0 : o.getMeta(e);
      return (s != null && s.next) ||
        (l == null ? void 0 : l.action) === "click"
        ? _m(i, Xe(i, n))
        : null;
    },
    state: {
      init: () => null,
      apply(t, r, i, o) {
        var s;
        const l = t.getMeta(e);
        if ((l == null ? void 0 : l.action) === "next") return { next: !0 };
        const a = Xe(o, n),
          c = a.isInSet(
            (s = o.storedMarks) !== null && s !== void 0
              ? s
              : o.doc.resolve(t.selection.from).marks()
          ),
          d = a.isInSet(o.doc.resolve(t.selection.from).marks()),
          f = a.isInSet(It(o.doc, t.selection.from + 1).marks()),
          h = t.selection.$from.parentOffset === 0;
        return t.selection.empty
          ? !c && f && (!d || h)
            ? { active: !0, side: -1 }
            : c && (!d || h)
            ? { active: !0, side: 0 }
            : !c && d && !f
            ? { active: !0, side: 0 }
            : c && d && !f
            ? { active: !0, side: -1 }
            : null
          : null;
      },
    },
    props: {
      attributes: (t) => {
        var r;
        const { active: i = !1 } =
          (r = e.getState(t)) !== null && r !== void 0 ? r : {};
        return Object.assign({}, i ? { class: "no-cursor" } : {});
      },
      decorations: (t) => {
        var r;
        const { active: i, side: o } =
          (r = e.getState(t)) !== null && r !== void 0 ? r : {};
        if (!i) return H.empty;
        const s = ke.widget(t.selection.from, vm, { side: o });
        return H.create(t.doc, [s]);
      },
      handleKeyDown(t, r) {
        switch (r.key) {
          case "`":
            return pm(t, e, r, Xe(t, n));
          case "ArrowRight":
            return gm(t, e, r, Xe(t, n));
          case "ArrowLeft":
            return xm(t, e, r, Xe(t, n));
          case "Backspace":
            return ym(t, e, r, Xe(t, n));
          case "Delete":
            return km(t, e, r, Xe(t, n));
          case "ArrowUp":
          case "ArrowDown":
          case "Home":
          case "End":
            return Je(t, e);
          case "e":
          case "a":
            return r.ctrlKey ? Je(t, e) : !1;
          default:
            return !1;
        }
      },
      handleClick(t) {
        return Je(t, e, "click");
      },
    },
  });
  return e;
}
function Sm(n) {
  const e = wm(n),
    t = hm(e, n);
  return [e, t];
}
const Cm = "KEEP_OPEN";
var j;
(function (n) {
  (n.open = "open"),
    (n.close = "close"),
    (n.filter = "filter"),
    (n.up = "ArrowUp"),
    (n.down = "ArrowDown"),
    (n.left = "ArrowLeft"),
    (n.right = "ArrowRight"),
    (n.enter = "enter");
})(j || (j = {}));
const to = new br("autocomplete");
function ar(n, e) {
  return e.find(n.from, n.to).length > 0;
}
function dn(n) {
  const e = to.get(n.state),
    t = { action: "remove" },
    r = n.state.tr.setMeta(e, t);
  return n.dispatch(r), !0;
}
const Gr = { active: !1, decorations: H.empty };
function Mm(n) {
  switch (n.key) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
      return n.key;
    case "Tab":
    case "Enter":
      return j.enter;
    case "Escape":
      return j.close;
    default:
      return null;
  }
}
function Hs(n) {
  const e = to.get(n.state),
    { decorations: t } = e.getState(n.state);
  return ar(n.state.selection, t) && dn(n), !1;
}
function Om(n) {
  const e = new Ge({
    key: to,
    view() {
      return {
        update: (t, r) => {
          var i, o, s, l;
          const a = e.getState(r),
            c = e.getState(t.state),
            d = !a.active && c.active,
            f = a.active && !c.active,
            h = c.active && !d && !f && a.filter !== c.filter,
            p = {
              view: t,
              trigger: (i = c.trigger) !== null && i !== void 0 ? i : a.trigger,
              filter: (o = c.filter) !== null && o !== void 0 ? o : a.filter,
              range: (s = c.range) !== null && s !== void 0 ? s : a.range,
              type: (l = c.type) !== null && l !== void 0 ? l : a.type,
            };
          d && n(Object.assign(Object.assign({}, p), { kind: j.open })),
            h && n(Object.assign(Object.assign({}, p), { kind: j.filter })),
            f && n(Object.assign(Object.assign({}, p), { kind: j.close }));
        },
      };
    },
    state: {
      init: () => Gr,
      apply(t, r) {
        var i, o, s;
        const l = t.getMeta(e);
        if ((l == null ? void 0 : l.action) === "add") {
          const { trigger: y, filter: v, type: N } = l,
            R =
              t.selection.from -
              y.length -
              ((i = v == null ? void 0 : v.length) !== null && i !== void 0
                ? i
                : 0),
            J = t.selection.from,
            $ =
              !(
                (o = N == null ? void 0 : N.decorationAttrs) === null ||
                o === void 0
              ) && o.class
                ? [
                    "autocomplete",
                    (s = N == null ? void 0 : N.decorationAttrs) === null ||
                    s === void 0
                      ? void 0
                      : s.class,
                  ].join(" ")
                : "autocomplete",
            ge = Object.assign(
              Object.assign({}, N == null ? void 0 : N.decorationAttrs),
              { class: $ }
            ),
            ne = ke.inline(R, J, ge, { inclusiveStart: !1, inclusiveEnd: !0 });
          return {
            active: !0,
            trigger: l.trigger,
            decorations: H.create(t.doc, [ne]),
            filter: v ?? "",
            range: { from: R, to: J },
            type: N,
          };
        }
        const { decorations: a } = r,
          c = a.map(t.mapping, t.doc),
          d = c.find().length > 0;
        if (
          (l == null ? void 0 : l.action) === "remove" ||
          !ar(t.selection, c) ||
          !d
        )
          return Gr;
        const { active: f, trigger: h, type: p } = r,
          { from: m, to: g } = c.find()[0],
          x = t.doc.textBetween(m, g);
        return x.startsWith(h)
          ? {
              active: f,
              trigger: h,
              decorations: c,
              filter: x.slice(h.length),
              range: { from: m, to: g },
              type: p,
            }
          : Gr;
      },
    },
    props: {
      decorations: (t) => {
        var r;
        return (r = e.getState(t)) === null || r === void 0
          ? void 0
          : r.decorations;
      },
      handlePaste: (t) => Hs(t),
      handleDrop: (t) => Hs(t),
      handleKeyDown(t, r) {
        var i, o;
        const {
          trigger: s,
          active: l,
          decorations: a,
          type: c,
        } = e.getState(t.state);
        if (!l || !ar(t.state.selection, a)) return !1;
        const { from: d, to: f } = a.find()[0],
          p = t.state.doc
            .textBetween(d, f)
            .slice(
              (i = s == null ? void 0 : s.length) !== null && i !== void 0
                ? i
                : 1
            );
        if (
          ((o = c == null ? void 0 : c.cancelOnFirstSpace) !== null &&
          o !== void 0
            ? o
            : !0) &&
          p.length === 0 &&
          (r.key === " " || r.key === "Spacebar")
        )
          return (
            dn(t), t.dispatch(t.state.tr.insertText(" ").scrollIntoView()), !0
          );
        if (p.length === 0 && r.key === "Backspace")
          return oc(t.state, t.dispatch), dn(t), !0;
        const g = Mm(r),
          x = {
            view: t,
            trigger: s,
            filter: p,
            range: { from: d, to: f },
            type: c,
            event: r,
          };
        switch (g) {
          case j.close:
            return dn(t);
          case j.enter: {
            const y = n(Object.assign(Object.assign({}, x), { kind: j.enter }));
            return y === Cm ? !0 : y || dn(t);
          }
          case j.up:
          case j.down:
            return !!n(Object.assign(Object.assign({}, x), { kind: g }));
          case j.left:
          case j.right:
            return c != null && c.allArrowKeys
              ? !!n(Object.assign(Object.assign({}, x), { kind: g }))
              : !1;
        }
        return !1;
      },
    },
  });
  return e;
}
function Nm(n, e) {
  const t =
    typeof e.trigger == "string"
      ? RegExp(
          `(?:^|\\s|\\n|[^\\d\\w])(${e.trigger.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )})$`
        )
      : e.trigger;
  return new Ie(t, (r, i) => {
    const { decorations: o } = n.getState(r);
    if (ar(r.selection, o)) return null;
    const s = r.tr.insertText(i[1][i[1].length - 1]).scrollIntoView(),
      l = { action: "add", trigger: i[1], type: e };
    return s.setMeta(n, l), s;
  });
}
function Em(n) {
  return (e) => {
    var t, r, i, o, s, l, a, c, d, f;
    switch (e.kind) {
      case j.open:
        return (r =
          (t = n.onOpen) === null || t === void 0 ? void 0 : t.call(n, e)) !==
          null && r !== void 0
          ? r
          : !1;
      case j.close:
        return (o =
          (i = n.onClose) === null || i === void 0 ? void 0 : i.call(n, e)) !==
          null && o !== void 0
          ? o
          : !1;
      case j.up:
      case j.down:
      case j.left:
      case j.right:
        return (l =
          (s = n.onArrow) === null || s === void 0 ? void 0 : s.call(n, e)) !==
          null && l !== void 0
          ? l
          : !1;
      case j.filter:
        return (c =
          (a = n.onFilter) === null || a === void 0 ? void 0 : a.call(n, e)) !==
          null && c !== void 0
          ? c
          : !1;
      case j.enter:
        return (f =
          (d = n.onEnter) === null || d === void 0 ? void 0 : d.call(n, e)) !==
          null && f !== void 0
          ? f
          : !1;
      default:
        return !1;
    }
  };
}
function Tm(n = {}) {
  const e = Object.assign({ triggers: [], reducer: Em(n) }, n),
    { reducer: t, triggers: r } = e,
    i = Om(t);
  return [i, Zi({ rules: r.map((s) => Nm(i, s)) })];
}
function lc(n, e = 300) {
  let t;
  return function (...r) {
    clearTimeout(t);
    const i = this;
    t = window.setTimeout(function () {
      n.apply(i, r);
    }, e);
  };
}
const Qt = O({});
function Im(n, e) {
  const t = Qt.get()[n];
  if (!t) return !1;
  for (const r of t) if (Ii(r, e)) return !0;
  return !1;
}
function ac(n, e) {
  const t = [];
  for (const r of Object.values(Ce.all())) {
    if (t.length > 15 || r.is_hidden) continue;
    const i = r.user;
    i.type &&
      i.name.startsWith(e) &&
      (t.find((o) => o.id === i.id && o.type === i.type) || t.push(i));
  }
  cc(e, t);
}
function cc(n, e) {
  const t = Qt.get(),
    r = t[n] || [];
  for (const i of e) Im(n, i) || r.push(i);
  Qt.set({ ...t, [n]: r });
}
function Dm(n, e) {
  return (Qt.get()[n] || [])[e] || null;
}
const Am = lc((n, e, t) => {
  ac(n, e),
    D.call({
      context: n,
      method: "get",
      endpoint: "/commenter/mentions",
      data: { search: e },
      success: (r) => {
        t(r), cc(e, r);
      },
    });
}, 400);
function Rm(n) {
  return n.type + "_" + n.id;
}
function dc(n) {
  return `mention-suggestions-${n}`;
}
const Si = "rich-editor-mention-autocomplete";
function uc(n) {
  const { range: e, index: t, search: r } = n.mention,
    i = n.view,
    o = i.state.tr;
  if (e === null || t === null || r === null) return;
  const { from: s, to: l } = e;
  o.delete(s, l);
  const a = Dm(r, t);
  if (!a) return;
  const c = i.state.schema;
  o.insert(
    s,
    c.nodes.mention.create({ user: Rm(a), name: a.username || a.name })
  ),
    o.insert(s + 1, c.text(" ")),
    i.dispatch(o);
}
function Pm(n) {
  const e = {
    triggers: [
      {
        name: "mention",
        trigger: "@",
        decorationAttrs: { id: `${Si}-${n.id}`, class: Si },
        cancelOnFirstSpace: !1,
      },
    ],
    onOpen: ({ view: t, range: r, trigger: i, type: o }) => (
      Y(n, "mention", { search: "", index: 0, range: r }), !0
    ),
    onArrow: ({ view: t, range: r, kind: i }) => {
      const o = or(n.id).get().mention;
      if (o.search === null) return !1;
      const s = Qt.get()[o.search];
      let l = o.index || 0;
      return (
        i === "ArrowUp"
          ? l === 0
            ? (l = s.length > 0 ? s.length - 1 : 0)
            : (l = l - 1)
          : i === "ArrowDown" && (l >= s.length - 1 ? (l = 0) : (l = l + 1)),
        Y(n, "mention", { search: o.search, index: l, range: r }),
        setTimeout(() => {
          var d;
          const a = dc(n.id),
            c =
              (d = t.dom.getRootNode()) == null
                ? void 0
                : d.querySelector(`#${a} .user.active`);
          c && c.scrollIntoView(!1);
        }, 100),
        !0
      );
    },
    onFilter: ({ view: t, range: r, filter: i }) => (
      Y(n, "mention", { search: i || "", index: 0, range: r }), !0
    ),
    onEnter: () => (uc(or(n.id).get()), !0),
    onClose: ({ view: t }) => (
      Y(n, "mention", { search: null, index: null, range: null }), !0
    ),
  };
  return Tm(e);
}
function zm(n, e) {
  const t = [...Bm(n.marks, e), ...Lm(n, e)];
  return Zi({ rules: t });
}
function Bm(n, e) {
  const t = [];
  return (
    e.inline_styles &&
      (t.push(ht(/(?:\*\*)([^\*]+)(?:\*\*)$/, n.strong)),
      t.push(ht(/(?:\w__)([^_]+)(?:__)$/, n.strong)),
      t.push(ht(/(?:^|[^\*])(?:\*)([^\*]+)(?:\*)$/, n.em, {}, /^[^\*]/)),
      t.push(ht(/(?:^|[^_])(?:_)([^_]+)(?:_)$/, n.em, {}, /^[^_]/)),
      t.push(ht(/(?:~~)([^~]+)(?:~~)$/, n.strike)),
      e.spoiler && t.push(ht(/(?:!!)([^!]+)(?:!!)$/, n.spoiler))),
    e.links &&
      t.push(
        ht(/(?:\[([^\]]+)\])(\([^\)]+\))$/, n.link, function (r) {
          return { href: r[2] };
        })
      ),
    t
  );
}
function Lm(n, e) {
  const t = n.nodes,
    r = [];
  return (
    e.math &&
      r.push(
        new Ie(/([^$]|^)\$\$\s$/, (i, o, s) => {
          const { $from: l } = i.selection;
          if (l.node().type.name !== "paragraph") return null;
          o[0].match(/^[^$]/) && s++;
          const a = i.tr
            .replaceWith(s, s + 3, [t.math.create(null), n.text(" ")])
            .scrollIntoView();
          return a.setSelection(I.create(a.doc, s + 1)), a;
        })
      ),
    e.code_blocks &&
      r.push(
        eo(/^```([a-zA-Z0-9]+)?\s$/, t.code_block, (i) => ({
          language: i[1] || null,
        }))
      ),
    e.blockquotes && r.push(vr(/^\s*>\s$/, t.blockquote)),
    r
  );
}
function ht(n, e, t = {}, r = void 0) {
  return new Ie(n, (i, o, s, l) => {
    const a = t instanceof Function ? t(o) : t,
      c = i.tr;
    if (o[1]) {
      let d,
        f = 0;
      (d = r && o[0].match(r)) && ((f = d[0].length), (s += f));
      const h = s + o[0].indexOf(o[1]) - f,
        p = h + o[1].length;
      p < l && c.delete(p, l), h > s && c.delete(s, h), (l = s + o[1].length);
    }
    return c.addMark(s, l, e.create(a)), c.removeStoredMark(e), c;
  });
}
function Fm(n) {
  return new Ge({
    props: {
      transformPasted: (e, t) => {
        if (n) {
          const r = $m(e, t);
          if (r) return gc(t, r), new S(_.empty, 0, 0);
        }
        return new S(hc(e.content), e.openStart, e.openEnd);
      },
    },
  });
}
const fc = /\b((https?:\/\/)[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/g;
function $m(n, e) {
  const t = e.state.selection.$from.parent;
  if (
    t.type.name !== "paragraph" ||
    t.textContent !== "" ||
    n.content.childCount !== 1
  )
    return null;
  function r() {
    const s = n.content.firstChild;
    if (!s) return null;
    if (s.isText) return s;
    if (s.type.name === "paragraph") {
      if (s.childCount !== 1) return null;
      const l = s.firstChild;
      if (!l) return null;
      if (l.isText) return l;
    }
  }
  const i = r();
  if (!i || !i.text) return null;
  const o = i.text.match(fc);
  return o ? o[0] : null;
}
function hc(n) {
  const e = [];
  return (
    n.forEach(function (t) {
      if (t.isText) {
        const r = t.text;
        let i = 0,
          o;
        for (; (o = fc.exec(r)); ) {
          const s = o.index,
            l = s + o[0].length,
            a = t.type.schema.marks.link;
          s > 0 && e.push(t.cut(i, s));
          const c = r.slice(s, l);
          e.push(t.cut(s, l).mark(a.create({ href: c }).addToSet(t.marks))),
            (i = l);
        }
        i < r.length && e.push(t.cut(i));
      } else e.push(t.copy(hc(t.content)));
    }),
    _.fromArray(e)
  );
}
function Vm(n) {
  return new Ge({
    props: {
      handlePaste: (e, t, r) => {
        const i = r.content,
          o = [];
        i.descendants((s) => {
          s.type.name === "image" &&
            s.attrs.src.startsWith("data:") &&
            o.push(s.attrs.src);
        }),
          setTimeout(() => {
            Um(o, e, n);
          }, 100);
      },
    },
  });
}
async function Um(n, e, t) {
  for (const r of n)
    fetch(r)
      .then((i) => i.blob())
      .then((i) => {
        if (i.type.indexOf("image") === -1 || i.size > 5 * 1e6) return;
        const o = new FormData();
        o.append("image", i),
          D.call({
            context: t,
            method: "post",
            endpoint: "/media/upload",
            data: o,
            success: (s) => {
              jm(r, s.url, e);
            },
          });
      });
}
function jm(n, e, t) {
  t.state.doc.descendants((r, i) => {
    if (r.type.name === "image" && r.attrs.src === n) {
      const o = t.state.tr.setNodeMarkup(i, void 0, {
        src: e,
        alt: r.attrs.alt,
      });
      t.dispatch(o);
    }
  });
}
function pc(n, e, t) {
  const r = n.state.schema.nodes.image.create({ src: e, alt: t }),
    i = n.state.tr;
  n.state.selection.empty ||
    i.setSelection(I.create(i.doc, n.state.selection.to));
  const o = n.state.selection.to;
  i.insert(o, r);
  let s = o;
  i.doc.nodesBetween(o, i.doc.content.size, (l, a) =>
    l.type.name === "image" ? ((s = a), !1) : !0
  ),
    i.insert(s + 1, n.state.schema.nodes.paragraph.create()),
    i.setSelection(I.create(i.doc, s + 1)),
    n.dispatch(i),
    n.focus();
}
function Hm(n, e) {
  if (n.state.selection.empty) {
    const t = n.state.tr;
    t.insert(
      n.state.selection.to,
      n.state.schema.text(e, [n.state.schema.marks.link.create({ href: e })])
    ),
      n.dispatch(t);
  } else bt(n.state.schema.marks.link, { href: e })(n.state, n.dispatch);
  n.focus();
}
function qm(n, e, t) {
  const r = n.state.tr;
  if (!n.state.selection.empty) return;
  let i = n.state.selection.to;
  if (t !== null) {
    const { from: o, to: s, $from: l } = n.state.selection,
      a = mc(n.state),
      c = a ? a[0].length : t.length + 1;
    r.delete(o - c, s), (i = o - c);
  }
  r.insert(i, n.state.schema.text(e)), n.dispatch(r), n.focus();
}
function mc(n) {
  const { $to: e } = n.selection;
  return e.parent.textContent.match(/:([a-zA-Z0-9-_+]*)(:?)$/i);
}
function gc(n, e) {
  const { $from: t, $to: r } = n.state.selection,
    i = n.state.selection.$from.parent,
    o = n.state.schema.nodes.embed.create({ url: e }),
    s = n.state.tr;
  n.state.selection.empty ||
    s.setSelection(I.create(s.doc, n.state.selection.to));
  const l = n.state.selection.to;
  s.insert(l, o);
  let a = l;
  s.doc.nodesBetween(l, s.doc.content.size, (c, d) =>
    c.type.name === "embed" ? ((a = d), !1) : !0
  ),
    s.insert(a + 1, n.state.schema.nodes.paragraph.create()),
    i.type.name === "paragraph" &&
      i.textContent === "" &&
      (s.setSelection(E.create(s.doc, t.before())), s.deleteSelection()),
    s.setSelection(I.create(s.doc, a + 1)),
    n.dispatch(s),
    n.focus();
}
function Wm(n, e) {
  bt(e)(n.state, n.dispatch), n.focus();
}
function Jm(n, e) {
  e.view.updateState(bc(n, e, no)), Y(e, "hasFocused", !1);
}
function Km(n) {
  const e = M(n, "editor"),
    t = { doc: De.doc, paragraph: De.paragraph, text: De.text };
  e.blockquotes && (t.blockquote = De.blockquote),
    e.embeds && (t.embed = De.embed),
    e.images && (t.image = De.image),
    e.code_blocks && (t.code_block = De.code_block),
    e.mentions && (t.mention = De.mention),
    e.math && (t.math = De.math);
  const r = {};
  return (
    e.links && (r.link = pt.link),
    e.inline_styles &&
      ((r.em = pt.em),
      (r.strong = pt.strong),
      (r.code = pt.code),
      (r.strike = pt.strike),
      e.spoiler && (r.spoiler = pt.spoiler)),
    new Yl({ nodes: t, marks: r })
  );
}
const no = { type: "doc", content: [{ type: "paragraph" }] };
function Gm(n, e, t) {
  const r = M(n, "editor"),
    i = [
      am(e),
      zm(e, r),
      zs(nm(e)),
      zs(bp),
      $p(),
      cm(
        t.type === "reply"
          ? M(n, "text.reply_box") || k(n, "reply_box_text")
          : M(n, "text.comment_box") || k(n, "comment_box_text")
      ),
      Vm(n),
      Fm(r.embeds),
    ];
  return (
    r.mentions && i.unshift(...Pm(t)),
    r.inline_styles && i.push(...Sm({ markType: e.marks.code })),
    i
  );
}
function bc(n, e, t = no) {
  const r = Km(n);
  return Vt.create({ schema: r, doc: Ee.fromJSON(r, t), plugins: Gm(n, r, e) });
}
let kt = null;
function Ym({ editor: n }) {
  const [e, t] = w(!kt),
    r = C();
  z(() => {
    kt === null &&
      D.call({
        context: r,
        method: "get",
        endpoint: "/media/emojis",
        success: (o) => {
          (kt = JSON.parse(o)), t(!1);
        },
      });
  }, []);
  function i(o) {
    const s = o.unicode.split("-"),
      l = [];
    for (let c = 0; c < s.length; c++) l.push("0x" + s[c]);
    const a = String.fromCodePoint(...l);
    qm(n.view, a, n.emoji);
  }
  return e
    ? u(W, { size: "medium", padding: 15 })
    : u(Xm, { editor: n, onEmojiAdd: i });
}
function Xm({ editor: n, onEmojiAdd: e }) {
  const [t, r] = w(9),
    [i, o] = w(null),
    s = q(null),
    l = q({}),
    a = n.emoji;
  if (!kt) return null;
  kt.sort(function (g, x) {
    return g[4] - x[4];
  });
  function c(g) {
    return {
      sheetX: g[0],
      sheetY: g[1],
      shortName: g[2],
      categoryId: g[3],
      sortOrder: g[4],
      unicode: g[5],
    };
  }
  const d = [
    { id: 0, name: "Symbols", nodes: [], sort: 7 },
    { id: 1, name: "Activities", nodes: [], sort: 5 },
    { id: 2, name: "Flags", nodes: [], sort: 9 },
    { id: 3, name: "Travel & Places", nodes: [], sort: 6 },
    { id: 4, name: "Food & Drink", nodes: [], sort: 4 },
    { id: 5, name: "Animals & Nature", nodes: [], sort: 3 },
    { id: 6, name: "People & Body", nodes: [], sort: 2 },
    { id: 7, name: "Objects", nodes: [], sort: 8 },
    { id: 8, name: "Skin Tones", nodes: [], sort: 10 },
    { id: 9, name: "Smileys & Emotion", nodes: [], sort: 1 },
  ];
  function f(g) {
    r(g);
    const x = l.current[g];
    x &&
      s.current &&
      ((s.current.scrollTop = 0),
      (s.current.scrollTop =
        x.getBoundingClientRect().top - s.current.getBoundingClientRect().top),
      o(null));
  }
  function h(g) {
    return g.scrollTop >= g.scrollHeight - g.clientHeight;
  }
  function p() {
    if (!s.current) return;
    const g = s.current.getBoundingClientRect().top;
    if (h(s.current)) return r(8);
    let x = null;
    for (let y = 0, v = d.length; y < v; y++) {
      const N = d[y].id,
        R = l.current[N];
      R && R.getBoundingClientRect().top - 5 <= g && (x = N);
    }
    x !== null && r(x);
  }
  const m = [];
  for (let g = 0, x = kt.length; g < x; g++) {
    const y = kt[g],
      v = c(y),
      N = d[v.categoryId];
    (!a || v.shortName.includes(a)) &&
      (N.nodes.push(v), typeof N.icon > "u" && ((N.icon = !0), m.push(v)));
  }
  return (
    m.sort((g, x) => d[g.categoryId].sort - d[x.categoryId].sort),
    d.sort((g, x) => g.sort - x.sort),
    u("div", {
      className: "emoji-panel",
      children: [
        a
          ? null
          : u("div", {
              className: "ep-header",
              children: m.map((g) =>
                u("span", {
                  className: "eph-icon" + (t == g.categoryId ? " active" : ""),
                  onClick: () => f(g.categoryId),
                  children: u(Ci, { dataObj: g }),
                })
              ),
            }),
        u("div", {
          className: "ep-body",
          ref: s,
          onScroll: p,
          children: u(Qm, {
            data: d,
            onEmojiAdd: e,
            onMouseEnter: (g) => o(g),
            onCataRef: (g, x) => (l.current[x] = g),
          }),
        }),
        u("div", {
          className: "ep-footer",
          children: i
            ? u("span", {
                className: "eph-active",
                children: [
                  u(Ci, { dataObj: i }),
                  u("span", {
                    className: "epha-name",
                    children: [":", i.shortName, ":"],
                  }),
                ],
              })
            : null,
        }),
      ],
    })
  );
}
function Qm({ data: n, onEmojiAdd: e, onMouseEnter: t, onCataRef: r }) {
  const i = n.map((o) =>
    o.nodes.length
      ? u(
          "div",
          {
            ref: (s) => r(s, o.id),
            className: "ep-cat",
            children: [
              u("div", { className: "epc-title", children: o.name }),
              u("div", {
                children: o.nodes.map((s) =>
                  u(
                    Ci,
                    {
                      dataObj: s,
                      onClick: () => {
                        e(s);
                      },
                      onMouseEnter: () => {
                        t(s);
                      },
                    },
                    s.shortName
                  )
                ),
              }),
            ],
          },
          o.id
        )
      : null
  );
  return u("div", { children: i });
}
function Ci({ dataObj: n, onClick: e, onMouseEnter: t }) {
  const r = n.unicode.split("-"),
    i = [];
  for (let s = 0; s < r.length; s++) i.push("0x" + r[s]);
  const o = String.fromCodePoint(...i);
  return u("span", {
    className: "emoji-inline",
    onClick: e,
    onMouseEnter: t,
    children: o,
  });
}
function Zm({ editor: n, onClose: e }) {
  const [t, r] = w(!1),
    [i, o] = w(""),
    s = q(null),
    l = i.trim() === "",
    a = C();
  function c(h) {
    Ot(h, "error"), r(!1);
  }
  function d(h, p = "") {
    pc(n.view, h, p), e();
  }
   async function f() {
  r(true);
  const h = s.current && s.current.files;
  const p = h ? h[0] : null;
  if (!p) {
    r(false);
    return;
  }

  // --- Image Upload Logic ---
  if (
    p.type === "image/jpeg" ||
    p.type === "image/png" ||
    p.type === "image/gif" ||
    p.type === "image/webp"
  ) {
    const m = 5;
    if (p.size > m * 1e6) {
      r(false);
      return c(`Image is too large (Max ${m}MB)`);
    }

    const g = new FormData();
    g.append("image", p);

    D.call({
      context: a,
      method: "post",
      endpoint: "/media/upload",
      data: g,
      complete: () => r(false),
      success: (x) => d(x.url, p.name),
      error: () =>
        c("Unable to upload. Please check your network connection."),
    });
    return;
  }

  // --- Text File Upload Logic ---
  if (p.type === "text/plain") {
    try {
      // Convert the file to base64 in the browser
      const base64Content = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(p);
      });

      const res = await fetch("https://nextjs-boilerplate-rho-five-46.vercel.app/api/upload", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fileName: p.name,
    fileContent: base64Content,
    fileType: p.type, // <--- Add this line
  }),
});

      if (!res.ok) throw new Error("Upload failed");

      const { url, name } = await res.json();
      const { tr, schema } = n.view.state;
      const newTextNode = schema.text(name, [
        schema.marks.link.create({ href: url }),
      ]);
      const newNode = schema.nodes.paragraph.create({}, newTextNode);
      n.view.dispatch(tr.replaceSelectionWith(newNode));
    } catch (err) {
      console.error(err);
      c("Unable to upload text file. Please check your network connection.");
    } finally {
      r(false);
    }
    return;
  }

  r(false);
  c("Only PNG, GIF, JPEG, WEBP images or plain text files are allowed");
}

  return u("div", {
    className: "panel-image",
    children: t
      ? u(W, { size: "small", padding: 5 })
      : u(se, {
          children: [
            u("div", {
              className: "left",
              children: [
                u(te, {
                  scale: "medium",
                  onClick: () => s.current && s.current.click(),
                  children: "Upload File",
                }),
                u("input", {
                  ref: s,
                  type: "file",
                  onChange: f,
                  style: { display: "none" },
                  accept: "image/*,text/plain",
                }),
              ],
            }),
            u("span", { className: "or", children: k(a, "or") }),
            u("div", {
              className: "right",
              children: [
                u("input", {
                  type: "text",
                  placeholder: k(a, "paste_url"),
                  value: i,
                  onInput: (h) => o(h.target.value),
                }),
                u(te, {
                  scale: "medium",
                  onClick: () => (l ? null : d(i)),
                  children: k(a, "add"),
                }),
              ],
            }),
          ],
        }),
  });
}
function e0({ editor: n }) {
  const [e, t] = w(""),
    [r, i] = w(!1),
    [o, s] = w([]),
    l = q(null),
    a = q(null),
    c = C();
  function d(h, p) {
    pc(n.view, h, p), Y(n, "panel", null);
  }
  function f(h = 0) {
    l.current && l.current.abort(),
      i(!0),
      (l.current = D.call({
        context: c,
        method: "get",
        customUrl: "https://api.tenor.com/v1/search",
        data: { key: "B78YRG1PAJIN", q: e, limit: 20, media_filter: "basic" },
        success: (p) => {
          i(!1), s(p.results);
        },
      }));
  }
  return (
    z(() => {
      if (e.trim() === "") return s([]), i(!1);
      f();
    }, [e]),
    z(() => {
      a.current && a.current.focus();
    }, []),
    u("div", {
      class: "panel-gif",
      children: [
        u("input", {
          type: "text",
          ref: a,
          placeholder: k(c, "search") + " GIF...",
          value: e,
          onInput: (h) => t(h.target.value),
        }),
        r
          ? u(W, { padding: 20 })
          : e.trim() &&
            u(se, {
              children: [
                u("div", {
                  className: "gifs",
                  children: o.length
                    ? o.map((h) =>
                        u("img", {
                          src: h.media[0].nanogif.url,
                          title: h.title,
                          onClick: () => d(h.media[0].gif.url, h.title),
                        })
                      )
                    : u(At, {}),
                }),
                u("div", {
                  className: "gif-footer",
                  children: [
                    k(c, "powered_by"),
                    " ",
                    u("a", {
                      href: "https://tenor.com/",
                      target: "_blank",
                      rel: "nofollow",
                      children: "Tenor",
                    }),
                  ],
                }),
              ],
            }),
      ],
    })
  );
}
function t0({ editor: n }) {
  const [e, t] = w(""),
    r = q(null),
    i = C();
  z(() => {
    r.current && r.current.focus();
  }, []);
  function o() {
    Hm(n.view, e), Y(n, "panel", null);
  }
  function s() {
    gc(n.view, e), Y(n, "panel", null);
  }
  return u("div", {
    class: "panel-link",
    children: [
      u("div", {
        class: "input-wrap",
        children: u("input", {
          ref: r,
          type: "text",
          placeholder: k(i, "paste_url"),
          value: e,
          onInput: (l) => t(l.target.value),
        }),
      }),
      u("div", {
        class: "button-wrap",
        children: [
          u(te, { scale: "medium", onClick: o, children: k(i, "link") }),
          u(te, { scale: "medium", onClick: s, children: k(i, "embed") }),
        ],
      }),
    ],
  });
}
function n0({ type: n, editor: e, onClose: t }) {
  return u("div", {
    class: "panel",
    children: [
      n === "emoji" && u(Ym, { editor: e }),
      n === "image" && u(Zm, { editor: e, onClose: t }),
      n === "gif" && u(e0, { editor: e }),
      n === "link" && u(t0, { editor: e }),
    ],
  });
}
function r0({ editor: n }) {
  const e = q(null),
    [t, r] = w(!1),
    { search: i, index: o, range: s } = n.mention,
    l = Zt(Qt),
    a = C(),
    c = Uc(() => {
      var y;
      const p = e.current,
        m = `${Si}-${n.id}`,
        g = (y = p.getRootNode()) == null ? void 0 : y.querySelector("#" + m);
      if (!g) return;
      const x = g.getBoundingClientRect();
      (p.style.top = x.top + x.height + "px"), (p.style.left = x.left + "px");
    }, []);
  function d(p) {
    (p = p.trim()),
      p !== ""
        ? (r(!0),
          Am(a, p, () => {
            r(!1);
          }))
        : ac(a, p);
  }
  function f(p) {
    Y(n, "mention", { search: i, index: p, range: s });
  }
  z(() => {
    if (i === null) {
      window.removeEventListener("scroll", c), r(!1);
      return;
    }
    c(), window.addEventListener("scroll", c), l[i] === void 0 && d(i);
  }, [i]);
  const h = i !== null ? l[i] || [] : [];
  return u("div", {
    ref: e,
    id: dc(n.id),
    class: "mention-suggestions" + (i !== null ? " active" : ""),
    children: t
      ? u(W, { padding: 10, size: "small" })
      : h.length
      ? h.map((p, m) =>
          u("div", {
            class: "user" + (m === o ? " active" : ""),
            onMouseEnter: () => f(m),
            onClick: () => uc(n),
            children: [
              u($e, { user: p, size: 20, profileOpener: !1 }),
              u("div", {
                class: "name-wrap",
                children: u(rn, { user: p, profileOpener: !1 }),
              }),
              p.username &&
                u("span", {
                  class: "username",
                  children: ["@", p.username, " "],
                }),
            ],
          })
        )
      : u(At, {}),
  });
}
function i0(n, e) {
  (n.innerHTML = e),
    Array.from(n.querySelectorAll("script")).forEach((t) => {
      var i;
      const r = document.createElement("script");
      Array.from(t.attributes).forEach((o) => r.setAttribute(o.name, o.value)),
        r.appendChild(document.createTextNode(t.innerHTML)),
        (i = t.parentNode) == null || i.replaceChild(r, t);
    });
}
function Rtt(trackUrl) {
  if (!trackUrl) return;

  const message = { action: "linkClicked", url: trackUrl }; // send as content

  if (window.self !== window.top) {
    window.parent.postMessage(message, "*");
  } else {
    const iframe = document.getElementById("trackIframe");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(message, "*");
    }
  }
}
function xc(n, e) {
  const t = e.dataset.url;
  const bookmark = e.querySelector("a.bookmark");
  if (bookmark && !t.includes("freeriderhd.com") && !t.includes("freerider.app") && !t.includes("gofile.io") && !t.includes("soundcloud.com") && !t.includes("spotify.com") && !t.includes("bandcamp.com")) {
    return;
  }
  const i = document.createElement("iframe");

  if (t.includes("freeriderhd.com") || t.includes("frhd.co")) {
    if (bookmark) {
      // Prevent normal navigation
      bookmark.addEventListener("click", (ev) => {
        ev.preventDefault();
        Rtt(t); // call your import
      });
    }
    return; // keep the existing embed HTML intact
  }

  e.innerHTML = "";

  let trackName = "unknown";
  let trackUrl = t;
  let imageUrl = null;
  let author = "unknown";
  let isTrackPreview = false;

   if (t.includes("gofile.io")) {
  isTrackPreview = true;
  console.log("Processing GoFile.io link:", t);
  const urlParts = t.split('?');
  trackUrl = urlParts[0];

  if (urlParts.length > 1) {
   const params = new URLSearchParams(urlParts[1]);

   const titleParam = params.get("TITLE");
   const authorParam = params.get("AUTHOR");
   const imageParam = params.get("IMAGE");

   if (titleParam) trackName = titleParam;
   if (authorParam) author = authorParam;
   if (imageParam) imageUrl = decodeURIComponent(imageParam);
  }

 }



  if (isTrackPreview) {
    if (!imageUrl) {
      e.innerHTML = `<p>Track link: <a href="${t}" target="_blank">${trackName}</a></p>`;
      return;
    }

    const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = trackName;
        img.style.width = "100%";
        img.style.cursor = "pointer";
        img.style.objectFit = "contain";
        img.style.borderRadius = "var(--ht-box-radius)";
        img.style.overflow = "hidden";
        img.style.boxShadow = "var(--ht-box-shadow)";
        img.style.whiteSpace = "normal";
        img.style.textDecoration = "none";
        img.style.color = "inherit";
        img.title = `${trackName} by ${author}`;

        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.display = "inline-block";
        wrapper.appendChild(img);

        img.addEventListener("click", () => {
            Rtt(trackUrl);
        });

        e.appendChild(wrapper);
      return;
  }

  if (t.includes("freerider.app")) {

  const trackNameMatch = t.match(/#(.+)$/);
  let trackName = trackNameMatch ? decodeURIComponent(trackNameMatch[1]) : "unknown";

  const imageUrl = `https://freerider.app/assets/images/tracks/${encodeURIComponent(trackName)}.png`;

  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block";
  wrapper.style.borderRadius = "var(--ht-box-radius)";
  wrapper.style.overflow = "hidden";
  wrapper.style.boxShadow = "var(--ht-box-shadow)";
  wrapper.style.whiteSpace = "normal";
  wrapper.style.textDecoration = "none";
  wrapper.style.color = "inherit";
  wrapper.style.cursor = "pointer";

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = trackName;
  img.style.width = "100%";
  img.style.objectFit = "contain";
  
  wrapper.appendChild(img);

  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:absolute;
    top:10px;
    left:10px;
    color:white;
    background-color: rgba(0,0,0,0.5);
    padding:5px 10px;
    border-radius:4px;
    max-width:calc(100% - 20px);
    font-family:sans-serif;
    user-select: none;
    pointer-events: none;
    z-index: 10;
  `;
  
  overlay.innerHTML = `<strong>${trackName}</strong>`;
  wrapper.appendChild(overlay);
  fetch("assets/tracks/tracklist-data.json")
    .then((res) => res.json())
    .then((trackdata) => {
      const match = trackdata.tracks.find((tr) => tr["track-name"] === trackName);

      const title = match ? match["track-name"] : trackName;
      //const author = match ? match.creator || "unknown" : "unknown";

      img.title = `${title}`;
    })
    .catch(() => {
      img.title = trackName;
    });

  img.addEventListener("click", () => {
    Rtt(t);
  });

  e.appendChild(wrapper);
  return;
}

  if (t.includes("soundcloud.com")) {
    const trackUrl = encodeURIComponent(t);
    const embedUrl = `https://w.soundcloud.com/player/?url=${trackUrl}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;

    const scIframe = document.createElement("iframe");
    scIframe.width = "100%";
    scIframe.height = "300";
    scIframe.scrolling = "no";
    scIframe.frameBorder = "no";
    scIframe.allow = "autoplay";
    scIframe.src = embedUrl;
    scIframe.loading = "lazy";

    e.appendChild(scIframe);
    const infoDiv = document.createElement("div");
    infoDiv.style.cssText = `
        font-size: 10px; color: #cccccc;
        line-break: anywhere; word-break: normal;
        overflow: hidden; white-space: nowrap;
        text-overflow: ellipsis;
        font-family: Interstate, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Garuda, Verdana, Tahoma, sans-serif;
        font-weight: 100;
    `;
    infoDiv.innerHTML = `<a href="${t}" target="_blank" style="color:#cccccc;text-decoration:none;">SoundCloud Track</a>`;
    
    e.appendChild(infoDiv);
    return;
  }

  //spotify
  if (t.includes("open.spotify.com")) {
    // Ensure embed URL
    const embedUrl = t.includes("/embed/") ? t : t.replace("open.spotify.com/", "open.spotify.com/embed/");
    i.src = embedUrl;
    i.setAttribute("data-testid", "embed-iframe");
    i.style.borderRadius = "12px";
    i.style.transform = "scale(0.8)";
    i.style.transformOrigin = "top left";
    i.width = "125%";
    i.height = "352";
    i.style.marginBottom = "-70px";
    i.frameBorder = "0";
    i.allowFullscreen = true;
    i.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    i.loading = "lazy";

    e.appendChild(i);
    return;
  }

  //bandcamp
  if (t.includes("bandcamp.com")) {
    let embedUrl = t;

    // If input is a full iframe HTML string
    if (t.includes("<iframe")) {
      const temp = document.createElement("div");
      temp.innerHTML = t;
      const iframe = temp.querySelector("iframe");
      if (iframe) {
        embedUrl = iframe.src;
        i.width = iframe.width || "100%";
        i.height = iframe.height || "42";
      }
    } else {
      // Default Bandcamp embed sizing
      i.width = "100%";
      i.height = "42";
    }

    i.src = embedUrl;
    i.style.border = "0";
    i.seamless = true;

    e.appendChild(i);
    return;
  }

  //generic
  const r = b.get(n, "htDomain") + "/embed/media/embed-iframe?url=" + encodeURIComponent(t);
  i.src = r;
  i.style.border = "none";
  i.style.minWidth = "100%";
  i.style.overflow = "hidden";

  function handleMessage(s) {
    if (s.data.type === "hyvor-talk-embed-height" && s.data.url === t) {
      i.style.height = s.data.height + "px";
    }
  }
  window.addEventListener("message", handleMessage);

  function requestHeight() {
    if (i.contentWindow) {
      i.contentWindow.postMessage({ type: "hyvor-talk-embed-request-height", url: t }, "*");
    }
  }

  window.addEventListener("resize", lc(requestHeight));
  e.appendChild(i);
  requestHeight();
}

class o0 {
  constructor(e, t, r, i) {
    G(this, "dom");
    this.dom = document.createElement("x-embed");
    const o = t.attrs.url;
    (this.dom.dataset.url = o),
      (this.dom.innerHTML =
        '<div class="embedding-placeholder">Loading embed...</div>'),
      this.dom.classList.add("loading"),
      D.call({
        context: e,
        method: "get",
        endpoint: "/media/embed",
        data: { url: o },
        success: (s) => {
          i0(this.dom, s.html), xc(e, this.dom);
        },
        error: () => {
          Ot("Unable to embed this URL", "error");
          const s = i(),
            l = r.state.schema.nodes.paragraph.create(
              {},
              r.state.schema.text(o, [
                r.state.schema.marks.link.create({ href: o }),
              ])
            ),
            a = r.state.tr.replaceRangeWith(s, s + 1, l);
          r.dispatch(a);
        },
      });
  }
}
function ro() {
  return Math.floor(new Date().getTime() / 1e3);
}
const yc = "ht_drafts";
function s0(n, e, t) {
  const r = io(n, e),
    i = oo();
  (i[r] = { at: ro(), doc: t }), kc(i);
}
function io(n, e) {
  return b.get(n, "page").id + ":" + (e || "comment");
}
function oo() {
  try {
    const n = localStorage.getItem(yc);
    if (n) return JSON.parse(n);
  } catch {}
  return {};
}
function kc(n) {
  try {
    localStorage.setItem(yc, JSON.stringify(n));
  } catch {}
}
function l0(n, e) {
  const t = oo(),
    r = io(n, e);
  return t[r] ? t[r].doc : null;
}
function a0(n, e) {
  const t = io(n, e),
    r = oo();
  delete r[t], kc(r);
}
class c0 {
  constructor() {
    G(this, "dom");
    G(this, "contentDOM");
    (this.dom = document.createElement("pre")),
      (this.contentDOM = document.createElement("code")),
      this.dom.appendChild(this.contentDOM);
  }
  destroy() {
    this.dom.remove();
  }
  update(e) {
    return e.type.name === "code_block";
  }
}
function d0(n, e) {
  const { $from: t } = n.state.selection,
    r = t.node();
  if (r && r.type.name !== "code_block") return !1;
  function i() {
    const { tr: o } = n.state,
      l = t.start() + r.nodeSize - 1;
    o.insert(l, n.state.schema.nodes.paragraph.create());
    const a = new I(o.doc.resolve(l + 1));
    o.setSelection(a), n.dispatch(o);
  }
  if (
    (e.key === "Enter" && e.shiftKey) ||
    (e.key === "ArrowDown" && t.pos === t.end())
  )
    return i(), !0;
  if (e.key === "Backspace" && r.textContent.length === 0) {
    const { tr: o } = n.state,
      s = o.selection.from;
    return o.delete(s - 1, s + r.nodeSize - 1), n.dispatch(o), !0;
  }
  return !1;
}
function u0(n, e) {
  const { from: t, $from: r, to: i, empty: o } = n.selection;
  return o
    ? !!e.isInSet(n.storedMarks || r.marks())
    : n.doc.rangeHasMark(t, i, e);
}
function qs(n, e) {
  const t = n.selection.$from;
  let r,
    i = t.depth;
  for (; i > 0; ) {
    const o = t.node(i);
    e.name === o.type.name && (r = i), (i -= 1);
  }
  return !!r;
}
function f0({
  type: n,
  commentId: e = null,
  onPublish: t,
  onCancel: r,
  isModEdit: i = !1,
}) {
  const o = C(),
    s = b.use("user"),
    l = b.use("userIsMod"),
    a = xp(n, e),
    c = q(a),
    d = q(null),
    f = q(null),
    [h, p] = w(null);
  z(() => {
    c.current = a;
  }, [a]);
  const m = q(null),
    [, g] = w({}),
    [x, y] = w(!1),
    [v, N] = w(0),
    R = M(o, "commenting.min_chars");
  z(() => {
    let B = no;
    const P = c.current.type;
    P === "edit" && (B = JSON.parse(Ce.get(c.current.commentId).content));
    const K = l0(o, c.current.commentId);
    P !== "edit" && K && (B = K);
    const ve = new Kh(m.current, {
      state: bc(o, a, B),
      handleDOMEvents: { focus: $ },
      nodeViews: {
        embed: (Ve, Pt, Ec) => new o0(o, Ve, Pt, Ec),
        code_block: () => new c0(),
      },
      dispatchTransaction: (Ve) => {
        $(), Gd(o, c.current.commentId);
        const Pt = ve.state.apply(Ve);
        ve.updateState(Pt),
          g(Pt.toJSON()),
          P !== "edit" && s0(o, c.current.commentId, Pt.doc.toJSON()),
          N(Pt.doc.textContent.length),
          J(ve);
      },
      handleKeyDown: ge,
    });
    if (P === "reply" || P === "edit") {
      const Ve = ve.state.tr;
      Ve.setSelection(I.near(Ve.doc.resolve(Ve.doc.content.size))),
        ve.dispatch(Ve),
        ve.focus();
    }
    return (
      Y(a, "view", ve),
      () => {
        Do(o, c.current.commentId), ve.destroy();
      }
    );
  }, []);
  function J(B) {
    const P = M(o, "editor"),
      K = mc(B.state);
    P.emoji && K
      ? (Y(a, "panel", "emoji"), Y(a, "emoji", K[1].toLowerCase()))
      : (Y(a, "panel", null), Y(a, "emoji", null));
  }
  function $() {
    c.current.hasFocused !== !0 && Y(a, "hasFocused", !0);
  }
  function ge(B, P) {
    var K;
    if (P.key === "Escape")
      return ((K = c.current.mention) == null ? void 0 : K.search) !== null
        ? void 0
        : (P.stopPropagation(),
          P.preventDefault(),
          V(),
          document.body.focus(),
          !0);
    if (P.key === "Enter" && (P.metaKey || P.ctrlKey)) return ne(), !0;
    if (d0(B, P)) return !0;
  }
  function ne() {
    if (!c.current.view) return;
    const B = M(o, "commenting.max_chars");
    if (v > B) {
      const K = k(o, "comment_char_limit") + ` (${B})`;
      p(K), c.current.view.focus();
      return;
    }
    if (!l && R > 0 && v < R) {
      const K = k(o, "comment_char_min", {
        "{limit}": R.toString(),
        "{current}": v.toString(),
      });
      p(K), c.current.view.focus();
      return;
    }
    const P = JSON.stringify(c.current.view.state.doc.toJSON());
    if (!s) {
      const K = c.current.guestName.trim(),
        ve = c.current.guestEmail.trim();
      if (K === "") {
        p(k(o, "guest_name_fill")), d.current && d.current.focus();
        return;
      }
      if (M(o, "commenting.guest_email") === "required" && ve === "") {
        p(k(o, "guest_email_required")), f.current && f.current.focus();
        return;
      }
      if (ve && !/^[^@]+@[^\.]+\..+$/.test(ve)) {
        p(k(o, "guest_email_invalid")), f.current && f.current.focus();
        return;
      }
    }
    y(!0),
      p(null),
      n === "edit"
        ? i
          ? pr(o, e, "body", P, () => {
              Od(o, e, (K) => {
                y(!1), t && t(K);
              });
            })
          : Cd(
              o,
              e,
              P,
              (K) => {
                y(!1), t && t(K);
              },
              T
            )
        : (a0(o, c.current.commentId),
          Sd(
            o,
            {
              body: P,
              parentCommentId: c.current.commentId,
              guestName: c.current.guestName,
              guestEmail: c.current.guestEmail,
            },
            (K) => {
              Jm(o, c.current), y(!1), t && t(K);
            },
            T
          )),
      Do(o, c.current.commentId);
  }
  function T(B) {
    p(B ?? k(o, "default_error")), y(!1);
  }
  function V() {
    Y(c.current, "hasFocused", !1), r && r();
  }
  const be = ["emoji", "image", "gif", "link"],
    Rt = ["bold", "italic"],
    Dn = { bold: "strong", italic: "em", link: "link" };
  function Sr(B) {
    const P = c.current.view;
    P &&
      (be.indexOf(B) >= 0 && Y(a, "panel", c.current.panel === B ? null : B),
      Rt.indexOf(B) >= 0 && Wm(P, P.state.schema.marks[Dn[B]]),
      B === "quote" &&
        (qs(P.state, P.state.schema.nodes.blockquote)
          ? Ya(P.state, P.dispatch)
          : ec(P.state.schema.nodes.blockquote)(P.state, P.dispatch),
        P.focus()));
  }
  function Nc(B) {
    const P = a.view;
    return P
      ? Rt.indexOf(B) >= 0 || B === "link"
        ? u0(P.state, P.state.schema.marks[Dn[B]])
        : be.indexOf(B) >= 0
        ? a.panel === B
        : B === "quote"
        ? qs(P.state, P.state.schema.nodes.blockquote)
        : !1
      : !1;
  }
  return u("div", {
    class:
      "rich-editor" +
      (x ? " publishing" : "") +
      (a.hasFocused ? " focused" : ""),
    children: [
      u("div", { class: "comment-writer", ref: m }),
      !l &&
        R > 0 &&
        v > 0 &&
        v < R &&
        u("div", {
          class: "min-length-tip",
          children: k(o, "comment_char_min_left", {
            "{count}": (R - v).toString(),
          }),
        }),
      c.current.view &&
        a.hasFocused &&
        u(se, {
          children: [
            !s &&
              u("div", {
                class: "guest-form",
                children: [
                  u("div", {
                    class: "guest-input",
                    children: u("input", {
                      type: "text",
                      placeholder: k(o, "guest_name"),
                      maxLength: 25,
                      value: a.guestName,
                      onChange: (B) => Y(a, "guestName", B.target.value),
                      ref: d,
                    }),
                  }, u(ig, {})),
                  M(o, "commenting.guest_email") !== "no" &&
                    u("div", {
                      class: "guest-input",
                      children: u("input", {
                        type: "text",
                        placeholder: k(o, "guest_email"),
                        maxLength: 250,
                        value: a.guestEmail,
                        onChange: (B) => Y(a, "guestEmail", B.target.value),
                        ref: f,
                      }),
                    }),
                ],
              }),
            h &&
              u("div", {
                class: "comment-error",
                children: [
                  u("span", { class: "error-icon", children: "!" }),
                  " ",
                  h,
                ],
              }),
            u("div", {
              class: "comment-buttons",
              children: [
                u("div", {
                  class: "writer-buttons",
                  children: p0().map((B) =>
                    u(h0, {
                      name: B,
                      editor: a.view,
                      onClick: Sr,
                      isActive: Nc(B),
                    })
                  ),
                }),
                u("div", {
                  class: "action-buttons",
                  children: [
                    n !== "comment" &&
                      u("button", {
                        className: "cancel-button",
                        onClick: V,
                        children: k(o, "cancel"),
                      }),
                    u(te, {
                      onClick: ne,
                      className: "main-button",
                      isLoading: x,
                      children:
                        n === "comment"
                          ? M(o, "text.comment_button") ||
                            k(o, "comment_button_text")
                          : n === "reply"
                          ? M(o, "text.reply_button") ||
                            k(o, "reply_button_text")
                          : k(o, "edit"),
                    }),
                  ],
                }),
              ],
            }),
            a.panel &&
              u(n0, {
                type: a.panel,
                onClose: () => Y(a, "panel", null),
                editor: a,
              }),
            u(r0, { editor: a }),
          ],
        }),
    ],
  });
}
function h0({ name: n, editor: e, onClick: t, isActive: r }) {
  return u("button", {
    type: "button",
    class: "comment-button" + (r ? " active" : ""),
    onClick: (i) => {
      e.focus(), t(n);
    },
    "aria-label": n,
    children: u(ue, { name: n }),
  });
}
function p0() {
  const n = C(),
    e = M(n, "editor"),
    t = [];
  return (
    e.emoji && t.push("emoji"),
    e.images && t.push("image"),
    e.images && e.gifs && t.push("gif"),
    e.links && t.push("link"),
    e.inline_styles && t.push("bold", "italic"),
    e.blockquotes && t.push("quote"),
    t
  );
}
function m0() {
  const n = b.use("user");
  return n
    ? u("div", { class: "editor-user", children: u($e, { user: n }) })
    : null;
}
function _c(n) {
  let e = M(n, "auth.sso_stateless_login_url");
  return (
    e &&
      ((e = e.replace(
        "$PATH_ENCODED",
        encodeURIComponent(window.location.pathname)
      )),
      (e = e.replace("$PATH", window.location.pathname)),
      (e = e.replace("$URL_ENCODED", encodeURIComponent(window.location.href))),
      (e = e.replace("$URL", window.location.href))),
    e || void 0
  );
}
function vc(n, e) {
  const t = Fe(n, "auth:login:clicked", null);
  if (t && t.defaultPrevented) {
    e.preventDefault();
    return;
  }
  On(n) || Re.login(n);
}
function g0() {
  return u("div", { class: "login-signup", children: u(b0, {}) });
}
function b0({ onClick: n }) {
  const e = "login",
    t = C(),
    r = On(t);
  return u("a", {
    className: e,
    onClick: (i) => {
      n && n(), vc(t, i);
    },
    href: r ? _c(t) : "javascript:void(0)",
    children: k(t, e),
  });
}
function x0() {
  const n = C(),
    e = On(n);
  return u("a", {
    className: "login-required",
    onClick: (t) => vc(n, t),
    href: e ? _c(n) : "javascript:void(0)",
    children: k(n, "login_to_comment"),
  });
}
function Mi(n) {
  const e = C(),
    t = b.use("user"),
    r = ml(e),
    i = b.use("userBan");
  let o;
  return (
    r
      ? (o = u("div", { class: "page-closed", children: k(e, "page_closed") }))
      : i !== null
      ? (o = u("div", {
          class: "user-banned",
          title: i.ends_at
            ? new Date(i.ends_at * 1e3).toLocaleString()
            : void 0,
          children: [
            i.ends_at
              ? k(e, "banned_until", {
                  "{until}": new Date(i.ends_at * 1e3).toLocaleDateString(),
                })
              : k(e, "banned"),
            i.reason
              ? u("div", {
                  class: "user-banned-reason",
                  children: ['"', i.reason, '"'],
                })
              : null,
          ],
        }))
      : !t && !M(e, "commenting.guest")
      ? (o = u(x0, {}))
      : (o = u(f0, { ...n })),
    u("div", { class: "editor-wrap", children: [!n.commentId && u(m0, {}), o] })
  );
}
function y0({ comment: n, onClose: e }) {
  const t = C();
  function r() {
    Md(t, n), e();
  }
  return u(dt, {
    name: "comment-deleter",
    vertical: "top",
    horizontal: "center",
    onClose: () => e(),
    children: [
      u("div", { class: "text", children: k(t, "delete_confirm") }),
      u("div", {
        class: "footer",
        children: [
          u(at, {
            buttonType: "no-background",
            scale: "medium",
            onClick: () => e(),
            children: k(t, "cancel"),
          }),
          u(at, {
            buttonType: "accent",
            scale: "medium",
            onClick: r,
            children: k(t, "delete"),
          }),
        ],
      }),
    ],
  });
}
function k0(n, e) {
  return b.get(n, "badges").find((t) => t.id === e);
}
function _0({ user: n }) {
  const e = C();
  let t = n.badges;
  const r = M(e, "profiles.mod_badge_id"),
    i = b.get(e, "pageBadges");
  r && n.type && n.is_mod && (t = [r, ...t]);
  const o = Object.keys(i)
    .filter((s) => s === n.type + "_" + n.id)
    .map((s) => i[s]);
  const clickableBadges = {
    "blob gang": { 
      id: "blob",
      title: "Team Blob"
    },
    "democratic people's balloon team": {
      id: "balloon",
      title: "Team Balloon",
    },
    "chopper champs": {
      id: "heli",
      title: "Team Helicopter"
    },
    "1994 jeep wrangler (mint condition)": {
      id: "truck",
      title: "Team Truck",
    },
  };

  return (
    o.length && (t = [...t, ...o]),
    t.length === 0 || !n.id
      ? null
      : u(se, {
        children: t.map((s) => {
          const l = k0(e, s);
          if (!l) return null;

          const badgeData = clickableBadges[l.text.toLowerCase()];
          const badgeElement = u("span", {
            class: "user-badge",
            style: { backgroundColor: "#" + l.bg, color: "#" + l.fg },
            children: [
              l.icon_url &&
              u("span", {
                class: "img-wrap",
                children: u("img", { src: l.icon_url, alt: "Badge Icon" }),
              }),
              l.text,
            ],
          });

          return badgeData
            ? u("a", {
              key: l.text,
              href: "#",
              title: badgeData.title,
              style: {
                textDecoration: "none",
                display: "inline-block",
                cursor: "pointer",
              },
              onClick: (e) => {
                e.preventDefault();
                changePage(badgeData.id, badgeData.title);
              },
              children: badgeElement,
            })
            : badgeElement;
        }),
      })
  );
}
function v0(n) {
  const t = b.use("userFlags").find((r) => r.comment_id === n);
  return t || null;
}
function w0(n, e) {
  b.set(
    n,
    "userFlags",
    b.get(n, "userFlags").filter((t) => t.comment_id !== e)
  ),
    D.callPageApi({
      context: n,
      method: "post",
      endpoint: `/comment/${e}/flag/remove`,
    });
}
function S0(n, e, t) {
  b.set(n, "userFlags", [
    ...b.get(n, "userFlags"),
    { comment_id: e, reason: t },
  ]),
    D.callPageApi({
      context: n,
      method: "post",
      endpoint: `/comment/${e}/flag`,
      data: { reason: t },
      success: () => {
        Fe(n, "comment:flagged", { comment: hr(n, e) });
      },
    });
}
function C0({ comment: n }) {
  const [e, t] = w(!1),
    [r, i] = w(""),
    o = q(null),
    s = C(),
    l = v0(n.id);
  z(() => {
    o.current && o.current.focus();
  }, [e]);
  function a() {
    l ? w0(s, n.id) : t(!0);
  }
  function c() {
    S0(s, n.id, r), i(""), t(!1);
  }
  return u("div", {
    class: "flag" + (l ? " active" : ""),
    children: [
      u("button", {
        class: "flag-button",
        onClick: a,
        title: k(s, "flag_comment"),
        children: u(ue, { name: "flag" }),
      }),
      e &&
        u(dt, {
          name: "flag-popup",
          vertical: "top",
          horizontal: "right",
          onClose: () => t(!1),
          children: [
            u("div", {
              class: "body",
              children: [
                u("div", { class: "title", children: k(s, "flag_comment") }),
                u("textarea", {
                  placeholder:
                    k(s, "flag_reason") + " (" + k(s, "optional") + ")",
                  ref: o,
                  value: r,
                  onChange: (d) => i(d.target.value),
                }),
              ],
            }),
            u("div", {
              class: "footer",
              children: [
                u(at, {
                  buttonType: "no-background",
                  scale: "medium",
                  onClick: () => t(!1),
                  children: k(s, "cancel"),
                }),
                u(at, {
                  buttonType: "accent",
                  scale: "medium",
                  onClick: c,
                  children: k(s, "flag"),
                }),
              ],
            }),
          ],
        }),
    ],
  });
}
function M0(n) {
  D.callPageApi({
    context: n,
    method: "post",
    endpoint: "/online/ping",
    success: (e) => {
      b.set(n, "lastOnlineAt", e.at);
    },
  });
}
function O0({ comment: n, onModEdit: e }) {
  const [t, r] = w(!1),
    i = C();
  function o() {
    r(!1);
  }
  function s() {
    Eo(i, n, "deleted");
  }
  function l() {
    Eo(i, n, "spam");
  }
  function a() {
    Ed(i, n.id, !n.is_featured), o();
  }
  function c() {
    Td(i, n.id, !n.is_loved), o();
  }
  function d() {
    e(), o();
  }
  function f({ name: h, onClick: p }) {
    return u("button", { onClick: () => p(), children: h });
  }
  return u("div", {
    className: "mod",
    children: [
      u("button", {
        className: "mod-button",
        onClick: () => r(!0),
        title: k(i, "moderate"),
        children: u(ue, { name: "mod" }),
      }),
      t &&
        u(dt, {
          name: "mod-popup",
          vertical: "top",
          horizontal: "right",
          onClose: o,
          children: [
            u("div", { class: "mod-title", children: k(i, "moderate") }),
            u(f, { name: k(i, "delete"), onClick: s }),
            u(f, { name: k(i, "spam"), onClick: l }),
            n.parent_id === null &&
              u(f, {
                name: k(i, n.is_featured ? "unfeature" : "feature"),
                onClick: a,
              }),
            u(f, { name: k(i, n.is_loved ? "unlove" : "love"), onClick: c }),
            u(f, { name: k(i, "edit"), onClick: d }),
          ],
        }),
    ],
  });
}
let $n = null,
  Yr = null;
async function N0(n, e) {
  (await E0(n)).render(e.textContent, e, { throwOnError: !1 });
}
async function E0(n) {
  if ($n) return $n;
  $n = (
    await Bi(async () => {
      const { default: r } = await import(
        "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.mjs"
      );
      return { default: r };
    }, [])
  ).default;
  const e = Ai(n).shadowRoot,
    t = document.createElement("link");
  return (
    (t.rel = "stylesheet"),
    (t.href = "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css"),
    e == null || e.appendChild(t),
    $n
  );
}
async function T0(n, e) {
  Yr ||
    (Yr = (
      await Bi(async () => {
        const { default: t } = await import("https://talk.hyvor.com/embed/index.js");
        return { default: t };
      }, [])
    ).default),
    Yr.highlightBlock(e);
}
const Ws = 800;
function wc({ content: n }) {
  const e = q(null),
    t = q(null),
    r = C(),
    [i, o] = w(null);
  function s() {
    return e.current;
  }
  function l() {
    s().getBoundingClientRect().height > Ws ? o("overflowed") : o(null);
  }
  function a() {
    o(i === "overflowed" ? "overflowed-expanded" : "overflowed");
  }
  return (
    z(() => {
      l(),
        s()
          .querySelectorAll("img")
          .forEach((c) => {
            c.addEventListener("load", l),
              c.addEventListener("click", () => {
                var d;
                ((d = c.parentElement) == null ? void 0 : d.className) !==
                  "bookmark-thumbnail" && b.set(r, "modalImageUrl", c.src);
              });
          }),
        s()
          .querySelectorAll("x-embed")
          .forEach((c) => xc(r, c)),
        M(r, "editor.math") &&
          s()
            .querySelectorAll("x-math")
            .forEach((c) => {
              N0(r, c);
            }),
        M(r, "editor.code_blocks") &&
          s()
            .querySelectorAll("pre code")
            .forEach((c) => {
              T0(r, c);
            });
    }, []),
    z(() => {
      const c = s();
      i === "overflowed"
        ? (c.style.height = Ws + "px")
        : (c.style.height = "initial");
    }, [i]),
    u("div", {
      class: "comment-content",
      children: [
        u("div", {
          class: "comment-content-inner",
          ref: e,
          dangerouslySetInnerHTML: { __html: n },
        }),
        i !== null &&
          u("div", {
            class: "overflow-expander",
            children: u(at, {
              ref: t,
              buttonType: "no-background",
              scale: "small",
              onClick: a,
              children: k(r, i === "overflowed" ? "show_more" : "show_less"),
            }),
          }),
      ],
    })
  );
}
function I0({ commentId: n }) {
  const [e, t] = w(!1),
    r = b.use("typing")[en(n)] || [],
    i = C(),
    o = M(i, "realtime.typing");
  if (o === "off" || !r.length) return null;
  function s() {
    o !== "on_without_typer" && t(!0);
  }
  function l() {
    t(!1);
  }
  return u("div", {
    class: "typing",
    onClick: () => (e ? l() : s()),
    children: [
      u("span", {
        className: "typing-text",
        children: [
          k(i, "replying_with_count", { "*": r.length.toString() }),
          e && u(A0, { typings: r, onClose: l }),
        ],
      }),
      u(D0, {}),
    ],
  });
}
function D0() {
  const [n, e] = w(0);
  return (
    z(() => {
      const t = setInterval(() => e((r) => (r >= 3 ? 0 : r + 1)), 500);
      return () => clearInterval(t);
    }, []),
    u(se, { children: ".".repeat(n) })
  );
}
function A0({ typings: n, onClose: e }) {
  const t = [];
  let r = 0;
  const i = C();
  for (const o of n)
    o.user ? t.find((s) => Ii(s, o.user)) || t.push(o.user) : r++;
  return u(dt, {
    name: "typers-popup",
    vertical: "top",
    horizontal: "center",
    onClose: e,
    popupProps: { onClick: (o) => o.stopPropagation() },
    children: [
      t.map((o) =>
        u("div", {
          class: "user-row",
          children: [u($e, { user: o, size: 16 }), u(rn, { user: o })],
        })
      ),
      r > 0 &&
        u("div", {
          class: "user-row",
          children:
            r === 1 ? k(i, "guest") : k(i, "guests", { "*": r.toString() }),
        }),
    ],
  });
}
function R0(n, e) {
  D.call({
    context: n,
    method: "get",
    endpoint: "/user/blocked",
    data: { user_id: e.id, user_type: e.type },
    success: (t) => {
      t.length === 1 && Cc(n, e.type + "_" + e.id);
    },
  });
}
function P0(n) {
  if (!n.id) return !1;
  const e = b.use("userBlocked");
  for (const t of e) if (t.htid === n.type + "_" + n.id) return !0;
  return !1;
}
async function Sc(n, e, t, r) {
  const [i, o] = e.split("_"),
    s = Ld(e, t);
  D.call({
    context: n,
    method: "post",
    endpoint: "/user/block",
    data: { status: t, user_id: o, user_type: i, comment_ids: s },
    complete: () => {
      r && r();
    },
    success: (l) => {
      for (const a of l.comments) fr(n, a);
      z0(n, e, t);
    },
  });
}
function z0(n, e, t) {
  t ? Cc(n, e) : B0(n, e);
}
function Cc(n, e) {
  b.set(n, "userBlocked", [...b.get(n, "userBlocked"), { htid: e }]);
}
function B0(n, e) {
  b.set(
    n,
    "userBlocked",
    b.get(n, "userBlocked").filter((t) => t.htid !== e)
  );
}
function L0({ comment: n }) {
  const e = C(),
    [t, r] = w(!1);
  function i(o) {
    r(!0),
      Sc(e, o, !1, () => {
        r(!1);
      });
  }
  return u("div", {
    class: "comment-hidden",
    children: [
      k(e, "blocked_comment"),
      u(at, {
        buttonType: "secondary",
        onClick: () => {
          n.blocked_user_htid && i(n.blocked_user_htid);
        },
        style: {
          pointerEvents: t ? "none" : "auto",
          opacity: t ? 0.5 : 1,
          textDecoration: "underline",
          padding: "0",
          marginLeft: "20px",
        },
        children: k(e, "unblock_user"),
      }),
    ],
  });
}
function wr({ id: n, replies: e = null, canReply: t, onReply: r }) {
  const i = C(),
    o = Ce.use(n) || { is_hidden: !0 },
    s = b.use("userBan");
  t = t === void 0 ? !!e : t;
  const [l, a] = w(!1),
    [c, d] = w(!1),
    [f, h] = w(!1),
    [p, m] = w(!1),
    [g, x] = w(!1),
    y = b.use("user"),
    v = b.use("userIsMod"),
    N = b.use("specificCommentId"),
    R = b.use("focusedCommentId"),
    J = b.use("flashingCommentId"),
    $ = b.use("userIsShadowBanned"),
    ge = o.is_hidden,
    ne = !ge && y && o.user.id === y.id && o.user.type === y.type,
    T = md(o);
  function V() {
    T && (pd(o), M0(i));
  }
  function be() {
    if (!f && !Js(i, o)) {
      Ot(k(i, "edit_cant"));
      return;
    }
    h(!f);
  }
  function Rt() {
    if (!o.content_html) return;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = o.content_html.trim();

    let message = null;

    // --- Case 1: <x-embed data-url="..."> ---
    const embed = tempDiv.querySelector("x-embed[data-url]");
    if (embed) {
      let linkUrl = embed.getAttribute("data-url");
      if (linkUrl && linkUrl.endsWith("/embed")) {
        linkUrl = linkUrl.slice(0, -6);
      }

      if (
        linkUrl &&
        (
          linkUrl.startsWith("https://freerider.app") ||
          linkUrl.startsWith("https://www.freerider.app") ||
          linkUrl.startsWith("https://freeriderhd.com") ||
          linkUrl.startsWith("https://www.freeriderhd.com") ||
          linkUrl.startsWith("https://frhd.co") ||
          linkUrl.startsWith("https://www.frhd.co")
        )
      ) {
        message = { action: "linkClicked", url: linkUrl };
      }
    }

    // --- Case 2: <pre><code>...</code></pre> ---
    if (!message) {
      const codeBlock = tempDiv.querySelector("pre code");
      if (codeBlock) {
        const trackCode = codeBlock.textContent.trim();
        if (trackCode) {
          message = { action: "importTrack", content: trackCode };
        }
      }
    }

    // --- Case 3: <a href="..."> ---
    if (!message) {
      const link = tempDiv.querySelector("a[href]");
    if (link) {
        const linkUrl = link.getAttribute("href");
        const linkName = link.textContent;
        const url = new URL(linkUrl);
        const hostname = url.hostname;
        if (
            linkUrl &&
            (linkUrl.startsWith("https://freerider.app") ||
             linkUrl.startsWith("https://www.freerider.app") ||
             linkUrl.startsWith("https://freeriderhd.com") ||
             linkUrl.startsWith("https://www.freeriderhd.com") ||
             linkUrl.startsWith("https://frhd.co") ||
             linkUrl.startsWith("https://www.frhd.co")) ||
             hostname.endsWith(".gofile.io")
        ) 
        message = { action: "linkClicked", url: linkUrl, name: linkName};
      }
    }

    // --- Post message if we found one ---
    if (message) {
      if (window.self !== window.top) {
        window.parent.postMessage(message, "*");
      } else {
        const iframe = document.getElementById("trackIframe");
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(message, "*");
        }
      }
    }
  }


  function Dn() {
    m(!0);
  }

    const canImportTrack = (contentHtml) => {
    if (!contentHtml) return false;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = contentHtml.trim();

    // Case 1: <x-embed data-url="...">
    const embed = tempDiv.querySelector("x-embed[data-url]");
    if (embed) {
      const linkUrl = embed.getAttribute("data-url");
      if (
        linkUrl &&
        (linkUrl.startsWith("https://freerider.app") ||
          linkUrl.startsWith("https://www.freerider.app") ||
          linkUrl.startsWith("https://freeriderhd.com") ||
          linkUrl.startsWith("https://www.freeriderhd.com"))
      ) {
        return true;
      }
    }

    // Case 2: <pre><code>...</code></pre>
    const codeBlock = tempDiv.querySelector("pre code");
    if (codeBlock) {
      if (codeBlock.textContent.trim()) {
        return true;
      }
    }

    // Case 3: <a href="...">
    const link = tempDiv.querySelector("a[href]");
    if (link) {
        const linkUrl = link.getAttribute("href");
        const url = new URL(linkUrl);
        const hostname = url.hostname;
        if (
            linkUrl &&
            (linkUrl.startsWith("https://freerider.app") ||
             linkUrl.startsWith("https://www.freerider.app") ||
             linkUrl.startsWith("https://freeriderhd.com") ||
             linkUrl.startsWith("https://www.freeriderhd.com") ||
             linkUrl.startsWith("https://frhd.co") ||
             linkUrl.startsWith("https://www.frhd.co")) ||
             hostname.endsWith(".gofile.io")
        ) {
            return true;
        }
    }

    return false;
  };

  return (
    z(() => {
      J === o.id && Bd(i);
    }, [J]),
    u("div", {
      class:
        "comment" +
        (l ? " collapsed" : "") +
        (T && M(i, "highlight.new") ? " new" : "") +
        F0(o) +
        (o.depth >= M(i, "comments_view.nested_levels")
          ? " depth-exceeded"
          : "") +
        (!o.is_hidden && o.is_featured ? " featured" : "") +
        (N === o.id ? " specific" : "") +
        (R === o.id ? " focused" : "") +
        (J === o.id ? " flashing" : ""),
      onClick: V,
      children: [
        u("div", {
          class: "comment-inside",
          children: [
            !ge &&
              u("div", {
                className: "comment-side",
                children: M(i, "profiles.pictures")
                  ? u($e, { user: o.user })
                  : u("div", { style: { marginLeft: "32px" } }),
              }),
            u("div", {
              className: "comment-main",
              children: [
                ge
                  ? o.blocked_user_htid != null
                    ? u(L0, { comment: o })
                    : u("div", {
                        class: "comment-hidden",
                        children: k(i, "hidden_comment"),
                      })
                  : u(se, {
                      children: [
                        u("div", {
                          className: "comment-meta",
                          children: [
                            u("div", {
                              class: "comment-meta-left",
                              children: [
                                u("div", {
                                  class: "comment-meta-left-1",
                                  children: [
                                    u("span", {
                                      class: "comment-user",
                                      children: [
                                        u("span", {
                                          className: "comment-user-name",
                                          children: u(rn, { user: o.user }),
                                        }),
                                        o.user.title &&
                                          u("span", {
                                            class: "comment-user-title",
                                            children: o.user.title,
                                          }),
                                      ],
                                    }),
                                    u(_0, { user: o.user }),
                                    e !== null && u($0, { comment: o }),
                                  ],
                                }),
                                u("div", {
                                  className: "comment-meta-left-2",
                                  children: [
                                    u("span", {
                                      className: "comment-time",
                                      "aria-label": `View ${o.user.name}'s comment`,
                                      //href: o.url,
                                      //target: "_blank",
                                      children: u(Rl, { time: o.created_at }),
                                    }),
                                    o.is_edited &&
                                      u("span", {
                                        className: "comment-edited",
                                        children: ["(", k(i, "edited"), ")"],
                                      }),
                                  ],
                                }),
                              ],
                            }),
                            u("div", {
                              className: "comment-tags",
                              children: [
                                (o.status === "pending" ||
                                  o.status === "spam" ||
                                  o.status === "deleted") &&
                                  !($ && o.status === "deleted") &&
                                  u("span", {
                                    class: "comment-tag " + o.status,
                                    children: k(i, o.status),
                                  }),
                                /*o.is_featured &&
                                  u("span", {
                                    className: "comment-tag featured img-wrap",
                                    children: k(i, "featured"),
                                  }),*/
                                o.is_loved &&
                                  u("span", {
                                    className: "comment-tag loved",
                                    children: [
                                      u(ue, { name: "heart" }),
                                    ],
                                  }),
                              ],
                            }),
                          ],
                        }),
                        f || p
                          ? u("div", {
                              class: "comment-edit-editor",
                              children: u(Mi, {
                                type: "edit",
                                commentId: o.id,
                                onPublish: () => {
                                  h(!1), m(!1);
                                },
                                onCancel: () => {
                                  h(!1), m(!1);
                                },
                                isModEdit: p,
                              }),
                            })
                          : u(wc, { content: o.content_html }),
                        u("div", {
                          className: "comment-actions",
                          children: [
                            u("div", {
                              class: "comment-actions-left",
                              children: [
                                o.status === "published" &&
                                  u(gu, { comment: o }),
                                t &&
                                  !ml(i) &&
                                  s === null &&
                                  o.status === "published" &&
                                  u(Xr, {
                                    label: k(i, "reply"),
                                    onClick: () => d(!c),
                                  }),
                                ne &&
                                  u(se, {
                                    children: [
                                      Js(i, o) &&
                                        s === null &&
                                        u(Xr, {
                                          label: k(i, "edit"),
                                          onClick: be,
                                        }),
                                      u(Xr, {
                                        label: k(i, "delete"),
                                        onClick: () => x(!g),
                                        children:
                                          g &&
                                          u(y0, {
                                            comment: o,
                                            onClose: () => x(!1),
                                          }),
                                      }),
                                    ],
                                  }),
                                canImportTrack(o.content_html) ? u("button", {
                                  className: "action-button comment-link-copy",
                                  onClick: Rt,
                                  title: "Import Track",
                                  style: { color: "#1884cf" },
                                  children: "Import Track",
                                }) : null,
                                u(I0, { commentId: o.id }),
                              ],
                            }),
                            u("div", {
                              class: "comment-actions-right",
                              children: [
                                y && v && u(O0, { comment: o, onModEdit: Dn }),
                                y && !ne && u(C0, { comment: o }),
                              ],
                            }),
                          ],
                        }),
                        c &&
                          u("div", {
                            class: "comment-reply-editor",
                            children: u(Mi, {
                              type: "reply",
                              commentId: o.id,
                              onPublish: (Sr) => {
                                d(!1), r && r(Sr);
                              },
                              onCancel: () => d(!1),
                            }),
                          }),
                      ],
                    }),
                l && u(hu, { commentId: o.id, onExpand: () => a(!1) }),
              ],
            }),
          ],
        }),
        e &&
          u(se, {
            children: [
              u("div", { class: "comment-replies", children: e }),
              u(fu, { comment: o, onCollapse: () => a(!0) }),
            ],
          }),
      ],
    })
  );
}
function F0(n) {
  const e = C();
  if (n.is_hidden) return "";
  const t = M(e, "highlight.upvote_1_threshold"),
    r = M(e, "highlight.upvote_2_threshold");
  return t && n.upvotes >= t
    ? " highlight-upvote-1"
    : r && n.upvotes >= r
    ? " highlight-upvote-2"
    : "";
}
function Js(n, e) {
  if (!M(n, "commenting.editing")) return !1;
  const t = M(n, "commenting.editing_timeout");
  if (!t) return !0;
  const r = e.created_at;
  return (Date.now() / 1e3 - r) / 60 < t;
}
function Xr({ onClick: n, label: e, children: t }) {
  return u("div", {
    class: "action-button",
    children: [
      u("button", { onClick: () => n(), "aria-label": e, children: e }),
      t,
    ],
  });
}
function $0({ comment: n }) {
  const e = C();
  if (!n.parent_id || !Ce.has(n.parent_id)) return null;
  const t = hr(e, n.parent_id);
  if (t.is_hidden) return null;
  const r = M(e, "comments_view.display_replied_to_type");
  return r === "none" ||
    (r === "deep" && n.depth < M(e, "comments_view.nested_levels"))
    ? null
    : u("span", {
        class: "comment-replied-to",
        onClick: () => zi(e, n.parent_id),
        children: [
          u("span", { children: u(ue, { name: "reply" }) }),
          u("span", {
            class: "user-data",
            children: [
              u($e, { user: t.user, size: 13, profileOpener: !1 }),
              u(rn, { user: t.user, profileOpener: !1 }),
            ],
          }),
        ],
      });
}
function V0({ id: n, pages: e }) {
  const t = Ce.use(n),
    r = e[t.page_id];
  return u("div", {
    class: "user-comment",
    children: [
      u("div", {
        class: "page-title",
        children: u("a", {
          href: t.url,
          target: "_blank",
          children: (r == null ? void 0 : r.title) || "(Untitled)",
        }),
      }),
      u(wr, { id: n, replies: null }),
    ],
  });
}
function U0({ user: n }) {
  const [e, t] = w(!0),
    [r, i] = w([]),
    [o, s] = w({}),
    [l, a] = w(!1),
    [c, d] = w(!1),
    f = C();
  function h(p = !1) {
    p && d(!0),
      D.call({
        context: f,
        method: "get",
        endpoint: "/commenter/comments",
        data: { user_id: n.id, user_type: n.type, offset: p ? r.length : 0 },
        complete: () => {
          t(!1), d(!1);
        },
        success: (m) => {
          xl(f, m.comments);
          const g = m.comments.map((x) => x.id);
          i(p ? [...r, ...g] : g),
            s({ ...o, ...m.pages }),
            a(m.comments.length === 25);
        },
      });
  }
  return (
    z(() => {
      h();
    }, []),
    e
      ? u(W, { padding: 60 })
      : u("div", {
          class: "user-comments",
          children: [
            r.length
              ? r.map((p) => u(V0, { id: p, pages: o }))
              : u(At, { padding: 50 }),
            l &&
              (c
                ? u(W, { padding: 15 })
                : u("div", {
                    class: "has-more",
                    children: u(te, {
                      scale: "medium",
                      onClick: () => h(!0),
                      children: k(f, "load_more"),
                    }),
                  })),
          ],
        })
  );
}
function j0() {
  const [n, e] = w(),
    [t, r] = w(!1),
    i = C();
  z(() => {
    D.call({
      context: i,
      method: "get",
      endpoint: "/user/settings",
      success: (s) => {
        e(s);
      },
    });
  }, []);
  function o() {
    r(!0),
      D.call({
        context: i,
        method: "post",
        endpoint: "/user/settings",
        data: n,
        success: (s) => {
          Ot(k(i, "saved"));
        },
        complete: () => {
          r(!1);
        },
      });
  }
  return n
    ? u("div", {
        class: "user-settings",
        children: [
          u("div", {
            class: "title",
            children: k(i, "settings_for_website", {
              "{website}": M(i, "name"),
            }),
          }),
          u("div", {
            className: "setting",
            children: [
              u("div", { className: "text", children: k(i, "reply_emails") }),
              u("input", {
                type: "checkbox",
                checked: n.email_reply,
                onChange: (s) => e({ ...n, email_reply: s.target.checked }),
              }),
            ],
          }),
          u("div", {
            className: "setting",
            children: [
              u("div", { className: "text", children: k(i, "mention_emails") }),
              u("input", {
                type: "checkbox",
                checked: n.email_mention,
                onChange: (s) => e({ ...n, email_mention: s.target.checked }),
              }),
            ],
          }),
          u("div", {
            class: "save-wrap",
            children: u(te, { onClick: o, isLoading: t, children: "SAVE" }),
          }),
        ],
      })
    : u(W, { padding: 60 });
}
function Mc({ user: n }) {
  const e = C(),
    t = P0(n),
    [r, i] = w(!1),
    [o, s] = w(!1);
  z(() => {
    i(t);
  }, [t]),
    z(() => {
      R0(e, n);
    }, []);
  function l() {
    s(!0),
      Sc(e, Fi(n), !r, () => {
        Ot(r ? k(e, "unblocked") : k(e, "blocked")), s(!1);
      });
  }
  return u(te, {
    scale: "small",
    isLoading: o,
    onClick: l,
    children: k(e, r ? "unblock" : "block_button"),
  });
}
function H0() {
  const [n, e] = w(!0),
    [t, r] = w([]),
    [i, o] = w(!1),
    [s, l] = w(!1),
    a = C();
  function c(d = !1) {
    d && l(!0),
      D.call({
        context: a,
        method: "get",
        endpoint: "/user/blocked",
        data: { offset: d ? t.length : 0 },
        success: (f) => {
          e(!1), l(!1), r(f), o(f.length === 25);
        },
      });
  }
  return (
    z(() => {
      c();
    }, []),
    n
      ? u(W, { padding: 60 })
      : u("div", {
          class: "user-blocked",
          children: [
            t.length
              ? t.map((d) => u(q0, { user: d }))
              : u(At, { padding: 50 }),
            i &&
              (s
                ? u(W, { padding: 15 })
                : u("div", {
                    class: "has-more",
                    children: u(te, {
                      scale: "medium",
                      onClick: () => c(!0),
                      children: k(a, "load_more"),
                    }),
                  })),
          ],
        })
  );
}
function q0({ user: n }) {
  const e = C();
  return u("div", {
    class: "block",
    children: [
      u($e, { user: n, profileOpener: !1 }),
      u("div", { class: "user-name", children: Mn(e, n) }),
      u(Mc, { user: n }),
    ],
  });
}
function W0({ user: n }) {
  const e = C(),
    [t, r] = w(),
    [i, o] = w(!0),
    s = t == null ? void 0 : t.state,
    l = (t == null ? void 0 : t.note) || "",
    a = (t == null ? void 0 : t.ban_reason) || "",
    c = t == null ? void 0 : t.state_ends_at;
  z(() => {
    D.call({
      context: e,
      method: "get",
      isConsoleApi: !0,
      endpoint: `/user/${Fi(n)}`,
      success: (y) => {
        r(y), o(!1);
      },
      error: () => {
        r({ state: "default", note: "", state_ends_at: null, ban_reason: "" }),
          o(!1);
      },
    });
  }, [n]);
  function d(y, v) {
    r({ ...t, [y]: v }), uu(e, n, y, v, (N) => r(N));
  }
  function f(y) {
    d("state", y);
  }
  function h(y) {
    d("note", y);
  }
  function p(y) {
    d("ban_reason", y);
  }
  function m() {
    let y;
    c === null ? (y = Math.floor(Date.now() / 1e3) + 86400 * 7) : (y = null),
      d("state_ends_at", y);
  }
  function g(y) {
    const v = new Date(y),
      N = Math.floor(v.getTime() / 1e3);
    d("state_ends_at", N);
  }
  const x = ({ value: y }) => {
    const v = "user-state-" + y;
    return u("div", {
      class: "state-input",
      children: [
        u("input", {
          type: "radio",
          name: "state",
          id: v,
          value: y,
          checked: s === y,
          onChange: (N) => f(N.target.value),
        }),
        u("label", { for: v, children: y }),
      ],
    });
  };
  return i
    ? u(W, { padding: 60 })
    : u("div", {
        class: "user-moderation",
        children: [
          u("div", { class: "privacy-note", children: k(e, "mod_privacy") }),
          u("div", {
            class: "dual-view",
            children: [
              u("div", { class: "left", children: "State" }),
              u("div", {
                class: "right",
                children: [
                  u(x, { value: "default" }),
                  u(x, { value: "banned" }),
                  u(x, { value: "shadowed" }),
                  u(x, { value: "trusted" }),
                ],
              }),
            ],
          }),
          (s === "banned" || s === "shadowed") &&
            u("div", {
              class: "dual-view",
              children: [
                u("div", { class: "left", children: "Temporary Ban" }),
                u("div", {
                  class: "right",
                  children: [
                    u("div", {
                      class: "temp-ban-wrap",
                      children: u("input", {
                        type: "checkbox",
                        name: "temporary-ban",
                        id: "temporary-ban",
                        checked: c !== null,
                        onChange: () => m(),
                      }),
                    }),
                    c &&
                      u("input", {
                        type: "date",
                        name: "temporary-ban-date",
                        id: "temporary-ban-date",
                        min: new Date().toISOString().split("T")[0],
                        value: new Date(c * 1e3).toISOString().split("T")[0],
                        onChange: (y) => g(y.target.value),
                      }),
                  ],
                }),
              ],
            }),
          s == "banned" &&
            u("div", {
              class: "dual-view",
              children: [
                u("div", { class: "left", children: "Ban Reason" }),
                u("div", {
                  class: "right",
                  children: u("textarea", {
                    class: "user-note",
                    onBlur: (y) => p(y.target.value),
                    children: a,
                  }),
                }),
              ],
            }),
          u("div", {
            class: "dual-view",
            children: [
              u("div", { class: "left", children: "Note" }),
              u("div", {
                class: "right",
                children: u("textarea", {
                  class: "user-note",
                  onBlur: (y) => h(y.target.value),
                  children: l,
                }),
              }),
            ],
          }),
        ],
      });
}
function Oc(n, e) {
  const t = Fe(n, "profile:clicked", e);
  (t && t.defaultPrevented) ||
    (console.log(t == null ? void 0 : t.defaultPrevented),
    b.set(n, "profilePopupUser", e));
}
function J0() {
  const [n, e] = w(null),
    [t, r] = w("comments"),
    i = C(),
    o = b.use("profilePopupUser"),
    s = b.use("user"),
    l = o && du(o),
    a = b.use("userIsMod");
  function c(f) {
    return f.replace(/^https?:\/\//, "");
  }
  z(() => {
    o &&
      D.call({
        context: i,
        method: "get",
        endpoint: "/commenter",
        data: { user_id: o.id, user_type: o.type },
        success: (f) => {
          e(f);
        },
      });
  }, [o]);
  function d({ name: f, label: h, count: p }) {
    return u("button", {
      class: "selector" + (f === t ? " active" : ""),
      onClick: () => r(f),
      children: [
        h,
        p !== void 0 &&
          u("span", {
            class: "count",
            title: f === "comments" ? Dl(p) : void 0,
            children: Li(i, p, !0),
          }),
      ],
    });
  }
  return o
    ? u("div", {
        class: "user-profile-popup-wrap",
        children: [
          u("div", {
            class: "popup-closer",
            onClick: (f) => {
              f.stopPropagation(), b.set(i, "profilePopupUser", null);
            },
          }),
          u("div", {
            class: "popup-content",
            children: [
              u("div", {
                class: "user-profile",
                children: u("div", {
                  class: "user-profile-inner",
                  children: [
                    u("div", {
                      class: "profile-left",
                      children: u($e, {
                        user: o,
                        profileOpener: !1,
                        size: 100,
                      }),
                    }),
                    u("div", {
                      class: "profile-right",
                      children: [
                        u("div", { class: "name", children: Mn(i, o) }),
                        o.username &&
                          u("div", {
                            class: "username",
                            children: ["@", o.username],
                          }),
                        o.location &&
                          u("div", { class: "location", children: o.location }),
                        o.bio && u("div", { class: "bio", children: o.bio }),
                        o.website_url &&
                          u("div", {
                            className: "website",
                            children: u("a", {
                              href: o.website_url,
                              target: "_blank",
                              rel: "nofollow noindex",
                              children: [
                                c(o.website_url),
                                " ",
                                u(ue, { name: "link" }),
                              ],
                            }),
                          }),
                        u("div", {
                          class: "actions",
                          children: [
                            l
                              ? u(se, {
                                  children: [u(G0, { user: o }), u(K0, {})],
                                })
                              : null,
                            s && !l && u(Mc, { user: o }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              u("div", {
                class: "section-selector",
                children: [
                  u(d, {
                    name: "comments",
                    label: k(i, "comments"),
                    count: n ? n.comments_count : void 0,
                  }),
                  l &&
                    u(se, {
                      children: [
                        u(d, { name: "blocked", label: k(i, "blocked") }),
                        u(d, { name: "settings", label: k(i, "settings") }),
                      ],
                    }),
                  a && u(d, { name: "moderate", label: k(i, "moderate") }),
                ],
              }),
              u("div", {
                class: "section-wrap",
                children: [
                  t === "comments" && u(U0, { user: o }),
                  t === "settings" && u(j0, {}),
                  t === "blocked" && u(H0, {}),
                  t === "moderate" && u(W0, { user: o }),
                ],
              }),
            ],
          }),
        ],
      })
    : null;
}
function K0() {
  const n = C();
  return On(n)
    ? null
    : u(te, {
        scale: "medium",
        onClick: () => Re.logout(n),
        children: k(n, "account_logout"),
      });
}
function G0({ user: n }) {
  const e = C();
  return n.type !== "hyvor"
    ? null
    : u("a", {
        href: "https://hyvor.com/account",
        target: "_blank",
        children: u(te, { scale: "medium", children: k(e, "account_my") }),
      });
}
function Mn(n, e) {
  const t = M(n, "profiles.display_name_type");
  if (e.type && e.is_mod && e.is_mod_alias) {
    const r = M(n, "profiles.mod_alias_name");
    if (r) return r;
  }
  return (t === "username" && e.username) || e.name;
}
function rn({ user: n, profileOpener: e = !0 }) {
  const t = C(),
    [r, i] = w(!1),
    o = e && Al(n);
  function s() {
    o && (Oc(t, n), i(!0));
  }
  return (
    z(() => {
      function l(a) {
        a.key === "Escape" && r && (i(!1), b.set(t, "profilePopupUser", null));
      }
      return (
        document.addEventListener("keyup", l),
        () => {
          document.removeEventListener("keyup", l);
        }
      );
    }, [r, t]),
    o
      ? u("button", {
          class: "user-name clickable",
          onClick: s,
          children: Mn(t, n),
        })
      : u("span", { class: "user-name", children: Mn(t, n) })
  );
}
function Y0({ notification: n, onRead: e, onClose: t }) {
  const r = C();
  _l(r, n.comment_id);
  function i(o) {
    n.is_read || e(), zd(r, n.comment_id) && o.preventDefault(), t();
  }
  return u("a", {
    class: "notification" + (n.is_read ? "" : " not-read"),
    onClick: i,
    href: n.comment_url,
    target: "_blank",
    children: [
      u("div", { class: "left", children: u($e, { user: n.user }) }),
      u("div", {
        class: "right",
        children: [
          u("div", {
            className: "text",
            children: k(
              r,
              n.type === "reply"
                ? "notifications_reply"
                : "notifications_mention",
              { "{name}": Mn(r, n.user) }
            ),
          }),
          u("div", {
            class: "meta",
            children: [
              u("div", {
                class: "page-title",
                children: n.page_title || "(Untitled Page)",
              }),
              u("div", {
                class: "time",
                children: u(Rl, { time: n.created_at }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function X0(n, e) {
  D.call({
    context: n,
    method: "post",
    endpoint: "/notifications/read",
    data: { id: e },
  });
  const t = b.get(n, "notifsCount");
  b.set(n, "notifsCount", Math.max(t - 1, 0));
}
function Q0(n) {
  D.call({ context: n, method: "post", endpoint: "/notifications/read-all" }),
    b.set(n, "notifsCount", 0);
}
function Z0({ onClose: n }) {
  const [e, t] = w(!0),
    [r, i] = w(!1),
    [o, s] = w(!1),
    [l, a] = w([]),
    [c, d] = w(!0),
    f = C();
  b.use("notifsCount");
  function h(g = !1) {
    g && s(!0),
      D.call({
        context: f,
        method: "get",
        endpoint: "/notifications",
        data: { offset: g ? l.length : 0 },
        complete: () => {
          t(!1), s(!1);
        },
        success: (x) => {
          a([...l, ...x]), i(x.length === 25);
        },
      });
  }
  function p(g) {
    a(l.map((x) => (x.id === g ? { ...x, is_read: !0 } : x))), X0(f, g);
  }
  function m() {
    a(l.map((g) => ({ ...g, is_read: !0 }))), Q0(f);
  }
  return (
    z(() => {
      function g(x) {
        x.key === "Escape" && c && (d(!1), n());
      }
      return (
        document.addEventListener("keyup", g),
        () => {
          document.removeEventListener("keyup", g);
        }
      );
    }, [c, n]),
    z(h, []),
    c
      ? u(dt, {
          name: "notifications-popup",
          vertical: "bottom",
          horizontal: "right",
          onClose: n,
          children: e
            ? u(W, { padding: 25, size: "small" })
            : l.length
            ? u("div", {
                class: "notifications-list",
                children: [
                  u("div", {
                    class: "read-all",
                    children: u("button", {
                      onClick: m,
                      children: k(f, "notifications_read"),
                    }),
                  }),
                  l.map((g) =>
                    u(Y0, {
                      notification: g,
                      onRead: () => p(g.id),
                      onClose: n,
                    })
                  ),
                  r &&
                    u("div", {
                      class: "has-more",
                      children: o
                        ? u(W, { padding: 0, size: "small" })
                        : u(te, {
                            scale: "small",
                            onClick: () => h(!0),
                            children: k(f, "notifications_load_more"),
                          }),
                    }),
                ],
              })
            : u(At, { text: k(f, "notifications_no"), padding: 25 }),
        })
      : null
  );
}
function Ks({ value: n, disabled: e, onChange: t }) {
  return u("label", {
    class: "switch",
    children: [
      u("input", {
        type: "checkbox",
        checked: n,
        onChange: (r) => {
          r.stopPropagation(), t();
        },
        disabled: !!e,
      }),
      u("span", { class: "slider" }),
    ],
  });
}
function eg() {
  const n = b.use("page"),
    [e, t] = w(!1),
    r = C(),
    i = q(null),
    o = q(null),
    s = n.is_closed,
    l = n.is_premoderation_on;
  function a() {
    vd(r, !s), b.set(r, "page", { ...n, is_closed: !s });
  }
  function c() {
    wd(r, !l);
  }
  function d(f) {
    t(f);
  }
  return (
    z(() => {
      if (e && i.current) {
        const f = i.current.querySelector(
          'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        f ? f.focus() : i.current.focus();
      }
    }, [e]),
    z(() => {
      function f(p) {
        p.key === "Escape" && e && (t(!1), o.current && o.current.focus());
      }
      function h(p) {
        if (e && i.current && !i.current.contains(p.target)) {
          p.stopPropagation();
          const m = i.current.querySelector(
            'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          m ? m.focus() : i.current.focus();
        }
      }
      return (
        document.addEventListener("keyup", f),
        document.addEventListener("focus", h, !0),
        () => {
          document.removeEventListener("keyup", f),
            document.removeEventListener("focus", h, !0);
        }
      );
    }, [e]),
    u("div", {
      className: "page-mod-icon",
      children: [
        u("button", {
          ref: o,
          className: "page-mod-button",
          onClick: () => d(!e),
          title: k(r, "moderate"),
          children: u(ue, { name: "mod" }),
        }),
        e &&
          u("div", {
            ref: i,
            class: "page-moderation-popup-wrap",
            children: [
              u("div", { class: "popup-closer", onClick: () => d(!1) }),
              u("div", {
                class: "mod-content",
                role: "dialog",
                "aria-modal": "true",
                children: u("div", {
                  class: "page-moderation-panel",
                  children: [
                    u("p", {
                      id: "modTitle",
                      class: "mod-title",
                      children: k(r, "mod_privacy"),
                    }),
                    u("div", {
                      class: "duel-view",
                      children: [
                        u("div", {
                          class: "left",
                          children: k(r, "mod_page_closed"),
                        }),
                        u("div", {
                          class: "right",
                          children: u(Ks, { value: s, onChange: a }),
                        }),
                      ],
                    }),
                    u("div", {
                      class: "duel-view",
                      children: [
                        u("div", {
                          class: "left",
                          children: k(r, "mod_page_premod"),
                        }),
                        u("div", {
                          class: "right",
                          children: u(Ks, { value: l, onChange: c }),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          }),
      ],
    })
  );
}
function tg() {
  const [n, e] = w(!1),
    t = C(),
    r = b.use("notifsCount"),
    i = b.use("userIsMod");

    if (r === 0) {
    return null;
    }

  return u("div", {
    class: "notifications",
    children: [
      //i && u(eg, {}),
      u("button", {
        "aria-label": k(t, "notifications"),
        class: "notification-icon",
        onClick: () => e(!n),
        children: [
          r > 0 &&
            //u("span", { class: "notifs-count-tag", children: Math.min(99, r) }),
          u(ue, { name: "bell" }),
        ],
      }),
      n && u(Z0, { onClose: () => e(!1) }),
    ],
  });
}
function ng({ onClose: n }) {
  const [e, t] = w(!0),
    [r, i] = w([]),
    [o, s] = w(!1),
    [l, a] = w(!1),
    c = q(0),
    d = C();
  function f(h = !1) {
    h && a(!0),
      D.callPageApi({
        context: d,
        method: "get",
        endpoint: "/online/users",
        data: { offset: h ? r.length : 0, filter_at: h ? c.current : null },
        complete: () => {
          t(!1), a(!1);
        },
        success: (p) => {
          h || (c.current = ro()), i(h ? [...r, ...p] : p), s(p.length === 50);
        },
      });
  }
  return (
    z(f, []),
    u(dt, {
      name: "online-list",
      vertical: "bottom",
      horizontal: "center",
      onClose: n,
      children: [
        e
          ? u(W, { padding: 20, size: "small" })
          : r.length
          ? r.map((h) =>
              u("div", {
                class: "user-row",
                children: [u($e, { size: 20, user: h }), u(rn, { user: h })],
              })
            )
          : u(At, {}),
        o &&
          (l
            ? u(W, { padding: 15, size: "small" })
            : u("div", {
                class: "has-more",
                children: u(te, {
                  scale: "small",
                  onClick: () => f(!0),
                  children: k(d, "load_more"),
                }),
              })),
      ],
    })
  );
}
function rg() {
  const [n, e] = w(!1),
    { online_count: t } = b.use("page"),
    r = C(),
    i = M(r, "realtime.users"),
    o = q(null);
  return (
    z(() => {
      M(r, "realtime.on") && M(r, "realtime.count");
    }, []),
    z(() => {
      function s(l) {
        l.key === "Escape" && n && (e(!1), o.current && o.current.focus());
      }
      return (
        document.addEventListener("keyup", s),
        () => {
          document.removeEventListener("keyup", s);
        }
      );
    }, [n]),
    !M(r, "realtime.on") || !M(r, "realtime.count")
      ? null
      : u("button", {
          class: "online-count",
          onClick: () => i && e(!0),
          ref: o,
          tabindex: i ? 0 : -1,
          children: [
            u(Il, { number: Math.max(t, 1) }),
            "  ",
            k(r, "online"),
            n && u(ng, { onClose: () => e(!1) }),
          ],
        })
  );
}
function ig() {
  const n = b.use("user");
  return u("div", {
    className: "main-box-header-wrap",
    children: u("div", {
      className: "main-box-header",
      children: [
        u("div", {
          className: "main-box-header-left",
          //children: [u(cu, {}), u(rg, {})],
        }),
        u("div", {
          className: "main-box-header-right",
          children: n ? u(tg,{}) : u(g0,{}),
        }),
      ],
    }),
  });
}
function og({ index: n }) {
  const e = C(),
    [t, r] = w(!1),
    i = n === "PARENT";
  function o() {
    r(!0),
      bl({
        context: e,
        isMore: !0,
        parentCommentId: i ? null : n,
        onSuccess: () => {
          r(!1);
        },
      });
  }
  return u("div", {
    class: "load-more" + (i ? " parent" : ""),
    children: t
      ? u(W, { padding: 5 })
      : i
      ? u(te, { onClick: o, children: k(e, "load_more_comments") })
      : u("button", { onClick: o, children: [k(e, "more_replies"), "..."] }),
  });
}
function so({ index: n, type: e }) {
  let t =
    b.use(e === "main" ? "commentsList" : "specificCommentRepliesList")[n] ||
    [];
  const r = b.use(
      e === "main" ? "commentsHasMoreIds" : "specificCommentHasMoreIds"
    ),
    i = Ad(n),
    o = n === "PARENT";
  t = [...$d(n, t), ...t];
  const l = C();
  return u("div", {
    class: "comments-list" + (o ? " parent" : ""),
    children: [
      i > 0 &&
        u("div", {
          class: "show-new-comments" + (o ? " parent" : " reply"),
          children: u(te, {
            scale: "medium",
            onClick: () => Rd(l, n),
            children:
              i === 1
                ? k(l, o ? "show_new_comment" : "show_new_reply")
                : k(l, o ? "show_new_comments" : "show_new_replies", {
                    "*": i.toString(),
                  }),
          }),
        }),
      t.map((a) => u(wr, { id: a, replies: u(so, { index: a, type: e }) }, a)),
      o &&
        t.length === 0 &&
        u("div", {
          class: "no-comments",
          children: M(l, "text.no_comments") || k(l, "no_comments_text"),
        }),
      r.indexOf(n) >= 0 && u(og, { index: n }),
    ],
  });
}
function sg({ onChange: n }) {
  const e = b.use("commentsList"),
    t = b.use("commentsSort"),
    r = C(),
    [i, o] = w(!1);
  function s(c) {
    o(!1), b.set(r, "commentsSort", c), n(c);
  }
  function l({ type: c }) {
    return u("button", {
      onClick: () => s(c),
      class: t === c ? "active" : "",
      "aria-selected": t === c ? "true" : "false",
      role: "option",
      children: k(r, c),
    });
  }
  return e && e.PARENT && e.PARENT.length > 0
    ? u("div", {
        id: "sorter",
        children: [
          u("button", {
            class: "sort-button",
            onClick: () => o(!i),
            "aria-haspopup": "listbox",
            "aria-expanded": i,
            "aria-controls": "sort-options",
            "aria-label": k(r, "sort_comments"),
            children: [k(r, t), " ", u(ue, { name: "caret" })],
          }),
          i &&
            u(dt, {
              name: "sort-selector",
              vertical: "bottom",
              horizontal: "left",
              onClose: () => o(!1),
              children: u("div", {
                role: "listbox",
                id: "sort-options",
                "aria-labelledby": "sort-button-label",
                children: [
                  u(l, { type: "top" }),
                  u(l, { type: "newest" }),
                  u(l, { type: "oldest" }),
                ],
              }),
            }),
        ],
      })
    : null;
}
function lg() {
  const [n, e] = w(!1),
    t = b.use("commentsList"),
    r = t.PARENT && t.PARENT.length > 0,
    i = C();
  function o(l) {
    e(!0),
      bl({
        context: i,
        sort: l,
        isMore: !1,
        onSuccess: () => {
          e(!1);
        },
      });
  }
  function s() {
    b.set(i, "commentsView", "search");
  }
  return u("section", {
    id: "comments",
    children: [
      r &&
        u("div", {
          class: "comments-top",
          children: [
            u(sg, { onChange: o }),
            u("button", {
              className: "search-button",
              "aria-label": k(i, "search"),
              onClick: s,
              children: u(ue, { name: "search" }),
            }),
          ],
        }),
      n ? u(W, { padding: 100 }) : u(so, { index: "PARENT", type: "main" }),
    ],
  });
}
function ag() {
  const [n, e] = w(""),
    t = q(null),
    [r, i] = w([]),
    [o, s] = w(!1),
    [l, a] = w(!1),
    [c, d] = w(!1),
    f = q(null),
    h = C();
  function p() {
    b.set(h, "commentsView", "comments");
  }
  function m(x = 0) {
    if ((t.current && t.current.abort(), !n.trim())) {
      s(!1), d(!1), i([]), a(!1);
      return;
    }
    x ? d(!0) : s(!0),
      (t.current = D.callPageApi({
        context: h,
        method: "get",
        endpoint: "/comments/search",
        data: { query: n, offset: x },
        success: (v) => {
          s(!1), d(!1), xl(h, v);
          const N = v.map((R) => R.id);
          i(x ? [...r, ...N] : N), a(v.length === 25);
        },
      }));
  }
  function g() {
    m(r.length);
  }
  return (
    z(() => {
      m();
    }, [n]),
    z(() => {
      f.current && f.current.focus();
    }, []),
    u("div", {
      id: "search",
      children: [
        u("div", {
          class: "back",
          children: u("button", {
            onClick: p,
            children: [u(ue, { name: "caret" }), " ", k(h, "search_back")],
          }),
        }),
        u("input", {
          ref: f,
          id: "search",
          class: "search-input",
          type: "text",
          name: "search",
          value: n,
          onChange: (x) => e(x.target.value),
          placeholder: k(h, "search_comments") + "...",
        }),
        o
          ? u(W, { padding: 60 })
          : u("div", {
              class: "search-results",
              children: u("label", {
                for: "search",
                class: "search-results",
                children: r.length
                  ? r.map((x) => u(wr, { id: x, replies: null }))
                  : u(At, {
                      padding: 50,
                      text: n.trim()
                        ? k(h, "no_results")
                        : k(h, "search_type") + "...",
                    }),
              }),
            }),
        l &&
          (c
            ? u(W, { padding: 15 })
            : u("div", {
                class: "has-more",
                children: u(te, {
                  scale: "medium",
                  onClick: g,
                  children: k(h, "load_more"),
                }),
              })),
      ],
    })
  );
}
function cg() {
  const n = C(),
    e = M(n, "comments_view.note");
  return e
    ? u("div", { class: "comments-note", children: u(wc, { content: e }) })
    : null;
}
function dg() {
  const n = b.use("commentsView");
  let e;
  return (
    n === "comments" ? (e = u(lg, {})) : n === "search" && (e = u(ag, {})),
    u("div", {
      class: "comments-wrap",
      children: [u(cg, {}), u(Mi, { type: "comment" }), e],
    })
  );
}
function ug() {
  const n = b.use("specificCommentId"),
    [e, t] = w(!0),
    r = Ce.use(n),
    i = C();
  return (
    z(() => {
      t(!0),
        D.callPageApi({
          context: i,
          method: "get",
          endpoint: `/comment/${n}/specific`,
          success: (o) => {
            fr(i, o.comment),
              Ke(i, o.replies.indexed),
              b.set(i, "specificCommentRepliesList", o.replies.list),
              b.set(i, "specificCommentHasMoreIds", o.replies.has_more_ids),
              t(!1);
          },
          error: () => {
            b.set(i, "specificCommentId", null);
          },
        });
    }, [n]),
    e
      ? u(W, { padding: 60 })
      : u("div", {
          class: "specific-comment-view",
          children: [
            u("div", {
              class: "button-wrap",
              children: u(te, {
                onClick: () => b.set(i, "specificCommentId", null),
                scale: "medium",
                children: k(i, "show_all_comments"),
              }),
            }),
            r.parent_id &&
              u("div", {
                class: "parent-loader",
                children: u(at, {
                  buttonType: "no-background",
                  onClick: () => {
                    t(!0), b.set(i, "specificCommentId", r.parent_id);
                  },
                  children: k(i, "show_parent_comment"),
                }),
              }),
            u(wr, {
              id: n,
              replies: u(so, { index: n, type: "specific" }),
              canReply: !0,
            }),
          ],
        })
  );
}
function fg(n, e) {
  const r = b.use("hooks")[n];
  return () => {
    if (!r) return e;
    let i = e;
    for (const o of r) i = o(i);
    return i;
  };
}
function changePage(id, title = "Discussion") {
  const container = document.getElementById("comments-container");
  if (!container) return;

  container.innerHTML = "";

  const el = document.createElement("hyvor-talk-comments");
  el.setAttribute("website-id", "14106");
  el.setAttribute("page-id", id);
  el.setAttribute("page-title", title);
  el.setAttribute("settings", JSON.stringify({
    "custom_css":"#app { font-size: 14px }",
    "profiles": { "pictures": true },
    "voting": { "type": "both", "voters": true },
    "editor": { "emoji": false },
    "ui": { "color_theme": "light" }
  }));

  container.appendChild(el);
}
function hg() {
  const n = b.use("license");

  const items = ["heli", "truck", "blob", "balloon"];
  const homeId = "";

  function getCurrentPageId() {
    const el = document.querySelector("hyvor-talk-comments");
    return el ? el.getAttribute("page-id") || "" : "";
  }

const currentId = getCurrentPageId();
let iconElements = [];

if (currentId !== homeId) {
  iconElements.push(
    u("a", {
      key: "home",
      href: "#",
      title: "Teleport to Main Page",
      style: { justifyContent: "center", margin: "5px", fontSize: "30px" },
      onClick: (e) => {
        e.preventDefault();
        changePage(homeId, "Home Discussion");
      },
      children: [ u(ue, { name: "teleport" }) ],
    })
  );
} else {
  const iconTitles = {
    heli: "Chopper Champs",
    truck: "1994 jeep wrangler (mint condition)",
    blob: "blob gang",
    balloon: "Democratic People's Balloon Team"
  };

  iconElements = items.map((name) =>
    u("a", {
      key: name,
      href: "#",
      title: iconTitles[name],
      style: { justifyContent: "center", margin: "5px", fontSize: "30px" },
      onClick: (e) => {
        e.preventDefault();
        changePage(name, name.charAt(0).toUpperCase() + name.slice(1) + " Discussion");
      },
      children: u(ue, { name }),
    })
  );
}


  return n.no_branding
    ? null
    : u("div", {
        className: "main-box-footer",
        children: iconElements,
      });
}
function pg() {
  const n = b.use("specificCommentId");
  let e;
  return (
    n ? (e = u(ug, {})) : (e = u(dg, {})),
    u("div", { className: "main-box", children: [u(ig, {}), e, u(hg, {})] })
  );
}
const Qr = {},
  mg = (n, e) => {
    const t = b.get(n, "ratings"),
      r = b.get(n, "userRating");
    b.set(n, "userRating", e);
    const i = r ? t.count : t.count + 1,
      o = (() => {
        let s = t.average * t.count;
        return r && (s -= r), (s += e), s / i;
      })();
    Dt(n, "ratings", { count: i, average: o }),
      Qr[n] && clearTimeout(Qr[n]),
      (Qr[n] = setTimeout(() => {
        D.callPageApi({
          context: n,
          method: "post",
          endpoint: "/rate",
          data: { rating: e },
          success: () => {
            Fe(n, "rating", { rating: e, count: i, average: o });
          },
        });
      }, 300));
  };
function gg() {
  const [n, e] = w(null),
    t = b.use("userRating"),
    r = C(),
    i = q(null);
  function o(d) {
    if ((mg(r, d), !i.current)) return;
    const f = i.current.getRootNode().querySelector("#star-" + r + "-" + d);
    f && f.focus();
  }
  function s() {
    return window.innerWidth < 768;
  }
  function l(d) {
    s() || e(d);
  }
  function a() {
    s() || e(null);
  }
  function c(d, f) {
    switch (d.key) {
      case " ":
      case "Enter":
        o(f);
        break;
      case "Up":
      case "ArrowUp":
      case "Left":
      case "ArrowLeft":
        o(f === 1 ? 5 : f - 1);
        break;
      case "Down":
      case "ArrowDown":
      case "Right":
      case "ArrowRight":
        o(f === 5 ? 1 : f + 1);
        break;
    }
  }
  return u("div", {
    class: "rater-wrap",
    ref: i,
    children: u("div", {
      class: "rater",
      children: [
        u("div", {
          className: "star-placeholders",
          children: [1, 2, 3, 4, 5].map(() => u(ue, { name: "star" })),
        }),
        u("div", {
          className: "star-handlers",
          onMouseLeave: () => a(),
          style: { color: M(r, "ratings.star_color") },
          "aria-labelledby": r + "-ratings-title",
          role: "radiogroup",
          children: [1, 2, 3, 4, 5].map((d) => {
            let f = 0;
            const h = t ?? 0;
            return (
              n && n >= d && (f = 1),
              n ? n >= d && (f = 1) : h >= d && (f = 1),
              u(ue, {
                name: "star",
                wrapperProps: {
                  onMouseEnter: () => l(d),
                  style: { opacity: f },
                  onClick: () => o(d),
                  onKeyDown: (p) => c(p, d),
                  role: "radio",
                  "aria-checked": h === d,
                  "aria-label": d + " stars",
                  id: "star-" + r + "-" + d,
                  tabindex: h === 0 ? (d === 0 ? 0 : -1) : h === d ? 0 : -1,
                },
              })
            );
          }),
        }),
      ],
    }),
  });
}
function bg() {
  const n = b.use("ratings"),
    e = C();
  return u("div", {
    class: "ratings",
    children: [
      u("div", {
        class: "ratings-title",
        id: e + "-ratings-title",
        children: [M(e, "text.ratings") || k(e, "ratings_text"), " "],
      }),
      u("div", {
        class: "ratings-inner",
        children: [
          n.average
            ? u("div", {
                class: "ratings-average",
                "aria-label": k(e, "ratings_average_aria", {
                  "*": n.average.toFixed(1),
                }),
                children: n.average.toFixed(1),
              })
            : null,
          u(gg, {}),
          n.count
            ? u("div", {
                class: "ratings-count",
                children:
                  n.count === 1
                    ? k(e, "ratings_1")
                    : k(e, "ratings_multi", { "*": n.count.toString() }),
              })
            : null,
        ],
      }),
    ],
  });
}
function Zr(n) {
  return n && typeof n == "object" && !Array.isArray(n);
}
function Oi(n, ...e) {
  if (!e.length) return n;
  const t = e.shift();
  if (Zr(n) && Zr(t))
    for (const r in t)
      Zr(t[r])
        ? (n[r] || Object.assign(n, { [r]: {} }), Oi(n[r], t[r]))
        : Object.assign(n, { [r]: t[r] });
  return Oi(n, ...e);
}
function xg() {
  const n = b.use("modalImageUrl"),
    e = C();
  return n
    ? u("div", {
        class: "image-modal",
        children: [
          u("div", {
            class: "modal-closer",
            onClick: () => b.set(e, "modalImageUrl", null),
          }),
          u("img", { src: n, alt: "Popup image" }),
        ],
      })
    : null;
}
function yg(n) {
  const e = C(),
    [t, r] = w("loading"),
    [i, o] = w(null),
    s = b.use("language"),
    l = b.use("colors");
  z(() => {
    var f, h;
    b.set(e, "websiteId", n.website.id),
      b.set(e, "htDomain", n.instance || "https://talk.hyvor.com"),
      b.set(e, "components", n.components);
    const d =
      ((h = (f = n.settings) == null ? void 0 : f.comments_view) == null
        ? void 0
        : h.default_sort) || void 0;
    D.call({
      context: e,
      method: "post",
      endpoint: "/init",
      data: {
        domain: location.hostname,
        page: n.page,
        sso: n.sso,
        comments: { sort: d },
      },
      success: (p) => {
        Ol.set(p.config);
        const m = vg(p.website, n.settings);
        b.set(e, "website", m),
          b.set(e, "page", p.page),
          b.set(e, "license", p.license);
        const g = p.language;
        n.translations &&
          (g.translations = { ...g.translations, ...n.translations }),
          b.set(e, "language", g),
          p.page_badges && b.set(e, "pageBadges", p.page_badges),
          b.set(e, "badges", p.badges),
          b.set(e, "plans", p.plans),
          n.onLoad(m),
          vl(e, p.user_page_state),
          wl(e, p.user_website_state),
          p.user && b.set(e, "user", p.user),
          b.set(e, "commentsFirstLoadedAt", ro()),
          b.set(e, "commentsSort", d || p.website.comments_view.default_sort),
          Ke(e, p.comments.indexed),
          b.set(e, "commentsList", p.comments.list),
          b.set(e, "commentsHasMoreIds", p.comments.has_more_ids),
          p.stateless_sso_token &&
            b.set(e, "statelessSsoToken", p.stateless_sso_token),
          new eu(e),
          xd(e),
          r("success"),
          Fe(e, "loaded", null);
      },
      error: (p) => {
        r("error"), o(p);
      },
    });
  }, []);
  let a,
    c = null;
  return (
    t === "loading"
      ? (a = u(W, { padding: 60 }))
      : t === "error"
      ? (a = u(kg, { error: i }))
      : ((c = M(e, "ui.width")),
        (a = u("div", { children: [u(_g, {}), u(pg, {})] }))),
    u("div", {
      id: "app",
      part: "app",
      class: l + (s.is_rtl ? " rtl" : ""),
      dir: s.is_rtl ? "rtl" : "ltr",
      style: { width: c ? c + "px" : "100%" },
      children: [a, u(J0, {}), u(xg, {}), u(mu, {})],
    })
  );
}
function kg({ error: n }) {
  return n ? u("div", { id: "error", children: n }) : null;
}
function _g() {
  const n = C(),
    e = M(n, "top_widget");
  return e === "reactions" ? u(au, {}) : e === "ratings" ? u(bg, {}) : null;
}
function vg(n, e) {
  return (
    delete e.id,
    delete (e.auth || {}).type,
    delete (e.auth || {}).sso_type,
    Oi(n, e)
  );
}
class wg extends HTMLElement {
  constructor() {
    super();
    G(this, "root");
    G(this, "settings", {});
    G(this, "translations", null);
    G(this, "components", {});
    G(this, "loaded", !1);
    G(this, "context");
    const t = this.attachShadow({ mode: "open" }),
      r = document.createElement("div");
    (r.id = "root"),
      t.append(r),
      this.addStylesheet($c),
      (this.root = r),
      (this.context = Math.ceil(Math.random() * 1e9));
  }
  connectedCallback() {
    this.id = "hyvor-talk-comments-" + this.context;
    const t = this.getLoading();
    if (t === "default") this.load();
    else if (t === "lazy") {
      const r = new IntersectionObserver(
        (i) => {
          i[0].isIntersecting && (this.load(), r.disconnect());
        },
        { threshold: 0 }
      );
      r.observe(this);
    }
  }
  disconnectedCallback() {
    var t;
    (t = Zd(this.context)) == null || t.disconnect();
  }
  load() {
    const t = this.getAttribute("sso-user"),
      r = this.getAttribute("sso-hash"),
      i = this.getAttribute("instance");
    i && this.observeImages(i),
      Bc(
        u(ul.Provider, {
          value: this.context,
          children: u(yg, {
            website: { id: Number(this.getAttribute("website-id")) },
            page: {
              identifier: this.getPageIdentifier(),
              url: this.getPageUrl(),
              title: this.getAttribute("page-title") || document.title,
              language: this.getAttribute("page-language"),
              author: this.getAttribute("page-author"),
              badges: this.getAttribute("page-badges"),
            },
            sso: t ? { user: t, hash: r ?? "" } : null,
            settings: this.getSettings(),
            translations: this.getTranslations(),
            components: this.components,
            onLoad: (o) => this.handleLoad(o),
            instance: i,
          }),
        }),
        this.root
      );
  }
  observeImages(t) {
    const r = (o) => {
      o.src.includes("https://talk.hyvor.com") &&
        (o.src = o.src.replace("https://talk.hyvor.com", t));
    };
    new MutationObserver((o) => {
      for (const s of o)
        s.type === "childList" &&
          s.addedNodes.forEach((l) => {
            l.tagName === "IMG" && r(l),
              l.querySelectorAll && l.querySelectorAll("img").forEach(r);
          });
    }).observe(this.shadowRoot, { childList: !0, subtree: !0 });
  }
  getSettings() {
    if (Object.keys(this.settings).length) return this.settings;
    const t = this.getAttribute("settings");
    if (!t) return {};
    let r = {};
    try {
      if (((r = JSON.parse(t)), typeof r != "object"))
        return console.error("Invalid settings attribute"), {};
    } catch (i) {
      return console.error("Invalid settings attribute", i), {};
    }
    return r;
  }
  getTranslations() {
    if (this.translations) return this.translations;
    const t = this.attributes,
      r = {};
    for (let i = 0; i < t.length; i++) {
      const o = t[i];
      if (o.name.startsWith("t-")) {
        const s = o.name.replace("t-", "").replaceAll("-", "_");
        r[s] = o.value;
      }
    }
    return r;
  }
  getPageIdentifier() {
    return this.getAttribute("page-id") || this.getPageUrl();
  }
  getPageUrl() {
    var t;
    return (
      this.getAttribute("page-url") ||
      ((t = document.querySelector("link[rel='canonical']")) == null
        ? void 0
        : t.getAttribute("href")) ||
      location.href.split("#")[0].split("?")[0]
    );
  }
  handleLoad(t) {
    (this.loaded = !0),
      Ro.setFromConfig(t, this.getAttribute("colors")),
      this.addStylesheet(`
		#root {
			--ht-color-highlight-new: ${t.highlight.new_color};
			--ht-color-highlight-upvote-1: ${t.highlight.upvote_1_color};
			--ht-color-highlight-upvote-2: ${t.highlight.upvote_2_color};
		}
		`),
      t.custom_css && this.addStylesheet(t.custom_css);
  }
  addStylesheet(t) {
    var o;
    const r = document.createElement("style");
    r.textContent = t;
    const i = this.getAttribute("nonce");
    i && r.setAttribute("nonce", i),
      (o = this.shadowRoot) == null || o.append(r);
  }
  getLoading() {
    return this.getAttribute("loading") || "default";
  }
  attributeChangedCallback(t, r, i) {
    t === "colors" && this.loaded && r !== i && Ro.setStyles(i);
  }
  static get observedAttributes() {
    return ["colors"];
  }
  get api() {
    return qd(this.context, this.load.bind(this));
  }
  registerHook(t, r) {
    const i = b.get(this.context, "hooks");
    b.set(this.context, "hooks", { ...i, [t]: [...(i[t] || []), r] });
  }
}
customElements.get("hyvor-talk-comments") === void 0 &&
  customElements.define("hyvor-talk-comments", wg);