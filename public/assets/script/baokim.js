window.addEventListener('load', function () {
  var t,
    e = 'inline-block',
    n = null,
    o = 25e5,
    a = 2e7,
    l = 3e6,
    s = document.getElementsByClassName('bk-btn'),
    r = '',
    p = document.getElementById('bk-modal'),
    m = '',
    d = 'https://ws.baokim.vn/payment-services',
    // c = window.location.hostname
    c = 'khamobile.vn'
  'm.' == (c = c.replace('www.', '')).substring(0, 2) && (c = c.substring(2))
  var u = window.location.protocol
  function g() {
    var e = document.getElementsByClassName('bk-product-name'),
      o = document.getElementsByClassName('bk-product-price'),
      a = document.getElementsByClassName('bk-product-qty'),
      l = document.getElementsByClassName('bk-product-image'),
      s = document.getElementsByClassName('bk-product-property'),
      r = [],
      p = [],
      m = [],
      g = [],
      b = ''
    for (maxLoop = e.length, i = 0; i < maxLoop; i++) {
      r.push(e[i].innerHTML)
      var y = P(o[i].innerHTML)
      ;(y =
        o[i].firstElementChild && o[i].firstElementChild.innerHTML.match(/\d+/g)
          ? P(o[i].firstElementChild.innerHTML)
          : P(o[i].innerHTML)),
        p.push(y)
      var v = null
      l[i] &&
        (l[i].hasAttribute('data-src')
          ? (v = l[i].getAttribute('data-src'))
          : l[i].hasAttribute('src')
          ? (v = l[i].getAttribute('src'))
          : l[i].hasAttribute('data-o_src') && (v = l[i].getAttribute('data-o_src')),
        v && !1 === v.includes('//') && (v = u + '//' + c + '/' + v)),
        g.push(v),
        void 0 !== a[i] && a[i].value ? m.push(a[i].value) : m.push(1)
    }
    var h = 'undefined' != typeof variant_id_pro ? variant_id_pro : null
    if (!h) {
      var f = document.querySelectorAll('.js-variant-option-container > input[type="hidden"]')
      if (f.length > 0) {
        var k = (f = document.querySelectorAll('.js-variant-option-container > input[type="hidden"]')[0]).value
        if (k) (h = JSON.parse(k).variant_id), console.log(h)
      }
      var _ = document.getElementById('product-selectors')
      _ && (h = _.value)
      var x = document.getElementById('product-select')
      x && (h = x.value)
      var E = document.querySelectorAll('[name=variantId]')
      E.length > 0 && (h = E[0].value)
      var L = document.getElementById('productSelect')
      L && (h = L.value)
    }
    var C = null,
      N = 'undefined' != typeof pro_id ? pro_id : null
    N && (C = parseInt(N))
    var T = s.length
    if (T > 0)
      for (i = 0; i < T; i++) {
        var w = s[i]
        h || ((h = w.value), isNaN(h) && (h = null)),
          'input' == w.tagName.toLowerCase()
            ? (b += w.value + ' - ')
            : 'select' == w.tagName.toLowerCase()
            ? (b += w.options[w.selectedIndex].text + ' - ')
            : (b += w.innerHTML + ' ')
      }
    var B = []
    for (i = 0; i < maxLoop; i++) {
      'undefined' != typeof meta && void 0 !== meta.product && (C = meta.product.id)
      var H = {
        name: r[i],
        image: g[i],
        quantity: m[i],
        price: p[i],
        platform_product_id: C,
        platform_variant_id: h,
      }
      B.push(H)
    }
    var M = {
      products: B,
      domain: c,
      merchantLogo: t.logo,
      productProperty: b,
    }
    console.log(M)
    var I = O('POST', d + 'api/v1/order-temporary/store', JSON.stringify(M))
    I && (n = I.token)
  }
  // console.log(c),
  ;(function () {
    var n = O('GET', 'https://pc.baokim.vn/api/plus/get-merchant?domain=' + c, null)
    if (!n) return
    if (200 != n.code) return
    var i = n.meta
    if (!i) return
    if (null == (t = i.data))
      return (
        (b.style.display = 'none'),
        (y.style.display = 'none'),
        (v.style.display = 'none'),
        (h.style.display = 'none'),
        (f.style.display = 'none'),
        void (k.style.display = 'none')
      )
    var d = t.config,
      u = d.payment,
      g = d.installment,
      _ = d.installment_amigo
    p &&
      ((m += '<div id="bk-modal-payment" class="bk-modal">'),
      (m += '<div class="bk-modal-content" id="bk-modal-content-style">'),
      (m += '<div id="bk-modal-pop" class="bk-modal-header">'),
      (m += '<div class="bk-container-fluid" style="box-sizing: border-box">'),
      (m += '<div class="bk-row bk-popup-header">'),
      (m += '<div class="bk-col-5 bk-col-lg-3" style="box-sizing: border-box" id="bk-logo">'),
      (m += '</div>'),
      (m += '<div class="bk-col-3 bk-col-lg-6" style="box-sizing: border-box">'),
      (m += '</div>'),
      (m += '<div class="bk-col-4 bk-col-lg-3 bk-text-right" style="box-sizing: border-box">'),
      (m += '<button type="button" id="bk-modal-close">&times;</button>'),
      (m += '</div>'),
      (m += '</div>'),
      (m += '</div>'),
      (m += '</div>'),
      (m += '<div class="bk-modal-body">'),
      (m += '<iframe width="100%" height="100%" id="iframe" src=""></iframe>'),
      (m += '</div>'),
      (m += '</div>'),
      (m += '</div>'),
      (m += '<div id="bk-modal-notify" class="bk-modal">'),
      (m += '<div class="bk-modal-content" id="bk-modal-content-notify">'),
      (m += '<div class="bk-modal-header">'),
      (m += '<div class="bk-container-fluid">'),
      (m += '<div class="bk-row bk-popup-header">'),
      (m += '<div class="bk-col-3" id="bk-logo">'),
      (m += '</div>'),
      (m += '<div class="bk-col-6">'),
      (m += '</div>'),
      (m += '<div class="bk-col-3 bk-text-right">'),
      (m += '<button type="button" id="bk-modal-close">&times;</button>'),
      (m += '</div>'),
      (m += '</div>'),
      (m += '</div>'),
      (m += '</div>'),
      (m += '<div class="bk-modal-body">'),
      (m += '<p class="text-center">Sản phẩm đã hết hàng, không thể thanh toán</p>'),
      (m += '<button type="button" class="bk-modal-notify-close bk-btn-notify-close">Đóng</button>'),
      (m += '</div>'),
      (m += '</div>'),
      (m += '</div>'),
      (p.innerHTML = m))
    if (u.enable) {
      var E = document.getElementsByClassName('bk-product-price'),
        L = !0,
        C = E.length
      for (H = 0; H < C; H++) {
        var N = E[H].innerHTML
        if ('LIÊN HỆ' === N.toUpperCase() || 'ĐẶT HÀNG' === N.toUpperCase()) return void (L = !1)
        if (
          void 0 ===
          (N =
            E[H].firstElementChild && E[H].firstElementChild.innerHTML.match(/\d+/g)
              ? P(E[H].firstElementChild.innerHTML)
              : P(E[H].innerHTML))
        )
          return void (L = !1)
      }
      if (L) {
        let n = 'Mua ngay'
        var T = 'Giao tận nơi hoặc nhận tại cửa hàng',
          w = '#e00',
          B = '#fff'
        if (null != t.style_popup) {
          const e = t.style_popup
          for (var H = 0; H < e.length; H++)
            1 == e[H].type &&
              1 == e[H].status &&
              (null != e[H].txt_btn_integrated && (n = e[H].txt_btn_integrated),
              null != e[H].note_btn_integrated && (T = e[H].note_btn_integrated),
              null != e[H].bg_color_btn_payment && (w = e[H].bg_color_btn_payment),
              null != e[H].tx_color_btn_payment && (B = e[H].tx_color_btn_payment))
        }
        ;(r +=
          '<button class="bk-btn-paynow" style="display: ' +
          e +
          ';background-color: ' +
          w +
          ' !important;color: ' +
          B +
          ' !important" type="button">'),
          (r += '<strong>' + n + '</strong>'),
          (r += '<span>' + T + '</span>'),
          (r += '</button>')
      }
    }
    if (g.enable) {
      var M = G(),
        I = !1
      'donghoduyanh.com' == c && (l = 5e6),
        M >= l && (I = !0),
        ('demo-bkplus.baokim.vn' != c &&
          'devtest.baokim.vn:9405' != c &&
          'devtest.baokim.vn' != c &&
          'bkplus.myharavan.com' != c) ||
          (I = !0),
        console.log('Total: ' + M + ' - instalment value: ' + l)
      let n = 'Trả góp qua thẻ'
      var A = 'Visa, Master, JCB',
        S = '#288ad6',
        q = '#fff'
      if (null != t.style_popup) {
        const e = t.style_popup
        for (H = 0; H < e.length; H++)
          2 == e[H].type &&
            1 == e[H].status &&
            (null != e[H].txt_btn_integrated && (n = e[H].txt_btn_integrated),
            null != e[H].note_btn_integrated && (A = e[H].note_btn_integrated),
            null != e[H].bg_color_btn_installment && (S = e[H].bg_color_btn_installment),
            null != e[H].tx_color_btn_installment && (q = e[H].tx_color_btn_installment))
      }
      I &&
        ((r +=
          '<button class="bk-btn-installment" style="display: ' +
          e +
          ';background-color: ' +
          S +
          ' !important;color: ' +
          q +
          ' !important" type="button">'),
        (r += '<strong>' + n + '</strong>'),
        (r += '<span>' + A + '</span>'),
        (r += '</button>'))
    }
    if (_.enable) {
      M = G()
      var j = !1
      _.hasOwnProperty('min_order_amount') && (o = _.min_order_amount),
        _.hasOwnProperty('max_order_amount') && (a = _.max_order_amount),
        M >= o && M <= a && (j = !0),
        ('demo-bkplus.baokim.vn' != c &&
          'devtest.baokim.vn:9405' != c &&
          'devtest.baokim.vn' != c &&
          'bkplus.myharavan.com' != c) ||
          (j = !0),
        console.log(M)
      let t = 'Mua ngay - trả sau',
        e = n.meta.data.user.amigo,
        i = n.meta.data.user.kredivo,
        l = n.meta.data.user.hcvn,
        s = n.meta.data.user.atome,
        p = '#f1eb1f',
        m = '#235d97'
      if (null != n.meta.data.style_popup) {
        const e = n.meta.data.style_popup
        for (let n = 0; n < e.length; n++)
          3 == e[n].type &&
            1 == e[n].status &&
            (null != e[n].txt_btn_integrated && (t = e[n].txt_btn_integrated),
            null != e[n].bg_color_btn_insta && (p = e[n].bg_color_btn_insta),
            null != e[n].tx_color_btn_insta && (m = e[n].tx_color_btn_insta))
      }
      if (j) {
        var U = '<div class="bk-insta-content">'
        ;(U +=
          'homebest.vn' == c
            ? '<strong style="color: #ffffff !important">TRẢ GÓP QUA CMT</strong>'
            : '<strong>MUA NGAY - TRẢ SAU</strong>'),
          'donghoduyanh.com' == c
            ? (U += '<span style="color: ' + m + ' !important">Không cần thẻ - Xét duyệt qua CCCD trong 20 giây</span>')
            : 'taozinsaigon.com' == c
            ? (U += '<span style="color: ' + m + ' !important">Phê duyệt trong 20 giây</span>')
            : 'homebest.vn' == c
            ? (U += '<span style="color: #ffffff !important">Duyệt nhanh qua điện thoại</span>')
            : ((U += '<span>'),
              1 == i && (U += '<img src="https://pc.baokim.vn/platform/img/icon-kredivo.svg" alt="">'),
              1 == s &&
                (U += '<img src="https://pc.baokim.vn/platform/img/icon-atome.svg" alt="" style="margin-left: 5px;">'),
              1 == l &&
                (U +=
                  '<img src="https://pc.baokim.vn/platform/img/home-paylater.png" alt="" style="margin-left: 5px;">'),
              1 == e &&
                (U += '<img src="https://pc.baokim.vn/platform/img/icon-insta.svg" alt="" style="margin-left: 5px;">'),
              (U += '</span>')),
          (r +=
            'homebest.vn' == c
              ? '<button class="bk-btn-installment-amigo" style="display: flex;background-color: #0a0 !important; color: #ffffff !important;" type="button">'
              : '<button class="bk-btn-installment-amigo" style="display: flex;" type="button">'),
          (r += U += '</div>'),
          (r += '</button>')
      }
    }
    if (1 == n.meta.data.config.installment_amigo.promotion_kredivo) {
      let t = n.meta.data.user.kredivo,
        e = n.meta.data.user.hcvn
      ;(r += '<div class="bk-promotion">'),
        (r += '    <div class="bk-promotion-title">'),
        (r += '        <p>ƯU ĐÃI KHI THANH TOÁN</p>'),
        1 == t && (r += '        <img src="https://pc.baokim.vn/platform/img/kredivo.png" alt="">'),
        1 == e && (r += '        <img src="https://pc.baokim.vn/platform/img/home-paylater.png" alt="">'),
        (r += '    </div>'),
        (r += '    <div class="bk-promotion-content">'),
        (r += '        <ul>'),
        1 == t &&
          ((r += '            <li>'),
          (r +=
            '                <img style="margin-top: 6px;" src="https://pc.baokim.vn/platform/img/kredivo.png" alt="">'),
          (r += '                <p>Giảm ngay 5% tối đa 500.000đ khi thanh toán trả góp 6/12 tháng</p>'),
          (r +=
            '                <span><img style="margin-right: 4px;" src="https://pc.baokim.vn/platform/img/fire-promotion.svg" alt="">ƯU ĐÃI HOT</span>'),
          (r += '            </li>')),
        1 == e &&
          ((r += '            <li>'),
          (r +=
            '                <img style="margin-top: 6px;" src="https://pc.baokim.vn/platform/img/home-paylater.png" alt="">'),
          (r += '                <p>Giảm ngay 250.000đ khi thanh toán lần đầu cho khoản vay tối thiểu 3.000.000đ</p>'),
          (r +=
            '                 <span><img style="margin-right: 4px;" src="https://pc.baokim.vn/platform/img/fire-promotion.svg" alt="">ƯU ĐÃI HOT</span>'),
          (r += '            </li>'),
          (r += '            <li>'),
          (r +=
            '                <img style="margin-top: 6px;" src="https://pc.baokim.vn/platform/img/home-paylater.png" alt="">'),
          (r += '                <p>Giảm ngay 150.000đ khi thanh toán lần đầu cho khoản vay tối thiểu 1.000.000đ</p>'),
          (r += '                <span style="background: none !important;"></span>'),
          (r += '            </li>')),
        1 == t &&
          ((r += '            <li>'),
          (r +=
            '                <img style="margin-top: 6px;" src="https://pc.baokim.vn/platform/img/kredivo.png" alt="">'),
          (r += '                <p>Giảm 50% tối đa 100.000đ khi thanh toán lần đầu</p>'),
          (r += '                <span style="background: none !important;"></span>'),
          (r += '            </li>')),
        (r += '        </ul>'),
        (r += '        <div class="bk-promotion-footer">'),
        (r += '            <p>Powered by</p>'),
        (r += '            <img src="https://pc.baokim.vn/platform/img/bk-logo-promotion.svg" alt="">'),
        (r += '        </div>'),
        (r += '    </div>'),
        (r += '</div>')
    }
    for (x in s) s[x].innerHTML = r
  })()
  var b = document.getElementById('bk-btn-paynow'),
    y = document.getElementsByClassName('bk-btn-paynow'),
    v = document.getElementById('bk-btn-installment'),
    h = document.getElementsByClassName('bk-btn-installment'),
    f = document.getElementById('bk-btn-installment-amigo'),
    k = document.getElementsByClassName('bk-btn-installment-amigo'),
    _ = document.getElementsByClassName('bk-btn-paynow-list'),
    E = document.getElementsByClassName('bk-btn-installment-list'),
    L = document.getElementById('bk-modal-payment'),
    C = document.getElementById('bk-modal-notify'),
    N = document.getElementById('bk-modal-close'),
    T = document.getElementsByClassName('bk-modal-notify-close'),
    w = document.getElementById('iframe'),
    B = document.getElementById('bk-modal-pop'),
    H = document.getElementById('bk-modal-content-style')
  if (y.length > 0)
    for (x = 0; x < y.length; x++)
      y[x].addEventListener('click', function () {
        M(this)
      })
  if (h.length > 0)
    for (x = 0; x < h.length; x++)
      h[x].addEventListener('click', function () {
        M(this, '/installment')
      })
  if (k.length > 0)
    for (x = 0; x < k.length; x++)
      k[x].addEventListener('click', function () {
        M(this, '/bnpl/installment')
      })
  function M(e, o = '') {
    if ('bk-btn-paynow' == e.className) {
      var i = '#006d9c'
      if (null != t.style_popup) {
        const e = t.style_popup
        for (var a = 0; a < e.length; a++)
          1 == e[a].type &&
            1 == e[a].status &&
            (null != e[a].bg_color_mdl_payment && ((i = e[a].bg_color_mdl_payment), (B.style.backgroundColor = i)),
            2 == e[a].display_mode_popup &&
              ((H.style.width = '100%'), (H.style.margin = '0px'), (H.style.height = '100%')))
      }
    }
    if ('bk-btn-installment' == e.className) {
      var l = '#006d9c'
      if (null != t.style_popup) {
        const e = t.style_popup
        for (a = 0; a < e.length; a++)
          2 == e[a].type &&
            1 == e[a].status &&
            (null != e[a].bg_color_mdl_installment &&
              ((l = e[a].bg_color_mdl_installment), (B.style.backgroundColor = l)),
            2 == e[a].display_mode_popup &&
              ((H.style.width = '100%'), (H.style.margin = '0px'), (H.style.height = '100%')))
      }
    }
    if ('bk-btn-installment-amigo' == e.className) {
      var s = '#006d9c'
      if (null != t.style_popup) {
        const e = t.style_popup
        for (a = 0; a < e.length; a++)
          3 == e[a].type &&
            1 == e[a].status &&
            (null != e[a].bg_color_mdl_insta && ((s = e[a].bg_color_mdl_insta), (B.style.backgroundColor = s)),
            2 == e[a].display_mode_popup &&
              ((H.style.width = '100%'), (H.style.margin = '0px'), (H.style.height = '100%')))
      }
    }
    var r,
      p,
      m = document.getElementsByClassName('bk-check-out-of-stock'),
      d = !1
    if (m.length > 0)
      for (a = 0; a < m.length; a++) {
        if ('Hết hàng' === m[a].value) return (d = !0), null
        if ('Liên hệ' === m[a].value) return (d = !0), null
      }
    if (d)
      C.css({
        display: 'block',
      }),
        C.removeClass('hide')
    else {
      var c =
        navigator.vendor &&
        navigator.vendor.indexOf('Apple') > -1 &&
        navigator.userAgent &&
        -1 == navigator.userAgent.indexOf('CriOS') &&
        -1 == navigator.userAgent.indexOf('FxiOS')
      n || g()
      var u = S(o)
      0 == c
        ? (w.setAttribute('src', u),
          (L.style.display = 'block'),
          L.classList.remove('hide'),
          (r = document.getElementsByTagName('body')[0]),
          (p = r.offsetWidth),
          (r.style.overflow = 'hidden'),
          (r.style.width = p))
        : (window.location = u)
    }
  }
  if (
    (document.addEventListener('keydown', (t) => {
      'Escape' === t.key && ((L.style.display = 'none'), q())
    }),
    N &&
      N.addEventListener('click', function () {
        ;(L.style.display = 'none'), q()
      }),
    T.length > 0)
  )
    for (j = 0; j < T.length; j++)
      T[j].addEventListener('click', function () {
        ;(C.style.display = 'none'), q()
      })
  if (_.length > 0)
    for (i = 0; i < _.length; i++)
      _[i].addEventListener('click', function () {
        I(this)
      })
  if (E.length > 0)
    for (i = 0; i < E.length; i++)
      E[i].addEventListener('click', function () {
        I(this, '/installment')
      })
  function I(t, e = '') {
    var n = {},
      o = [],
      i = [],
      a = []
    i.push(t.getAttribute('data-price')),
      a.push(t.getAttribute('data-image')),
      o.push(t.getAttribute('data-name')),
      (n.productPrices = i),
      (n.productNames = o),
      (n.productImages = a),
      console.log(n),
      A(n)
    var l = S(e)
    w.setAttribute('src', l)
  }
  var A = function (e) {
    ;(L.style.display = 'block'), L.classList.remove('hide')
    var o = ['1']
    maxLoopList = e.productNames.length
    var a = []
    for (i = 0; i < maxLoopList; i++) {
      var l = {
        name: e.productNames[i],
        image: e.productImages[i],
        quantity: o[i],
        price: e.productPrices[i],
      }
      a.push(l)
    }
    var s = {
        products: a,
        domain: c,
        merchantLogo: t.logo,
        productProperty: '',
      },
      r = O('POST', d + 'api/v1/order-temporary/store', JSON.stringify(s))
    r && (n = r.token)
  }
  function O(t, e, n, o = !1) {
    var i = new XMLHttpRequest()
    i.open(t, e, o)
    var a = null
    try {
      i.setRequestHeader('Content-Type', 'application/json'),
        i.send(n),
        (a = i.response),
        (a = JSON.parse(a)),
        console.log(a)
    } catch (t) {
      console.log('Request failed'), console.log(t)
    }
    return a
  }
  function S(t = '') {
    return 'https://pg.baokim.vn/' + t + '?token=' + n
  }
  function q() {
    var t = document.getElementsByTagName('body')[0]
    ;(t.style.overflow = 'auto'), (t.style.width = 'auto')
  }
  function P(t) {
    return (
      (price = t.replace('VNĐ', '')),
      (price = t.replace('VND', '')),
      (price = t.replace(/[\[\]&]+/g, '')),
      (price = t.split('.').join('')),
      (price = price.split(',').join('')),
      (price = price.split(' ').join('')),
      (price = t.replace(/[^0-9]/g, '')),
      (price = parseInt(price, 10)),
      price
    )
  }
  function G() {
    var t = 0,
      e = document.getElementsByClassName('bk-product-price'),
      n = document.getElementsByClassName('bk-product-qty'),
      o = e.length
    for (console.log('length: ' + o), i = 0; i < o; i++) {
      P(e[i].innerHTML)
      var a = 1
      n[i] && (a = n[i].value),
        (t +=
          (e[i].firstElementChild && e[i].firstElementChild.innerHTML.match(/\d+/g)
            ? P(e[i].firstElementChild.innerHTML)
            : P(e[i].innerHTML)) * a)
    }
    return t
  }
  if (('undefined' != typeof meta && console.log(meta), 'xedienvietthanh.com' == window.location.hostname)) {
    for (i = 0; i < y.length; i++)
      (y[i].innerHTML = ''),
        (y[i].innerHTML =
          '<strong style="display: block">Mua ngay</strong><span style="display: block">(Mua online được giảm giá 500k)</span><span style="display: block; margin-bottom: 5px;">Giao hàng miễn phí</span>')
    for (i = 0; i < h.length; i++)
      (h[i].innerHTML = ''),
        (h[i].innerHTML =
          '<strong style="display: block">Mua trả góp 0%</strong><span style="display: block"> Thủ tục đơn giản</span><span style="display: block; margin-bottom: 5px;">Qua thẻ: Visa, Master, JCB</span>')
  }
})
