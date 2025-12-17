const tabs = document.querySelectorAll('.tab-menu li');
const contents = document.querySelectorAll('.tab-content div');

tabs.forEach((tab, index) => {
tab.addEventListener('click', () => {
tabs.forEach(t => t.classList.remove('active'));
tab.classList.add('active');
contents.forEach(c => c.style.display = 'none');
contents[index].style.display = 'block';
});
});

// ハッシュ変更時のスクロール調整（固定ヘッダー対応）
window.addEventListener('hashchange', () => {
  const id = location.hash.substring(1);
  const el = document.getElementById(id);
  if (el) {
    const header = document.querySelector('.header') || document.querySelector('.header_sp');
    const headerHeight = header ? header.offsetHeight : 0;
    const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
    const scrollTo = Math.max(elementTop - headerHeight - 8, 0);
    window.scrollTo({ top: scrollTo, behavior: 'smooth' });
  }
});

// ページ読み込み時のハッシュ処理
window.addEventListener('load', () => {
  if (location.hash && location.hash.length > 1) {
    setTimeout(() => {
      const id = location.hash.substring(1);
      const el = document.getElementById(id);
      if (el) {
        const header = document.querySelector('.header') || document.querySelector('.header_sp');
        const headerHeight = header ? header.offsetHeight : 0;
        const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
        const scrollTo = Math.max(elementTop - headerHeight - 8, 0);
        window.scrollTo({ top: scrollTo, behavior: 'smooth' });
      }
    }, 100);
  }
});

//ドロップダウンメニュー（モバイルのみ）
document.addEventListener('click', function(e) {
	var dropdownLink = e.target.closest('.has-child > a');
	if (!dropdownLink) return;
	
	var href = dropdownLink.getAttribute('href');
	// ページ内リンク（#で始まる）の場合はドロップダウン処理をスキップ
	if (href && href.startsWith('#')) {
		return;
	}
	
	// モバイルサイズの場合のみドロップダウンを開閉
	if (window.innerWidth <= 768) {
		e.preventDefault();
		var parentLi = dropdownLink.closest('li.has-child');
		parentLi.classList.toggle('active');
		var submenu = parentLi.querySelector('ul');
		if (submenu) {
			if (submenu.style.display === 'none' || submenu.style.display === '') {
				submenu.style.display = 'block';
			} else {
				submenu.style.display = 'none';
			}
		}
	}
});

// ページがリサイズされたら動かしたい場合の記述
window.addEventListener('resize', function() {
	mediaQueriesWin();/* ドロップダウンの関数を呼ぶ*/
});

// ページが読み込まれたらすぐに動かしたい場合の記述
window.addEventListener('load', function(){
	mediaQueriesWin();/* ドロップダウンの関数を呼ぶ*/
});

// ハンバーガーメニュー（オーバーレイ）を開閉する処理
document.addEventListener('DOMContentLoaded', () => {
	const hamburger = document.querySelector('.hamburger-overlay');
	const nav = document.querySelector('#overlay-menu');

	if (!hamburger || !nav) return; // 要素がなければ何もしない

	hamburger.addEventListener('click', () => {
		hamburger.classList.toggle('active');
		nav.classList.toggle('active');

		const isOpen = hamburger.classList.contains('active');
		hamburger.setAttribute('aria-expanded', isOpen);
		nav.setAttribute('aria-hidden', !isOpen);
		document.body.style.overflow = isOpen ? 'hidden' : '';
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && nav.classList.contains('active')) {
			hamburger.classList.remove('active');
			nav.classList.remove('active');
			hamburger.setAttribute('aria-expanded', false);
			nav.setAttribute('aria-hidden', true);
			document.body.style.overflow = '';
		}
	});
});

/*
	追加のフォールバック: jQuery が無い場合に .has-child > a をクリックで開閉する
 （すでに他で処理されている場合は二重登録を避けるため jQuery の存在を優先）
*/
(function(){
	if (typeof window.jQuery !== 'undefined') return; // jQuery があれば既存コードを使う

	document.addEventListener('click', function(e){
		var a = e.target.closest('.has-child > a');
		if(!a) return;
		if(window.innerWidth > 768) return; // モバイル時のみ
		e.preventDefault();
		var parent = a.parentElement;
		if(!parent) return;
		parent.classList.toggle('active');
		var submenu = parent.querySelector('ul');
		if(!submenu) return;
		if(getComputedStyle(submenu).display === 'none'){
			submenu.style.display = 'block';
		} else {
			submenu.style.display = 'none';
		}
	});
})();

