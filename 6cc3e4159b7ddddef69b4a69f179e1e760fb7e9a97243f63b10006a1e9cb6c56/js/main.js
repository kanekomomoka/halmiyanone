
  const slides = document.querySelectorAll('.slide');
let current = 0;

setInterval(() => {
  slides[current].classList.remove('active');
  current = (current + 1) % slides.length;
  slides[current].classList.add('active');
}, 4000); // 4秒ごとに切り替え

// 動的に読み取る都道府県データ (各タブの .character_list の並び順を採用)
const regionPrefectures = {}; // { region: [ { name, image, description } ] }
let currentRegion = null;
let currentPrefectureIndex = 0;

// ポップアップ機能
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.querySelector('.character_popup');
  const overlay = document.querySelector('.popup_overlay');
  const closeButton = document.querySelector('.character_popup_close');
  const prevButton = document.querySelector('.prev_prefecture');
  const nextButton = document.querySelector('.next_prefecture');
  
  // character_list の並び順から regionPrefectures を構築
  const characterLists = document.querySelectorAll('.character_list[data-region]');
  characterLists.forEach(list => {
    const region = list.dataset.region;
    const items = Array.from(list.querySelectorAll('.character_list_item'));
    regionPrefectures[region] = items.map(it => ({
      name: it.dataset.prefecture || it.getAttribute('data-prefecture') || '',
      image: it.dataset.img || it.getAttribute('data-img') || '',
      description: it.dataset.desc || it.getAttribute('data-desc') || ''
    }));
  });

  // SVG パス側にも data-* が付いている場合があるので、それらを参照できるようにしておく
  const svgPathsByName = {};
  document.querySelectorAll('path[data-prefecture]').forEach(p => {
    const name = p.dataset.prefecture || p.getAttribute('data-prefecture');
    if (name) svgPathsByName[name] = p;
  });
  
  // ポップアップを開く
  const openPopup = (element) => {
    let prefecture, image, description;
    
    if (element) {
      // 要素からデータを取得
      prefecture = element.getAttribute('data-prefecture') || element.dataset.prefecture || element.getAttribute('data-title') || '名前未設定';
      image = element.getAttribute('data-img') || element.dataset.img || element.getAttribute('data-image') || '';
      description = element.getAttribute('data-desc') || element.dataset.desc || element.getAttribute('data-description') || '説明がありません';

      // region を特定（要素に data-region があれば優先）
      const regionFromElement = element.getAttribute('data-region') || element.dataset.region || null;
      if (regionFromElement && regionPrefectures[regionFromElement]) {
        currentRegion = regionFromElement;
        currentPrefectureIndex = regionPrefectures[currentRegion].findIndex(pref => pref.name === prefecture);
      } else {
        // まず character_list 側のデータから探す
        let found = false;
        for (const r in regionPrefectures) {
          const idx = regionPrefectures[r].findIndex(pref => pref.name === prefecture);
          if (idx !== -1) {
            currentRegion = r;
            currentPrefectureIndex = idx;
            // 優先される画像/説明がなければ、character_list の値を使う
            if (!image) image = regionPrefectures[r][idx].image || '';
            if (!description) description = regionPrefectures[r][idx].description || '';
            found = true;
            break;
          }
        }
        if (!found) {
          // 見つからない場合は currentRegion を null にしておく
          currentRegion = null;
          currentPrefectureIndex = 0;
        }
      }
    } else {
      // prev/next 操作: currentRegion と currentPrefectureIndex を使って値を取り出す
      if (currentRegion && regionPrefectures[currentRegion]) {
        const prefData = regionPrefectures[currentRegion][currentPrefectureIndex];
        prefecture = prefData.name;
        image = prefData.image;
        description = prefData.description;
      } else {
        prefecture = '名前未設定';
        image = '';
        description = '説明がありません';
      }
    }

    popup.querySelector('.character_popup_title').textContent = prefecture;
    popup.querySelector('.character_popup_image').src = image;
    popup.querySelector('.character_popup_description').textContent = description;

// 都道府県名 → ローマ字変換マップ
const prefectureMap = {
  '北海道': 'hokkaido',
  '青森県': 'aomori',
  '秋田県': 'akita',
  '岩手県': 'iwate',
  '宮城県': 'miyagi',
  '山形県': 'yamagata',
  '福島県': 'fukushima',
  '鳥取県': 'tottori',
  '岡山県': 'okayama',
  '広島県': 'hiroshima',
  '山口県': 'yamaguchi',
  '島根県': 'shimane',
  '香川県': 'kagawa',
  '愛媛県': 'ehime',
  '高知県': 'kochi',
  '徳島県': 'tokushima',
  '福岡県': 'fukuoka',
  '佐賀県': 'saga',
  '長崎県': 'nagasaki',
  '熊本県': 'kumamoto',
  '大分県': 'oita',
  '宮崎県': 'miyazaki',
  '鹿児島県': 'kagoshima',
  // 必要に応じて追加
};

// 詳しく見るボタンを説明文の下に追加
const descContainer = popup.querySelector('.character_popup_description');
const oldButton = popup.querySelector('.detail-btn');
if (oldButton) oldButton.remove();

const button = document.createElement('button');
button.classList.add('detail-btn');
button.textContent = element?.dataset.btn || '詳しく見る';

// ✅ 動的にローマ字ページへ遷移
button.addEventListener('click', () => {
  const romanized = prefectureMap[prefecture] || prefecture.replace('県', '');
  const pageName = `omiyage_${romanized}.html`;
  window.location.href = pageName;
});

descContainer.insertAdjacentElement('afterend', button);

    popup.classList.add('show');
    overlay.classList.add('show');
  };

  // 前の県へ移動 (同じ region 内で循環)
  const showPrevPrefecture = () => {
    if (!currentRegion || !regionPrefectures[currentRegion]) return;
    const arr = regionPrefectures[currentRegion];
    currentPrefectureIndex = (currentPrefectureIndex - 1 + arr.length) % arr.length;
    openPopup();
  };

  // 次の県へ移動 (同じ region 内で循環)
  const showNextPrefecture = () => {
    if (!currentRegion || !regionPrefectures[currentRegion]) return;
    const arr = regionPrefectures[currentRegion];
    currentPrefectureIndex = (currentPrefectureIndex + 1) % arr.length;
    openPopup();
  };

  // ポップアップを閉じる
  const closePopup = () => {
    popup.classList.remove('show');
    overlay.classList.remove('show');
  };

  // 都道府県パスのクリックイベント設定
  const prefecturePaths = document.querySelectorAll('path[data-prefecture]');
  prefecturePaths.forEach(path => {
    path.addEventListener('click', (e) => {
      e.preventDefault();
      openPopup(path);
    });
  });

  // キャラクターリストアイテムのクリックイベント設定
  const characterItems = document.querySelectorAll('.character_list_item');
  characterItems.forEach(item => {
    item.addEventListener('click', () => openPopup(item));
  });

  // イベントリスナーの設定
  closeButton.addEventListener('click', closePopup);
  overlay.addEventListener('click', closePopup);
  if (prevButton) prevButton.addEventListener('click', showPrevPrefecture);
  if (nextButton) nextButton.addEventListener('click', showNextPrefecture);

  // キーボードでの操作
  document.addEventListener('keydown', (e) => {
    if (!popup.classList.contains('show')) return;
    
    if (e.key === 'ArrowLeft') {
      showPrevPrefecture();
    } else if (e.key === 'ArrowRight') {
      showNextPrefecture();
    } else if (e.key === 'Escape') {
      closePopup();
    }
  });
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

