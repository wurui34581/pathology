!(function (t) {
  'use strict'
  function e (e) {
    this.viewer.setMouseNavEnabled(!1)
    var i = this.viewer.viewport.deltaPointsFromPixels(e.delta, !0),
      s = this.viewer.viewport.pointFromPixel(e.position, !0), r = new t.Point(s.x - i.x, s.y - i.y)
    if (this.rect) {
      var n
      if (this.restrictToImage && (n = this.rect.clone()), this.rectDone) {
        if (this.allowRotation) {
          var o = this.rect.getAngleFromCenter(r), h = this.rect.getAngleFromCenter(s)
          this.rect.rotation = (this.rect.rotation + o - h) % Math.PI
        }
      } else this.startRotated ? this.rect = a(this.rotatedStartPoint, s, this.startRotatedHeight) : (this.rect.width += i.x, this.rect.height += i.y)
      var l = this.viewer.world.getHomeBounds()
      this.restrictToImage && !this.rect.fitsIn(new t.Rect(0, 0, l.width, l.height)) && (this.rect = n)
    } else {
      if (this.restrictToImage) {
        if (!c(this, r)) return
        d(i, s)
      }
      this.startRotated ? (this.rotatedStartPoint = r, this.rect = a(r, s, this.startRotatedHeight)) : this.rect = new t.SelectionRect(r.x, r.y, i.x, i.y), this.rectDone = !1
    }
    this.draw()
  }

  function i () { this.rect.width < 0 && (this.rect.x += this.rect.width, this.rect.width = Math.abs(this.rect.width)), this.rect.height < 0 && (this.rect.y += this.rect.height, this.rect.height = Math.abs(this.rect.height)), this.viewer.setMouseNavEnabled(!0), this.rectDone = !0 }

  function s () { this.viewer.canvas.focus() }

  function r (e) {
    t.addClass(this.element, 'dragging')
    var i = this.viewer.viewport.deltaPointsFromPixels(e.delta, !0)
    this.rect.x += i.x, this.rect.y += i.y
    var s = this.viewer.world.getHomeBounds()
    this.restrictToImage && !this.rect.fitsIn(new t.Rect(0, 0, s.width, s.height)) && (this.rect.x -= i.x, this.rect.y -= i.y), this.draw()
  }

  function n () { t.removeClass(this.element, 'dragging') }

  function o (e, i) {
    var s, r = i.delta, n = this.rect.getDegreeRotation(), o = this.restrictToImage ? this.rect.clone() : null
    switch (n !== 0 && (r = r.rotate(-1 * n, new t.Point(0, 0)), s = this.rect.getCenter()), r = this.viewer.viewport.deltaPointsFromPixels(r, !0), e) {
      case 0:
        this.rect.y += r.y, this.rect.height -= r.y
        break
      case 1:
        this.rect.width += r.x
        break
      case 2:
        this.rect.height += r.y
        break
      case 3:
        this.rect.x += r.x, this.rect.width -= r.x
        break
      case 0.5:
        this.rect.y += r.y, this.rect.height -= r.y, this.rect.x += r.x, this.rect.width -= r.x
        break
      case 1.5:
        this.rect.y += r.y, this.rect.height -= r.y, this.rect.width += r.x
        break
      case 2.5:
        this.rect.width += r.x, this.rect.height += r.y
        break
      case 3.5:
        this.rect.height += r.y, this.rect.x += r.x, this.rect.width -= r.x
    }
    if (n !== 0) {
      var h = this.rect.getCenter(), l = h.rotate(n, s)
      r = l.minus(h), this.rect.x += r.x, this.rect.y += r.y
    }
    var a = this.viewer.world.getHomeBounds()
    this.restrictToImage && !this.rect.fitsIn(new t.Rect(0, 0, a.width, a.height)) && (this.rect = o), this.draw()
  }

  function h () { this.rect.width < 0 && (this.rect.x += this.rect.width, this.rect.width = Math.abs(this.rect.width)), this.rect.height < 0 && (this.rect.y += this.rect.height, this.rect.height = Math.abs(this.rect.height)) }

  function l (t) {
    var e = t.keyCode ? t.keyCode : t.charCode
    e === 13 ? this.confirm() : String.fromCharCode(e) === this.keyboardShortcut && this.toggleState()
  }

  function a (e, i, s) {
    if (e.x > i.x) {
      var r = e
      e = i, i = r
    }
    var n = i.minus(e), o = e.distanceTo(i), h = -1 * Math.atan2(n.x, n.y) + Math.PI / 2,
      l = new t.Point(n.x / 2 + e.x, n.y / 2 + e.y), a = new t.SelectionRect(l.x - o / 2, l.y - s / 2, o, s, h),
      c = new t.Point(0, s)
    return c = c.rotate(a.getDegreeRotation(), new t.Point(0, 0)), a.x += c.x / 2, a.y += c.y / 2, a
  }

  function c (t, e) {
    var i = t.viewer.world.getHomeBounds()
    return e.x >= 0 && e.x <= i.width && e.y >= 0 && e.y <= i.height
  }

  function d (t, e) {
    var i
    for (var s in {
      x: 0,
      y: 0
    })i = e[s] - t[s], i < 1 && i > 0 && (e[s] > 1 ? (t[s] -= e[s] - 1, e[s] = 1) : e[s] < 0 && (t[s] -= e[s], e[s] = 0))
  }

  if (!t.version || t.version.major < 2) throw new Error('This version of OpenSeadragonSelection requires OpenSeadragon version 2.0.0+')
  t.Viewer.prototype.selection = function (e) { return this.selectionInstance && !e || (e = e || {}, e.viewer = this, this.selectionInstance = new t.Selection(e)), this.selectionInstance }, t.Selection = function (a) {
    t.extend(!0, this, {
      viewer: null,
      isSelecting: !1,
      buttonActiveImg: !1,
      rectDone: !0,
      element: null,
      toggleButton: null,
      showSelectionControl: !0,
      showConfirmDenyButtons: !0,
      styleConfirmDenyButtons: !0,
      returnPixelCoordinates: !0,
      keyboardShortcut: 'c',
      rect: null,
      allowRotation: !0,
      startRotated: !1,
      startRotatedHeight: 0.1,
      restrictToImage: !1,
      onSelection: null,
      prefixUrl: null,
      navImages: {
        selection: {
          REST: 'selection_rest.png',
          GROUP: 'selection_grouphover.png',
          HOVER: 'selection_hover.png',
          DOWN: 'selection_pressed.png'
        },
        selectionConfirm: {
          REST: 'selection_confirm_rest.png',
          GROUP: 'selection_confirm_grouphover.png',
          HOVER: 'selection_confirm_hover.png',
          DOWN: 'selection_confirm_pressed.png'
        },
        selectionCancel: {
          REST: 'selection_cancel_rest.png',
          GROUP: 'selection_cancel_grouphover.png',
          HOVER: 'selection_cancel_hover.png',
          DOWN: 'selection_cancel_pressed.png'
        }
      },
      handleStyle: {
        top: '50%',
        left: '50%',
        width: '6px',
        height: '6px',
        margin: '-4px 0 0 -4px',
        background: '#000',
        border: '1px solid #ccc'
      },
      cornersStyle: {width: '6px', height: '6px', background: '#000', border: '1px solid #ccc'}
    }, a), t.extend(!0, this.navImages, this.viewer.navImages), this.element || (this.element = t.makeNeutralElement('div'), this.element.style.background = 'rgba(0, 0, 0, 0.1)', this.element.className = 'selection-box'), this.borders = this.borders || []
    for (var c, d = [],
           g = 0; g < 4; g++) { this.borders[g] || (this.borders[g] = t.makeNeutralElement('div'), this.borders[g].className = 'border-' + g, this.borders[g].style.position = 'absolute', this.borders[g].style.width = '1px', this.borders[g].style.height = '1px', this.borders[g].style.background = '#fff'), c = t.makeNeutralElement('div'), c.className = 'border-' + g + '-handle', c.style.position = 'absolute', c.style.top = this.handleStyle.top, c.style.left = this.handleStyle.left, c.style.width = this.handleStyle.width, c.style.height = this.handleStyle.height, c.style.margin = this.handleStyle.margin, c.style.background = this.handleStyle.background, c.style.border = this.handleStyle.border, new t.MouseTracker({
      element: this.borders[g],
      dragHandler: o.bind(this, g),
      dragEndHandler: h.bind(this, g)
    }), d[g] = t.makeNeutralElement('div'), d[g].className = 'corner-' + g + '-handle', d[g].style.position = 'absolute', d[g].style.width = this.cornersStyle.width, d[g].style.height = this.cornersStyle.height, d[g].style.background = this.cornersStyle.background, d[g].style.border = this.cornersStyle.border, new t.MouseTracker({
      element: d[g],
      dragHandler: o.bind(this, g + 0.5),
      dragEndHandler: h.bind(this, g)
    }), this.borders[g].appendChild(c), this.element.appendChild(this.borders[g]), setTimeout(this.element.appendChild.bind(this.element, d[g]), 0); }
    this.borders[0].style.top = 0, this.borders[0].style.width = '100%', this.borders[1].style.right = 0, this.borders[1].style.height = '100%', this.borders[2].style.bottom = 0, this.borders[2].style.width = '100%', this.borders[3].style.left = 0, this.borders[3].style.height = '100%', d[0].style.top = '-3px', d[0].style.left = '-3px', d[1].style.top = '-3px', d[1].style.right = '-3px', d[2].style.bottom = '-3px', d[2].style.right = '-3px', d[3].style.bottom = '-3px', d[3].style.left = '-3px', this.overlay || (this.overlay = new t.SelectionOverlay(this.element, this.rect || new t.SelectionRect())), this.innerTracker = new t.MouseTracker({
      element: this.element,
      clickTimeThreshold: this.viewer.clickTimeThreshold,
      clickDistThreshold: this.viewer.clickDistThreshold,
      dragHandler: t.delegate(this, r),
      dragEndHandler: t.delegate(this, n),
      clickHandler: t.delegate(this, s)
    }), this.outerTracker = new t.MouseTracker({
      element: this.viewer.canvas,
      clickTimeThreshold: this.viewer.clickTimeThreshold,
      clickDistThreshold: this.viewer.clickDistThreshold,
      dragHandler: t.delegate(this, e),
      dragEndHandler: t.delegate(this, i),
      clickHandler: t.delegate(this, s),
      startDisabled: !this.isSelecting
    }), this.keyboardShortcut && t.addEvent(this.viewer.container, 'keypress', t.delegate(this, l), !1)
    var u = this.prefixUrl || this.viewer.prefixUrl || '', w = this.viewer.buttons && this.viewer.buttons.buttons,
      y = w ? this.viewer.buttons.buttons[0] : null, m = y ? y.onFocus : null, v = y ? y.onBlur : null
    if (this.showSelectionControl && (this.toggleButton = new t.Button({
        element: this.toggleButton ? t.getElement(this.toggleButton) : null,
        clickTimeThreshold: this.viewer.clickTimeThreshold,
        clickDistThreshold: this.viewer.clickDistThreshold,
        tooltip: t.getString('Tooltips.SelectionToggle') || 'Toggle selection',
        srcRest: u + this.navImages.selection.REST,
        srcGroup: u + this.navImages.selection.GROUP,
        srcHover: u + this.navImages.selection.HOVER,
        srcDown: u + this.navImages.selection.DOWN,
        onRelease: this.toggleState.bind(this),
        onFocus: m,
        onBlur: v
      }), w && (this.viewer.buttons.buttons.push(this.toggleButton), this.viewer.buttons.element.appendChild(this.toggleButton.element)), this.toggleButton.imgDown && (this.buttonActiveImg = this.toggleButton.imgDown.cloneNode(!0), this.toggleButton.element.appendChild(this.buttonActiveImg))), this.showConfirmDenyButtons) {
      this.confirmButton = new t.Button({
        element: this.confirmButton ? t.getElement(this.confirmButton) : null,
        clickTimeThreshold: this.viewer.clickTimeThreshold,
        clickDistThreshold: this.viewer.clickDistThreshold,
        tooltip: t.getString('Tooltips.SelectionConfirm') || 'Confirm selection',
        srcRest: u + this.navImages.selectionConfirm.REST,
        srcGroup: u + this.navImages.selectionConfirm.GROUP,
        srcHover: u + this.navImages.selectionConfirm.HOVER,
        srcDown: u + this.navImages.selectionConfirm.DOWN,
        onRelease: this.confirm.bind(this),
        onFocus: m,
        onBlur: v
      })
      var p = this.confirmButton.element
      p.classList.add('confirm-button'), this.element.appendChild(p), this.cancelButton = new t.Button({
        element: this.cancelButton ? t.getElement(this.cancelButton) : null,
        clickTimeThreshold: this.viewer.clickTimeThreshold,
        clickDistThreshold: this.viewer.clickDistThreshold,
        tooltip: t.getString('Tooltips.SelectionConfirm') || 'Cancel selection',
        srcRest: u + this.navImages.selectionCancel.REST,
        srcGroup: u + this.navImages.selectionCancel.GROUP,
        srcHover: u + this.navImages.selectionCancel.HOVER,
        srcDown: u + this.navImages.selectionCancel.DOWN,
        onRelease: this.cancel.bind(this),
        onFocus: m,
        onBlur: v
      })
      var f = this.cancelButton.element
      f.classList.add('cancel-button'), this.element.appendChild(f), this.styleConfirmDenyButtons && (p.style.position = 'absolute', p.style.top = '50%', p.style.left = '50%', p.style.transform = 'translate(-100%, -50%)', f.style.position = 'absolute', f.style.top = '50%', f.style.left = '50%', f.style.transform = 'translate(0, -50%)')
    }
    this.viewer.addHandler('selection', this.onSelection), this.viewer.addHandler('open', this.draw.bind(this)), this.viewer.addHandler('animation', this.draw.bind(this)), this.viewer.addHandler('resize', this.draw.bind(this)), this.viewer.addHandler('rotate', this.draw.bind(this))
  }, t.extend(t.Selection.prototype, t.ControlDock.prototype, {
    toggleState: function () { return this.setState(!this.isSelecting) },
    setState: function (t) { return this.isSelecting = t, this.outerTracker.setTracking(t), t ? this.draw() : this.undraw(), this.buttonActiveImg && (this.buttonActiveImg.style.visibility = t ? 'visible' : 'hidden'), this.viewer.raiseEvent('selection_toggle', {enabled: t}), this },
    setAllowRotation: function (t) { this.allowRotation = t },
    enable: function () { return this.setState(!0) },
    disable: function () { return this.setState(!1) },
    draw: function () { return this.rect && (this.overlay.update(this.rect.normalize()), this.overlay.drawHTML(this.viewer.drawer.container, this.viewer.viewport)), this },
    undraw: function () { return this.overlay.destroy(), this.rect = null, this },
    confirm: function () {
      if (this.rect) {
        var e = this.rect.normalize()
        if (this.returnPixelCoordinates) {
          var i = this.viewer.viewport.viewportToImageRectangle(e)
          i = t.SelectionRect.fromRect(i).round(), i.rotation = e.rotation, e = i
        }
        this.viewer.raiseEvent('selection', e), this.undraw()
      }
      return this
    },
    cancel: function () { return this.viewer.raiseEvent('selection_cancel', !1), this.undraw() }
  })
}(OpenSeadragon)), (function (t) {
  'use strict'
  t.SelectionOverlay = function (e, i) { t.Overlay.apply(this, arguments), t.isPlainObject(e) ? this.rotation = e.location.rotation || 0 : this.rotation = i.rotation || 0 }, t.SelectionOverlay.prototype = t.extend(Object.create(t.Overlay.prototype), {
    drawHTML: function () { t.Overlay.prototype.drawHTML.apply(this, arguments), this.style.transform = this.style.transform.replace(/ ?rotate\(.+rad\)/, '') + ' rotate(' + this.rotation + 'rad)' },
    update: function (e) { t.Overlay.prototype.update.apply(this, arguments), this.rotation = e.rotation || 0 }
  })
}(OpenSeadragon)), (function (t) {
  'use strict'
  t.SelectionRect = function (e, i, s, r, n) { t.Rect.apply(this, [e, i, s, r]), this.rotation = n || 0 }, t.SelectionRect.fromRect = function (e) { return new t.SelectionRect(e.x, e.y, e.width, e.height) }, t.SelectionRect.prototype = t.extend(Object.create(t.Rect.prototype), {
    clone: function () { return new t.SelectionRect(this.x, this.y, this.width, this.height, this.rotation) },
    equals: function (e) { return t.Rect.prototype.equals.apply(this, [e]) && this.rotation === e.rotation },
    toString: function () { return '[' + Math.round(100 * this.x) / 100 + ',' + Math.round(100 * this.y) / 100 + ',' + Math.round(100 * this.width) / 100 + 'x' + Math.round(100 * this.height) / 100 + '@' + Math.round(100 * this.rotation) / 100 + ']' },
    swapWidthHeight: function () {
      var t = this.clone()
      return t.width = this.height, t.height = this.width, t.x += (this.width - this.height) / 2, t.y += (this.height - this.width) / 2, t
    },
    getDegreeRotation: function () { return this.rotation * (180 / Math.PI) },
    getAngleFromCenter: function (t) {
      var e = t.minus(this.getCenter())
      return Math.atan2(e.x, e.y)
    },
    round: function () { return new t.SelectionRect(Math.round(this.x), Math.round(this.y), Math.round(this.width), Math.round(this.height), this.rotation) },
    normalize: function () {
      var t = this.clone()
      return t.width < 0 && (t.x += t.width, t.width *= -1), t.height < 0 && (t.y += t.height, t.height *= -1), t.rotation %= Math.PI, t
    },
    fitsIn: function (t) {
      for (var e = this.normalize(), i = [e.getTopLeft(), e.getTopRight(), e.getBottomRight(), e.getBottomLeft()],
             s = e.getCenter(), r = e.getDegreeRotation(), n = t.getBottomRight(),
             o = 0; o < 4; o++) if (i[o] = i[o].rotate(r, s), i[o].x < t.x || i[o].x > n.x || i[o].y < t.y || i[o].y > n.y) return !1
      return !0
    },
    reduceRotation: function () {
      var t
      return this.rotation < Math.PI / -4 ? (t = this.swapWidthHeight(), t.rotation += Math.PI / 2) : this.rotation > Math.PI / 4 ? (t = this.swapWidthHeight(), t.rotation -= Math.PI / 2) : t = this.clone(), t
    }
  })
}(OpenSeadragon))
// # sourceMappingURL=openseadragonselection.js.map
