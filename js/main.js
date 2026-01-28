$(function () {
    /*=================================================
    ハンバーガーメニュー
    ===================================================*/
    $('.toggle_btn').on('click', function () {
        $('header').toggleClass('open');
    });

    $('hamberger-menu a , .menu-mask').click(function () {
        $('header').removeClass('open');
    });


    /*=================================================
      タッチデバイス用  トップへ移動/ボタン
    ===================================================*/
    let toTop = $(".to-top");
    const circle = $(".circle");
    const greenBtn = $(".green-btn");

    // 最初に画面が表示された時は、トップに戻るボタンを非表示に設定
    toTop.hide();

    $(window).scroll(function () {
        const scrollTop = $(this).scrollTop();
        const windowHeight = $(this).height();
        const footerTop = $('footer').offset().top;

        if (
            scrollTop > 500 &&  //上から500px以上スクロールしたら表示
            scrollTop + windowHeight < footerTop  //画面の一番下が、まだフッターに届いていない
        ) {
            toTop.fadeIn();  // 表示
        } else {
            toTop.fadeOut(); // 非表示
        }
    });

    // スマホ判定（PC は hover 任せ）
    const isMobile = window.matchMedia("(hover: none)").matches;

    circle.on('click', function (e) {

        // モバイルだけ「即ジャンプを防止」
        if (isMobile) {
            e.preventDefault();
            toTop.addClass("active");
        }

        // circle の3D回転（0.8s）終了を待つ
        circle.one("transitionend webkitTransitionEnd", function () {
            // 遷移
            $("html,body").animate({ scrollTop: 0 }, 800,
                function () {
                    toTop.removeClass('active');
                });
        });
    })

    $(".green-btn a").on('click', function (e) {

        //クリックされた要素（aタグ）のhref 属性の値を取り出して、link に入れる
        const link = $(this).attr("href");
        //クリックされた aタグから見て、一番近い .green-btn を親方向に探して取得
        const btn = $(this).closest(".green-btn");

        if (isMobile) {
            e.preventDefault();
            btn.addClass("active");

            //演出を見せる猶予
            setTimeout(() => {
                window.location.href = link;
            }, 150);

            // active解除（戻る／中断対策）
            setTimeout(() => {
                btn.removeClass("active");
            }, 400);
        }
    })

    /*=================================================
            slick 作品用
    ===================================================*/

    const slideItem = $('.slide-items');

    slideItem.slick({
        autoplay: false,
        arrows: false,
        // autoplaySpeed: 4000,
        // infinite: true,
        centerMode: false,
        slidesToShow: 4,
        // cssEase: 'linear',

        responsive: [{
            breakpoint: 1120,
            settings: {
                slidesToShow: 3,
                centerPadding: '50px',
            },
        },
        {
            breakpoint: 800,
            settings: "unslick",
        },
        ]
    });

    // スクロールイベントの監視
    slideItem.on('wheel', function (e) {

        // slick が存在しない（スマホなど）の場合は何もしない
        if (!$(this).hasClass('slick-initialized')) {
            return;
        }

        e.preventDefault();

        if (!slideItem.hasClass('js-slick-moving')) {
            if (e.originalEvent.deltaY < 0) {
                $(this).slick('slickNext');
            } else {
                $(this).slick('slickPrev');
            }
        }
    });

    // スライド送り中を判定するためにクラスを付与する
    slideItem.on('beforeChange', function () {
        slideItem.addClass('js-slick-moving');
    });

    slideItem.on('afterChange', function () {
        slideItem.removeClass('js-slick-moving');
    });



    /*=================================================
              blog アーカイブ切り替え
     ===================================================*/

    const blogSlide = $('.blog-slide');

    blogSlide.slick({
        autoplay: false,
        arrows: true,
        centerMode: false,
        slidesToShow: 2,
        slidesToScroll: 1, // 一枚ずつ表示切替
        prevArrow: '<button class="slide-arrow prev-arrow"></button>',
        nextArrow: '<button class="slide-arrow next-arrow"></button>',
        responsive: [{
            breakpoint: 800,
            settings: {
                slidesToShow: 1
            }
        }]
    });

});


/*=================================================
      SP メインビジュアルの横スクロール
===================================================*/

'use strict';

document.addEventListener("DOMContentLoaded", () => {
    const mvImg = document.querySelector('.index-top-img');
    const hero = document.querySelector('.index-top');


    if (!mvImg || !hero) return;

    // SPのみ有効
    const isSP = () => window.innerWidth <= 800;

    // const maxMoveRatio = 0.5; // 横移動の最大割合

    const getMaxMove = () =>
        mvImg.clientWidth - window.innerWidth;

    let maxMove = 0;

    const updateMaxMove = () => {
        maxMove = Math.max(getMaxMove(), 0);
    };
    window.addEventListener('resize', updateMaxMove);

    if (mvImg.complete) {
        updateMaxMove();
    } else {
        mvImg.addEventListener('load', updateMaxMove);
    }

    const syncScroll = () => {
        if (!isSP()) return;

        const rect = hero.getBoundingClientRect();
        const totalScroll = hero.offsetHeight - window.innerHeight;

        // セクションに入っている間だけ動かす
        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
            const speed = 1.6; //速さ調整
            const progress = Math.min(
                Math.max((-rect.top / totalScroll) * speed, 0),
                1
            );

            const moveX = maxMove * progress;
            mvImg.style.transform = `translateX(${-moveX}px)`;
        }

        // 終了位置
        if (rect.bottom < window.innerHeight) {
            mvImg.classList.add('is-absolute');
        } else {
            mvImg.classList.remove('is-absolute');
        }
    };

    // IntersectionObserverで最適化
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', syncScroll, { passive: true });
                    syncScroll();
                } else {
                    window.removeEventListener('scroll', syncScroll);
                }
            });
        },
        { threshold: 0 }
    );

    observer.observe(hero);
});

// let isActive = false;

// const observer = new IntersectionObserver(entries => {
//     entries.forEach(entry => {
//         isActive = entry.isIntersecting;
//     });
// });

// observer.observe(document.querySelector('.index-top'));

// window.addEventListener('scroll', () => {
//     if (!isActive || window.innerWidth > 768) return;

//     const scrollY = window.scrollY;
//     const moveX = scrollY * 0.2;
//     mvImg.style.transform = `translateX(${-moveX}px)`;
// });