// オープニングアニメーション
window.addEventListener("load", () => {
  const loading = document.querySelector(".loading");
  const contents = document.querySelector(".contents");
  const startButton = document.getElementById("start-journey");
  // ページにハッシュが付いている（例: index.html#search や #character）場合、
  // 他ページからの遷移である可能性が高いためローディングを自動で閉じる
  if (location.hash && location.hash.length > 1) {
    loading.style.opacity = '0';
    setTimeout(() => {
      loading.style.display = 'none';
      contents.classList.add('show');
    }, 200); // 素早く閉じる
    // ハッシュがある場合は「旅を始める」ボタンで再表示されないように早期リターン
    return;
  }
  // 「旅を始める」ボタンクリックでローディング画面をフェードアウト
  startButton.addEventListener("click", () => {
    loading.style.opacity = "0";

    // 完全に透明になった後に非表示
    setTimeout(() => {
      loading.style.display = "none";
      contents.classList.add("show"); // コンテンツ表示
    }, 1000); // フェードアウト時間と合わせる
  });

  // ヘッダーやモバイルメニューのリンクを取得して、
  // "TOP" 以外がクリックされた場合はローディングを非表示にする。
  const navLinks = document.querySelectorAll('.header_nav_list_item a, .nav-overlay__link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      try {
        const href = (link.getAttribute('href') || '').trim();
        const isTopLabel = (link.dataset && (link.dataset.ja === 'Top' || link.dataset.en === 'Top'));
        const text = (link.textContent || '').trim();
        const isTopText = text === 'Top' || text === 'トップ';

        // アンカー（#）が含まれるリンクはセクション遷移扱いにして TOP とはみなさない
        const hasHash = href.includes('#');
        // 明確にトップページを指す href のみ TOP と判定
        const topHrefs = new Set(['', '#', 'index.html', './index.html', '/', './']);
        const hrefNoHash = href.split('#')[0];
        const isTopHref = !hasHash && (topHrefs.has(href) || topHrefs.has(hrefNoHash) || hrefNoHash.endsWith('/index.html') || hrefNoHash.endsWith('/'));

        const isTop = isTopLabel || isTopText || isTopHref;

        if (!isTop) {
          // TOP 以外が押された → ローディングを即座に閉じる
          loading.style.opacity = '0';
          setTimeout(() => {
            loading.style.display = 'none';
            contents.classList.add('show');
          }, 200);
        } else {
          // TOP が押された → ローディングを表示（必要なら再表示）
          loading.style.display = 'flex';
          loading.style.opacity = '1';
          contents.classList.remove('show');
        }
      } catch (err) {
        // 安全のためエラーは無視
        console.error(err);
      }
    });
  });
});
 
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


// キャラクター一覧の画像を data-img から設定し、読み込み失敗時はフォールバック画像に差し替える
document.addEventListener('DOMContentLoaded', () => {
  const FALLBACK = 'images/character/comingsoon.png';
  document.querySelectorAll('.character_list_item').forEach(item => {
    try {
      const dataImg = item.getAttribute('data-img') || item.dataset.img || '';
      let imgEl = item.querySelector('img');
      if (imgEl) {
        if (dataImg) imgEl.src = dataImg;
      } else if (dataImg) {
        imgEl = document.createElement('img');
        imgEl.src = dataImg;
        imgEl.alt = item.dataset.prefecture || '';
        item.insertAdjacentElement('afterbegin', imgEl);
      }

      if (imgEl) {
        imgEl.addEventListener('error', () => {
          if (imgEl.src && !imgEl.src.includes('comingsoon.png')) imgEl.src = FALLBACK;
        });
        // もし存在しないパスで最初からエラーになる場合に備えて、すぐにフォールバックを試みる
        if (imgEl.complete && imgEl.naturalWidth === 0) {
          imgEl.src = FALLBACK;
        }
      }
    } catch (e) {
      console.error('[main.js] image init error', e);
    }
  });
});
