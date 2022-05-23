(() => { "use strict"; const t = { min: 0, max: 0, from: 0, to: 0, vertical: !1, range: !0, bar: !0, tip: !0, scale: !0, scaleBase: "step", step: 0, interval: 0, sticky: !1, shiftOnKeyDown: 0, shiftOnKeyHold: 0, onStart: () => !0, onChange: () => !0, onUpdate: () => !0 }, s = { type: "", clientY: 0, clientX: 0, top: 0, left: 0, width: 0, height: 0, shiftBase: 0, moovingControl: "", key: "", repeat: !1 }, i = { fromPosition: 0, toPos: 0, marksArr: [{ pos: 0, val: 0 }], intervalValue: "", stepValue: "", scaleBase: "", barWidth: 0, barPos: 0, fromVal: "", toVal: "", thumb: s }; class e { constructor() { this.observers = [] } subscribe(t) { return !this.observers.includes(t) && (this.observers.push(t), this.observers) } unsubscribe(t) { return this.observers = this.observers.filter((s => s !== t)), this.observers } fire(s, i, e = t) { this.observers.forEach((t => t({ key: s, data: i, conf: e }))) } } var a = function (t, s, i, e) { return new (i || (i = Promise))((function (a, o) { function n(t) { try { h(e.next(t)) } catch (t) { o(t) } } function r(t) { try { h(e.throw(t)) } catch (t) { o(t) } } function h(t) { var s; t.done ? a(t.value) : (s = t.value, s instanceof i ? s : new i((function (t) { t(s) }))).then(n, r) } h((e = e.apply(t, s || [])).next()) })) }; class o extends e { constructor(e) { super(), this.changeMode = !1, this.backEndConf = {}, this.conf = t, this.data = Object.assign(Object.assign({}, i), { thumb: Object.assign({}, s) }), this.methods = { calcFromPosition: !1, calcToPosition: !1, calcScale: !1, calcBar: !1, switchVertical: !1, switchRange: !1, switchScale: !1, switchBar: !1, switchTip: !1, updateControlPos: !1 }, this.startConf = e, this.noCalVal = !1 } getConf(t) { this.backEndConf = t; const s = Object.assign(Object.assign(Object.assign({}, this.conf), this.startConf), this.backEndConf); return this.conf = o.checkConf(s), this.conf } start() { this.onStart = this.conf.onStart, this.onUpdate = this.conf.onUpdate, this.onChange = this.conf.onChange, this.calcScale(), this.calcFromPosition(), this.calcToPosition(), this.calcBar(), "function" == typeof this.onStart && this.onStart(this.conf) } getData() { return this.conf } calcPos(t) { const { type: s, clientY: i, clientX: e, top: a, left: o, width: n, height: r, shiftBase: h, moovingControl: l } = t; let c = 0; if (this.conf.vertical) c = 100 - 100 * (i - a) / r; else { let t = 0; "pointermove" === s && (t = 100 * h / n), c = 100 * (e - o) / n - t } this.conf.sticky && (c = this.setSticky(c)); let m = !1; if (c < 0) return m = !0, this.calcVal("min", 0, l), "newPosition < 0"; if (c > 100) return m = !0, this.calcVal("max", 0, l), "newPosition > 100"; if (this.conf.range) { if ("min" === l && c > this.data.toPos) return m = !0, this.calcVal("meetMax", 0, l), "newPosition > toPos"; if ("max" === l && c < this.data.fromPosition) return m = !0, this.calcVal("meetMin", 0, l), "newPosition < fromPosition" } return "min" === l ? (this.data.fromPosition = c, this.fire("FromPosition", this.data, this.conf)) : (this.data.toPos = c, this.fire("ToPosition", this.data, this.conf)), m || this.calcVal("normal", c, l), this.calcBar(), "function" == typeof this.onChange && this.onChange(this.conf), c } calcPosKey(t) { const { key: s, repeat: i, moovingControl: e } = t, a = t => (this.conf.from = t.val, this.data.fromPosition = t.pos, this.data.fromVal = String(t.val), this.fire("FromPosition", this.data), this.fire("FromValue", this.data), { newVal: String(t.val), newPosition: t.pos }), o = t => (this.conf.to = t.val, this.data.toPos = t.pos, this.data.toVal = String(t.val), this.fire("ToPosition", this.data), this.fire("ToValue", this.data), { newVal: String(t.val), newPosition: t.pos }), n = t => i ? this.data.marksArr[t + this.conf.shiftOnKeyHold] : this.data.marksArr[t + this.conf.shiftOnKeyDown], r = t => i ? this.data.marksArr[t - this.conf.shiftOnKeyHold] : this.data.marksArr[t - this.conf.shiftOnKeyDown]; let h, l, c; if (this.conf.sticky) if ("min" === e) { const t = this.data.marksArr.findIndex((t => t.val === this.conf.from)); if ("ArrowRight" === s || "ArrowUp" === s) { if (l = n(t), void 0 === l) return "newPosition>100"; c = l.val > this.conf.from && (this.conf.range && l.val <= this.conf.to || !this.conf.range && l.val <= this.conf.max) ? a(l) : "too big newPosition" } else { if (l = r(t), void 0 === l) return "newPosition<0"; c = this.conf.range && l.val < this.conf.to || !this.conf.range ? a(l) : "too small newPosition" } } else { const t = this.data.marksArr.findIndex((t => t.val === this.conf.to)); if ("ArrowRight" === s || "ArrowUp" === s) { if (l = n(t), void 0 === l) return "newPosition>100"; c = l && l.val > this.conf.to && this.conf.to < this.conf.max ? o(l) : "too big newPosition" } else { if (l = r(t), void 0 === l) return "newPosition<0"; c = l.val >= this.conf.from && this.conf.to > this.conf.from ? o(l) : "too small newPosition" } } else { if (this.noCalVal = !0, "min" === e) { if ("ArrowRight" === s || "ArrowUp" === s) { const t = this.conf.range && this.conf.from < this.conf.to, s = !this.conf.range && this.conf.from < this.conf.max, e = this.conf.range && this.conf.from >= this.conf.to, a = !this.conf.range && this.conf.from >= this.conf.max; (t || s) && (h = i ? this.conf.from + this.conf.shiftOnKeyHold : this.conf.from + this.conf.shiftOnKeyDown, this.conf.range && h > this.conf.to && (h = this.conf.to), !this.conf.range && h > this.conf.max && (h = this.conf.max)), e && (h = this.conf.to), a && (h = this.conf.max) } else this.conf.from > this.conf.min ? (h = i ? this.conf.from - this.conf.shiftOnKeyHold : this.conf.from - this.conf.shiftOnKeyDown, h < this.conf.min && (h = this.conf.min)) : h = this.conf.min; this.data.fromVal = String(h), this.conf.from = Number(h), this.calcFromPosition(), this.fire("FromValue", this.data), c = h } else "ArrowRight" === s || "ArrowUp" === s ? this.conf.to < this.conf.max ? (h = i ? this.conf.to + this.conf.shiftOnKeyHold : this.conf.to + this.conf.shiftOnKeyDown, h > this.conf.max && (h = this.conf.max)) : h = this.conf.max : this.conf.to > this.conf.from ? (h = i ? this.conf.to - this.conf.shiftOnKeyHold : this.conf.to - this.conf.shiftOnKeyDown, h < this.conf.from && (h = this.conf.from)) : h = this.conf.from, this.data.toVal = String(h), this.conf.to = h, this.calcToPosition(), this.fire("ToValue", this.data), c = h; this.noCalVal = !1 } return this.calcBar(), "function" == typeof this.onChange && this.onChange(this.conf), c } static checkConf(t) { const s = t, i = t => { let s = 0; return Number.isNaN(+t) || (s = +t), s }, e = t => { let s = !1; return !0 !== t && "true" !== t || (s = !0), s }; return s.min = i(s.min), s.max = i(s.max), s.from = i(s.from), s.to = i(s.to), s.step = i(s.step), s.interval = i(s.interval), s.shiftOnKeyDown = i(s.shiftOnKeyDown), s.shiftOnKeyHold = i(s.shiftOnKeyHold), s.vertical = e(s.vertical), s.range = e(s.range), s.sticky = e(s.sticky), s.scale = e(s.scale), s.bar = e(s.bar), s.tip = e(s.tip), "step" !== s.scaleBase && "interval" !== s.scaleBase && (s.scaleBase = "step"), s.shiftOnKeyDown <= 0 && (s.shiftOnKeyDown = 1), s.shiftOnKeyHold <= 0 && (s.shiftOnKeyHold = 1), s.max <= s.min && (s.max = s.min + 10, s.from = s.min, s.to = s.max), s.from < s.min && (s.from = s.min), s.to < s.min && (s.to = s.from), !s.range && s.to > s.max && (s.to = s.from), s.range && s.to > s.max && (s.to = s.max), s.range && s.from > s.max && (s.from = s.to), !s.range && s.from > s.max && (s.from = s.max), s.range && s.from > s.to && (s.from = s.min), s.step <= 0 && (s.step = (s.max - s.min) / 2), s.interval <= 0 && (s.interval = 2), s } update(t) { let s = Object.assign(Object.assign({}, this.conf), t); s = o.checkConf(s), this.findChangedConf(this.conf, s), this.conf = s; const i = Object.keys(this.methods); for (let t = 0; t < i.length; t += 1) { const s = i[t]; this.methods[s] && this[s]() } "function" == typeof this.onUpdate && this.onUpdate(this.conf); for (let t = 0; t < i.length; t += 1) { const s = i[t]; this.methods[s] && (this.methods[s] = !1) } return this.noCalVal = !1, Object.assign(this.conf, this.data) } findChangedConf(t, s) { const i = Object.keys(s); for (let e = 0; e < i.length; e += 1) { const a = i[e]; if (s[a] !== t[a]) switch (a) { case "min": case "max": this.noCalVal = !1, this.methods.calcScale = !0, this.methods.calcFromPosition = !0, this.methods.calcToPosition = !0, this.methods.calcBar = !0; break; case "from": this.methods.calcFromPosition = !0, this.methods.calcBar = !0; break; case "to": this.methods.calcToPosition = !0, this.methods.calcBar = !0; break; case "step": case "interval": this.methods.calcScale = !0, this.methods.updateControlPos = !0; break; case "scaleBase": this.methods.calcScale = !0; break; case "vertical": this.methods.switchVertical = !0; break; case "range": this.methods.switchRange = !0; break; case "scale": this.methods.switchScale = !0; break; case "bar": this.methods.switchBar = !0; break; case "tip": this.methods.switchTip = !0; break; case "sticky": this.methods.updateControlPos = !0; break; case "onStart": s.onStart && (this.conf.onStart = s.onStart, this.onStart = s.onStart); break; case "onChange": s.onChange && (this.conf.onChange = s.onChange, this.onChange = s.onChange); break; case "onUpdate": s.onUpdate && (this.conf.onUpdate = s.onUpdate, this.onUpdate = s.onUpdate); break; default: return !0 } } return this.methods } switchVertical() { return a(this, void 0, void 0, (function* () { yield this.fire("IsVertical", this.data, this.conf), yield this.calcFromPosition(), yield this.calcToPosition(), yield this.calcBar(), yield this.calcScale() })) } switchRange() { return a(this, void 0, void 0, (function* () { yield this.fire("IsRange", this.data, this.conf), yield this.calcBar(), "function" == typeof this.onChange && (yield this.onChange(this.conf)) })) } updateControlPos() { return a(this, void 0, void 0, (function* () { yield this.calcFromPosition(), yield this.calcToPosition(), yield this.calcBar(), "function" == typeof this.onChange && (yield this.onChange(this.conf)), yield this.fire("IsSticky", this.data, this.conf) })) } switchScale() { this.fire("IsScale", this.data, this.conf) } switchBar() { this.fire("IsBar", this.data, this.conf) } switchTip() { this.fire("IsTip", this.data, this.conf) } setSticky(t) { let s = 0; for (let i = 0; i < this.data.marksArr.length; i += 1) { let e = 0; if (i < this.data.marksArr.length - 1 && (e = this.data.marksArr[i + 1].pos), Math.abs(t - this.data.marksArr[i].pos) < Math.abs(t - e)) { s = this.data.marksArr[i].pos; break } } return s } calcFromPosition() { this.data.fromPosition = 100 * (this.conf.from - this.conf.min) / (this.conf.max - this.conf.min), this.conf.sticky && (this.data.fromPosition = this.setSticky(this.data.fromPosition)), this.noCalVal || this.calcVal("normal", this.data.fromPosition, "min"), this.fire("FromPosition", this.data, this.conf) } calcToPosition() { this.data.toPos = 100 * (this.conf.to - this.conf.min) / (this.conf.max - this.conf.min), this.conf.sticky && (this.data.toPos = this.setSticky(this.data.toPos)), this.noCalVal || this.calcVal("normal", this.data.toPos, "max"), this.fire("ToPosition", this.data, this.conf) } calcBar() { this.conf.range ? (this.data.barPos = this.data.fromPosition, this.data.barWidth = this.data.toPos - this.data.fromPosition) : (this.data.barPos = 0, this.data.barWidth = this.data.fromPosition), this.fire("Bar", this.data, this.conf) } calcScale() { let t = 1, s = 1; if ("step" === this.conf.scaleBase) { s = this.conf.step, t = (this.conf.max - this.conf.min) / s; const i = String(t % 1 == 0 ? t : Math.trunc(t + 1)); this.data.scaleBase = "step", this.data.intervalValue = i, this.data.stepValue = String(this.conf.step), this.conf.interval = parseFloat(i) } if ("interval" === this.conf.scaleBase) { t = this.conf.interval, s = (this.conf.max - this.conf.min) / t; const i = String(s % 1 == 0 ? s : s.toFixed(2)); this.data.scaleBase = "interval", this.data.intervalValue = String(t), this.data.stepValue = i, this.conf.step = parseFloat(i) } this.data.marksArr = [{ val: this.conf.min, pos: 0 }]; let i = this.conf.min; for (let e = 0; e < t; e += 1) { const t = { val: 0, pos: 0 }; if (i += s, i <= this.conf.max) { const s = 100 * (i - this.conf.min) / (this.conf.max - this.conf.min); t.val = parseFloat(i.toFixed(2)), t.pos = s, this.data.marksArr.push(t) } } this.data.marksArr[this.data.marksArr.length - 1].val < this.conf.max && this.data.marksArr.push({ val: this.conf.max, pos: 100 }), this.fire("Scale", this.data, this.conf) } calcVal(t, s, i) { if (!this.changeMode) { let e = ""; "normal" === t ? e = (this.conf.min + (this.conf.max - this.conf.min) * s / 100).toFixed(0) : "min" === t ? e = String(this.conf.min) : "max" === t ? e = String(this.conf.max) : "meetMax" === t ? e = String(this.conf.to) : "meetMin" === t && (e = String(this.conf.from)), "min" === i ? (this.data.fromVal = e, this.conf.from = parseFloat(e), this.fire("FromValue", this.data)) : (this.data.toVal = e, this.conf.to = parseFloat(e), this.fire("ToValue", this.data)) } } } const n = o; class r { constructor(s, i) { this.controlMinDist = 0, this.controlMaxDist = 0, this.markList = [], this.conf = t, this.checkNext = !1, this.lastLabelRemoved = !1, this.slider = s, this.conf = i, this.track = r.getElem(this.slider, ".rs-metalamp__track"), this.progressBar = document.createElement("div"), this.progressBar.className = "rs-metalamp__progressBar", this.track.append(this.progressBar), this.switchBar(i) } static getElem(t, s) { return t.querySelector(s) } switchVertical(t) { const { classList: s } = this.progressBar; t.vertical ? s.add("rs-metalamp__progressBar_vert") : s.remove("rs-metalamp__progressBar_vert") } switchBar(t) { this.conf = t; const { classList: s } = this.progressBar; this.conf.bar ? s.remove("rs-metalamp__progressBar_hidden") : s.add("rs-metalamp__progressBar_hidden") } updateBar(t, s, i) { const { style: e } = this.progressBar; i ? (e.bottom = `${t}%`, e.height = `${s}%`, e.left = "", e.width = "") : (e.left = `${t}%`, e.width = `${s}%`, e.bottom = "", e.height = "") } } const h = r; class l extends e { constructor(t, e) { super(), this.initDone = !1, this.defineControl = t => !t.classList || (t.classList.contains("rs-metalamp__control-min") ? "min" : "max"), this.slider = t, this.root = t.previousElementSibling, this.track = t.firstElementChild, this.data = Object.assign(Object.assign({}, i), { thumb: Object.assign({}, s) }), this.conf = e, this.controlMin = l.renderControl("rs-metalamp__control-min", "rs-metalamp__tip-min", this.conf.from), this.tipMin = l.getElem(this.controlMin, ".rs-metalamp__tip"), this.track.append(this.controlMin), this.controlMax = l.renderControl("rs-metalamp__control-max", "rs-metalamp__tip-max", this.conf.to), this.tipMax = l.getElem(this.controlMax, ".rs-metalamp__tip"), this.track.append(this.controlMax), this.init(e), this.dragControlMouse(), this.dragControlTouch(), this.pressControl(), this.clickTrack() } updatePos(t, s) { const i = t; this.initDone || (this.initDone = !0), this.conf.vertical ? (i.style.bottom = `${s}%`, i.style.left = "") : (i.style.left = `${s}%`, i.style.bottom = ""), "min" === this.defineControl(i) ? this.tipMin.style.left = l.calcTipPos(this.conf.vertical, this.tipMin) : this.tipMax.style.left = l.calcTipPos(this.conf.vertical, this.tipMax) } updateVal(t, s) { s ? this.tipMin.innerText = t : this.tipMax.innerText = t } updateInput(t) { "INPUT" === this.root.tagName && (this.root.value = this.conf.range ? `${t.from}, ${t.to}` : String(t.from)) } switchVertical(t) { this.conf = t, this.conf.vertical ? (this.controlMax.classList.add("rs-metalamp__control_vert"), this.tipMax.classList.add("rs-metalamp__tip_vert"), this.controlMin.classList.add("rs-metalamp__control_vert"), this.tipMin.classList.add("rs-metalamp__tip_vert"), this.controlMax.classList.remove("rs-metalamp__control_horizontal"), this.tipMax.classList.remove("rs-metalamp__tip_horizontal"), this.controlMin.classList.remove("rs-metalamp__control_horizontal"), this.tipMin.classList.remove("rs-metalamp__tip_horizontal")) : (this.controlMax.classList.remove("rs-metalamp__control_vert"), this.tipMax.classList.remove("rs-metalamp__tip_vert"), this.controlMin.classList.remove("rs-metalamp__control_vert"), this.tipMin.classList.remove("rs-metalamp__tip_vert"), this.controlMax.classList.add("rs-metalamp__control_horizontal"), this.tipMax.classList.add("rs-metalamp__tip_horizontal"), this.controlMin.classList.add("rs-metalamp__control_horizontal"), this.tipMin.classList.add("rs-metalamp__tip_horizontal")) } switchRange(t) { this.conf = t, this.conf.range ? (this.controlMax.classList.remove("rs-metalamp__control_hidden"), this.conf.tip && this.tipMax.classList.remove("rs-metalamp__tip_hidden")) : (this.controlMax.classList.add("rs-metalamp__control_hidden"), this.tipMax.classList.add("rs-metalamp__tip_hidden")) } switchTip(t) { this.conf = t, this.conf.tip ? (this.tipMax.classList.remove("rs-metalamp__tip_hidden"), this.tipMin.classList.remove("rs-metalamp__tip_hidden"), this.initDone && (this.tipMax.style.left = l.calcTipPos(t.vertical, this.tipMax), this.tipMin.style.left = l.calcTipPos(t.vertical, this.tipMin))) : (this.tipMax.classList.add("rs-metalamp__tip_hidden"), this.tipMin.classList.add("rs-metalamp__tip_hidden")) } static calcTipPos(t, s) { return t ? -1 * s.offsetWidth - 5 + "px" : s.offsetWidth / 2 * -1 + "px" } static getElem(t, s) { return t.querySelector(s) } static renderControl(t, s, i) { const e = document.createElement("button"); e.className = "rs-metalamp__control", e.classList.add(t); const a = document.createElement("span"); return a.className = "rs-metalamp__tip", a.classList.add(s), a.innerText = String(i), e.append(a), e } init(t) { this.conf = t, this.switchRange(this.conf), this.switchTip(this.conf) } renderLeftControl() { this.controlMin = l.renderControl("rs-metalamp__control-min", "rs-metalamp__tip-min", this.conf.from), this.tipMin = this.controlMin.querySelector(".rs-metalamp__tip"), this.track.append(this.controlMin) } renderRightControl() { this.controlMax = l.renderControl("rs-metalamp__control-max", "rs-metalamp__tip-max", this.conf.to), this.tipMax = this.controlMax.querySelector(".rs-metalamp__tip"), this.track.append(this.controlMax) } getMetrics(t) { const s = t.parentElement, i = this.data.thumb; i.top = s.getBoundingClientRect().top, i.left = s.getBoundingClientRect().left, i.width = s.offsetWidth, i.height = s.offsetHeight } dragControlMouse() { const t = () => !1; this.slider.addEventListener("pointerdown", (t => { t.preventDefault(); const { target: s } = t; if (!(s instanceof HTMLElement)) throw new Error("Cannot handle move outside of DOM"); s.classList.contains("rs-metalamp__control") && s.classList.add("rs-metalamp__control_grabbing"); const i = this.data.thumb; if (s.classList.contains("rs-metalamp__control")) { i.moovingControl = String(this.defineControl(s)), this.conf.vertical || (i.shiftBase = t.clientX - s.getBoundingClientRect().left), this.getMetrics(s); const e = t => { i.type = t.type, i.clientX = t.clientX, i.clientY = t.clientY, this.fire("MoveEvent", this.data) }, a = () => { s.classList.remove("rs-metalamp__control_grabbing"), s.removeEventListener("pointermove", e), s.removeEventListener("pointerup", a) }; s.setPointerCapture(t.pointerId), s.addEventListener("pointermove", e), s.addEventListener("pointerup", a) } })), this.slider.addEventListener("dragstart", t), this.slider.addEventListener("selectstart", t) } dragControlTouch() { this.slider.addEventListener("touchstart", (t => { t.preventDefault(); const { target: s } = t; if (!(s instanceof HTMLElement)) throw new Error("Cannot handle move outside of DOM"); const i = this.data.thumb; if (s.classList.contains("rs-metalamp__control")) { i.moovingControl = String(this.defineControl(s)), this.getMetrics(s); const t = t => { i.type = t.type, i.clientX = t.targetTouches[0] ? t.targetTouches[0].clientX : 0, i.clientY = t.targetTouches[0] ? t.targetTouches[0].clientY : 0, this.fire("MoveEvent", this.data) }; s.addEventListener("touchmove", t) } })) } pressControl() { this.slider.addEventListener("keydown", (t => { if (-1 !== ["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp"].indexOf(t.code)) { t.preventDefault(); const { target: s } = t; if (!(s instanceof HTMLElement)) throw new Error("Cannot handle move outside of DOM"); const i = this.data.thumb; s.classList.contains("rs-metalamp__control") && (i.moovingControl = s.classList.contains("rs-metalamp__control-min") ? "min" : "max", i.key = t.code, i.repeat = t.repeat, this.fire("KeydownEvent", this.data)) } })) } clickTrack() { this.slider.addEventListener("pointerdown", (t => { t.preventDefault(); const { target: s } = t; if (!(s instanceof HTMLElement)) throw new Error("Cannot handle move outside of DOM"); const i = this.data.thumb, e = ["rs-metalamp__track", "rs-metalamp__progressBar", "rs-metalamp__label", "rs-metalamp__mark", "rs-metalamp__frame"]; if ([...s.classList].some((t => -1 !== e.indexOf(t)))) { let s = 0, e = 0; this.conf.vertical ? (s = Math.abs(this.controlMin.getBoundingClientRect().bottom - t.clientY), e = Math.abs(this.controlMax.getBoundingClientRect().bottom - t.clientY)) : (s = Math.abs(this.controlMin.getBoundingClientRect().left - t.clientX), e = Math.abs(this.controlMax.getBoundingClientRect().left - t.clientX)), i.top = this.track.getBoundingClientRect().top, i.left = this.track.getBoundingClientRect().left, i.width = Number(this.track.offsetWidth), i.height = Number(this.track.offsetHeight), i.type = t.type, i.clientX = t.clientX, i.clientY = t.clientY, this.controlMax.classList.contains("hidden") ? i.moovingControl = "min" : i.moovingControl = s <= e ? "min" : "max", this.fire("MoveEvent", this.data) } })) } } const c = l, m = class extends e { constructor(s) { super(), this.backEndConf = {}, this.conf = t, this.handleMoveEvent = t => { "MoveEvent" === t.key && this.fire("MoveEvent", t.data) }, this.handleKeydownEvent = t => { "KeydownEvent" === t.key && this.fire("KeydownEvent", t.data) }, this.root = s, this.slider = document.createElement("div"), this.slider.className = "rs-metalamp__wrapper", this.root.after(this.slider), this.track = document.createElement("div"), this.track.className = "rs-metalamp__track", this.slider.append(this.track), this.frame = document.createElement("div"), this.frame.className = "rs-metalamp__frame", this.slider.append(this.frame), this.collectParms() } init(t) { this.conf = t, this.createSubViews(), this.createListeners(), this.switchVertical(t) } disable() { this.slider.classList.add("rs-metalamp__wrapper_disabled") } enable() { this.slider.classList.remove("rs-metalamp__wrapper_disabled") } updateFromPos(t, s) { this.viewControl && (this.viewControl.updatePos(this.viewControl.controlMin, t.fromPosition), this.viewControl.updateInput(s)) } updateToPos(t, s) { this.viewControl && (this.viewControl.updatePos(this.viewControl.controlMax, t.toPos), this.viewControl.updateInput(s)) } updateFromVal(t) { this.viewControl && this.viewControl.updateVal(t.fromVal, !0) } updateToVal(t) { this.viewControl && this.viewControl.updateVal(t.toVal, !1) } updateScale(t, s) { this.viewScale && this.viewScale.createScale(t.marksArr, s) } updateBar(t, s) { this.viewBar && this.viewBar.updateBar(t.barPos, t.barWidth, s.vertical) } switchVertical(t) { t.vertical ? (this.slider.classList.add("rs-metalamp__wrapper_vert"), this.track.classList.add("rs-metalamp__track_vert"), this.frame.classList.add("rs-metalamp__frame_vert")) : (this.slider.classList.remove("rs-metalamp__wrapper_vert"), this.track.classList.remove("rs-metalamp__track_vert"), this.frame.classList.remove("rs-metalamp__frame_vert")), this.viewBar && this.viewControl && (this.viewBar.switchVertical(t), this.viewControl.switchVertical(t)) } switchRange(t) { this.viewControl && this.viewControl.switchRange(t) } switchScale(t) { this.viewScale && this.viewScale.switchScale(t) } switchBar(t) { this.viewBar && this.viewBar.switchBar(t) } switchTip(t) { this.viewControl && this.viewControl.switchTip(t) } collectParms() { this.backEndConf = {}; const t = new Map, s = ["min", "max", "from", "to", "step", "interval", "shiftonkeydown", "shiftonkeyhold", "scalebase", "vertical", "range", "sticky", "scale", "bar", "tip"]; for (let i = 0; i < this.root.attributes.length; i += 1) { const e = this.root.attributes[i], a = e.name.replace(/^data-/, ""); -1 !== s.indexOf(a) && t.set(a, e.value) } t.forEach((s => { /^-?\d+\.?\d*$/.test(s[1]) && t.set(s[0], parseFloat(s[1])), "true" === s[1] && t.set(s[0], !0), "false" === s[1] && t.set(s[0], !1), "shiftonkeydown" === s[0] && (t.set("shiftOnKeyDown", s[1]), t.delete(s[0])), "shiftonkeyhold" === s[0] && (t.set("shiftOnKeyHold", s[1]), t.delete(s[0])), "scalebase" === s[0] && (t.set("scaleBase", s[1]), t.delete(s[0])) })), this.backEndConf = Object.fromEntries(t.entries()) } createSubViews() { this.viewControl = new c(this.slider, this.conf), this.viewScale = new class { constructor(t, s, i, e = []) { this.startWidth = 0, this.markList = [], this.lastLabelRemoved = !1, this.scaleMarks = [], this.calcMarkList = !1, this.conf = i, this.slider = t, this.track = s, 0 === e.length ? this.calcMarkList = !0 : this.markList = e } createScale(t, s) { this.conf = s, this.scaleMarks = t; const i = this.slider.querySelectorAll(".js-rs-metalamp__mark"); return this.calcMarkList && (i.length && i.forEach((t => t.remove())), t.forEach((t => { const i = document.createElement("div"); i.classList.add("rs-metalamp__mark"), i.classList.add("js-rs-metalamp__mark"); const e = document.createElement("div"); e.innerText = String(t.val), e.classList.add("rs-metalamp__label"), i.appendChild(e), s.vertical ? (i.classList.add("rs-metalamp__mark_vert"), e.classList.add("rs-metalamp__label_vert"), i.style.bottom = `${String(t.pos)}%`) : (i.classList.add("rs-metalamp__mark_horizontal"), e.classList.add("rs-metalamp__label_horizontal"), i.style.left = `${String(t.pos)}%`), s.scale || i.classList.add("rs-metalamp__mark_visually-hidden"), this.track.appendChild(i), s.vertical ? e.style.top = e.offsetHeight / 2 * -1 + "px" : e.style.left = e.offsetWidth / 2 * -1 + "px" })), this.markList = [...this.track.querySelectorAll(".js-rs-metalamp__mark")]), this.resize(), this.checkScaleLength(this.markList) } switchScale(t) { this.conf = t; const s = this.slider.querySelectorAll(".js-rs-metalamp__mark"); return this.conf.scale ? s.forEach((t => { t.classList.remove("rs-metalamp__mark_visually-hidden") })) : s.forEach((t => { t.classList.add("rs-metalamp__mark_visually-hidden") })), s } checkScaleLength(t) { const s = t => { for (let s = 1; s < t.length; s += 2)t[s].firstElementChild.classList.add("rs-metalamp__label_hidden"), t[s].classList.add("rs-metalamp__mark_no-label"), t[s].classList.add("js-rs-metalamp__mark_no-label"); this.markList = [...this.track.querySelectorAll(".js-rs-metalamp__mark:not(.js-rs-metalamp__mark_no-label)")], this.lastLabelRemoved = !0, this.checkScaleLength(this.markList) }; if (this.conf.vertical) { let i = 0; if (t.forEach((t => { const s = t.firstElementChild; i += s.getBoundingClientRect().height })), !(i > this.track.offsetHeight)) return this.lastLabelRemoved && this.addLastLabel(this.lastLabelRemoved), this.markList; s(t) } else { let i = 0; if (t.forEach((t => { const s = t.firstElementChild; i += s.getBoundingClientRect().width })), !(i > this.track.offsetWidth)) return this.lastLabelRemoved && this.addLastLabel(this.lastLabelRemoved), this.markList; s(t) } return this.markList } addLastLabel(t) { const s = this.track.querySelectorAll(".js-rs-metalamp__mark:not(.js-rs-metalamp__mark_no-label)"), i = s[s.length - 1], e = this.track.querySelector(".js-rs-metalamp__mark:last-child"); t && (i.classList.add("rs-metalamp__mark_no-label"), i.classList.add("js-rs-metalamp__mark_no-label"), i.firstElementChild.classList.add("rs-metalamp__label_hidden"), e.classList.remove("rs-metalamp__mark_no-label"), e.classList.remove("js-rs-metalamp__mark_no-label"), e.firstElementChild.classList.remove("rs-metalamp__label_hidden")) } resize() { this.startWidth = this.slider.offsetWidth, window.addEventListener("resize", (() => { const t = this.slider.offsetWidth; t !== this.startWidth && (t < this.startWidth && this.checkScaleLength(this.markList), t > this.startWidth && this.createScale(this.scaleMarks, this.conf), this.startWidth = t) })) } }(this.slider, this.track, this.conf), this.viewBar = new h(this.slider, this.conf) } createListeners() { this.viewControl && (this.viewControl.subscribe(this.handleMoveEvent), this.viewControl.subscribe(this.handleKeydownEvent)) } }; class d extends e { constructor(t, s) { super(), this.handleFromPosition = t => { "FromPosition" === t.key && this.view && this.view.updateFromPos(t.data, t.conf) }, this.handleToPosition = t => { "ToPosition" === t.key && this.view && this.view.updateToPos(t.data, t.conf) }, this.handleFromValue = t => { "FromValue" === t.key && this.view && this.view.updateFromVal(t.data) }, this.handleToValue = t => { "ToValue" === t.key && this.view && this.view.updateToVal(t.data) }, this.handleScale = t => { "Scale" === t.key && this.view && this.view.updateScale(t.data, t.conf) }, this.handleBar = t => { "Bar" === t.key && this.view && this.view.updateBar(t.data, t.conf) }, this.handleIsVertical = t => { "IsVertical" === t.key && this.view && this.view.switchVertical(t.conf) }, this.handleIsRange = t => { "IsRange" === t.key && this.view && this.view.switchRange(t.conf) }, this.handleIsScale = t => { "IsScale" === t.key && this.view && this.view.switchScale(t.conf) }, this.handleIsBar = t => { "IsBar" === t.key && this.view && this.view.switchBar(t.conf) }, this.handleIsTip = t => { "IsTip" === t.key && this.view && this.view.switchTip(t.conf) }, this.handleMoveEvent = t => { "MoveEvent" === t.key && this.model && this.model.calcPos({ type: t.data.thumb.type, clientY: t.data.thumb.clientY, clientX: t.data.thumb.clientX, top: t.data.thumb.top, left: t.data.thumb.left, width: t.data.thumb.width, height: t.data.thumb.height, shiftBase: t.data.thumb.shiftBase, moovingControl: t.data.thumb.moovingControl }) }, this.handleKeydownEvent = t => { "KeydownEvent" === t.key && this.model && this.model.calcPosKey({ key: t.data.thumb.key, repeat: t.data.thumb.repeat, moovingControl: t.data.thumb.moovingControl }) }, this.model = t, this.view = s, this.createListeners(), this.init(), this.enabled = !0 } update(t) { this.model && this.model.update(t) } getData() { return !this.model || this.model.getData() } disable() { this.view && (this.removeListeners(), this.enabled = !1, this.view.disable()) } enable() { !this.enabled && this.view && (this.createListeners(), this.view.enable()), this.enabled = !0 } destroy() { this.view && (this.view.slider.remove(), this.view = null, this.model = null) } init() { this.view && this.model && (this.model.getConf(this.view.backEndConf), this.view.init(this.model.conf), this.model.start()) } createListeners() { this.view && this.model && (this.model.subscribe(this.handleFromPosition), this.model.subscribe(this.handleToPosition), this.model.subscribe(this.handleFromValue), this.model.subscribe(this.handleToValue), this.model.subscribe(this.handleBar), this.model.subscribe(this.handleScale), this.model.subscribe(this.handleIsVertical), this.model.subscribe(this.handleIsRange), this.model.subscribe(this.handleIsScale), this.model.subscribe(this.handleIsBar), this.model.subscribe(this.handleIsTip), this.view.subscribe(this.handleMoveEvent), this.view.subscribe(this.handleKeydownEvent)) } removeListeners() { this.view && this.model && (this.model.unsubscribe(this.handleFromPosition), this.model.unsubscribe(this.handleToPosition), this.model.unsubscribe(this.handleFromValue), this.model.unsubscribe(this.handleToValue), this.model.unsubscribe(this.handleBar), this.model.unsubscribe(this.handleScale), this.model.unsubscribe(this.handleIsVertical), this.model.unsubscribe(this.handleIsRange), this.model.unsubscribe(this.handleIsScale), this.model.unsubscribe(this.handleIsBar), this.model.unsubscribe(this.handleIsTip), this.view.unsubscribe(this.handleMoveEvent), this.view.unsubscribe(this.handleKeydownEvent)) } } $.fn.SliderMetaLamp = function (t) { return this.each(((s, i) => { const e = $(i); e.data("SliderMetaLamp") || e.data("SliderMetaLamp", new d(new n(t), new m(i))) })), this } })();