/* 言語切替 (日本語 / English / 方言) */
document.addEventListener('DOMContentLoaded', () => {
  const LANG_KEY = 'siteLang';
  const defaultLang = localStorage.getItem(LANG_KEY) || 'ja';

  function applyLang(lang){
    // update body data and html lang attribute
    document.body.dataset.lang = lang;
    document.documentElement.lang = lang === 'en' ? 'en' : 'ja';

    // find all elements marked for translation with data-i18n attribute
    const items = document.querySelectorAll('[data-i18n]');
    items.forEach(el => {
      const value = el.dataset[lang] || el.dataset.ja || el.dataset.en || el.dataset.dia || '';
      if (value !== undefined && value !== null) {
        // Use innerHTML to preserve line breaks if provided
        el.innerHTML = value;
      }
    });

    // mark active buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
      btn.setAttribute('aria-pressed', btn.dataset.lang === lang);
    });
  }

  // wiring: desktop and mobile buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang || 'ja';
      localStorage.setItem(LANG_KEY, lang);
      applyLang(lang);
    });
  });

  // initial apply
  applyLang(defaultLang);
});



document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger-overlay');
  const nav = document.querySelector('.nav-overlay');

  if (!hamburger || !nav) return; // 存在しなければ処理しない

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');

    const isOpen = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    nav.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
      nav.setAttribute('aria-hidden', true);
      document.body.style.overflow = '';
    }
  });
});




//ドロップダウンの設定を関数でまとめる
function mediaQueriesWin(){
	var width = $(window).width();
	if(width <= 768) {//横幅が768px以下の場合 $(".has-child>a").off('click');	//has-childクラスがついたaタグのonイベントを複数登録を避ける為offにして一旦初期状態へ
		$(".has-child>a").on('click', function() {//has-childクラスがついたaタグをクリックしたら
			var parentElem =  $(this).parent();// aタグから見た親要素のliを取得し
			$(parentElem).toggleClass('active');//矢印方向を変えるためのクラス名を付与して
			$(parentElem).children('ul').stop().slideToggle(500);//liの子要素のスライドを開閉させる※数字が大きくなるほどゆっくり開く
			return false;//リンクの無効化
		});
	}else{//横幅が768px以上の場合
		$(".has-child>a").off('click');//has-childクラスがついたaタグのonイベントをoff(無効)にし
		$(".has-child").removeClass('active');//activeクラスを削除
		$('.has-child').children('ul').css("display","");//スライドトグルで動作したdisplayも無効化にする
	}
}

// ページがリサイズされたら動かしたい場合の記述
$(window).resize(function() {
	mediaQueriesWin();/* ドロップダウンの関数を呼ぶ*/
});

// ページが読み込まれたらすぐに動かしたい場合の記述
$(window).on('load',function(){
	mediaQueriesWin();/* ドロップダウンの関数を呼ぶ*/
});

/*
  jQuery が無い場合のフォールバック処理（モバイルの .has-child をクリックで開閉）
  --- jQuery の slideToggle と競合しないように、jQuery が存在する場合は追加しない
*/
(function(){
  if (typeof window.jQuery !== 'undefined') return; // jQuery が既にあるなら何もしない

  document.addEventListener('click', function(e){
    // .has-child > a をターゲットにする（イベント委譲）
    var a = e.target.closest('.has-child > a');
    if(!a) return;

    // モバイルサイズのみ有効
    if(window.innerWidth > 768) return;

    e.preventDefault();
    var parent = a.parentElement;
    if(!parent) return;

    parent.classList.toggle('active');
    var submenu = parent.querySelector('ul');
    if(!submenu) return;

    // simple toggle: block/none を切り替える（jQuery の slide 風の挙動はここでは簡易化）
    if(getComputedStyle(submenu).display === 'none'){
      submenu.style.display = 'block';
    } else {
      submenu.style.display = 'none';
    }
  });
})();